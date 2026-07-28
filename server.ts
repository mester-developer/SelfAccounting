import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Rate Limiter for AI endpoints
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Periodic cleanup of expired rate limit entries to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

const aiRateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 20;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (record.count >= maxRequests) {
    return res.status(429).json({
      error: "تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً یک دقیقه دیگر مجدداً تلاش کنید.",
    });
  }

  record.count += 1;
  next();
};

app.use("/api/ai/*", aiRateLimiter);

// Initialize Gemini client lazily
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Financial Insights & Anomaly Detection Endpoint
app.post("/api/ai/analyze-expenses", async (req, res) => {
  try {
    const { transactions = [], accounts = [], budgets = [], goals = [] } = req.body || {};

    if (!Array.isArray(transactions) || !Array.isArray(accounts) || !Array.isArray(budgets) || !Array.isArray(goals)) {
      return res.status(400).json({ error: "فرمت ورودی‌ها نامعتبر است. تمامی لیست‌ها باید به صورت آرایه باشند." });
    }

    // Sanitize payload sizes
    const safeTxs = transactions.slice(0, 50);
    const safeAccs = accounts.slice(0, 20);
    const safeBudgets = budgets.slice(0, 20);
    const safeGoals = goals.slice(0, 20);
    
    const ai = getGeminiClient();

    const prompt = `
تو یک مشاور مالی ارشد و هوش مصنوعی تحلیلگر حسابداری شخصی برای برنامه WealthPulse هستی.
اطلاعات زیر را تحلیل کن و یک پاسخ JSON ساختاریافته ارائه بده.

اطلاعات مالی کاربر:
- حساب‌ها: ${JSON.stringify(safeAccs)}
- بودجه‌ها: ${JSON.stringify(safeBudgets)}
- تراکنش‌های اخیر: ${JSON.stringify(safeTxs)}
- اهداف مالی: ${JSON.stringify(safeGoals)}

پاسخ را دقیقا به فرمت JSON زیر بده (بدون متن اضافه یا علامت‌های Markdown مثل \`\`\`json):
{
  "healthScore": 85, // نمره سلامت مالی از ۰ تا ۱۰۰
  "summary": "خلاصه کوتاه فارسی از وضعیت مالی کاربر",
  "savingTips": ["پیشنهاد ۱ برای کاهش هزینه‌ها", "پیشنهاد ۲"],
  "anomalies": ["توضیح هزینه غیرعادی در صورت وجود (مثلاً رشد ناگهانی هزینه فست‌فود)"],
  "cashflowForecast": {
    "next30DaysIncome": 12000000,
    "next30DaysExpenses": 8500000,
    "projectedSavings": 3500000,
    "advice": "توصیه پیش‌بینی موجودی آینده"
  },
  "budgetWarnings": ["هشدار درباره دسته‌هایی که نزدیک یا فراتر از بودجه هستند"]
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    res.json(data);
  } catch (error: any) {
    console.error("Error in AI expense analysis:", error);
    res.status(500).json({
      error: "خطا در تحلیل هوش مصنوعی",
      message: error.message || "لطفاً GEMINI_API_KEY را چک کنید.",
    });
  }
});

// AI Interactive Financial Advisor Chat Endpoint
app.post("/api/ai/financial-advisor", async (req, res) => {
  try {
    const { message, financialSnapshot } = req.body || {};

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ error: "پیام کاربر نامعتبر یا خالی است." });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: "طول پیام بیش از حد مجاز است (حداکثر ۲۰۰۰ کاراکتر)." });
    }

    const ai = getGeminiClient();

    const netWorth = typeof financialSnapshot?.netWorth === "number" ? financialSnapshot.netWorth : 0;
    const monthlyIncome = typeof financialSnapshot?.monthlyIncome === "number" ? financialSnapshot.monthlyIncome : 0;
    const monthlyExpense = typeof financialSnapshot?.monthlyExpense === "number" ? financialSnapshot.monthlyExpense : 0;

    const systemInstruction = `
تو "آریا"، مشاور مالی هوشمند و دستیار شخصی کاربران در نرم‌افزار مدیریت مالی WealthPulse هستی.
لحن تو بسیار محترمانه، کارشناسانه، انگیزه بخش، مدرن و دقیق است.
همواره به زبان فارسی پاسخ بده.
با توجه به وضعیت مالی کاربر (موجودی حساب‌ها، درآمدها، هزینه‌ها، اقساط و اهداف):
موجودی کل کاربر: ${netWorth}
درآمد این ماه: ${monthlyIncome}
هزینه این ماه: ${monthlyExpense}

به سوالات کاربر پاسخ‌های کاربردی، تخصصی و در عین حال ساده برای بهینه‌سازی مالی، پس‌انداز، سرمایه‌گذاری (طلا، ارز، بورس، صندوق‌ها) و مدیریت بدهی‌ها بده.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        { role: "user", parts: [{ text: message.trim() }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in AI advisor chat:", error);
    res.status(500).json({
      error: "خطا در ارتباط با مشاور هوشمند",
      message: error.message || "کلید API معتبر یافت نشد.",
    });
  }
});

// AI Receipt Scanner (OCR) Endpoint
app.post("/api/ai/scan-receipt", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body || {};

    if (!imageBase64 || typeof imageBase64 !== "string") {
      return res.status(400).json({ error: "تصویر فاکتور ارسال نشده است." });
    }

    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic"];
    const safeMimeType = (mimeType && typeof mimeType === "string" && allowedMimeTypes.includes(mimeType))
      ? mimeType
      : "image/jpeg";

    if (imageBase64.length > 15 * 1024 * 1024) {
      return res.status(400).json({ error: "حجم تصویر ارسال شده بیش از حد مجاز است." });
    }

    const ai = getGeminiClient();

    const prompt = `
این تصویر فاکتور خرید یا رسید بانکی را تحلیل کن و اطلاعات زیر را استخراج کن.
پاسخ را فقط به صورت JSON معتبر زیر برگردان:
{
  "merchant": "نام فروشگاه یا پذیرنده",
  "amount": 150000, // مبلغ کل به عدد (تومان یا ریال)
  "date": "1403/05/10", // تاریخ به صورت شمسی یا میلادی
  "category": "خوراکی و سوپرمارکت", // پیشنهاد دسته (خوراکی، رستوران، پوشاک، قبوض، سوخت، درمان، سایر)
  "items": ["کالا ۱", "کالا ۲"],
  "note": "یادداشت خریدهای استخراج شده"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
              mimeType: safeMimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    res.json(data);
  } catch (error: any) {
    console.error("Error in scan receipt:", error);
    res.status(500).json({
      error: "خطا در اسکن تصویر فاکتور",
      message: error.message,
    });
  }
});

// Vite Middleware Integration for Development & Static Serving for Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WealthPulse Finance Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
