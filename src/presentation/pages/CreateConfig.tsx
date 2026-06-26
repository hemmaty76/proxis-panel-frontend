import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Wallet, Package as PackageIcon, Check, Copy, QrCode, X, Clock, HardDrive, Loader2, Info } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import {
  getShopPackages,
  purchasePackage,
  getProfile,
  type PackageItem,
  type PurchaseResult
} from '../../data/services/shopService';



export default function CreateConfig() {
  const { t, i18n } = useTranslation();

  const getLocale = () => {
    switch (i18n.language) {
      case 'en': return 'en-US';
      case 'ar': return 'ar-EG';
      case 'fa': default: return 'fa-IR';
    }
  };
  const formatCurrency = (value: number) => `${value.toLocaleString(getLocale())} ${t('createConfig.currency')}`;

  const formatDataLimit = (limit: number) => {
    if (limit === 0) return t('createConfig.unlimited');
    return `${limit.toLocaleString(getLocale())} ${t('createConfig.gigabyte')}`;
  };
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [creditLimit, setCreditLimit] = useState<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [recentPurchases, setRecentPurchases] = useState<PurchaseResult['config_details'][]>([]);
  const [copiedUsername, setCopiedUsername] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; link: string; username: string } | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [packagesData, profileData] = await Promise.all([
          getShopPackages(),
          getProfile()
        ]);
        if (isMounted) {
          setPackages(packagesData);
          setBalance(profileData.balance);
          setCreditLimit(profileData.credit_limit)
        }
      } catch (error) {
        if (isMounted) toast.error(t('createConfig.messages.fetchError'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  // محاسبه قیمت تمام شده (مبلغی که از کیف پول کسر می‌شود)
  const getCostPrice = (pkg: PackageItem) => {
    return pkg.cost_price;
  };

  // محاسبه قیمت فروش (مبلغی که باید از مشتری گرفته شود)
  const getSellPrice = (pkg: PackageItem) => {
    return pkg.sell_price;
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;

    setIsPurchasing(true);
    try {
      const result = await purchasePackage(selectedPackage.id);
      toast.success(t('createConfig.messages.purchaseSuccess'));

      // کسر کردن "قیمت تمام شده" از موجودی
      const costPrice = getCostPrice(selectedPackage);
      setBalance(prev => prev !== null ? prev - costPrice : prev);

      setRecentPurchases(prev => [result.config_details, ...prev]);
      setSelectedPackage(null);
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || t('createConfig.messages.purchaseErrorFallback');
      toast.error(errorMsg);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleCopyLink = async (username: string, link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedUsername(username);
      toast.success(t('createConfig.messages.copySuccess'));
      setTimeout(() => setCopiedUsername(null), 2000);
    } catch (err) {
      toast.error(t('createConfig.messages.copyError'));
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('createConfig.header.title')}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {t('createConfig.header.subtitle')}
          </p>
        </div>

        <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 shrink-0">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Wallet size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 mb-0.5">{t('createConfig.header.currentBalance')}</p>
            <p className="text-lg font-black text-slate-800 tabular-nums">
              {balance !== null ? formatCurrency(balance) : '...'}
            </p>
          </div>
        </div>
      </header>

      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-white h-56 rounded-2xl border border-slate-100 animate-pulse"></div>
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <PackageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-700">{t('createConfig.package.notFound')}</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg)}
                className="bg-white border-2 border-slate-100 rounded-2xl p-5 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">
                    {pkg.name}
                  </h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <HardDrive size={16} className="text-slate-400" />
                      {t('createConfig.package.volume')} <span className="font-bold text-slate-800">{formatDataLimit(pkg.data_limit_gb)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock size={16} className="text-slate-400" />
                      {t('createConfig.package.validity')} <span className="font-bold text-slate-800 tabular-nums">{pkg.duration_days} {t('createConfig.days')}</span>
                    </div>
                  </div>
                </div>

                {/* بخش نمایش دوگانه قیمت‌ها در کارت */}
                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{t('createConfig.package.costPrice')}</span>
                    <span className="text-sm font-bold text-slate-700 tabular-nums">{formatCurrency(getCostPrice(pkg))}</span>
                  </div>
                  <div className="flex items-center justify-between bg-blue-50/50 p-2 -mx-2 rounded-lg">
                    <span className="text-xs font-bold text-blue-600/80">{t('createConfig.package.sellPrice')}</span>
                    <span className="text-sm font-black text-blue-700 tabular-nums">{formatCurrency(getSellPrice(pkg))}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {recentPurchases.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-lg font-extrabold text-slate-800 mb-4 flex items-center gap-2">
            <Check className="text-emerald-500" size={20} />
            {t('createConfig.recentPurchases.title')}
          </h2>
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl overflow-hidden">
            <div className="divide-y divide-emerald-100/50">
              {recentPurchases.map((config) => (
                <div key={config.marzban_username} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/60 hover:bg-white transition-colors">
                  <div>
                    <p className="font-bold text-slate-800 dir-ltr text-left text-lg">{config.marzban_username}</p>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                      {t('createConfig.recentPurchases.deductedAmount')} <span className="text-slate-700 font-bold tabular-nums">{formatCurrency(config.price_paid)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setQrModal({ isOpen: true, link: config.sub_link, username: config.marzban_username })} className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all flex items-center justify-center">
                      <QrCode size={18} strokeWidth={2.5} />
                    </button>
                    <button onClick={() => handleCopyLink(config.marzban_username, config.sub_link)} className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${copiedUsername === config.marzban_username ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                      {copiedUsername === config.marzban_username ? <><Check size={16} strokeWidth={2.5} /> {t('createConfig.recentPurchases.copied')}</> : <><Copy size={16} strokeWidth={2.5} /> {t('createConfig.recentPurchases.copyLink')}</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <PackageIcon size={32} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">{t('createConfig.modal.title')}</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {t('createConfig.modal.confirmPromptStart')}<span className="font-bold text-slate-700">{selectedPackage.name}</span>{t('createConfig.modal.confirmPromptEnd')}
              </p>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-6 space-y-3 text-sm">
                {/* مبلغ کسر از کیف پول */}
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-semibold">{t('createConfig.modal.amountToDeduct')}</span>
                  <span className="text-slate-800 font-bold tabular-nums">{formatCurrency(getCostPrice(selectedPackage))}</span>
                </div>

                {/* موجودی پس از خرید */}
                {balance !== null && (
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200/60">
                    <span className="text-slate-600 font-semibold">{t('createConfig.modal.balanceAfter')}</span>
                    <span className={`font-bold tabular-nums ${balance - getCostPrice(selectedPackage) < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                      {formatCurrency(balance - getCostPrice(selectedPackage))}
                    </span>
                  </div>
                )}
              </div>

              {/* راهنمای قیمت فروش برای فروشنده */}
              <div className="mt-4 flex items-start gap-2 bg-blue-50/50 text-blue-700 text-xs p-3 rounded-xl text-right">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t('createConfig.modal.guideStart')} <strong>{formatCurrency(getSellPrice(selectedPackage))}</strong> {t('createConfig.modal.guideMiddle')} <strong>{formatCurrency(getSellPrice(selectedPackage) - getCostPrice(selectedPackage))}</strong> {t('createConfig.modal.guideEnd')}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setSelectedPackage(null)}
                disabled={isPurchasing}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
              >
                {t('createConfig.modal.cancel')}
              </button>
              <button
                onClick={handleConfirmPurchase}
                // چک کردن موجودی با قیمت تمام‌شده
                disabled={isPurchasing || (balance !== null && (balance + creditLimit) < getCostPrice(selectedPackage))}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isPurchasing ? <Loader2 size={18} className="animate-spin" /> : t('createConfig.modal.payAndReceive')}
              </button>
            </div>
          </div>
        </div>
      )}

      {qrModal?.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-slate-800">{t('createConfig.qrModal.title')}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 dir-ltr text-right">{qrModal.username}</p>
              </div>
              <button onClick={() => setQrModal(null)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="p-8 flex justify-center bg-white">
              <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                <QRCodeCanvas value={qrModal.link} size={200} level="M" includeMargin={false} className="rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}