import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Users, Search, Plus, Wallet, KeyRound, Edit3, X, Loader2, Landmark, HelpCircle, CheckCircle2, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  getVisitorDashboard, getVisitorShops, createShopUnderVisitor,
  type VisitorDashboardStats
} from '../../../data/services/visitorService';
import { resetShopPassword, updateShop, type AdminUserItem } from '../../../data/services/adminService';
import { requestZarinpalCharge } from '../../../data/services/shopService';

export default function VisitorDashboard() {
  const { t, i18n } = useTranslation();

  const getLocale = () => {
    switch (i18n.language) {
      case 'en': return 'en-US';
      case 'ar': return 'ar-EG';
      case 'fa': default: return 'fa-IR';
    }
  };
  const formatCurrency = (value: number) => `${(value || 0).toLocaleString(getLocale())} ${t('shopsManagement.currency')}`;

  const [stats, setStats] = useState<VisitorDashboardStats | null>(null);
  const [shops, setShops] = useState<AdminUserItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{
    user: AdminUserItem;
    discountPercent: string;
    creditLimit: string;
    isActive: boolean;
    description: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  const [createCreditLimit, setCreateCreditLimit] = useState('0');
  const [createDiscountPercent, setCreateDiscountPercent] = useState('0');

  // Charge wallet states
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
  const [chargeAmount, setChargeAmount] = useState('');
  const [isCharging, setIsCharging] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const paymentStatus = searchParams.get('payment');
  const [isResultModalOpen, setIsResultModalOpen] = useState(!!paymentStatus);

  const handleChargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(chargeAmount.replace(/\D/g, ''));

    if (!numericAmount || numericAmount < 10000) {
      toast.error(t('dashboardHome.messages.minCharge', 'حداقل مبلغ شارژ ۱۰,۰۰۰ تومان است.'));
      return;
    }

    setIsCharging(true);
    try {
      const data = await requestZarinpalCharge(numericAmount);
      window.location.href = data.payment_url;
    } catch {
      toast.error(t('dashboardHome.messages.chargeError', 'خطا در اتصال به درگاه پرداخت.'));
      setIsCharging(false);
    }
  };

  const handleCloseResultModal = () => {
    setIsResultModalOpen(false);
    searchParams.delete('payment');
    setSearchParams(searchParams, { replace: true });
  };

  const fetchStats = async () => {
    try {
      const statsData = await getVisitorDashboard();
      setStats(statsData);
    } catch {
      toast.error(t('visitor.dashboard.messages.fetchError', 'خطا در دریافت اطلاعات داشبورد.'));
    }
  };

  const fetchShops = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await getVisitorShops(page, pageSize);
      setShops(response.items);
      setTotalPages(response.total_pages);
      setTotalCount(response.total_count);
    } catch {
      toast.error(t('visitor.dashboard.messages.fetchShopsError', 'خطا در دریافت لیست مغازه‌ها.'));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    await Promise.all([fetchStats(), fetchShops(currentPage)]);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchShops(currentPage);
  }, [currentPage]);

  const handleCreateShop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      username: String(formData.get('username')),
      phone_number: String(formData.get('phone_number')),
      password: String(formData.get('password')),
      description_admin: String(formData.get('description_admin')),
      credit_limit: Number(createCreditLimit.replace(/\D/g, '')),
      discount_percent: Number(createDiscountPercent),
    };

    setIsSubmitting(true);
    try {
      await createShopUnderVisitor(data);
      toast.success(t('visitor.dashboard.messages.createSuccess', 'مغازه‌دار جدید با موفقیت ثبت شد.'));
      setCreateModalOpen(false);
      setCreateCreditLimit('0');
      setCreateDiscountPercent('0');
      fetchData();
    } catch (err: any) {
      const detail = err?.response?.data?.detail || t('visitor.dashboard.messages.createError', 'خطا در ثبت مغازه‌دار جدید.');
      toast.error(detail);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditShop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editModal) return;

    setIsSubmitting(true);
    try {
      await updateShop(editModal.user.id, {
        credit_limit: Number(editModal.creditLimit.replace(/\D/g, '')),
        discount_percent: Number(editModal.discountPercent),
        is_active: editModal.isActive,
        description_admin: editModal.description,
        role: editModal.user.role
      });
      toast.success(t('visitor.dashboard.messages.updateSuccess', 'اطلاعات مغازه‌دار با موفقیت بروزرسانی شد.'));
      setEditModal(null);
      fetchData();
    } catch {
      toast.error(t('visitor.dashboard.messages.updateError', 'خطا در بروزرسانی اطلاعات.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (user: AdminUserItem) => {
    if (!window.confirm(t('visitor.dashboard.messages.resetPasswordConfirm', 'آیا از تغییر رمز عبور کاربر {{username}} به "123456" اطمینان دارید؟', { username: user.username }))) return;
    try {
      await resetShopPassword(user.id);
      toast.success(t('visitor.dashboard.messages.resetPasswordSuccess', 'رمز عبور مغازه‌دار به "123456" بازنشانی شد.'));
    } catch {
      toast.error(t('visitor.dashboard.messages.resetPasswordError', 'خطا در بازنشانی رمز عبور.'));
    }
  };

  const filteredShops = shops.filter(shop =>
    shop.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (shop.phone_number && shop.phone_number.includes(searchQuery))
  );

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-indigo-600" size={28} />
            {t('visitor.dashboard.title', 'پنل ویزیتور')}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">{t('visitor.dashboard.subtitle', 'مدیریت مغازه‌های زیرمجموعه و پورسانت‌های دریافتی')}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder={t('visitor.dashboard.searchPlaceholder', 'جستجوی مغازه...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              dir="rtl"
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={18} /> {t('visitor.dashboard.addShopBtn', 'مغازه‌دار جدید')}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">{t('visitor.dashboard.stats.walletBalance', 'موجودی کیف پول')}</span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Wallet size={20} /></span>
            </div>
            <p className="text-xl font-black text-slate-800 mt-4 tabular-nums">{formatCurrency(stats?.balance || 0)}</p>
          </div>
          <button
            onClick={() => setIsChargeModalOpen(true)}
            className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1"
          >
            <Plus size={14} />
            {t('visitor.dashboard.chargeWalletBtn', 'شارژ حساب')}
          </button>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">{t('visitor.dashboard.stats.totalEarnings', 'کل درآمد پورسانت')}</span>
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Landmark size={20} /></span>
            </div>
            <p className="text-xl font-black text-slate-800 mt-4 tabular-nums">{formatCurrency(stats?.total_earnings || 0)}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">{t('visitor.dashboard.stats.totalPaid', 'مجموع تسویه‌ها')}</span>
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={20} /></span>
            </div>
            <p className="text-xl font-black text-slate-800 mt-4 tabular-nums">{formatCurrency(stats?.total_paid || 0)}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">{t('visitor.dashboard.stats.remainingBalance', 'طلب باقیمانده شما')}</span>
              <span className="p-2 bg-amber-50 text-amber-600 rounded-xl"><Wallet size={20} /></span>
            </div>
            <p className="text-xl font-black text-slate-800 mt-4 tabular-nums">{formatCurrency(stats?.remaining_balance || 0)}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">{t('visitor.dashboard.stats.totalSales', 'تعداد کل فروش')}</span>
              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={20} /></span>
            </div>
            <p className="text-xl font-black text-slate-800 mt-4 tabular-nums">{stats?.total_sales_count || 0}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between min-h-[140px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">{t('visitor.dashboard.stats.testConfigsCount', 'کانفیگ تست ساخته‌شده')}</span>
              <span className="p-2 bg-slate-50 text-slate-600 rounded-xl"><HelpCircle size={20} /></span>
            </div>
            <p className="text-xl font-black text-slate-800 mt-4 tabular-nums">{stats?.test_configs_count || 0}</p>
          </div>
        </div>
      </div>

      {/* Shops Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-extrabold text-slate-800 text-lg">{t('visitor.dashboard.shopsList.title', 'لیست مغازه‌داران شما')}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{t('visitor.dashboard.shopsList.subtitle', 'مغازه‌های ثبت شده توسط شما که از خریدهای آن‌ها پورسانت دریافت می‌کنید.')}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-6 py-4">{t('visitor.dashboard.table.userAndPhone', 'نام کاربری و تلفن')}</th>
                <th className="px-6 py-4">{t('visitor.dashboard.table.desc', 'توضیحات')}</th>
                <th className="px-6 py-4">{t('visitor.dashboard.table.balanceAndCredit', 'موجودی و سقف اعتبار')}</th>
                <th className="px-6 py-4">{t('visitor.dashboard.table.discountPercent', 'درصد تخفیف')}</th>
                <th className="px-6 py-4 text-center">{t('visitor.dashboard.table.actions', 'عملیات')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">{t('visitor.dashboard.table.loading', 'در حال بارگذاری اطلاعات...')}</td></tr>
              ) : filteredShops.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">{t('visitor.dashboard.table.empty', 'مغازه‌ای یافت نشد.')}</td></tr>
              ) : (
                filteredShops.map(shop => (
                  <tr key={shop.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{shop.username}</p>
                      <p className="text-xs font-semibold text-slate-500 dir-ltr text-right mt-0.5">{shop.phone_number}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium max-w-[200px] truncate" title={shop.description_admin}>
                      {shop.description_admin || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 tabular-nums">{formatCurrency(shop.balance)}</p>
                      <p className="text-xs text-indigo-600 font-semibold mt-0.5">{t('visitor.dashboard.table.creditLimitLabel', 'سقف اعتبار: ')}{formatCurrency(shop.credit_limit)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 tabular-nums">{shop.discount_percent} %</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-1.5">
                        <button
                          onClick={() => setEditModal({
                            user: shop,
                            discountPercent: String(shop.discount_percent),
                            creditLimit: String(shop.credit_limit),
                            isActive: shop.is_active,
                            description: shop.description_admin || ''
                          })}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title={t('visitor.dashboard.tooltips.edit', 'ویرایش مغازه‌دار')}
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleResetPassword(shop)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title={t('visitor.dashboard.tooltips.resetPassword', 'تغییر رمز عبور به 123456')}
                        >
                          <KeyRound size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs font-semibold text-slate-500">
              مجموع: {totalCount} مغازه
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40"
              >
                قبلی
              </button>
              <span className="text-xs font-semibold text-slate-600">
                صفحه {currentPage} از {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-40"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Shop Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-slate-800">{t('visitor.dashboard.modals.edit.title', 'ویرایش مغازه‌دار')} ({editModal.user.username})</h3>
              <button onClick={() => setEditModal(null)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleEditShop} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('visitor.dashboard.modals.edit.creditLimit', 'سقف اعتبار (تومان)')}</label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={editModal.creditLimit ? Number(editModal.creditLimit.replace(/\D/g, '')).toLocaleString('en-US') : ''}
                  onChange={(e) => setEditModal(prev => prev ? { ...prev, creditLimit: e.target.value.replace(/\D/g, '') } : null)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-left font-bold font-[inherit]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('visitor.dashboard.modals.edit.discountPercent', 'درصد تخفیف مغازه‌دار')}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  dir="ltr"
                  value={editModal.discountPercent}
                  onChange={(e) => setEditModal(prev => prev ? { ...prev, discountPercent: e.target.value } : null)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 text-left font-bold font-[inherit]"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="edit_is_active"
                  checked={editModal.isActive}
                  onChange={(e) => setEditModal(prev => prev ? { ...prev, isActive: e.target.checked } : null)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
                />
                <label htmlFor="edit_is_active" className="text-sm font-bold text-slate-700 select-none">{t('visitor.dashboard.modals.edit.isActive', 'فعال بودن حساب مغازه')}</label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('visitor.dashboard.modals.edit.desc', 'توضیحات')}</label>
                <textarea
                  value={editModal.description}
                  onChange={(e) => setEditModal(prev => prev ? { ...prev, description: e.target.value } : null)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none font-medium text-slate-700"
                  placeholder={t('visitor.dashboard.modals.edit.descPlaceholder', 'توضیحات اختیاری...')}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex justify-center shadow-sm transition-all">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('visitor.dashboard.modals.edit.submit', 'ثبت تغییرات')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Shop Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="font-bold text-slate-800">{t('visitor.dashboard.modals.create.title', 'ثبت مغازه‌دار جدید')}</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateShop} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('visitor.dashboard.modals.create.username', 'نام کاربری')}</label>
                  <input name="username" type="text" required dir="ltr" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('visitor.dashboard.modals.create.phone', 'تلفن همراه')}</label>
                  <input name="phone_number" type="text" required dir="ltr" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('visitor.dashboard.modals.create.password', 'رمز عبور')}</label>
                  <input name="password" type="text" required dir="ltr" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-medium" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('visitor.dashboard.modals.edit.creditLimit', 'سقف اعتبار (تومان)')}</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={createCreditLimit ? Number(createCreditLimit).toLocaleString('en-US') : ''}
                    onChange={(e) => setCreateCreditLimit(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-bold font-[inherit]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('visitor.dashboard.modals.edit.discountPercent', 'درصد تخفیف مغازه‌دار')}</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    dir="ltr"
                    value={createDiscountPercent}
                    onChange={(e) => setCreateDiscountPercent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-bold font-[inherit]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('visitor.dashboard.modals.edit.desc', 'توضیحات')}</label>
                  <input name="description_admin" type="text" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex justify-center shadow-sm transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('visitor.dashboard.modals.create.submit', 'ثبت و ساخت اکانت')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Charge Wallet Modal */}
      {isChargeModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-800">
                {t('dashboardHome.chargeModal.title', 'افزایش موجودی حساب')}
              </h3>
              <button
                type="button"
                onClick={() => setIsChargeModalOpen(false)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleChargeSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {t('dashboardHome.chargeModal.amountLabel', 'مبلغ شارژ (تومان)')}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none dir-ltr font-bold text-slate-800"
                  value={chargeAmount}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, '');
                    setChargeAmount(rawValue ? Number(rawValue).toLocaleString('en-US') : '');
                  }}
                  placeholder="مثال: 50,000"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs font-medium leading-relaxed space-y-2">
                <p>
                  {t('dashboardHome.chargeModal.notice', 'پس از پرداخت موفق، مبلغ بلافاصله به موجودی حساب شما افزوده خواهد شد.')}
                </p>
                <p className="font-bold text-amber-900 border-t border-amber-200/60 pt-2 flex items-start gap-1">
                  <span>⚠️</span>
                  <span>{t('dashboardHome.chargeModal.vpnWarning', 'توجه: لطفاً قبل از ورود به درگاه پرداخت، فیلترشکن (VPN) خود را خاموش کنید تا در فرآیند پرداخت خطایی رخ ندهد.')}</span>
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isCharging || !chargeAmount}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold disabled:opacity-50 transition-all flex justify-center items-center gap-2 shadow-sm"
                >
                  {isCharging ? <Loader2 className="animate-spin" size={20} /> : null}
                  {t('dashboardHome.chargeModal.submitBtn', 'پرداخت با زرین‌پال')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsChargeModalOpen(false)}
                  disabled={isCharging}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-bold transition-colors"
                >
                  {t('common.cancel', 'انصراف')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Zarinpal Payment Result Modal */}
      {isResultModalOpen && paymentStatus && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center space-y-4">
            {paymentStatus === 'success' ? (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-100/50">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-slate-800">
                    {t('dashboardHome.paymentResult.successTitle', 'افزایش موجودی موفقیت‌آمیز بود')}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {t('dashboardHome.paymentResult.successDesc', 'تراکنش شما با موفقیت تایید شد. مبلغ پرداختی بلافاصله به موجودی حساب شما اضافه گردید.')}
                  </p>
                </div>
                <button
                  onClick={handleCloseResultModal}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold shadow-sm transition-all"
                >
                  {t('dashboardHome.paymentResult.closeBtn', 'متوجه شدم')}
                </button>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 ring-8 ring-red-100/50">
                  <XCircle size={36} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-extrabold text-slate-800">
                    {t('dashboardHome.paymentResult.failedTitle', 'پرداخت ناموفق یا انصراف')}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {t('dashboardHome.paymentResult.failedDesc', 'عملیات پرداخت با خطا مواجه شد و یا توسط شما لغو گردید.')}
                  </p>
                </div>
                <button
                  onClick={handleCloseResultModal}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl font-bold shadow-sm transition-all"
                >
                  {t('dashboardHome.paymentResult.closeBtn', 'متوجه شدم')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
