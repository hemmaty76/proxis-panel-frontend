import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Save, Loader2, Store } from 'lucide-react';
import { getProfile, updateProfile } from '../../data/services/shopService';

export default function ShopSettings() {
  const { t } = useTranslation();
  const [shopName, setShopName] = useState('');
  const [supportChannel, setSupportChannel] = useState('');
  const [supportId, setSupportId] = useState('');
  const [supportPhone, setSupportPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setShopName(data.shop_name || '');
        setSupportChannel(data.support_channel || '');
        setSupportId(data.support_id || '');
        setSupportPhone(data.support_phone || '');
      } catch {
        toast.error(t('shopSettings.messages.fetchError', 'خطا در بارگذاری اطلاعات فروشگاه.'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [t]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        shop_name: shopName,
        support_channel: supportChannel,
        support_id: supportId,
        support_phone: supportPhone,
      });
      toast.success(t('shopSettings.messages.saveSuccess', 'اطلاعات پشتیبانی فروشگاه با موفقیت ذخیره شد.'));
    } catch {
      toast.error(t('shopSettings.messages.saveError', 'خطا در ذخیره اطلاعات فروشگاه.'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Store className="text-indigo-600" size={28} />
          {t('shopSettings.labels.title', 'تنظیمات فروشگاه و پشتیبانی')}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">
          {t('shopSettings.labels.subtitle', 'اطلاعات زیر در لینک سابسکریپشن نمایش داده می‌شود و برای کانفیگ‌های جدید اعمال خواهد شد.')}
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            {t('shopSettings.labels.shopName', 'نام فروشگاه')}
          </label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all"
            placeholder={t('shopSettings.placeholders.shopName', 'فروشگاه آنلاین من')}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            {t('shopSettings.labels.supportChannel', 'آدرس کانال پشتیبانی (بله، تلگرام و...)')}
          </label>
          <input
            type="text"
            value={supportChannel}
            onChange={(e) => setSupportChannel(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all"
            placeholder="https://t.me/my_channel"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            {t('shopSettings.labels.supportId', 'آدرس آیدی پشتیبانی')}
          </label>
          <input
            type="text"
            value={supportId}
            onChange={(e) => setSupportId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all"
            placeholder="https://t.me/my_support"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            {t('shopSettings.labels.supportPhone', 'شماره تماس پشتیبانی')}
          </label>
          <input
            type="text"
            value={supportPhone}
            onChange={(e) => setSupportPhone(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-all"
            placeholder="09123456789"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl font-bold text-sm transition-colors shadow-sm shadow-indigo-600/10"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                {t('shopSettings.buttons.saving', 'در حال ذخیره...')}
              </>
            ) : (
              <>
                <Save size={18} />
                {t('shopSettings.buttons.save', 'ذخیره تنظیمات')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
