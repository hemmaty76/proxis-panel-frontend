import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { publicApiClient } from '../../core/api/axios';
import toast from 'react-hot-toast';
import {
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Smartphone,
  Send,
  Phone,
  Download
} from 'lucide-react';
import AppleIdLayout from './public-accounts/AppleIdLayout';
import DefaultAccountLayout from './public-accounts/DefaultAccountLayout';

interface AccountData {
  product_name: string;
  product_description: string | null;
  public_fields: Record<string, any>;
  private_fields: Record<string, any>;
  customer_phone: string | null;
  purchased_at: string;
  shop_name: string | null;
  shop_support_channel: string | null;
  shop_support_id: string | null;
  shop_support_phone: string | null;
}

// Farsi Translation helper for standard account fields
function translateKey(key: string): string {
  const k = key.toLowerCase().trim();
  if (k === 'apple id' || k === 'appleid' || k === 'apple_id') return 'اپل آیدی (ایمیل)';
  if (k === 'email' || k === 'username' || k === 'user' || k === 'نام کاربری' || k === 'ایمیل') return 'ایمیل / نام کاربری';
  if (k === 'password' || k === 'pass' || k === 'رمز' || k === 'رمز عبور' || k === 'پسورد') return 'رمز عبور';
  if (k.includes('recovery') || k.includes('backup') || k.includes('پشتیبان') || k.includes('نجات')) return 'ایمیل پشتیبان (Recovery)';
  if (k.includes('birth') || k.includes('dob') || k.includes('date') || k.includes('tavalod') || k.includes('تولد')) return 'تاریخ تولد';
  
  // Security Questions
  if (k === 'question1' || k === 'question 1' || k === 'q1' || k === 'سوال 1') return 'سوال امنیتی ۱';
  if (k === 'answer1' || k === 'answer 1' || k === 'a1' || k === 'پاسخ 1') return 'پاسخ سوال امنیتی ۱';
  if (k === 'question2' || k === 'question 2' || k === 'q2' || k === 'سوال 2') return 'سوال امنیتی ۲';
  if (k === 'answer2' || k === 'answer 2' || k === 'a2' || k === 'پاسخ 2') return 'پاسخ سوال امنیتی ۲';
  if (k === 'question3' || k === 'question 3' || k === 'q3' || k === 'سوال 3') return 'سوال امنیتی ۳';
  if (k === 'answer3' || k === 'answer 3' || k === 'a3' || k === 'پاسخ 3') return 'پاسخ سوال امنیتی ۳';
  
  if (k.includes('question') || (k.startsWith('q') && /\d/.test(k))) {
    const num = k.match(/\d+/);
    return `سوال امنیتی ${num ? num[0] : ''}`;
  }
  if (k.includes('answer') || (k.startsWith('a') && /\d/.test(k))) {
    const num = k.match(/\d+/);
    return `پاسخ سوال ${num ? num[0] : ''}`;
  }
  
  return key;
}

export default function PublicAccount() {
  const { code } = useParams<{ code: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!code) {
        setError('کد شناسایی اکانت ارسال نشده است.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await publicApiClient.post<AccountData>('/public/account/details', {
          code: code,
        });
        setAccountData(response.data);
      } catch (err: any) {
        console.error('Error fetching account details:', err);
        const detail = err.response?.data?.detail || 'اکانت مورد نظر یافت نشد یا حذف شده است.';
        setError(detail);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [code]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('کپی شد!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Group fields dynamically from BOTH public_fields and private_fields
  const publicFields = accountData?.public_fields || {};
  const privateFields = accountData?.private_fields || {};
  const combinedFields: Record<string, any> = { ...publicFields, ...privateFields };

  const mainFields: [string, any][] = [];
  const securityFields: [string, any][] = [];
  const otherFields: [string, any][] = [];

  Object.entries(combinedFields).forEach(([key, val]) => {
    if (val === undefined || val === null || String(val).trim() === '') return;
    const kLower = key.toLowerCase();
    if (kLower.includes('pass') || kLower.includes('رمز') || kLower.includes('id') || kLower.includes('کاربری') || (kLower.includes('email') && !kLower.includes('recovery') && !kLower.includes('support') && !kLower.includes('پشتیبان')) || kLower.includes('ایمیل')) {
      mainFields.push([key, val]);
    } else if (kLower.includes('question') || kLower.includes('answer') || kLower.includes('سوال') || kLower.includes('پاسخ') || kLower.includes('security') || /^q\d/i.test(kLower) || /^a\d/i.test(kLower)) {
      securityFields.push([key, val]);
    } else {
      otherFields.push([key, val]);
    }
  });


  const isAppleId = accountData?.product_name.toLowerCase().includes('apple') || false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4" dir="rtl">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-slate-300 font-bold mt-4 animate-pulse">در حال دریافت اطلاعات ایمن اکانت...</p>
        </div>
      </div>
    );
  }

  if (error || !accountData) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4" dir="rtl">
        <div className="max-w-[440px] w-full bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-extrabold text-white mb-2">خطا در استعلام اکانت</h2>
          <p className="text-sm text-slate-400 font-semibold leading-relaxed mb-6">
            {error || 'متاسفانه قادر به بازیابی اطلاعات این اکانت نیستیم.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-750 transition-all active:scale-[0.98]"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 sm:p-6 md:p-8 selection:bg-indigo-500 selection:text-white" dir="rtl">
      
      {/* Stylesheet specifically for printing / saving as PDF */}
      <style>{`
        @media print {
          body, html {
            background: white !important;
            color: black !important;
            font-size: 12px !important;
          }
          .no-print {
            display: none !important;
          }
          .print-card {
            background: white !important;
            color: black !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            padding: 20px !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 12px !important;
          }
          .print-card * {
            color: black !important;
          }
          .print-box {
            background: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            color: black !important;
          }
          .print-border {
            border-color: #cbd5e1 !important;
          }
        }
      `}</style>

      <div className="max-w-2xl w-full bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.5)] p-6 sm:p-8 md:p-10 relative overflow-hidden space-y-6 print-card">
        
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none no-print"></div>
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none no-print"></div>

        {/* Header */}
        <div className="text-center relative z-10 border-b border-slate-800/60 pb-5 flex flex-col items-center print-border">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-3 no-print">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1.5">
            نمایش مشخصات و پشتیبانی اکانت
          </h2>
          <p className="text-sm text-slate-400 font-bold mb-4">
            {accountData.product_name}
          </p>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 shadow-md shadow-indigo-600/10 no-print"
          >
            <Download size={14} />
            <span>دانلود مشخصات اکانت (فایل PDF)</span>
          </button>
        </div>

        {/* Security Share & Download Warning Box */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex gap-3 text-right relative z-10 print-box print-border">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-black text-red-300">هشدار امنیتی بسیار مهم</h4>
            <p className="text-[11px] font-bold text-red-200/90 leading-relaxed">
              این لینک حاوی اطلاعات محرمانه اکانت شماست. آن را **هرگز با دیگران به اشتراک نگذارید**.
              حتماً اطلاعات اکانت را با دکمه دانلود فوق دریافت و به صورت PDF ذخیره کنید تا همیشه به آن دسترسی داشته باشید.
            </p>
          </div>
        </div>

        {/* Dynamic content wrapper */}
        <div className="space-y-6 relative z-10">
          {isAppleId ? (
            <AppleIdLayout
              accountData={accountData}
              mainFields={mainFields}
              securityFields={securityFields}
              otherFields={otherFields}
              copiedKey={copiedKey}
              handleCopy={handleCopy}
              translateKey={translateKey}
            />
          ) : (
            <DefaultAccountLayout
              accountData={accountData}
              mainFields={mainFields}
              securityFields={securityFields}
              otherFields={otherFields}
              copiedKey={copiedKey}
              handleCopy={handleCopy}
              translateKey={translateKey}
            />
          )}

          {/* Support Information Card (Hidden when printing except basic info) */}
          {accountData.shop_name && (
            <div className="bg-indigo-950/30 border border-indigo-900/30 rounded-2xl p-5 space-y-4 print-box print-border">
              <h4 className="text-xs font-black text-slate-400 flex items-center gap-1.5 border-b border-indigo-900/30 pb-2 print-border">
                <HelpCircle size={14} className="text-indigo-400 no-print" />
                دریافت پشتیبانی از فروشگاه صادرکننده
              </h4>
              
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-300">
                    مغازه صادرکننده: <span className="text-white font-extrabold">{accountData.shop_name}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    برای مشکلات مربوط به فعال‌سازی یا ضمانت اکانت، از گزینه‌های پشتیبانی زیر استفاده کنید.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1 no-print">
                {(accountData.shop_support_id || accountData.shop_support_channel) && (
                  <a
                    href={`https://t.me/${(accountData.shop_support_id || accountData.shop_support_channel || '').trim().replace(/^@/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3 px-4 bg-blue-600/80 hover:bg-blue-600 text-white rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 transition-all active:scale-[0.98] shadow-sm shadow-blue-600/10"
                  >
                    <Send size={14} className="rotate-180" />
                    پشتیبانی در تلگرام
                  </a>
                )}
                
                {accountData.shop_support_phone && (
                  <a
                    href={`tel:${accountData.shop_support_phone}`}
                    className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs flex justify-center items-center gap-1.5 border border-slate-750 transition-all active:scale-[0.98]"
                  >
                    <Phone size={14} />
                    تماس تلفنی با پشتیبان
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-500 border-t border-slate-800/40 pt-4 flex items-center justify-center gap-1 mr-1 print-border">
          <Smartphone size={12} className="no-print" />
          <span>تاریخ خرید اکانت: {new Date(accountData.purchased_at).toLocaleDateString('fa-IR')}</span>
        </div>
      </div>
    </div>
  );
}
