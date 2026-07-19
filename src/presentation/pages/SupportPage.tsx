import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { sendSupportMessage, getSettings } from '../../data/services/shopService';

export default function SupportPage() {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [telegramId, setTelegramId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupportSettings = async () => {
      try {
        const settings = await getSettings();
        if (settings.telegram_support_id) {
          const username = settings.telegram_support_id.trim().replace(/^@/, '');
          if (username) {
            setTelegramId(username);
          }
        }
      } catch (err) {
        console.error('Failed to load system settings:', err);
      }
    };
    fetchSupportSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error(t('passwordChangeForm.errors.fillAllFields', 'لطفاً تمام فیلدها را پر کنید'));
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await sendSupportMessage(message);
      if (response.status === 'success') {
        toast.success(t('support.sendSuccess', 'پیام شما با موفقیت ارسال شد.'));
        setMessage('');
      } else {
        toast.error(t('support.sendError', 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.'));
      }
    } catch (err) {
      toast.error(t('support.sendError', 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.'));
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRtl = i18n.language !== 'en';

  return (
    <div className={`p-4 md:p-8 max-w-5xl mx-auto space-y-8 ${isRtl ? 'text-right' : 'text-left'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-700 rounded-3xl p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-white" />
              {t('support.title', 'پشتیبانی و ثبت پیشنهاد')}
            </h1>
            <p className="text-indigo-100 text-sm font-medium max-w-xl">
              {t('support.qualityDesc', 'تلاش ما همواره ارائه بالاترین کیفیت و پایداری برای سرویس‌های شماست. در صورت نیاز به راهنمایی یا ثبت انتقادات و پیشنهادات، از فرم زیر استفاده کنید.')}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/15 w-fit">
            <Sparkles className="w-5 h-5 text-yellow-300 animate-spin duration-3000" />
            <span className="text-xs font-bold tracking-wide">{t('support.support24h', 'پشتیبانی ۲۴ ساعته')}</span>
          </div>
        </div>
      </div>

      {/* Grid Layout for Telegram Outage & Suggestion Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Telegram Support Outage Card (4 Cols on Large Screen) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between flex-1 space-y-6">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm">
                <svg className="w-7 h-7 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </div>
              
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  {t('support.telegramTitle', 'ارسال گزارش خرابی در تلگرام')}
                </h3>
                {telegramId && (
                  <p className="text-indigo-600 text-xs font-bold mt-1 dir-ltr inline-block">
                    @{telegramId}
                  </p>
                )}
              </div>

              {/* Strict Warning alert specific for Telegram messaging */}
              <div className="bg-red-50/70 border border-red-100 rounded-2xl p-4 flex gap-3">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-700 text-[11px] font-bold leading-relaxed">
                  {t('support.warning', 'فقط در صورت قطعی سرویس‌ها به پشتیبان پیام دهید. در زمان قطعی سراسری هیچ مسئولیتی وجود ندارد و سرویس‌هایی که دارای تاریخ انقضا هستند اگر تمام شوند تمدید نخواهند شد.')}
                </p>
              </div>
            </div>

            {telegramId ? (
              <a
                href={`https://t.me/${telegramId}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-2xl font-black text-center text-sm shadow-md shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 flex justify-center items-center gap-2"
              >
                {t('support.telegramBtn', 'ارسال پیام در تلگرام')}
              </a>
            ) : (
              <div className="text-center text-xs font-bold text-slate-400 py-3">
                {t('support.telegramNotConfigured', 'پشتیبان تلگرام پیکربندی نشده است.')}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Premium Suggestion & Feedback Form (7 Cols on Large Screen) */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                {t('support.suggestionTitle', 'ثبت انتقاد یا پیشنهاد')}
              </h3>
              <p className="text-slate-400 text-xs font-semibold">
                {t('support.suggestionDesc', 'برای ارسال هرگونه پیشنهاد، انتقاد یا ایده جدید جهت بهبود پنل، از فرم زیر استفاده کنید.')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('support.placeholder', 'متن پیشنهاد، گزارش باگ یا ایده خود را بنویسید...')}
                  rows={6}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-bold text-sm text-slate-700 placeholder:text-slate-400/80 transition-all resize-none shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-100 hover:shadow-indigo-200 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                <Send size={15} className={isRtl ? 'rotate-180' : ''} />
                {isSubmitting ? t('support.sending', 'در حال ارسال...') : t('support.sendBtn', 'ارسال پیشنهاد یا انتقاد')}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
