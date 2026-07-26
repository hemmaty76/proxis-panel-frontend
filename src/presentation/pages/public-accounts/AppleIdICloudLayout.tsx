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
  AlertTriangle,
  Check,
  Copy,
  ShieldAlert,
  CloudOff
} from 'lucide-react';
import type { AccountLayoutProps } from './types';

export default function AppleIdICloudLayout({
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
      {/* ⚠️ EXTREME CRITICAL WARNING BOX - FIND MY WARNING */}
      <div className="bg-red-500/15 border-2 border-red-500/40 rounded-2xl p-4 sm:p-5 flex gap-3.5 text-right print-box print-border shadow-lg shadow-red-950/20 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-red-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 text-red-400 shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-2">
          <h4 className="text-sm sm:text-base font-black text-red-300 flex items-center gap-1.5">
            <span>هشدار بسیار حیاتی: غیرفعال‌سازی حتمی Find My</span>
          </h4>
          <p className="text-xs sm:text-[13px] font-bold text-red-100/90 leading-relaxed">
            این اکانت ویژه استفاده در تنظیمات اصلی گوشی (<strong className="text-white underline font-black">iCloud / Settings</strong>) می‌باشد.{' '}
            <strong className="text-amber-300 underline font-black">خاموش بودن گزینه Find My (Find My iPhone) کاملاً الزامی است.</strong>
          </p>
          
          <div className="bg-slate-950/60 border border-red-500/30 rounded-xl p-3 text-[11px] sm:text-xs text-red-200/90 space-y-1 mt-2">
            <p className="font-extrabold text-red-300 flex items-center gap-1">
              <AlertTriangle size={13} className="shrink-0 text-amber-400" />
              تبعات سنگین روشن ماندن Find My:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pr-1 font-medium leading-relaxed">
              <li>در صورت روشن ماندن Find My، دستگاه شما قفل (<strong className="text-amber-300">Activation Lock / iCloud Lock</strong>) شده و گوشی کاملاً غیرقابل استفاده می‌گردد.</li>
              <li>در صورت قفل شدن دستگاه به علت عدم رعایت این دستورالعمل، هیچ‌گونه امکان بازیابی یا جبران خسارت وجود ندارد و تمام مسئولیت بر عهده خریدار خواهد بود.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* PRIVACY & SYNC WARNING BOX */}
      <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex gap-3 text-right print-box print-border">
        <CloudOff className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-black text-amber-300">توصیه مهم: غیرفعال‌سازی همگام‌سازی (Sync)</h4>
          <p className="text-[11px] sm:text-xs font-semibold text-amber-200/90 leading-relaxed">
            جهت حفظ حریم خصوصی و جلوگیری از پر شدن سریع فضای اکانت، حتماً همگام‌سازی عکس‌ها (<strong className="text-white">Photos</strong>)، مخاطبین (<strong className="text-white">Contacts</strong>) و بک‌آپ‌گیری آیکلود را غیرفعال (Turn Off) کنید.
          </p>
        </div>
      </div>

      {/* 1. Main Credentials Block */}
      <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-5 space-y-4 print-box print-border">
        <h3 className="text-xs font-black text-indigo-400 tracking-wider flex items-center gap-1.5 border-b border-indigo-500/10 pb-2 print-border">
          <Lock size={14} className="no-print" /> مشخصات اصلی ورود به آیکلود (iCloud Apple ID)
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

      {/* 2. Security Questions Block */}
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
                  <div className="flex items-start gap-2 text-xs font-semibold border-b border-slate-800/50 pb-2 print-border">
                    <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-md shrink-0 border border-indigo-500/30">
                      سوال:
                    </span>
                    <span className="font-mono text-slate-200 font-bold select-all leading-relaxed" dir="ltr">
                      {questionText}
                    </span>
                  </div>

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
                  <div className="flex items-center justify-between gap-2 bg-slate-950/40 border border-slate-800 p-3 rounded-xl text-xs font-mono" dir="ltr">
                    <span className="text-slate-200 font-extrabold truncate select-all">
                      {String(val)}
                    </span>
                    <button
                      onClick={() => handleCopy(String(val), fieldId)}
                      className={`p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors shrink-0 no-print ${copiedKey === fieldId ? 'text-emerald-400' : ''}`}
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

      {/* Interactive Step-by-Step iCloud Login Checklist */}
      <div className="bg-slate-950/30 border border-slate-800/60 rounded-2xl p-5 space-y-4 no-print">
        <h4 className="text-xs font-black text-slate-400 flex items-center gap-1.5 border-b border-slate-800/60 pb-2">
          <CheckSquare size={14} className="text-indigo-400" />
          مراحل فعال‌سازی ایمن در آیکلود (چک‌لیست تعاملی)
        </h4>
        
        <div className="space-y-3">
          {[
            { id: 1, text: 'وارد برنامه تنظیمات آیفون (Settings) شوید.' },
            { id: 2, text: 'در بالای صفحه، روی قسمت Sign in to your iPhone (ورود به آیفون) کلیک کنید.' },
            { id: 3, text: 'مشخصات Apple ID و رمز عبور فوق را وارد نمایید.' },
            { id: 4, text: 'در صورت درخواست ارتقای امنیت (Two-Factor Authentication)، حتماً گزینه Other Options (سایر گزینه‌ها) و سپس Don\'t Upgrade (ارتقا ندهید) را انتخاب کنید.' },
            { id: 5, text: '🚨 مرحله کاملاً حیاتی: بلافاصله پس از ورود، به مسیر Settings > Apple ID > Find My رفته و گزینه Find My iPhone را روی OFF (خاموش) قرار دهید.' },
            { id: 6, text: 'به بخش Settings > iCloud رفته و گزینه‌های Photos، Contacts و iCloud Backup را خاموش کنید.' }
          ].map((step) => (
            <div
              key={step.id}
              onClick={() => toggleChecklist(step.id)}
              className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-slate-800/30 transition-all ${
                checklist[step.id] ? 'bg-slate-800/10 text-slate-400 border border-transparent' : 'text-slate-300'
              }`}
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
