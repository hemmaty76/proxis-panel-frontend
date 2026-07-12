import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  Receipt,
  Search,
  X,
  Loader2,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Smartphone,
  User
} from 'lucide-react';
import { getTransactions, type TransactionItem } from '../../../data/services/adminService';

export default function TransactionsList() {
  const { t, i18n } = useTranslation();

  const getLocale = () => {
    switch (i18n.language) {
      case 'en': return 'en-US';
      case 'ar': return 'ar-EG';
      case 'fa': default: return 'fa-IR';
    }
  };

  const formatCurrency = (value: number) =>
    `${value.toLocaleString(getLocale())} ${t('common.currency', 'تومان')}`;

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(getLocale(), {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [phoneNumberFilter, setPhoneNumberFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const pageSize = 10;

  const fetchTransactions = async (page = 1, phone = '') => {
    setIsLoading(true);
    try {
      const data = await getTransactions(page, pageSize, phone || undefined);
      setTransactions(data.items);
      setTotalPages(data.total_pages);
      setTotalCount(data.total_count);
    } catch {
      toast.error(t('transactions.messages.fetchError', 'خطا در بارگذاری تراکنش‌ها.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(currentPage, activeFilter);
  }, [currentPage, activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveFilter(phoneNumberFilter);
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setPhoneNumberFilter('');
    setActiveFilter('');
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-xs">
            <CheckCircle2 size={14} />
            {t('transactions.status.success', 'موفق')}
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full font-bold text-xs">
            <XCircle size={14} />
            {t('transactions.status.failed', 'ناموفق')}
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full font-bold text-xs animate-pulse">
            <AlertCircle size={14} />
            {t('transactions.status.pending', 'در انتظار')}
          </span>
        );
    }
  };

  const getGatewayBadge = (gateway: string) => {
    switch (gateway) {
      case 'ZARINPAL':
        return (
          <span className="inline-flex items-center px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-xs border border-indigo-100">
            {t('transactions.gateway.zarinpal', 'زرین‌پال')}
          </span>
        );
      case 'CRYPTO':
        return (
          <span className="inline-flex items-center px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg font-bold text-xs border border-purple-100">
            {t('transactions.gateway.crypto', 'رمزارز')}
          </span>
        );
      case 'MANUAL':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 bg-slate-50 text-slate-700 rounded-lg font-bold text-xs border border-slate-200">
            {t('transactions.gateway.manual', 'دستی (ادمین)')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="text-indigo-600" size={28} />
            {t('transactions.header.title', 'تراکنش‌های واریزی')}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {t('transactions.header.subtitle', 'مشاهده و فیلتر تمامی پرداخت‌ها، شارژهای دستی و تراکنش‌های بانکی')}
          </p>
        </div>

        {/* Filter Section */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm w-full md:w-auto max-w-sm">
          <Smartphone className="text-slate-400 shrink-0" size={18} />
          <input
            type="text"
            value={phoneNumberFilter}
            onChange={(e) => setPhoneNumberFilter(e.target.value)}
            placeholder={t('transactions.header.searchPlaceholder', 'فیلتر شماره تلفن...')}
            className="w-full bg-transparent border-none outline-none font-semibold text-slate-800 focus:ring-0 placeholder:text-slate-400 text-sm"
          />
          {activeFilter && (
            <button
              type="button"
              onClick={handleClearFilter}
              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          )}
          <button
            type="submit"
            className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shrink-0"
          >
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* Main List */}
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-600" size={36} /></div>
      ) : transactions.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[300px] flex flex-col justify-center items-center">
          <HelpCircle className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-600">
            {t('transactions.empty.title', 'تراکنشی یافت نشد')}
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            {activeFilter ? t('transactions.empty.withFilter', 'هیچ تراکنشی با این شماره تلفن ثبت نشده است.') : t('transactions.empty.noFilter', 'تاکنون هیچ تراکنشی در سیستم ثبت نگردیده است.')}
          </p>
          {activeFilter && (
            <button
              onClick={handleClearFilter}
              className="mt-4 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm rounded-xl transition-colors"
            >
              {t('transactions.empty.clearFilter', 'پاک کردن فیلتر')}
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center text-slate-500">
              <thead className="text-xs font-bold text-slate-700 bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">{t('transactions.table.user', 'کاربر')}</th>
                  <th className="px-6 py-4">{t('transactions.table.phone', 'شماره تلفن')}</th>
                  <th className="px-6 py-4">{t('transactions.table.amount', 'مبلغ واریزی')}</th>
                  <th className="px-6 py-4">{t('transactions.table.balanceAfter', 'موجودی پس از تراکنش')}</th>
                  <th className="px-6 py-4">{t('transactions.table.gateway', 'درگاه پرداخت')}</th>
                  <th className="px-6 py-4">{t('transactions.table.reference', 'شناسه مرجع / Authority')}</th>
                  <th className="px-6 py-4">{t('transactions.table.status', 'وضعیت')}</th>
                  <th className="px-6 py-4">{t('transactions.table.description', 'توضیحات')}</th>
                  <th className="px-6 py-4">{t('transactions.table.date', 'تاریخ تراکنش')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      <div className="flex items-center justify-center gap-1.5">
                        <User size={14} className="text-slate-400" />
                        <span>{tr.username || t('transactions.table.unknownUser', 'نامشخص')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700 dir-ltr text-center">
                      {tr.phone_number || t('transactions.table.noPhone', 'بدون شماره')}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-emerald-600 text-center">
                      {formatCurrency(tr.amount)}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-700 text-center">
                      {formatCurrency(tr.balance_after)}
                    </td>
                    <td className="px-6 py-4">
                      {getGatewayBadge(tr.gateway)}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600 text-center select-all" title={tr.reference_id || ''}>
                      {tr.reference_id || '---'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(tr.status)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600 max-w-[200px] truncate" title={tr.description || ''}>
                      {tr.description || t('transactions.table.noDescription', 'بدون توضیح')}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        <span>{formatDate(tr.created_at)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500">
                {t('transactions.pagination.total', 'تعداد کل: {{count}} تراکنش', { count: totalCount })}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold text-xs disabled:opacity-50 transition-colors"
                >
                  {t('transactions.pagination.prev', 'قبلی')}
                </button>
                <span className="px-3 py-1.5 text-xs font-extrabold text-slate-700">
                  {t('transactions.pagination.pageOf', '{{current}} از {{total}}', { current: currentPage, total: totalPages })}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-bold text-xs disabled:opacity-50 transition-colors"
                >
                  {t('transactions.pagination.next', 'بعدی')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
