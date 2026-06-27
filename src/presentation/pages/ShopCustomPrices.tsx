import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Settings, Save, Loader2, Info, HelpCircle } from 'lucide-react';
import { getShopCustomPrices, updateShopCustomPrice, type ShopCustomPriceItem } from '../../data/services/shopService';

export default function ShopCustomPrices() {
  const { t } = useTranslation();
  const [prices, setPrices] = useState<ShopCustomPriceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState('');

  const fetchCustomPrices = async () => {
    setIsLoading(true);
    try {
      const data = await getShopCustomPrices();
      setPrices(data);
    } catch {
      toast.error(t('shopCustomPrices.messages.fetchError', 'خطا در بارگذاری قیمت‌های سفارشی شما.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomPrices();
  }, []);

  const handleStartEdit = (item: ShopCustomPriceItem) => {
    setEditingId(item.id);
    setTempPrice(String(item.sell_price_per_unit));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setTempPrice('');
  };

  const handleSavePrice = async (id: string) => {
    const cleanPrice = Number(tempPrice.replace(/\D/g, ''));
    if (!cleanPrice || cleanPrice <= 0) {
      toast.error(t('shopCustomPrices.messages.invalidPrice', 'لطفاً قیمت معتبری وارد کنید.'));
      return;
    }

    try {
      await updateShopCustomPrice(id, cleanPrice);
      toast.success(t('shopCustomPrices.messages.saveSuccess', 'قیمت فروش دسته با موفقیت به‌روزرسانی شد.'));
      setEditingId(null);
      setTempPrice('');
      fetchCustomPrices();
    } catch {
      toast.error(t('shopCustomPrices.messages.saveError', 'خطا در ثبت قیمت جدید.'));
    }
  };

  const getSellTypeLabel = (val?: string) => {
    switch (val) {
      case 'VOLUME_TIME': return t('servicesManagement.labels.sellTypes.volumeTime', 'حجمی زمانی (محدود)');
      case 'UNLIMITED_VOLUME': return t('servicesManagement.labels.sellTypes.unlimitedVolume', 'حجم نامحدود (زمانی)');
      case 'UNLIMITED_TIME': return t('servicesManagement.labels.sellTypes.unlimitedTime', 'زمان نامحدود (حجمی)');
      default: return val || t('servicesManagement.labels.tables.unlimited', 'نامحدود');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* هدر */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="text-indigo-600" size={28} />
          {t('shopCustomPrices.labels.title', 'تنظیمات قیمت فروش به مشتری نهایی')}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">{t('shopCustomPrices.labels.subtitle', 'در این بخش می‌توانید قیمت نهایی فروش هر واحد سرویس (به ازای هر گیگابایت یا روز) را برای مشتریان خود مشخص کنید.')}</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-blue-800 text-sm leading-relaxed flex gap-3">
        <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-bold">{t('shopCustomPrices.labels.guideTitle', 'راهنمای محاسبه قیمت فروش نهایی:')}</p>
          <ul className="list-disc list-inside mt-1.5 space-y-1 font-medium text-xs leading-relaxed">
            <li>{t('shopCustomPrices.labels.guide1', 'در مدل‌های حجمی زمانی و زمان نامحدود، قیمت نهایی فاکتور فروش مشتری شما برابر با (قیمت فروش هر واحد × حجم گیگابایت پکیج) خواهد بود.')}</li>
            <li>{t('shopCustomPrices.labels.guide2', 'در مدل‌های حجم نامحدود، ملاک قیمت‌گذاری معمولاً بر اساس روز است اما فرمول فروش نهایی از مقداردهی فاکتور پیروی می‌کند.')}</li>
          </ul>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-600" size={36} /></div>
      ) : prices.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-base font-bold text-slate-500">{t('shopCustomPrices.labels.noPrices', 'هیچ تنظیمات قیمتی برای شما ثبت نشده است. ادمین باید دسته‌بندی‌های فروش فعال بسازد.')}</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prices.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between min-h-[170px]">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-black rounded-lg border border-indigo-100">{item.category_name || item.config_type_name || t('shopCustomPrices.labels.defaultServiceType', 'سرویس')}</span>
                  {!item.category_name && <span className="text-xs text-slate-400 font-bold">{getSellTypeLabel(item.sell_type)}</span>}
                </div>
                <h3 className="text-base font-extrabold text-slate-800">{t('shopCustomPrices.labels.cardTitle', 'تعرفه فروش به مشتری نهایی')}</h3>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2 w-full">
                    <input
                      type="text"
                      dir="ltr"
                      value={tempPrice ? Number(tempPrice).toLocaleString('en-US') : ''}
                      onChange={e => setTempPrice(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-sm text-left font-[inherit]"
                      autoFocus
                    />
                    <button onClick={() => handleSavePrice(item.id)} className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm" title={t('shopCustomPrices.labels.saveTitle', 'ذخیره قیمت')}><Save size={16} /></button>
                    <button onClick={handleCancelEdit} className="px-3 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-xs font-bold text-slate-500">{t('shopCustomPrices.labels.cancelBtn', 'لغو')}</button>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="text-[10px] text-slate-400 font-black block mb-0.5">{t('shopCustomPrices.labels.unitPrice', 'قیمت هر واحد (گیگابایت/روز)')}</span>
                      <span className="text-base font-black text-indigo-600 tabular-nums">{item.sell_price_per_unit.toLocaleString()} {t('usersManagement.currency', 'تومان')}</span>
                    </div>
                    <button onClick={() => handleStartEdit(item)} className="px-4 py-2 border border-indigo-100 bg-indigo-50/50 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 rounded-xl text-xs font-bold transition-all">{t('shopCustomPrices.labels.changeBtn', 'تغییر تعرفه')}</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
