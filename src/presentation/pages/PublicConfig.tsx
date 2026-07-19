import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { publicApiClient } from '../../core/api/axios';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ShieldCheck, AlertCircle, QrCode, FileText } from 'lucide-react';

// Declaration for the Cloudflare Turnstile global object
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        params: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface ConfigData {
  marzban_username: string;
  sub_link: string;
  status: string;
  expire_date: string | null;
}

// Custom Turnstile component
interface TurnstileProps {
  siteKey: string;
  onVerify: (token: string) => void;
}

function Turnstile({ siteKey, onVerify }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const scriptId = 'cloudflare-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          const id = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onVerify(token);
            },
            'expired-callback': () => {
              onVerify('');
            },
            'error-callback': () => {
              onVerify('');
            }
          });
          widgetIdRef.current = id;
        } catch (e) {
          console.error("Turnstile render error", e);
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        const checkInterval = setInterval(() => {
          if (window.turnstile) {
            clearInterval(checkInterval);
            renderWidget();
          }
        }, 100);
      };
      document.body.appendChild(script);
    } else {
      if (window.turnstile) {
        renderWidget();
      } else {
        script.addEventListener('load', renderWidget);
      }
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // Ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify]);

  return <div ref={containerRef} className="flex justify-center my-4" />;
}

export default function PublicConfig() {
  const { code } = useParams<{ code: string }>();
  const [inputCode, setInputCode] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [configData, setConfigData] = useState<ConfigData | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  // Fallback to Cloudflare's always-pass testing Site Key if not defined in .env
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeCode = code || inputCode;
    if (!activeCode) {
      toast.error('لطفا آدرس سرویس یا نام کاربری خود را وارد کنید.');
      return;
    }
    if (!captchaToken) {
      toast.error('لطفا تاییدیه امنیتی کلودفلر را کامل کنید.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await publicApiClient.post<ConfigData>('/public/config/sub-link', {
        code: activeCode,
        captcha_token: captchaToken,
      });
      setConfigData(response.data);
      toast.success('لینک اشتراک با موفقیت دریافت شد.');
    } catch (error: any) {
      console.error('Error fetching sub link:', error);
      const detail = error.response?.data?.detail || 'پاسخ نامعتبر است.';
      toast.error(detail);
      // Reset captcha token on error to force re-verification
      setCaptchaToken('');
      setResetTrigger(prev => prev + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = () => {
    if (!configData) return;
    navigator.clipboard.writeText(configData.sub_link);
    setCopied(true);
    toast.success('لینک کپی شد!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white" dir="rtl">
      <div className="max-w-[480px] w-full bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.5)] p-8 md:p-10 relative overflow-hidden">
        
        {/* Decorative ambient glowing backdrops */}
        <div className="absolute -top-20 -right-20 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4 animate-pulse">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
            دریافت لینک اتصال
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            جهت حفظ امنیت، لطفا تاییدیه امنیتی زیر را کامل کنید
          </p>
        </div>

        {!configData ? (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Input field if no code in URL */}
            {!code && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400 mr-1">
                  آدرس سرویس یا نام کاربری قدیمی
                </label>
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    if (captchaToken) {
                      setCaptchaToken('');
                      setResetTrigger(prev => prev + 1);
                    }
                  }}
                  className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800/80 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-200 text-left text-sm font-medium text-white placeholder:text-slate-500"
                  placeholder="مثال: https://domain.com/sub/username یا username"
                  autoComplete="off"
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center">
              <Turnstile key={resetTrigger} siteKey={siteKey} onVerify={setCaptchaToken} />
              {!captchaToken && (
                <span className="text-xs text-slate-500 mt-2">
                  در حال بررسی و بارگذاری تاییدیه امنیتی...
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !captchaToken}
              className={`w-full py-4 px-4 rounded-xl text-white font-bold shadow-lg transition-all duration-200 flex justify-center items-center gap-2
                ${isSubmitting || !captchaToken
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-750'
                  : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/10 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'}`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  در حال تایید...
                </span>
              ) : (
                'دریافت لینک اشتراک'
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-6 relative z-10 animate-fadeIn">
            {/* User details */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-3.5">
              <div className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-2">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <FileText size={15} /> شناسه کاربر
                </span>
                <span className="text-slate-200 font-bold tracking-wide font-mono" dir="ltr">
                  {configData.marzban_username}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-slate-800/50 pb-2">
                <span className="text-slate-400 font-medium">وضعیت اتصال</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  configData.status === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : configData.status === 'ON_HOLD'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {configData.status === 'ACTIVE'
                    ? 'فعال'
                    : configData.status === 'ON_HOLD'
                    ? 'در انتظار اتصال'
                    : configData.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-medium">تاریخ انقضا</span>
                <span className="text-slate-200 font-bold" dir="ltr">
                  {configData.expire_date 
                    ? configData.expire_date 
                    : configData.status === 'ON_HOLD' 
                    ? 'شروع پس از اولین اتصال' 
                    : 'نامحدود'}
                </span>
              </div>
            </div>

            {/* Sub Link Output */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 mr-1">
                لینک اشتراک
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={configData.sub_link}
                  className="flex-1 px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-xl outline-none text-left text-sm font-medium text-slate-300 font-mono tracking-tight select-all"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 ${copied ? 'bg-emerald-600 hover:bg-emerald-600' : ''}`}
                  title="کپی لینک"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>

            {/* Actions for QR code */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className={`py-2 px-4 rounded-lg text-xs font-semibold border flex items-center gap-2 transition-all duration-200 ${showQr ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-transparent border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'}`}
              >
                <QrCode size={16} />
                {showQr ? 'پنهان کردن کد QR' : 'نمایش کد QR برای اسکن با موبایل'}
              </button>
            </div>

            {/* QR Code Container */}
            {showQr && (
              <div className="bg-white p-5 rounded-2xl shadow-inner flex flex-col items-center justify-center gap-2.5 mx-auto max-w-[240px] animate-slideDown">
                <QRCodeSVG
                  value={configData.sub_link}
                  size={180}
                  level="H"
                  includeMargin={false}
                  className="w-full h-auto"
                />
                <span className="text-[10px] text-slate-500 font-semibold tracking-tight text-center mt-1">
                  جهت اتصال، این کد را در برنامه کلاینت اسکن کنید
                </span>
              </div>
            )}

            {/* Retrieve another sublink button */}
            <button
              type="button"
              onClick={() => {
                setConfigData(null);
                setCaptchaToken('');
                if (!code) setInputCode('');
              }}
              className="w-full py-3.5 bg-transparent hover:bg-slate-800/40 border border-slate-800 hover:border-slate-750 text-slate-400 hover:text-slate-200 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              استعلام مجدد
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="text-center mt-8 text-[11px] text-slate-500/80 font-medium flex items-center justify-center gap-1.5 relative z-10 border-t border-slate-800/40 pt-5">
          <AlertCircle size={12} />
          <span>لینک اشتراک خود را هرگز در اختیار دیگران قرار ندهید.</span>
        </div>
      </div>
    </div>
  );
}
