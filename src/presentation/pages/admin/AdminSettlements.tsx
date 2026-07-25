import { useEffect, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  Wallet,
  Plus,
  Loader2,
  HelpCircle,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  X,
  History,
  Users
} from 'lucide-react';
import {
  type SettlementDashboardResponse,
  type AdminUserItem,
  type UserDebtItem,
  getSettlementDashboard,
  createSettlement,
  getAllShops,
  getAdminUserDebts
} from '../../../data/services/adminService';

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  accent: 'default' | 'slate' | 'indigo' | 'green' | 'red';
}

function StatCard({ title, value, icon, accent }: StatCardProps) {
  const accentStyles = {
    default: { ring: 'ring-slate-200', iconBg: 'bg-slate-100 text-slate-600', value: 'text-slate-900' },
    slate: { ring: 'ring-slate-200', iconBg: 'bg-slate-200/70 text-slate-700', value: 'text-slate-800' },
    indigo: { ring: 'ring-indigo-100', iconBg: 'bg-indigo-50 text-indigo-600', value: 'text-indigo-700' },
    green: { ring: 'ring-emerald-100', iconBg: 'bg-emerald-50 text-emerald-600', value: 'text-emerald-700' },
    red: { ring: 'ring-red-100', iconBg: 'bg-red-50 text-red-600', value: 'text-red-700' },
  }[accent];

  return (
    <div className={`group relative bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200 min-h-[132px] flex flex-col justify-between`}>
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentStyles.iconBg}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className={`text-2xl font-extrabold tracking-tight tabular-nums ${accentStyles.value}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function AdminSettlements() {
  const { t, i18n } = useTranslation();

  const getLocale = () => {
    switch (i18n.language) {
      case 'en': return 'en-US';
      case 'ar': return 'ar-EG';
      case 'fa': default: return 'fa-IR';
    }
  };

  const formatCurrency = (value: number) =>
    `${value.toLocaleString('en-US')} ${t('common.currency', 'تومان')}`;

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(getLocale(), {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));

  const userRole = localStorage.getItem('user_role');

  const [activeTab, setActiveTab] = useState<'settlements' | 'debts'>('settlements');
  const [data, setData] = useState<SettlementDashboardResponse | null>(null);
  const [userDebts, setUserDebts] = useState<UserDebtItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDebtsLoading, setIsDebtsLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<AdminUserItem[]>([]);
  
  // Pagination & Filtering States
  const [currentPage, setCurrentPage] = useState(1);
  const [filterUserId, setFilterUserId] = useState('');
  const pageSize = 10;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newTrackingCode, setNewTrackingCode] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSuppliersList = async () => {
    try {
      const [suppliersData, visitorsData] = await Promise.all([
        getAllShops(1, 100, undefined, 'SUPPLIER'),
        getAllShops(1, 100, undefined, 'VISITOR')
      ]);
      setSuppliers([...suppliersData.items, ...visitorsData.items]);
    } catch {
      // Silent error
    }
  };

  const fetchUserDebtsData = async () => {
    if (userRole !== 'ADMIN') return;
    setIsDebtsLoading(true);
    try {
      const debts = await getAdminUserDebts();
      setUserDebts(debts);
    } catch {
      // Silent error
    } finally {
      setIsDebtsLoading(false);
    }
  };

  const fetchDashboardData = async (page = 1, userId = '') => {
    setIsLoading(true);
    try {
      const params: any = { page, page_size: pageSize };
      if (userId) {
        params.user_id = userId;
      }
      const settlementData = await getSettlementDashboard(params);
      setData(settlementData);
    } catch {
      toast.error(t('settlements.messages.fetchError', 'خطا در بارگذاری اطلاعات تسویه‌حساب.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === 'ADMIN') {
      fetchSuppliersList();
      fetchUserDebtsData();
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(currentPage, filterUserId);
  }, [currentPage, filterUserId]);

  useEffect(() => {
    if (activeTab === 'debts' && userRole === 'ADMIN') {
      fetchUserDebtsData();
    }
  }, [activeTab]);

  const handleOpenModal = () => {
    setNewAmount('');
    setNewTrackingCode('');
    setSelectedUserId('');
    setIsModalOpen(true);
  };

  const handleSettleUser = (debtItem: UserDebtItem) => {
    setSelectedUserId(debtItem.user_id);
    setNewAmount(debtItem.remaining_debt > 0 ? debtItem.remaining_debt.toLocaleString('en-US') : '');
    setNewTrackingCode('');
    setIsModalOpen(true);
  };

  const handleSubmitSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(newAmount.replace(/\D/g, ''));

    if (!selectedUserId) {
      toast.error(t('settlements.messages.selectSupplier', 'لطفاً تامین‌کننده را انتخاب کنید.'));
      return;
    }

    if (!numericAmount || numericAmount <= 0) {
      toast.error(t('settlements.messages.invalidAmount', 'لطفاً مبلغ معتبری وارد کنید.'));
      return;
    }

    setIsSubmitting(true);
    try {
      await createSettlement(selectedUserId, numericAmount, newTrackingCode);
      toast.success(t('settlements.messages.success', 'پرداختی با موفقیت ثبت شد.'));
      setIsModalOpen(false);
      fetchDashboardData(currentPage, filterUserId);
      fetchUserDebtsData();
    } catch {
      toast.error(t('settlements.messages.submitError', 'خطا در ثبت پرداختی.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupplierFilterChange = (userId: string) => {
    setFilterUserId(userId);
    setCurrentPage(1);
  };

  const historyResponse = data?.history;
  const historyItems = historyResponse?.items || [];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet className="text-indigo-600" size={28} />
            {t('settlements.header.title', 'تسویه‌حساب آپ‌استریم')}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {t('settlements.header.subtitle', 'مدیریت بدهی‌ها و پرداختی‌ها به ارائه‌دهنده سرور اصلی')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {/* Supplier Filter Dropdown */}
          {userRole === 'ADMIN' && (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-sm">
              <span className="text-slate-500 font-bold shrink-0">{t('settlements.labels.userFilter', 'نام کاربر:')}</span>
              <select
                value={filterUserId}
                onChange={e => handleSupplierFilterChange(e.target.value)}
                className="bg-transparent border-none outline-none font-bold text-slate-800 focus:ring-0 cursor-pointer"
              >
                <option value="">{t('settlements.labels.allUsers', 'همه کاربران')}</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.username} ({s.role === 'VISITOR' ? t('settlements.roles.visitor', 'ویزیتور') : t('settlements.roles.supplier', 'تامین‌کننده')})</option>
                ))}
              </select>
            </div>
          )}

          {userRole === 'ADMIN' && (
            <button
              onClick={handleOpenModal}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 w-full md:w-auto"
            >
              <Plus size={20} />
              {t('settlements.buttons.newSettlement', 'ثبت پرداختی جدید')}
            </button>
          )}
        </div>
      </div>

      {/* Top Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('settlements')}
          className={`py-3 px-5 text-sm font-extrabold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'settlements'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <History size={18} />
          <span>{t('settlements.tabs.history', 'لیست تسویه‌ها')}</span>
        </button>

        {userRole === 'ADMIN' && (
          <button
            onClick={() => setActiveTab('debts')}
            className={`py-3 px-5 text-sm font-extrabold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'debts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Users size={18} />
            <span>{t('settlements.tabs.debts', 'لیست بدهی‌ها')}</span>
            {userDebts.filter(d => d.remaining_debt > 0).length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                {userDebts.filter(d => d.remaining_debt > 0).length}
              </span>
            )}
          </button>
        )}
      </div>

      {activeTab === 'debts' && userRole === 'ADMIN' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="text-slate-400" size={20} />
                <h2 className="text-lg font-bold text-slate-800">لیست بدهی تامین‌کنندگان و ویزیتورها</h2>
              </div>
              <span className="text-xs font-semibold text-slate-400">تعداد کل: {userDebts.length} نفر</span>
            </div>

            {isDebtsLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-600" size={36} /></div>
            ) : userDebts.length === 0 ? (
              <div className="p-12 text-center bg-slate-50/50">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-500">هیچ تامین‌کننده یا ویزیتوری یافت نشد.</h3>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center text-slate-500">
                  <thead className="text-xs font-bold text-slate-700 bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-right">کاربر / نام فروشگاه</th>
                      <th className="px-6 py-4">نقش</th>
                      <th className="px-6 py-4">شماره همراه</th>
                      <th className="px-6 py-4">طلب کل (تولید شده)</th>
                      <th className="px-6 py-4">پرداختی تسویه‌شده</th>
                      <th className="px-6 py-4">مانده بدهی فعلی</th>
                      <th className="px-6 py-4">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userDebts.map((item) => (
                      <tr key={item.user_id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-right font-extrabold text-slate-900">
                          {item.shop_name}
                          {item.username !== item.shop_name && <span className="text-xs font-medium text-slate-400 mr-1">({item.username})</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${
                            item.role === 'VISITOR' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {item.role === 'VISITOR' ? 'ویزیتور' : 'تامین‌کننده'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600 font-bold dir-ltr">{item.phone_number || '-'}</td>
                        <td className="px-6 py-4 font-bold text-slate-700">{formatCurrency(item.total_debt)}</td>
                        <td className="px-6 py-4 font-bold text-emerald-600">{formatCurrency(item.total_paid)}</td>
                        <td className="px-6 py-4 font-extrabold text-base">
                          <span className={item.remaining_debt > 0 ? 'text-rose-600' : 'text-slate-400'}>
                            {formatCurrency(item.remaining_debt)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleSettleUser(item)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 mx-auto"
                          >
                            <Wallet size={14} />
                            <span>تسویه</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'settlements' && (
        isLoading || !data ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-600" size={36} /></div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title={userRole === 'SUPPLIER' || userRole === 'VISITOR' ? 'طلب تولید شده شما (طلب کل)' : filterUserId ? 'بدهی تولید شده تامین‌کننده' : t('settlements.stats.totalDebt', 'کل بدهی تولید شده')}
                value={formatCurrency(data.total_debt)}
                accent="slate"
                icon={<TrendingDown size={22} />}
              />
              <StatCard
                title={userRole === 'SUPPLIER' || userRole === 'VISITOR' ? 'دریافتی‌های تسویه شده شما' : filterUserId ? 'مبلغ تسویه شده تامین‌کننده' : t('settlements.stats.totalPaid', 'کل مبلغ تسویه شده')}
                value={formatCurrency(data.total_paid)}
                accent="green"
                icon={<CheckCircle2 size={22} />}
              />
              <StatCard
                title={userRole === 'SUPPLIER' || userRole === 'VISITOR' ? 'مانده طلب فعلی شما' : filterUserId ? 'مانده بدهی تامین‌کننده' : t('settlements.stats.remainingDebt', 'مانده بدهی فعلی')}
                value={formatCurrency(data.remaining_debt)}
                accent={data.remaining_debt > 0 ? "red" : "default"}
                icon={<AlertCircle size={22} />}
              />
            </div>

            {/* History Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2">
                <History className="text-slate-400" size={20} />
                <h2 className="text-lg font-bold text-slate-800">{t('settlements.history.title', 'تاریخچه پرداختی‌ها')}</h2>
              </div>

              {historyItems.length === 0 ? (
                <div className="p-12 text-center bg-slate-50/50">
                  <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-base font-bold text-slate-500">
                    {t('settlements.history.empty', 'هیچ پرداختی تا کنون ثبت نشده است.')}
                  </h3>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-center text-slate-500">
                    <thead className="text-xs font-bold text-slate-700 bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">{t('settlements.table.date', 'تاریخ و ساعت')}</th>
                        <th className="px-6 py-4">{t('settlements.table.supplierName', 'نام تامین‌کننده')}</th>
                        <th className="px-6 py-4">{t('settlements.table.amount', 'مبلغ پرداختی')}</th>
                        <th className="px-6 py-4">{t('settlements.table.trackingCode', 'کد پیگیری / یادداشت')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyItems.map((record) => {
                        const associatedSupplier = suppliers.find(s => s.id === record.user_id);
                        return (
                          <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900">{formatDate(record.created_at)}</td>
                            <td className="px-6 py-4 font-semibold text-slate-800">
                              {associatedSupplier ? `${associatedSupplier.username} (${associatedSupplier.role === 'VISITOR' ? t('settlements.roles.visitor', 'ویزیتور') : t('settlements.roles.supplier', 'تامین‌کننده')})` : (userRole !== 'ADMIN' ? t('settlements.table.you', 'شما') : t('settlements.table.unknownServer', 'نامشخص'))}
                            </td>
                            <td className="px-6 py-4 font-black text-emerald-600">{formatCurrency(record.amount)}</td>
                            <td className="px-6 py-4 font-medium text-slate-600">{record.tracking_code || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination Controls */}
              {historyResponse && historyResponse.total_pages > 1 && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4 text-xs font-bold text-slate-500">
                  <span>
                    {t('settlements.pagination.page', 'صفحه')} {historyResponse.current_page} {t('settlements.pagination.of', 'از')} {historyResponse.total_pages}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-slate-700 transition-colors"
                    >
                      قبلی
                    </button>
                    <button
                      disabled={currentPage >= historyResponse.total_pages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white text-slate-700 transition-colors"
                    >
                      بعدی
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )
      )}

      {/* New Settlement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <Wallet className="text-indigo-600" size={20} />
                {t('settlements.modal.title', 'ثبت پرداختی جدید')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitSettlement} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {t('settlements.modal.selectUser', 'انتخاب تامین‌کننده / ویزیتور *')}
                </label>
                <select
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white text-slate-800 font-semibold cursor-pointer"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value="">{t('settlements.modal.selectPlaceholder', '-- انتخاب کنید --')}</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.username} ({s.role === 'VISITOR' ? t('settlements.roles.visitor', 'ویزیتور') : t('settlements.roles.supplier', 'تامین‌کننده')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {t('settlements.modal.amountLabel', 'مبلغ پرداختی (تومان)')}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none dir-ltr font-bold text-slate-800"
                  value={newAmount}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, '');
                    setNewAmount(rawValue ? Number(rawValue).toLocaleString('en-US') : '');
                  }}
                  placeholder="مثال: 5,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {t('settlements.modal.trackingCodeLabel', 'کد پیگیری یا یادداشت (اختیاری)')}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-slate-800"
                  value={newTrackingCode}
                  onChange={(e) => setNewTrackingCode(e.target.value)}
                  placeholder={t('settlements.modal.trackingCodePlaceholder', 'شماره رسید کارت به کارت...')}
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || !newAmount}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all flex justify-center items-center gap-2 shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  {t('settlements.modal.submitBtn', 'ثبت و کسر از بدهی')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold transition-colors"
                >
                  {t('common.cancel', 'انصراف')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}