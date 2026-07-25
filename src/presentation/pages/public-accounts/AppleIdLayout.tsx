import { useState } from 'react';
import {
  Lock,
  User,
  Calendar,
  FileText,
  ShieldQuestion,
  Info,
  CheckSquare,
  Square,
  AlertCircle,
  Check,
  Copy

} from 'lucide-react';
import type { AccountLayoutProps } from './types';

export default function AppleIdLayout({
  mainFields,
  securityFields,
  otherFields,
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
    6: false,
  });

  const toggleChecklist = (id: number) => {
    setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Apple ID App Store Extreme Warning Box */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-right print-box print-border">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-black text-amber-300">مهم: راهنمای ورود به اکانت App Store</h4>
          <p className="text-[11px] font-bold text-amber-200/90 leading-relaxed">
            این حساب کاربری اختصاصی <strong className="text-white underline">App Store</strong> می‌باشد. لطفاً مشخصات فوق را <strong className="text-white underline">فقط و فقط در برنامه App Store</strong> وارد نمایید و از ورود به بخش تنظیمات اصلی آیفون (iCloud / Settings) خودداری فرمایید.
          </p>
        </div>
      </div>


      {/* 1. Main Credentials Block */}
      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-5 space-y-4 print-box print-border">
        <h3 className="text-xs font-black text-indigo-400 tracking-wider flex items-center gap-1.5 border-b border-indigo-500/10 pb-2 print-border">
          <Lock size={14} className="no-print" /> مشخصات اصلی ورود به اپل آیدی
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mainFields.map(([key, val]) => {
            const fieldId = `main-${key}`;
            const isPassword = key.toLowerCase().includes('pass') || key.includes('رمز');

            return (
              <div key={key} className="space-y-1.5 text-right">
                <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                  {isPassword ? <Lock size={11} className="text-indigo-400 no-print" /> : <User size={11} className="text-indigo-400 no-print" />}
                  {translateKey(key)}
                </span>
                <div className="flex items-center justify-between gap-2 bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-xs font-mono" dir="ltr">
                  <span className="text-slate-100 font-extrabold select-all truncate">
                    {String(val)}
                  </span>
                  <button
                    onClick={() => handleCopy(String(val), fieldId)}
                    className={`p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors shrink-0 no-print ${copiedKey === fieldId ? 'text-emerald-400' : ''}`}
                    title="کپی"
                  >
                    {copiedKey === fieldId ? <Check size={15} /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Security Questions Block (Splits values containing `:` for questions, optimized for English text-left LTR) */}
      {securityFields.length > 0 && (
        <div className="bg-slate-950/20 border border-slate-800/60 rounded-2xl p-5 space-y-4 print-box print-border">
          <h3 className="text-xs font-black text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-800/60 pb-2 print-border">
            <ShieldQuestion size={14} className="text-indigo-400 no-print" /> سوالات امنیتی و پاسخ‌ها
          </h3>
          
          <div className="space-y-4">
            {securityFields.map(([key, val]) => {
              const fieldId = `security-${key}`;
              let questionText = translateKey(key);
              let answerText = String(val);

              if (String(val).includes(':')) {
                const parts = String(val).split(':');
                questionText = parts[0].trim();
                answerText = parts.slice(1).join(':').trim();
              }

              return (
                <div key={key} className="bg-slate-950/50 border border-slate-800/80 p-4 rounded-2xl space-y-2.5 text-right print-box print-border">
                  {/* Question row */}
                  <div className="flex items-start gap-2 text-xs font-semibold border-b border-slate-800/50 pb-2 print-border">
                    <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 border border-indigo-500/30">
                      سوال:
                    </span>
                    <span className="font-mono text-slate-200 font-bold select-all leading-relaxed" dir="ltr">
                      {questionText}
                    </span>
                  </div>

                  {/* Answer row */}
                  <div className="flex items-center justify-between gap-3 text-xs pt-0.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 border border-emerald-500/30">
                        پاسخ:
                      </span>
                      <span className="font-mono text-emerald-400 font-extrabold select-all truncate text-sm" dir="ltr">
                        {answerText}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(answerText, fieldId)}
                      className={`p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors shrink-0 no-print ${copiedKey === fieldId ? 'text-emerald-400' : ''}`}
                      title="کپی پاسخ"
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

      {/* 3. Recovery Email & DOB Block */}
      {otherFields.length > 0 && (
        <div className="bg-slate-950/20 border border-slate-800/60 rounded-2xl p-5 space-y-4 print-box print-border">
          <h3 className="text-xs font-black text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-800/60 pb-2 print-border">
            <Info size={14} className="text-indigo-400 no-print" /> اطلاعات بازیابی و تاریخ تولد
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {otherFields.map(([key, val]) => {
              const fieldId = `other-${key}`;
              const isDob = key.toLowerCase().includes('birth') || key.toLowerCase().includes('date') || key.includes('تولد');

              return (
                <div key={key} className="space-y-1 text-right">
                  <span className="text-[11px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                    {isDob ? <Calendar size={11} className="text-indigo-400 no-print" /> : <FileText size={11} className="text-indigo-400 no-print" />}
                    {translateKey(key)}
                  </span>
                  <div className="flex items-center justify-between gap-2 bg-slate-950/40 border border-slate-855 p-3 rounded-xl text-xs font-mono" dir="ltr">
                    <span className="text-slate-200 font-extrabold truncate select-all">
                      {String(val)}
                    </span>
                    <button
                      onClick={() => handleCopy(String(val), fieldId)}
                      className={`p-1.5 text-slate-505 hover:text-slate-350 hover:bg-slate-800 rounded transition-colors shrink-0 no-print ${copiedKey === fieldId ? 'text-emerald-400' : ''}`}
                    >
                      {copiedKey === fieldId ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Step-by-Step Login Checklist (Hidden when printing) */}
      <div className="bg-slate-950/30 border border-slate-800/60 rounded-2xl p-5 space-y-4 no-print">
        <h4 className="text-xs font-black text-slate-400 flex items-center gap-1.5 border-b border-slate-800/60 pb-2">
          <CheckSquare size={14} className="text-indigo-400" />
          مراحل ورود ایمن به گوشی (چک‌لیست تعاملی)
        </h4>
        
        <div className="space-y-3">
          {[
            { id: 1, text: 'برنامه App Store (فروشگاه اپلیکیشن) را روی گوشی یا تبلت خود باز کنید.' },
            { id: 2, text: 'روی آیکون پروفایل خود در گوشه بالای صفحه کلیک کنید.' },
            { id: 3, text: 'در صورت فعال بودن اکانت قبلی، به پایین صفحه رفته و دکمه Sign Out را لمس کنید.' },
            { id: 4, text: 'مشخصات Apple ID و رمز فوق را وارد نموده و دکمه Sign In را بزنید.' },
            { id: 5, text: 'در صورت مشاهده درخواست فعال‌سازی تایید دو مرحله‌ای (Two-Factor)، حتماً گزینه Other Options (سایر گزینه‌ها) و سپس Don\'t Upgrade (ارتقا ندهید) را انتخاب کنید.' }
          ].map((step) => (

            <div
              key={step.id}
              onClick={() => toggleChecklist(step.id)}
              className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-slate-800/30 transition-all ${checklist[step.id] ? 'bg-slate-800/10 text-slate-450 border border-transparent' : 'text-slate-350'}`}
            >
              <span className="shrink-0 mt-0.5 text-indigo-400">
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
