import React, { useState, useEffect } from 'react';
import {
  Account,
  Transaction,
  Budget,
  FinancialGoal,
  UserSettings,
  AiAnalysisResult,
} from '../types';
import { formatCurrency } from '../utils/formatters';
import {
  Bot,
  Sparkles,
  Send,
  AlertTriangle,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  ScanLine,
  Lightbulb,
} from 'lucide-react';

interface AiAdvisorViewProps {
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: FinancialGoal[];
  settings: UserSettings;
  onOpenReceiptScanner: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AiAdvisorView: React.FC<AiAdvisorViewProps> = ({
  accounts,
  transactions,
  budgets,
  goals,
  settings,
  onOpenReceiptScanner,
}) => {
  const [analysis, setAnalysis] = useState<AiAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Chatbot State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'سلام! من آریا، مشاور مالی هوشمند شما در WealthPulse هستم. چطور می‌توانم در مدیریت بودجه یا سرمایه‌گذاری به شما کمک کنم؟',
      time: new Date().toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);

  // Run AI Expense Analysis
  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/ai/analyze-expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accounts, transactions, budgets, goals }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'خطا در برقراری ارتباط با سرور هوش مصنوعی');
      }

      const data: AiAnalysisResult = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'پاسخی از هوش مصنوعی دریافت نشد.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    runAiAnalysis();
  }, []);

  // Handle Chat Submit
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    const userMsgObj: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsgObj]);
    setInputMsg('');
    setIsChatSending(true);

    try {
      const netWorth = accounts.reduce((acc, curr) => acc + curr.balance, 0);
      const res = await fetch('/api/ai/financial-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          financialSnapshot: {
            netWorth,
            monthlyIncome: 38000000,
            monthlyExpense: 17300000,
          },
        }),
      });

      const data = await res.json();
      const aiMsgObj: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply || 'متأسفانه با مشکلی روبرو شدم. لطفاً مجدداً پیام دهید.',
        time: new Date().toLocaleTimeString('fa-IR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, aiMsgObj]);
    } catch (error) {
      const errorMsgObj: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'ارتباط با سرور مشاور هوشمند برقرار نشد. لطفاً اتصال اینترنت را چک کنید.',
        time: new Date().toLocaleTimeString('fa-IR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, errorMsgObj]);
    } finally {
      setIsChatSending(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/30 backdrop-blur-xl rounded-3xl p-6 shadow-2xl text-slate-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-1">
            <Sparkles className="w-4 h-4 text-amber-300" />
            هوش مصنوعی اختصاصی Gemini
          </div>
          <h2 className="text-xl font-bold text-white">تحلیلگر و مشاور هوشمند مالی</h2>
          <p className="text-xs text-slate-300 mt-1">
            شناسایی الگوهای خرج، هشدار هزینه‌های غیرعادی و پیش‌بینی موجودی آینده
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenReceiptScanner}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 hover:bg-indigo-500/30 text-xs font-medium transition-all"
          >
            <ScanLine className="w-4 h-4 text-indigo-300" />
            اسکن تصویر فاکتور
          </button>
          <button
            onClick={runAiAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium transition-all shadow-lg shadow-indigo-500/25"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            تحلیل مجدد
          </button>
        </div>
      </div>

      {/* Analysis Grid Results */}
      {isAnalyzing ? (
        <div className="p-12 text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl text-slate-400 text-xs space-y-3">
          <Bot className="w-8 h-8 text-indigo-400 mx-auto animate-bounce" />
          <p className="font-bold text-slate-200">
            هوش مصنوعی در حال بررسی و تحلیل تراکنش‌ها و بودجه‌ها است...
          </p>
        </div>
      ) : analysis ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Score & Summary */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">
                نمره سلامت مالی
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-emerald-400">
                {analysis.healthScore}
              </span>
              <span className="text-xs text-slate-400">از ۱۰۰</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-white/10">
              {analysis.summary}
            </p>
          </div>

          {/* Saving Tips & Recommendations */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-3 shadow-xl">
            <h3 className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4" />
              پیشنهادهای کاهش هزینه
            </h3>
            <ul className="space-y-2 text-xs text-slate-300">
              {analysis.savingTips?.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cashflow Forecast */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-3 shadow-xl">
            <h3 className="font-bold text-xs text-sky-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              پیش‌بینی موجودی ۳۰ روز آینده
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">درآمد پیش‌بینی شده:</span>
                <span className="font-bold text-emerald-400">
                  {formatCurrency(
                    analysis.cashflowForecast?.next30DaysIncome || 0,
                    settings.currency
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">هزینه پیش‌بینی شده:</span>
                <span className="font-bold text-rose-400">
                  {formatCurrency(
                    analysis.cashflowForecast?.next30DaysExpenses || 0,
                    settings.currency
                  )}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pt-2 border-t border-white/10 italic">
                «{analysis.cashflowForecast?.advice}»
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Interactive AI Chatbot */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          گفتگو با مشاور مالی هوشمند آریا
        </h3>

        <div className="h-80 overflow-y-auto space-y-3 p-4 bg-slate-950/50 rounded-2xl border border-white/10 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-start' : 'items-end'
              }`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-indigo-500/20 text-indigo-200 border border-indigo-500/30'
                    : 'bg-white/10 text-slate-200 border border-white/10'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {isChatSending && (
            <div className="text-xs text-indigo-400 font-bold animate-pulse">
              آریا در حال پاسخ‌دهی است...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="flex gap-2 text-xs">
          <input
            type="text"
            placeholder="مثلا: چطور پس‌انداز ماهانه را افزایش دهم؟"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400"
          />
          <button
            type="submit"
            disabled={isChatSending}
            className="px-5 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors shadow-lg shadow-indigo-500/25"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
