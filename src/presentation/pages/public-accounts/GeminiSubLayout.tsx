import { useState } from 'react';
import {
  Key,
  Globe,
  ShieldAlert,
  ExternalLink,
  CheckSquare,
  Square,
  Check,
  Copy,
  Sparkles,
  Info,
  Laptop
} from 'lucide-react';
import type { AccountLayoutProps } from './types';

export default function GeminiSubLayout({
  accountData,
  mainFields,
  copiedKey,
  handleCopy,
  translateKey
}: AccountLayoutProps) {
  const [checklist, setChecklist] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const toggleChecklist = (id: number) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Find 'sub' or main link from private/public fields
  const subValue =
    accountData.private_fields?.sub ||
    accountData.public_fields?.sub ||
    (mainFields.find(([k]) => k.toLowerCase() === 'sub')?.[1]) ||
    '';

  const isUrl = typeof subValue === 'string' && (subValue.startsWith('http://') || subValue.startsWith('https://'));

  return (
    <div className="space-y-6">
      {/* HEADER BANNER - GEMINI AI & ANTIGRAVITY */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 text-right print-box print-border relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-black">
            <Sparkles size={12} />
            <span>Google AI & Gemini Sub</span>
          </div>
          <h3 className="text-sm sm:text-base font-black text-white">
            راهنمای فعال‌سازی اشتراک Google AI / Gemini / Antigravity
          </h3>
          <p className="text-xs text-slate-300 font-medium leading-relaxed">
            {accountData.product_description || 'این اشتراک از طریق لینک ساب اختصاصی فعال‌سازی می‌شود و برای محصولات هوش مصنوعی گوگل قابل استفاده است.'}
          </p>
        </div>
      </div>

      {/* 1. SUBSCRIPTION LINK / SUB CODE CARD */}
      <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-500/30 rounded-2xl p-5 space-y-4 print-box print-border shadow-lg shadow-cyan-950/20">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs sm:text-sm font-black text-cyan-400 flex items-center gap-2">
            <Key size={16} className="no-print text-cyan-400" />
            <span>لینک ساب / کلید فعال‌سازی (Sub Link)</span>
          </h3>
          <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-300 px-2 py-0.5 rounded-md border border-cyan-500/20">
            اختصاصی
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Globe size={12} className="text-cyan-400 no-print" />
            لینک فعال‌سازی سرویس (Sub):
          </span>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl">
            <span className="font-mono text-xs sm:text-sm text-cyan-200 font-extrabold select-all break-all" dir="ltr">
              {String(subValue || 'در دسترس نیست')}
            </span>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0 no-print">
              {isUrl && (
                <a
                  href={String(subValue)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1 shadow-sm"
                >
                  <ExternalLink size={13} />
                  <span>باز کردن لینک</span>
                </a>
              )}

              <button
                onClick={() => handleCopy(String(subValue), 'sub-link')}
                className={`px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-all flex items-center gap-1 border border-slate-700 ${copiedKey === 'sub-link' ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : ''
                  }`}
              >
                {copiedKey === 'sub-link' ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedKey === 'sub-link' ? 'کپی شد' : 'کپی لینک'}</span>
              </button>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/25 rounded-xl p-3 text-[11px] sm:text-xs text-cyan-200 font-semibold space-y-1 mt-3">
            <p className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Laptop size={14} className="text-cyan-400 shrink-0" />
              دستورالعمل باز کردن لینک:
            </p>
            <p className="leading-relaxed text-slate-200 font-medium">
              لینک فوق باید دقیقاً <strong className="text-amber-300 underline font-black">در دستگاه و مرورگری که ایمیل گوگل مورد نظر روی آن لاگین شده است</strong> و <strong className="text-white underline font-black">حتماً با فیلترشکن/VPN مناسب (که خطای ۴۰۳ ندهد)</strong> باز شود.
            </p>
          </div>
        </div>
      </div>

      {/* OTHER FIELDS IF ANY */}
      {mainFields.filter(([k]) => k.toLowerCase() !== 'sub').length > 0 && (
        <div className="bg-slate-950/30 border border-slate-800/60 rounded-2xl p-5 space-y-4 print-box print-border">
          <h3 className="text-xs font-black text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-800/60 pb-2">
            <Info size={14} className="text-cyan-400 no-print" /> سایر اطلاعات اکانت
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {mainFields
              .filter(([k]) => k.toLowerCase() !== 'sub')
              .map(([key, val]) => {
                const fieldId = `main-${key}`;
                return (
                  <div key={key} className="space-y-1 text-right">
                    <span className="text-[11px] font-bold text-slate-400 mr-1">
                      {translateKey(key)}
                    </span>
                    <div className="flex items-center justify-between gap-2 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-xs font-mono" dir="ltr">
                      <span className="text-slate-100 font-extrabold select-all truncate">
                        {String(val)}
                      </span>
                      <button
                        onClick={() => handleCopy(String(val), fieldId)}
                        className={`p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors shrink-0 no-print ${copiedKey === fieldId ? 'text-emerald-400' : ''}`}
                      >
                        {copiedKey === fieldId ? <Check size={15} /> : <Copy size={15} />}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 2. CRITICAL TECHNICAL GUIDELINES BOX */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 space-y-3.5 text-right print-box print-border shadow-md">
        <div className="flex items-center gap-2 border-b border-amber-500/20 pb-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <h4 className="text-xs sm:text-sm font-black text-amber-300">
            نکات فنی بسیار مهم جهت جلوگیری از قطعی و خطای ۴۰۳ (Error 403)
          </h4>
        </div>

        <div className="space-y-3 text-xs text-amber-100/90 leading-relaxed font-semibold">
          <div className="flex items-start gap-2">
            <span className="bg-amber-500/20 text-amber-300 font-black px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">۱</span>
            <p>
              <strong className="text-white underline">استفاده از IP مناسب جهت عدم بروز خطای ۴۰۳:</strong> سرویس‌های گوگل AI نسبت به IP حساس هستند. حتماً از ابزار تغییر IP با کیفیت، اختصاصی و بدون قطعی استفاده کنید.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="bg-amber-500/20 text-amber-300 font-black px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">۲</span>
            <p>
              <strong className="text-white underline">استفاده از IP پایدار و ثابت (Static IP):</strong> از تغییر مداوم لوکیشن یا کشور ابزار تغییر IP پرهیز کنید. تغییر ناگهانی IP می‌تواند باعث مسدودی یا بروز خطای ۴۰۳ شود.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="bg-amber-500/20 text-amber-300 font-black px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">۳</span>
            <p>
              <strong className="text-white underline">تغییر ریجن برای آنتی‌گرویتی (Antigravity):</strong> در صورت استفاده از Antigravity، حتماً کشور/ریجن اکانت را بررسی کرده و در صورت لزوم از لینک رسمی گوگل زیر تغییر دهید:
              <br />
              <a
                href="https://policies.google.com/country-association-form"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-cyan-300 font-mono underline font-bold mt-1 bg-slate-950/60 px-2 py-1 rounded-md border border-cyan-500/30 hover:text-cyan-200 transition-colors"
                dir="ltr"
              >
                <ExternalLink size={12} />
                https://policies.google.com/country-association-form
              </a>
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="bg-amber-500/20 text-amber-300 font-black px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">۴</span>
            <p>
              <strong className="text-white underline">محدودیت تعداد اکانت روی یک دیوایس:</strong> از فعال‌سازی و استفاده هم‌زمان چندین اکانت بر روی یک دستگاه (گوشی/سیستم) جداً خودداری کنید.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="bg-amber-500/20 text-amber-300 font-black px-1.5 py-0.5 rounded text-[10px] shrink-0 mt-0.5">۵</span>
            <p>
              <strong className="text-white underline">استفاده از مرورگر ایزوله (Incognito / Dedicated Profile):</strong> جهت جلوگیری از تداخل کوکی‌ها با سایر اکانت‌های گوگل، ترجیحاً یک پروفایل اختصاصی مرورگر ایجاد کرده یا از حالت Incognito استفاده فرمایید.
            </p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE CHECKLIST FOR ACTIVATION */}
      <div className="bg-slate-950/30 border border-slate-800/60 rounded-2xl p-5 space-y-4 no-print">
        <h4 className="text-xs font-black text-slate-400 flex items-center gap-1.5 border-b border-slate-800/60 pb-2">
          <CheckSquare size={14} className="text-cyan-400" />
          مراحل فعال‌سازی و اتصال به Gemini / Antigravity (چک‌لیست تعاملی)
        </h4>

        <div className="space-y-3">
          {[
            { id: 1, text: 'ابزار تغییر IP (VPN) مناسب و باکیفیت که خطای ۴۰۳ ندهد را روی دستگاه روشن نمایید.' },
            { id: 2, text: 'مطمئن شوید در همان دستگاه و مرورگری هستید که ایمیل گوگل مورد نظر روی آن لاگین شده است.' },
            { id: 3, text: 'لینک ساب (Sub Link) فوق را در همان مرورگر و با VPN فعال باز کنید.' },
            { id: 4, text: 'در صورت استفاده از آنتی‌گرویتی، وارد فرم رسمی تغییر کشور گوگل شده و ریجن اکانت را تنظیم کنید.' },
            { id: 5, text: 'از فعال‌سازی هم‌زمان چند اکانت روی یک دیوایس خودداری فرموده و فایل PDF اکانت را ذخیره نمایید.' }
          ].map((step) => (
            <div
              key={step.id}
              onClick={() => toggleChecklist(step.id)}
              className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-slate-800/30 transition-all ${checklist[step.id] ? 'bg-slate-800/10 text-slate-400 border border-transparent' : 'text-slate-300'
                }`}
            >
              <span className="shrink-0 mt-0.5 text-cyan-400">
                {checklist[step.id] ? <CheckSquare size={16} /> : <Square size={16} />}
              </span>
              <span className={`text-[11px] sm:text-xs font-semibold leading-relaxed ${checklist[step.id] ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                {step.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
