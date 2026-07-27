import React from 'react';
import {
  FileCode2,
  Database,
  Layers,
  ShieldCheck,
  Server,
  Workflow,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

export const ArchitectureDocView: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 lg:pb-8 text-xs text-slate-300 leading-relaxed">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 text-slate-100 shadow-2xl">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold mb-1">
          <Cpu className="w-4 h-4 text-emerald-400" />
          مستندات معماری نرم‌افزار (Software Architecture & Systems Design)
        </div>
        <h2 className="text-xl font-extrabold">معماری سیستم WealthPulse</h2>
        <p className="text-xs text-slate-300 mt-1">
          طراحی مقیاس‌پذیر، امن و پرسرعت بر پایه React 19، Express، Gemini AI و
          مستندات کامل ERD و REST API
        </p>
      </div>

      {/* Grid Documentation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tech Stack & High Level Architecture */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            ۱. پشته فناوری (Tech Stack)
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>فرانت‌اند:</strong> React 19 + TypeScript + Tailwind CSS v4 + Motion
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>بک‌اند:</strong> Node.js Express server با پشتیبانی از Gemini AI SDK
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>هوش مصنوعی:</strong> Google Gen AI SDK (@google/genai) برای تحلیل تراکنش‌ها و اسکن فاکتور
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>ذخیره‌سازی و کش:</strong> LocalStorage API لایه کش آفلاین + Firestore / PostgreSQL Ready
              </span>
            </li>
          </ul>
        </div>

        {/* Database ERD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Database className="w-4 h-4 text-sky-400" />
            ۲. مدل داده‌ها (Database ERD & Entities)
          </h3>
          <p className="text-slate-400">
            مایگریشن‌های دیتابیس شامل موجودیت‌های اصلی:
          </p>
          <div className="p-3 bg-slate-950 rounded-2xl font-mono text-[11px] text-slate-300 space-y-1 dir-ltr border border-slate-800">
            <div>• Accounts (id, name, type, balance, cardNumber, color)</div>
            <div>• Transactions (id, amount, type, categoryId, accountId, date, tags)</div>
            <div>• Budgets (id, categoryId, amount, period, warningThreshold)</div>
            <div>• Debts (id, personName, type, totalAmount, paidAmount, dueDate)</div>
            <div>• Loans (id, title, totalAmount, monthlyInstallment, nextDueDate)</div>
            <div>• Investments (id, name, symbol, type, quantity, buyPrice, currentPrice)</div>
          </div>
        </div>

        {/* REST API Specifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <Server className="w-4 h-4 text-purple-400" />
            ۳. سرویس‌های API بک‌اند (REST API Endpoints)
          </h3>
          <div className="space-y-2 dir-ltr font-mono text-[11px]">
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-purple-300">
              POST /api/ai/analyze-expenses
            </div>
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-purple-300">
              POST /api/ai/financial-advisor
            </div>
            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-purple-300">
              POST /api/ai/scan-receipt
            </div>
          </div>
        </div>

        {/* Security & Encryption */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            ۴. استانداردهای امنیتی و حریم خصوصی
          </h3>
          <ul className="space-y-2">
            <li>• کلیدهای حساس API تنها در سمت سرور (Server-side process.env) ذخیره می‌شوند.</li>
            <li>• پشتیبانی از PIN Lock و حسگر اثر انگشت برای حفاظت از داده‌های شخصی کاربر.</li>
            <li>• عدم ارسال هیچ‌گونه کلید یا توکن محرمانه به سمت مرورگر کاربر.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
