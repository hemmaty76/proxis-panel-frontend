import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Check, ChevronRight, ChevronLeft, QrCode, X, BarChart3, RefreshCw, LifeBuoy, Search, RotateCw, AlertTriangle, Loader2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  getShopConfigs,
  getConfigUsage,
  getConfigRenewInfo,
  renewConfig,
  type PaginatedPurchases,
  type ConfigUsageResponse,
  type RenewInfoResponse,
  type PackageItem
} from '../../data/services/shopService';
import { useTranslation } from 'react-i18next';



function encodeUuidToBase64(uuidStr: string): string {
  try {
    const hex = uuidStr.replace(/-/g, '');
    const bytes = new Uint8Array(hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = window.btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    return uuidStr;
  }
}

export default function UsersManagement({ hideHeader = false }: { hideHeader?: boolean }) {
  const { t, i18n } = useTranslation();

  const getLocale = () => {
    switch (i18n.language) {
      case 'en': return 'en-US';
      case 'ar': return 'ar-EG';
      case 'fa': default: return 'fa-IR';
    }
  };
  const formatCurrency = (value: number) => `${value.toLocaleString(getLocale())} ${t('usersManagement.currency')}`;

  const formatDate = (dateInput: string | number | Date | null | undefined) => {
    if (!dateInput) return t('usersManagement.emptyDate', 'بدون تاریخ');
    try {
      let date: Date;
      if (dateInput instanceof Date) {
        date = dateInput;
      } else if (typeof dateInput === 'number') {
        const isSeconds = dateInput < 10000000000;
        date = new Date(isSeconds ? dateInput * 1000 : dateInput);
      } else {
        const num = Number(dateInput);
        if (!isNaN(num) && dateInput.trim() !== '') {
          const isSeconds = num < 10000000000;
          date = new Date(isSeconds ? num * 1000 : num);
        } else {
          date = new Date(dateInput);
        }
      }

      if (isNaN(date.getTime())) {
        return t('usersManagement.emptyDate', 'بدون تاریخ');
      }

      return new Intl.DateTimeFormat(getLocale(), {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (e) {
      console.error('Error formatting date:', e, dateInput);
      return t('usersManagement.emptyDate', 'بدون تاریخ');
    }
  };

  const formatDataLimit = (limit: number) => {
    if (limit === 0) return t('usersManagement.unlimited');
    return `${limit.toLocaleString(getLocale())} ${t('usersManagement.gigabyte')}`;
  };
  const [data, setData] = useState<PaginatedPurchases | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; link: string; username: string } | null>(null);
  const [selectedUsage, setSelectedUsage] = useState<ConfigUsageResponse | null>(null);
  const [isUsageLoading, setIsUsageLoading] = useState(false);
  const [isUsageOpen, setIsUsageOpen] = useState(false);

  // Renew Modal States
  const [renewModalConfigId, setRenewModalConfigId] = useState<string | null>(null);
  const [renewInfo, setRenewInfo] = useState<RenewInfoResponse | null>(null);
  const [isRenewInfoLoading, setIsRenewInfoLoading] = useState(false);
  const [selectedRenewPackage, setSelectedRenewPackage] = useState<PackageItem | null>(null);
  const [customRenewSellPrice, setCustomRenewSellPrice] = useState<number | null>(null);
  const [isRenewing, setIsRenewing] = useState(false);
  const [showAllPackagesForRenew, setShowAllPackagesForRenew] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchConfigs = async () => {
      setIsLoading(true);
      try {
        const result = await getShopConfigs(currentPage, 10, appliedSearch);
        if (isMounted) setData(result);
      } catch (error) {
        if (isMounted) toast.error(t('usersManagement.messages.fetchError'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchConfigs();
    return () => { isMounted = false; };
  }, [currentPage, appliedSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setAppliedSearch(searchTerm);
  };

  const handleOpenRenewModal = async (configId: string) => {
    setRenewModalConfigId(configId);
    setIsRenewInfoLoading(true);
    setRenewInfo(null);
    setSelectedRenewPackage(null);
    setCustomRenewSellPrice(null);
    setShowAllPackagesForRenew(false);

    try {
      const info = await getConfigRenewInfo(configId);
      setRenewInfo(info);
      if (info.is_package_active && info.current_package) {
        setSelectedRenewPackage(info.current_package);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'خطا در دریافت اطلاعات تمدید');
      setRenewModalConfigId(null);
    } finally {
      setIsRenewInfoLoading(false);
    }
  };

  const handleConfirmRenew = async () => {
    if (!renewModalConfigId || !selectedRenewPackage) return;

    setIsRenewing(true);
    try {
      await renewConfig(renewModalConfigId, selectedRenewPackage.id, customRenewSellPrice);
      toast.success(`کانفیگ ${renewInfo?.marzban_username || ''} با موفقیت تمدید شد.`);
      setRenewModalConfigId(null);
      setRenewInfo(null);
      const result = await getShopConfigs(currentPage, 10, appliedSearch);
      setData(result);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'خطا در تمدید کانفیگ');
    } finally {
      setIsRenewing(false);
    }
  };

  const [copiedSupportId, setCopiedSupportId] = useState<string | null>(null);

  const handleCopyLink = async (id: string, link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(id);
      toast.success(t('usersManagement.messages.copySuccess'));
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error(t('usersManagement.messages.copyError'));
    }
  };

  const handleCopySupportLink = async (id: string) => {
    try {
      const codedId = encodeUuidToBase64(id);
      const link = `https://support.agentor.ir/${codedId}`;
      await navigator.clipboard.writeText(link);
      setCopiedSupportId(id);
      toast.success('لینک صفحه پشتیبانی (کپچا) کپی شد.');
      setTimeout(() => setCopiedSupportId(null), 2000);
    } catch (err) {
      toast.error('خطا در کپی لینک پشتیبانی');
    }
  };


  const handleShowUsage = async (username: string) => {
    setIsUsageOpen(true);
    setIsUsageLoading(true);
    setSelectedUsage(null);
    try {
      const result = await getConfigUsage(username);
      setSelectedUsage(result);
    } catch (error) {
      toast.error('خطا در دریافت اطلاعات مصرف کاربر از سرور اصلی');
      setIsUsageOpen(false);
    } finally {
      setIsUsageLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const val = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
    return `${val.toLocaleString(getLocale())} ${sizes[i]}`;
  };

  return (
    <div className="space-y-6 md:space-y-8 relative">
      {!hideHeader && (
        <header className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('usersManagement.header.title')}
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            {t('usersManagement.header.subtitle')}
          </p>
        </header>
      )}

      {/* بخش جستجو */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="جستجو با نام کاربری یا شناسه کانفیگ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            dir="rtl"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
          />
          <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors">
            <Search size={18} />
          </button>
        </form>
        {appliedSearch && (
          <button
            onClick={() => { setSearchTerm(''); setAppliedSearch(''); setCurrentPage(1); }}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-2 rounded-xl flex items-center gap-1 transition-colors self-end sm:self-auto"
          >
            <X size={14} />
            پاک کردن فیلتر جستجو
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">

        {/* === نمایش دسکتاپ === */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-right text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-6 py-4">{t('usersManagement.table.username')}</th>
                <th className="px-6 py-4">{t('usersManagement.table.serviceVolume')}</th>
                <th className="px-6 py-4">{t('usersManagement.table.createdAt')}</th>
                <th className="px-6 py-4">{t('usersManagement.table.sellPrice')}</th>
                <th className="px-6 py-4 text-center">{t('usersManagement.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse bg-white">
                    <td colSpan={6} className="px-6 py-4"><div className="h-4 w-full bg-slate-100 rounded"></div></td>
                  </tr>
                ))
              ) : data?.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">{t('usersManagement.table.noConfigs')}</td>
                </tr>
              ) : (
                data?.items.map((item) => {
                  const isConfig = item.product_type === 'CONFIG';
                  const displayName = (isConfig && item.config?.marzban_username) || 'محصول دیگر';
                  const configId = item.config?.id || '';
                  const subLink = item.config?.sub_link || '';
                  const dataLimit = item.config?.data_limit || 0;
                  const packageName = item.config?.package_name;
                  const packageDuration = item.config?.package_duration;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800 dir-ltr text-right">{displayName}</td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        {isConfig ? (
                          <>
                            <div>{formatDataLimit(dataLimit)}</div>
                            {packageName && (
                              <div className="text-xs text-slate-400 mt-0.5 font-normal">
                                {packageName} {packageDuration ? `(${packageDuration.toLocaleString(getLocale())} روز)` : ''}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-slate-400 text-xs">جزییات خرید در دسترس نیست</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{formatDate(item.created_at)}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700 tabular-nums">{formatCurrency(item.shop_sell_price)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                          {isConfig && (
                            <>
                              <button
                                onClick={() => handleOpenRenewModal(configId)}
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200"
                                title="تمدید سرویس"
                              >
                                <RotateCw size={18} strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() => handleShowUsage(displayName)}
                                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 transition-all duration-200"
                                title="مشاهده مصرف و جزئیات"
                              >
                                <BarChart3 size={18} strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() => setQrModal({ isOpen: true, link: subLink, username: displayName })}
                                className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-200"
                                title={t('usersManagement.tooltips.showQr')}
                              >
                                <QrCode size={18} strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() => handleCopyLink(configId, subLink)}
                                className={`p-2 rounded-lg transition-all duration-200 ${copiedId === configId ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600'
                                  }`}
                                title={t('usersManagement.tooltips.copyLink')}
                              >
                                {copiedId === configId ? <Check size={18} strokeWidth={2.5} /> : <Copy size={18} strokeWidth={2.5} />}
                              </button>
                              <button
                                onClick={() => handleCopySupportLink(configId)}
                                className={`p-2 rounded-lg transition-all duration-200 ${copiedSupportId === configId ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 hover:bg-purple-100 hover:text-purple-600'
                                  }`}
                                title="کپی لینک پشتیبانی (کپچا)"
                              >
                                {copiedSupportId === configId ? <Check size={18} strokeWidth={2.5} /> : <LifeBuoy size={18} strokeWidth={2.5} />}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* === نمایش موبایل === */}
        <div className="md:hidden flex flex-col divide-y divide-slate-100">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="p-5 h-32 animate-pulse bg-slate-50"></div>
            ))
          ) : data?.items.length === 0 ? (
            <div className="p-8 text-center text-slate-500">{t('usersManagement.table.noConfigs')}</div>
          ) : (
            data?.items.map((item) => {
              const isConfig = item.product_type === 'CONFIG';
              const displayName = (isConfig && item.config?.marzban_username) || 'محصول دیگر';
              const configId = item.config?.id || '';
              const subLink = item.config?.sub_link || '';
              const dataLimit = item.config?.data_limit || 0;
              const packageName = item.config?.package_name;
              const packageDuration = item.config?.package_duration;

              return (
                <div key={item.id} className="p-5 flex flex-col gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                  <div className="flex justify-between items-center gap-4 min-w-0">
                    <span className="font-bold text-slate-800 text-lg dir-ltr text-left truncate flex-1 min-w-0" title={displayName}>
                      {displayName}
                    </span>

                    <div className="flex items-center gap-2 shrink-0">
                      {isConfig && (
                        <>
                          <button
                            onClick={() => handleOpenRenewModal(configId)}
                            className="p-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                            title="تمدید سرویس"
                          >
                            <RotateCw size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleShowUsage(displayName)}
                            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                            title="مشاهده مصرف"
                          >
                            <BarChart3 size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => setQrModal({ isOpen: true, link: subLink, username: displayName })}
                            className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                            title={t('usersManagement.tooltips.showQr')}
                          >
                            <QrCode size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => handleCopyLink(configId, subLink)}
                            className={`p-2.5 rounded-xl transition-all duration-200 ${copiedId === configId ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600 shadow-sm'
                              }`}
                            title={t('usersManagement.tooltips.copyLink')}
                          >
                            {copiedId === configId ? <Check size={18} strokeWidth={2.5} /> : <Copy size={18} strokeWidth={2.5} />}
                          </button>
                          <button
                            onClick={() => handleCopySupportLink(configId)}
                            className={`p-2.5 rounded-xl transition-all duration-200 ${copiedSupportId === configId ? 'bg-emerald-100 text-emerald-600' : 'bg-purple-50 text-purple-600 shadow-sm'
                              }`}
                            title="کپی لینک پشتیبانی (کپچا)"
                          >
                            {copiedSupportId === configId ? <Check size={18} strokeWidth={2.5} /> : <LifeBuoy size={18} strokeWidth={2.5} />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 text-[11px] font-semibold block mb-0.5">{t('usersManagement.table.volumeShort')}</span>
                      {isConfig ? (
                        <>
                          <span className="font-medium text-slate-700 text-sm block">{formatDataLimit(dataLimit)}</span>
                          {packageName && (
                            <span className="text-[11px] text-slate-400 block mt-0.5 font-normal">
                              {packageName} {packageDuration ? `(${packageDuration.toLocaleString(getLocale())} روز)` : ''}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-400 text-xs">جزییات خرید در دسترس نیست</span>
                      )}
                    </div>
                    <div><span className="text-slate-400 text-[11px] font-semibold block mb-0.5">{t('usersManagement.table.sellPrice')}</span><span className="font-bold text-slate-800 text-sm tabular-nums">{formatCurrency(item.shop_sell_price)}</span></div>
                    <div><span className="text-slate-400 text-[11px] font-semibold block mb-0.5">{t('usersManagement.table.createdShort')}</span><span className="font-medium text-slate-600 text-sm">{formatDate(item.created_at)}</span></div>
                  </div>
                </div>
              );
            })
          )}
        </div>


        {!isLoading && data && data.total_pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
            <span className="text-sm font-medium text-slate-500">
              {t('usersManagement.pagination.page')} <span className="text-slate-800 font-bold">{data.current_page.toLocaleString(getLocale())}</span> {t('usersManagement.pagination.of')} <span className="text-slate-800 font-bold">{data.total_pages.toLocaleString(getLocale())}</span>
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"><ChevronRight size={18} /></button>
              <button onClick={() => setCurrentPage((p) => Math.min(data.total_pages, p + 1))} disabled={currentPage === data.total_pages} className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"><ChevronLeft size={18} /></button>
            </div>
          </div>
        )}
      </div>

      {/* === مودال QR Code === */}
      {qrModal?.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">

            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-slate-800">{t('usersManagement.qrModal.title')}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 dir-ltr text-right">{qrModal.username}</p>
              </div>
              <button
                onClick={() => setQrModal(null)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-8 flex justify-center bg-white">
              <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                <QRCodeCanvas
                  value={qrModal.link}
                  size={200}
                  level="M"
                  includeMargin={false}
                  className="rounded-lg"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
              <p className="text-sm font-medium text-slate-600">
                {t('usersManagement.qrModal.guide')}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* === مودال جزئیات مصرف (Real-time Config Details) === */}
      {isUsageOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">

            {/* Header */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-slate-800">
                  {t('usageModal.title', 'جزئیات مصرف کانفیگ')}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 dir-ltr text-right">
                  {selectedUsage?.username || t('usageModal.loadingUser', 'در حال بارگذاری...')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {selectedUsage && (
                  <button
                    onClick={() => handleShowUsage(selectedUsage.username)}
                    disabled={isUsageLoading}
                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors disabled:opacity-50"
                    title={t('usageModal.refreshTooltip', 'بروزرسانی')}
                  >
                    <RefreshCw size={18} strokeWidth={2.5} className={isUsageLoading ? 'animate-spin' : ''} />
                  </button>
                )}
                <button
                  onClick={() => setIsUsageOpen(false)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {isUsageLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <RefreshCw className="animate-spin text-indigo-600" size={32} />
                  <p className="text-sm font-semibold text-slate-500">
                    {t('usageModal.fetchingInfo', 'دریافت اطلاعات مصرف از سرور اصلی...')}
                  </p>
                </div>
              ) : selectedUsage ? (
                <div className="space-y-6 font-sans">
                  {/* Status */}
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-500">
                      {t('usageModal.status.title', 'وضعیت سرویس')}
                    </span>
                    <div>
                      {selectedUsage.status === 'active' && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          {t('usageModal.status.active', 'فعال (Active)')}
                        </span>
                      )}
                      {selectedUsage.status === 'on_hold' && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-700 border border-amber-200">
                          {t('usageModal.status.onHold', 'در انتظار اولین اتصال (On Hold)')}
                        </span>
                      )}
                      {selectedUsage.status === 'expired' && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                          {t('usageModal.status.expired', 'منقضی شده (Expired)')}
                        </span>
                      )}
                      {selectedUsage.status === 'disabled' && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-extrabold bg-slate-200 text-slate-700 border border-slate-300">
                          {t('usageModal.status.disabled', 'غیرفعال (Disabled)')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Volume Usage */}
                  <div className="space-y-3 bg-gradient-to-br from-indigo-50/50 to-slate-50 p-5 rounded-2xl border border-slate-100/80">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-bold text-indigo-950">
                        {t('usageModal.traffic.title', 'ترافیک مصرفی')}
                      </span>
                      <span className="text-xs font-bold text-indigo-950/80">
                        {formatBytes(selectedUsage.used_traffic)} {t('usageModal.traffic.of', 'از')} {selectedUsage.data_limit > 0 ? formatBytes(selectedUsage.data_limit) : t('usageModal.traffic.unlimited', 'نامحدود')}
                      </span>
                    </div>

                    {selectedUsage.data_limit > 0 ? (
                      <div className="space-y-1.5">
                        <div className="w-full bg-slate-200/80 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${((selectedUsage.used_traffic / selectedUsage.data_limit) * 100) > 85 ? 'bg-gradient-to-r from-rose-500 to-red-600' :
                                ((selectedUsage.used_traffic / selectedUsage.data_limit) * 100) > 60 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                                  'bg-gradient-to-r from-indigo-500 to-emerald-500'
                              }`}
                            style={{ width: `${Math.min(100, (selectedUsage.used_traffic / selectedUsage.data_limit) * 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                          <span>{Math.min(100, (selectedUsage.used_traffic / selectedUsage.data_limit) * 100).toFixed(1)}% {t('usageModal.traffic.used', 'مصرف شده')}</span>
                          <span>{formatBytes(Math.max(0, selectedUsage.data_limit - selectedUsage.used_traffic))} {t('usageModal.traffic.remaining', 'باقی‌مانده')}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full w-full"></div>
                      </div>
                    )}
                  </div>

                  {/* Other Info */}
                  <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
                    <div className="flex justify-between items-center p-4">
                      <span className="text-xs font-bold text-slate-500">
                        {t('usageModal.details.lifetime', 'کل ترافیک مصرفی (Lifetime)')}
                      </span>
                      <span className="text-sm font-bold text-slate-800 dir-ltr">{formatBytes(selectedUsage.lifetime_used_traffic)}</span>
                    </div>

                    <div className="flex justify-between items-center p-4">
                      <span className="text-xs font-bold text-slate-500">
                        {t('usageModal.details.createdAt', 'تاریخ ایجاد کانفیگ')}
                      </span>
                      <span className="text-sm font-bold text-slate-700">{formatDate(selectedUsage.created_at)}</span>
                    </div>

                    {selectedUsage.status === 'on_hold' ? (
                      <div className="flex justify-between items-center p-4">
                        <span className="text-xs font-bold text-slate-500">
                          {t('usageModal.details.duration', 'مدت دوره (پس از اتصال)')}
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                          {Math.round(selectedUsage.on_hold_expire_duration / (24 * 3600))} {t('usageModal.details.days', 'روز')}
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center p-4">
                        <span className="text-xs font-bold text-slate-500">
                          {t('usageModal.details.expire', 'تاریخ انقضا')}
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                          {selectedUsage.expire ? formatDate(selectedUsage.expire) : t('usageModal.traffic.unlimited', 'نامحدود')}
                        </span>
                      </div>
                    )}

                    {selectedUsage.online_at && (
                      <div className="flex justify-between items-center p-4">
                        <span className="text-xs font-bold text-slate-500">
                          {t('usageModal.details.lastOnline', 'آخرین اتصال به سرور')}
                        </span>
                        <span className="text-sm font-bold text-slate-700">{formatDate(selectedUsage.online_at)}</span>
                      </div>
                    )}

                    {selectedUsage.sub_updated_at && (
                      <div className="flex justify-between items-center p-4">
                        <span className="text-xs font-bold text-slate-500">
                          {t('usageModal.details.lastSubUpdate', 'آخرین بروزرسانی ساب')}
                        </span>
                        <span className="text-sm font-bold text-slate-700">{formatDate(selectedUsage.sub_updated_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50/50 text-center border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsUsageOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                {t('usageModal.closeBtn', 'بستن')}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* === مودال تمدید کانفیگ === */}
      {renewModalConfigId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
                  <RotateCw className="text-blue-600" size={20} />
                  تمدید سرویس کانفیگ
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 dir-ltr text-right">
                  {renewInfo?.marzban_username || 'در حال دریافت اطلاعات...'}
                </p>
              </div>
              <button
                onClick={() => setRenewModalConfigId(null)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {isRenewInfoLoading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
                  <p className="text-sm font-semibold text-slate-500">
                    در حال دریافت وضعیت پکیج و تمدید...
                  </p>
                </div>
              ) : renewInfo ? (
                <div className="space-y-5">
                  {/* اطلاعات لحظه‌ای سرویس فعلی در صورت دسترس بودن سرور */}
                  {renewInfo.live_info ? (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 text-xs">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-slate-500">وضعیت فعلی سرویس:</span>
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
                          renewInfo.live_info.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          renewInfo.live_info.status === 'on_hold' ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {renewInfo.live_info.status === 'active' ? 'فعال (Active)' :
                           renewInfo.live_info.status === 'on_hold' ? 'در انتظار اولین اتصال' :
                           'منقضی شده (Expired)'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-700 font-medium">
                        <span>ترافیک مصرفی:</span>
                        <span className="font-bold dir-ltr">
                          {formatBytes(renewInfo.live_info.used_traffic)} از {renewInfo.live_info.data_limit > 0 ? formatBytes(renewInfo.live_info.data_limit) : 'نامحدود'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-700 font-medium">
                        <span>تاریخ انقضا فعلی:</span>
                        <span className="font-bold">
                          {renewInfo.live_info.expire ? formatDate(renewInfo.live_info.expire) : 'بدون تاریخ انقضا'}
                        </span>
                      </div>
                    </div>
                  ) : renewInfo.server_accessible === false ? (
                    <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-4 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-bold text-rose-700">
                        <AlertTriangle size={16} />
                        وضعیت سرور: غیرقابل دسترس / منقضی شده
                      </div>
                      <p className="text-rose-600 leading-relaxed">
                        اطلاعات لحظه‌ای سرویس قابل خواندن نیست (دسترسی به سرور قطع یا حذف شده است).
                      </p>
                    </div>
                  ) : null}

                  {renewInfo.is_package_active && !showAllPackagesForRenew ? (
                    <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                          <Check size={16} />
                          پکیج فعلی فعال است:
                        </span>
                        <button
                          onClick={() => setShowAllPackagesForRenew(true)}
                          className="text-xs font-bold text-blue-600 hover:underline"
                        >
                          تغییر پکیج
                        </button>
                      </div>
                      <p className="text-base font-extrabold text-emerald-950">
                        {renewInfo.current_package?.name}
                      </p>
                      <div className="flex gap-4 text-xs font-bold text-emerald-700">
                        <span>حجم: {formatDataLimit(renewInfo.current_package?.data_limit_gb || 0)}</span>
                        <span>اعتبار: {renewInfo.current_package?.duration_days === 0 ? 'بدون تاریخ انقضا' : `${renewInfo.current_package?.duration_days} روز`}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {!renewInfo.is_package_active && (
                        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-2xl text-xs space-y-1.5">
                          <div className="flex items-center gap-2 font-bold text-amber-800">
                            <AlertTriangle size={16} />
                            پکیج اصلی این کانفیگ در حال حاضر غیرفعال شده است!
                          </div>
                          <p className="text-amber-800/90 leading-relaxed">
                            لطفاً یکی از پکیج‌های فعال زیر را برای تمدید این سرویس انتخاب کنید:
                          </p>
                        </div>
                      )}

                      <div className="bg-rose-50 border border-rose-200 text-rose-900 p-3.5 rounded-xl text-xs flex items-start gap-2.5 font-medium shadow-sm">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5 text-rose-600" />
                        <p className="leading-relaxed">
                          <strong className="font-extrabold text-rose-700">توجه بسیار مهم:</strong> در صورت تغییر پکیج، لینک پشتیبان مشتری ثابت می‌ماند اما آدرس جدید ساب‌لینک باید حتماً به مشتری تحویل داده شود (یا به مشتری بفرمایید آدرس جدید ساب‌لینک را از طریق همان لینک پشتیبان دریافت کند)، زیرا بدون لینک جدید مشتری به سرویس دسترسی نخواهد داشت.
                        </p>
                      </div>

                      <label className="block text-xs font-bold text-slate-700">
                        انتخاب پکیج جهت تمدید:
                      </label>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-1">
                        {renewInfo.available_packages.map((pkg) => (
                          <div
                            key={pkg.id}
                            onClick={() => setSelectedRenewPackage(pkg)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                              selectedRenewPackage?.id === pkg.id
                                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div>
                              <p className="font-bold text-sm text-slate-800">{pkg.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {formatDataLimit(pkg.data_limit_gb)} | {pkg.duration_days === 0 ? 'بدون تاریخ انقضا' : `${pkg.duration_days} روز`}
                              </p>
                            </div>
                            <div className="text-left dir-ltr">
                              <span className="font-black text-sm text-slate-800 tabular-nums">
                                {formatCurrency(pkg.cost_price)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRenewPackage && (
                    <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-4">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-600">مبلغ کسر از کیف پول:</span>
                        <span className="text-slate-900 tabular-nums">{formatCurrency(selectedRenewPackage.cost_price)}</span>
                      </div>

                      <div className="text-right">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          قیمت فروش دلخواه به مشتری (تومان):
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={customRenewSellPrice !== null ? customRenewSellPrice : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') setCustomRenewSellPrice(null);
                            else {
                              const num = parseInt(val, 10);
                              if (!isNaN(num) && num >= 0) setCustomRenewSellPrice(num);
                            }
                          }}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none text-sm font-bold"
                          placeholder={`پیش‌فرض: ${formatCurrency(selectedRenewPackage.sell_price)}`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
              <button
                onClick={() => setRenewModalConfigId(null)}
                disabled={isRenewing}
                className="px-4 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleConfirmRenew}
                disabled={isRenewing || !selectedRenewPackage}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isRenewing ? <Loader2 size={18} className="animate-spin" /> : 'پرداخت و تمدید'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}