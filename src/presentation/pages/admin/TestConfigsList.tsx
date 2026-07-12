import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Copy,
  Check,
  Loader2,
  HelpCircle,
  QrCode,
  X,
  Plus,
  FileText
} from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { getVisitorTestConfigs, updateVisitorTestConfigDescription, type TestConfigItem } from '../../../data/services/visitorService';

export default function TestConfigsList() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('user_role');

  const [testConfigs, setTestConfigs] = useState<TestConfigItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // QR Modal State
  const [qrModal, setQrModal] = useState<{ username: string; link: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Description Modal State
  const [descModal, setDescModal] = useState<{ id: string; username: string; description: string } | null>(null);
  const [isUpdatingDesc, setIsUpdatingDesc] = useState(false);

  const getLocale = () => {
    switch (i18n.language) {
      case 'en': return 'en-US';
      case 'ar': return 'ar-EG';
      case 'fa': default: return 'fa-IR';
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(getLocale(), {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const formatVolume = (bytes: number) => {
    if (bytes === 0) return t('visitor.testConfigsList.volumeFormat.zero', '۰ گیگابایت');
    const gb = bytes / 1073741824;
    return t('visitor.testConfigsList.volumeFormat.gb', '{{gb}} گیگابایت', { gb: gb.toFixed(0) });
  };

  const fetchTestConfigs = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getVisitorTestConfigs(page, pageSize);
      setTestConfigs(response.items);
      setTotalPages(response.total_pages);
      setTotalCount(response.total_count);
    } catch {
      toast.error(t('visitor.testConfig.messages.fetchError', 'خطا در بارگذاری اطلاعات کانفیگ‌های تست.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestConfigs(currentPage);
  }, [currentPage]);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    toast.success(t('visitor.testConfig.messages.copySuccess', 'لینک اشتراک کپی شد.'));
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleUpdateDescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descModal) return;

    setIsUpdatingDesc(true);
    try {
      await updateVisitorTestConfigDescription(descModal.id, descModal.description);
      toast.success(t('visitor.testConfigsList.messages.updateDescSuccess', 'توضیحات با موفقیت ویرایش شد.'));
      setDescModal(null);
      fetchTestConfigs(currentPage);
    } catch {
      toast.error(t('visitor.testConfigsList.messages.updateDescError', 'خطا در ویرایش توضیحات.'));
    } finally {
      setIsUpdatingDesc(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="text-indigo-600" size={28} />
            {t('visitor.testConfigsList.header.title', 'کانفیگ‌های تست رایگان')}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {t('visitor.testConfigsList.header.subtitle', 'لیست کامل اکانت‌های تست موقت صادر شده توسط ویزیتورها و وضعیت آن‌ها')}
          </p>
        </div>

        {userRole === 'VISITOR' && (
          <button
            onClick={() => navigate('/visitor/test-config')}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-indigo-600/10 hover:shadow-md"
          >
            <Plus size={18} />
            {t('visitor.testConfigsList.buttons.create', 'ساخت کانفیگ تست جدید')}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[300px]">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <span className="font-semibold text-sm">{t('visitor.testConfigsList.loading', 'در حال دریافت لیست کانفیگ‌های تست...')}</span>
        </div>
      ) : testConfigs.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[300px] flex flex-col justify-center items-center">
          <HelpCircle className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-600">
            {t('visitor.testConfigsList.empty.title', 'هیچ کانفیگ تستی صادر نشده است')}
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            {t('visitor.testConfigsList.empty.description', 'در صورت صادر شدن اکانت‌های تست توسط ویزیتورها، مشخصات و لینک‌های آن‌ها در این بخش نمایش داده خواهد شد.')}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center text-slate-500">
              <thead className="text-xs font-bold text-slate-700 bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">{t('visitor.testConfigsList.table.username', 'نام کاربری')}</th>
                  {(userRole === 'ADMIN' || userRole === 'SUPPLIER') && (
                    <th className="px-6 py-4">{t('visitor.testConfigsList.table.visitor', 'ویزیتور')}</th>
                  )}
                  <th className="px-6 py-4">{t('visitor.testConfigsList.table.server', 'سرور / لوکیشن')}</th>
                  <th className="px-6 py-4">{t('visitor.testConfigsList.table.volume', 'حجم (اعتبار)')}</th>
                  {(userRole === 'ADMIN' || userRole === 'VISITOR') && (
                    <th className="px-6 py-4">{t('visitor.testConfigsList.table.description', 'توضیحات (ارائه شده به)')}</th>
                  )}
                  <th className="px-6 py-4">{t('visitor.testConfigsList.table.createdAt', 'تاریخ ساخت')}</th>
                  <th className="px-6 py-4">{t('visitor.testConfigsList.table.actions', 'عملیات')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {testConfigs.map((config) => (
                  <tr key={config.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 text-left dir-ltr max-w-[200px] truncate">
                      {config.marzban_username}
                    </td>
                    {(userRole === 'ADMIN' || userRole === 'SUPPLIER') && (
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {config.visitor_username || t('visitor.testConfigsList.table.unknown', 'نامشخص')}
                      </td>
                    )}
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {config.server_name || t('visitor.testConfigsList.table.unknown', 'نامشخص')}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {formatVolume(config.data_limit)} {t('visitor.testConfigsList.daysFormat', '({{days}} روز)', { days: 10 })}
                    </td>
                    {(userRole === 'ADMIN' || userRole === 'VISITOR') && (
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setDescModal({ id: config.id, username: config.marzban_username, description: config.description })}
                          className="mx-auto flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 rounded-xl font-bold text-xs transition-all max-w-[160px] truncate"
                          title={t('visitor.testConfigsList.tooltips.editDescription', 'مشاهده / ویرایش توضیحات')}
                        >
                          <FileText size={14} className="text-slate-400 shrink-0" />
                          <span className="truncate">{config.description || t('visitor.testConfigsList.table.noDescription', 'بدون توضیح')}</span>
                        </button>
                      </td>
                    )}
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {formatDate(config.created_at)}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleCopyLink(config.sub_link)}
                        className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition-all"
                        title={t('visitor.testConfigsList.tooltips.copyLink', 'کپی لینک اشتراک')}
                      >
                        {copiedLink === config.sub_link ? (
                          <Check className="text-emerald-600" size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => setQrModal({ username: config.marzban_username, link: config.sub_link })}
                        className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-all"
                        title={t('visitor.testConfigsList.tooltips.showQr', 'نمایش بارکد (QR Code)')}
                      >
                        <QrCode size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <span className="text-xs font-semibold text-slate-500">
                {t('visitor.testConfigsList.pagination.total', 'مجموع: {{count}} کانفیگ', { count: totalCount })}
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40"
                >
                  {t('visitor.testConfigsList.pagination.prev', 'قبلی')}
                </button>
                <span className="text-xs font-semibold text-slate-600">
                  {t('visitor.testConfigsList.pagination.pageOf', 'صفحه {{current}} از {{total}}', { current: currentPage, total: totalPages })}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40"
                >
                  {t('visitor.testConfigsList.pagination.next', 'بعدی')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QR Modal */}
      {qrModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-slate-800">{t('visitor.testConfigsList.modals.qr.title', 'بارکد اتصال کانفیگ تست')}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 dir-ltr text-left">{qrModal.username}</p>
              </div>
              <button
                onClick={() => setQrModal(null)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-8 flex justify-center bg-white">
              <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm animate-pulse-once">
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
                {t('visitor.testConfigsList.modals.qr.guide', 'برای اتصال، این بارکد را در اپلیکیشن کلاینت خود اسکن کنید.')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Description Modal */}
      {descModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="font-extrabold text-slate-800">{t('visitor.testConfigsList.modals.desc.title', 'توضیحات کانفیگ تست')}</h3>
                <p className="text-xs font-semibold text-slate-500 mt-1 dir-ltr text-left">{descModal.username}</p>
              </div>
              <button
                onClick={() => setDescModal(null)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleUpdateDescription} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2">{t('visitor.testConfigsList.modals.desc.label', 'توضیحات (ارائه شده به):')}</label>
                <textarea
                  value={descModal.description}
                  onChange={(e) => setDescModal(prev => prev ? { ...prev, description: e.target.value } : null)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-sm font-semibold transition-all"
                  placeholder={t('visitor.testConfigsList.modals.desc.placeholder', 'توضیحات ارائه این کانفیگ تست...')}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setDescModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-colors text-sm"
                >
                  {t('visitor.testConfigsList.modals.desc.cancel', 'انصراف')}
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingDesc}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors text-sm disabled:opacity-50"
                >
                  {isUpdatingDesc && <Loader2 className="animate-spin" size={16} />}
                  {t('visitor.testConfigsList.modals.desc.submit', 'ثبت تغییرات')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
