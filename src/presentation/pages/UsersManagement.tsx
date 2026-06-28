import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Check, ChevronRight, ChevronLeft, QrCode, X, BarChart3, RefreshCw } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { getShopConfigs, getConfigUsage, type PaginatedConfigs, type ConfigUsageResponse } from '../../data/services/shopService';
import { useTranslation } from 'react-i18next';



export default function UsersManagement() {
  const { t, i18n } = useTranslation();

  const getLocale = () => {
    switch (i18n.language) {
      case 'en': return 'en-US';
      case 'ar': return 'ar-EG';
      case 'fa': default: return 'fa-IR';
    }
  };
  const formatCurrency = (value: number) => `${value.toLocaleString(getLocale())} ${t('usersManagement.currency')}`;

  const formatDate = (iso: string) => {
    if (!iso) return t('usersManagement.emptyDate');
    return new Intl.DateTimeFormat(getLocale(), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(iso));
  };

  const formatDataLimit = (limit: number) => {
    if (limit === 0) return t('usersManagement.unlimited');
    return `${limit.toLocaleString(getLocale())} ${t('usersManagement.gigabyte')}`;
  };
  const [data, setData] = useState<PaginatedConfigs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrModal, setQrModal] = useState<{ isOpen: boolean; link: string; username: string } | null>(null);
  const [selectedUsage, setSelectedUsage] = useState<ConfigUsageResponse | null>(null);
  const [isUsageLoading, setIsUsageLoading] = useState(false);
  const [isUsageOpen, setIsUsageOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchConfigs = async () => {
      setIsLoading(true);
      try {
        const result = await getShopConfigs(currentPage, 10);
        if (isMounted) setData(result);
      } catch (error) {
        if (isMounted) toast.error(t('usersManagement.messages.fetchError'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchConfigs();
    return () => { isMounted = false; };
  }, [currentPage]);

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
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('usersManagement.header.title')}
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          {t('usersManagement.header.subtitle')}
        </p>
      </header>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">

        {/* === نمایش دسکتاپ === */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-right text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-6 py-4">{t('usersManagement.table.username')}</th>
                <th className="px-6 py-4">{t('usersManagement.table.serviceVolume')}</th>
                <th className="px-6 py-4">{t('usersManagement.table.createdAt')}</th>
                <th className="px-6 py-4">{t('usersManagement.table.expireDate')}</th>
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
                data?.items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dir-ltr text-right">{item.marzban_username}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">{formatDataLimit(item.data_limit)}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(item.created_at)}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(item.expire_date)}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700 tabular-nums">{formatCurrency(item.shop_sell_price)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleShowUsage(item.marzban_username)}
                          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-600 transition-all duration-200"
                          title="مشاهده مصرف و جزئیات"
                        >
                          <BarChart3 size={18} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => setQrModal({ isOpen: true, link: item.sub_link, username: item.marzban_username })}
                          className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-200"
                          title={t('usersManagement.tooltips.showQr')}
                        >
                          <QrCode size={18} strokeWidth={2.5} />
                        </button>
                        <button
                          onClick={() => handleCopyLink(item.id, item.sub_link)}
                          className={`p-2 rounded-lg transition-all duration-200 ${copiedId === item.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-600'
                            }`}
                          title={t('usersManagement.tooltips.copyLink')}
                        >
                          {copiedId === item.id ? <Check size={18} strokeWidth={2.5} /> : <Copy size={18} strokeWidth={2.5} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
            data?.items.map((item) => (
              <div key={item.id} className="p-5 flex flex-col gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800 text-lg dir-ltr text-left">{item.marzban_username}</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShowUsage(item.marzban_username)}
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                      title="مشاهده مصرف"
                    >
                      <BarChart3 size={18} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => setQrModal({ isOpen: true, link: item.sub_link, username: item.marzban_username })}
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                      title={t('usersManagement.tooltips.showQr')}
                    >
                      <QrCode size={18} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => handleCopyLink(item.id, item.sub_link)}
                      className={`p-2.5 rounded-xl transition-all duration-200 ${copiedId === item.id ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600 shadow-sm'
                        }`}
                      title={t('usersManagement.tooltips.copyLink')}
                    >
                      {copiedId === item.id ? <Check size={18} strokeWidth={2.5} /> : <Copy size={18} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <div><span className="text-slate-400 text-[11px] font-semibold block mb-0.5">{t('usersManagement.table.volumeShort')}</span><span className="font-medium text-slate-700 text-sm">{formatDataLimit(item.data_limit)}</span></div>
                  <div><span className="text-slate-400 text-[11px] font-semibold block mb-0.5">{t('usersManagement.table.sellPrice')}</span><span className="font-bold text-slate-800 text-sm tabular-nums">{formatCurrency(item.shop_sell_price)}</span></div>
                  <div><span className="text-slate-400 text-[11px] font-semibold block mb-0.5">{t('usersManagement.table.createdShort')}</span><span className="font-medium text-slate-600 text-sm">{formatDate(item.created_at)}</span></div>
                  <div><span className="text-slate-400 text-[11px] font-semibold block mb-0.5">{t('usersManagement.table.expireShort')}</span><span className="font-medium text-slate-600 text-sm">{formatDate(item.expire_date)}</span></div>
                </div>
              </div>
            ))
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
                          {selectedUsage.expire ? formatDate(new Date(selectedUsage.expire * 1000).toISOString()) : t('usageModal.traffic.unlimited', 'نامحدود')}
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
    </div>
  );
}