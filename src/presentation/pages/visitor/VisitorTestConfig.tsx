import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { FilePlus, Copy, Check, Loader2, Info, QrCode, X } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { getConfigTypes, type ConfigTypeItem } from '../../../data/services/adminService';
import { createVisitorTestConfig } from '../../../data/services/visitorService';

export default function VisitorTestConfig() {
  const { t } = useTranslation();
  const [configTypes, setConfigTypes] = useState<ConfigTypeItem[]>([]);
  const [selectedConfigTypeId, setSelectedConfigTypeId] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ username: string; subscription_url: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    const fetchConfigTypes = async () => {
      try {
        const types = await getConfigTypes();
        setConfigTypes(types);
        if (types.length > 0) {
          setSelectedConfigTypeId(types[0].id);
        }
      } catch (err) {
        toast.error(t('visitor.testConfig.messages.fetchTypesError', 'خطا در دریافت لیست سرویس‌ها.'));
      } finally {
        setIsLoadingTypes(false);
      }
    };
    fetchConfigTypes();
  }, [t]);

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConfigTypeId) {
      toast.error(t('visitor.testConfig.messages.selectTypeRequired', 'لطفاً نوع سرویس را انتخاب کنید.'));
      return;
    }
    if (!clientName.trim()) {
      toast.error(t('visitor.testConfig.messages.clientNameRequired', 'لطفاً نام مشتری را وارد کنید.'));
      return;
    }
    if (!description.trim()) {
      toast.error('لطفاً توضیحات را وارد کنید.');
      return;
    }

    setIsSubmitting(true);
    setResult(null);
    try {
      const res = await createVisitorTestConfig({
        config_type_id: selectedConfigTypeId,
        username: clientName.trim(),
        description: description.trim()
      });
      setResult(res);
      toast.success(t('visitor.testConfig.messages.createSuccess', 'کانفیگ تست با موفقیت ایجاد شد!'));
      setClientName('');
      setDescription('');
    } catch (err: any) {
      const msg = err?.response?.data?.detail || t('visitor.testConfig.messages.createError', 'خطا در ایجاد کانفیگ تست.');
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.subscription_url);
    setCopied(true);
    toast.success(t('visitor.testConfig.messages.copySuccess', 'لینک اشتراک کپی شد.'));
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <FilePlus className="text-indigo-600" size={28} />
          {t('visitor.testConfig.title', 'ایجاد کانفیگ تست')}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">{t('visitor.testConfig.subtitle', 'ساخت اکانت‌های تست موقت برای بررسی سرعت و اتصال')}</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex gap-3 text-amber-800">
        <Info className="shrink-0 mt-0.5" size={20} />
        <div className="text-sm font-medium leading-relaxed">
          <p className="font-bold mb-1">{t('visitor.testConfig.rules.title', 'قوانین اکانت تست ویزیتور:')}</p>
          <ul className="list-disc list-inside space-y-1">
            <li>{t('visitor.testConfig.rules.rule1', 'حجم کل این اکانت‌ها برابر ۱ گیگابایت است.')}</li>
            <li>{t('visitor.testConfig.rules.rule2', 'مدت زمان فعال بودن اکانت‌ها حداکثر ۱۰ روز می‌باشد.')}</li>
            <li>{t('visitor.testConfig.rules.rule3', 'هزینه اولیه ساخت کانفیگ تست بدون درصد ادمین و ویزیتور از موجودی شما کسر خواهد شد و برای مغازه‌دار رایگان است.')}</li>
            <li>{t('visitor.testConfig.rules.rule4', 'این اکانت‌ها در لیست اصلی فاکتورها ثبت نمی‌شوند اما تعداد آن‌ها در اطلاعات شما شمارش می‌شود.')}</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden p-6">
        <form onSubmit={handleCreateTest} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('visitor.testConfig.form.locationLabel', 'انتخاب نوع سرویس/لوکیشن')}</label>
            {isLoadingTypes ? (
              <div className="flex items-center gap-2 text-slate-400 py-2"><Loader2 className="animate-spin" size={18} /> {t('visitor.testConfig.form.loadingLocations', 'در حال دریافت لوکیشن‌ها...')}</div>
            ) : (
              <select
                value={selectedConfigTypeId}
                onChange={(e) => setSelectedConfigTypeId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-medium"
              >
                {configTypes.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.server_name || 'بدون سرور'} - {t.name} {t.categories_name_str ? `(${t.categories_name_str})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('visitor.testConfig.form.clientNameLabel', 'نام دلخواه برای تفکیک مشتری (انگلیسی)')}</label>
            <input
              type="text"
              required
              dir="ltr"
              placeholder="Ali, Client1"
              value={clientName}
              onChange={(e) => setClientName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-left font-medium"
            />
            <p className="text-[11px] text-slate-400 mt-1">{t('visitor.testConfig.form.clientNameHelper', 'نام کاربری نهایی شامل پیشوند ویزیتوری شما خواهد بود.')}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">توضیحات (به چه کسی ارائه شده - اجباری)</label>
            <textarea
              required
              rows={2}
              placeholder="مثال: تست برای مهران رضایی، همکار مغازه‌دار"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoadingTypes}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex justify-center items-center shadow-sm disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={20} /> {t('visitor.testConfig.form.submitting', 'در حال ساخت اکانت در مرزبان...')}</span>
            ) : (
              t('visitor.testConfig.form.submitBtn', 'ایجاد کانفیگ تست')
            )}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4 animate-in fade-in-50 zoom-in-95">
          <div className="flex items-center gap-2 text-emerald-800">
            <Check className="shrink-0" size={22} />
            <h3 className="font-extrabold text-lg">{t('visitor.testConfig.result.successTitle', 'کانفیگ با موفقیت در سرور ایجاد شد!')}</h3>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-500 font-bold block mb-1">{t('visitor.testConfig.result.usernameLabel', 'نام کاربری در سرور:')}</span>
              <code className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-emerald-800 select-all">{result.username}</code>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-bold block mb-1">{t('visitor.testConfig.result.subLinkLabel', 'لینک اشتراک (Subscription URL):')}</span>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  readOnly
                  value={result.subscription_url}
                  className="flex-1 min-w-[200px] px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors text-sm shadow-sm"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {t('visitor.testConfig.result.copyBtn', 'کپی لینک')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowQr(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors text-sm shadow-sm"
                >
                  <QrCode size={16} />
                  نمایش بارکد (QR)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQr && result && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-slate-800">بارکد اتصال کانفیگ تست</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 dir-ltr text-left">{result.username}</p>
              </div>
              <button
                onClick={() => setShowQr(false)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-8 flex justify-center bg-white">
              <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                <QRCodeCanvas
                  value={result.subscription_url}
                  size={200}
                  level="M"
                  includeMargin={false}
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
              <p className="text-sm font-medium text-slate-600">
                برای اتصال، این بارکد را در اپلیکیشن کلاینت خود اسکن کنید.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
