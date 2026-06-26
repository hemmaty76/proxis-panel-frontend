import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Users, Search, Plus, Wallet, KeyRound, Edit3, BarChart3, X, Loader2, ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  getAllShops, createShop, chargeShopWallet, resetShopPassword,
  updateShopDescription, getShopDashboardStats, type AdminUserItem, type AdminUserStats
} from '../../../data/services/adminService';


export default function ShopsManagement() {
  const { t, i18n } = useTranslation();

  const getLocale = () => {
    switch (i18n.language) {
      case 'en': return 'en-US';
      case 'ar': return 'ar-EG';
      case 'fa': default: return 'fa-IR';
    }
  };
  const formatCurrency = (value: number) => `${value.toLocaleString(getLocale())} ${t('shopsManagement.currency')}`;

  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPhone, setSearchPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [chargeModal, setChargeModal] = useState<{ user: AdminUserItem } | null>(null);
  const [descModal, setDescModal] = useState<{ user: AdminUserItem } | null>(null);
  const [statsModal, setStatsModal] = useState<{ user: AdminUserItem, stats: AdminUserStats | null, loading: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // === استیت‌های جدید برای مدیریت کاما در اینپوت‌ها ===
  const [chargeAmount, setChargeAmount] = useState('');
  const [createCreditLimit, setCreateCreditLimit] = useState('0');
  const [createPricePerGb, setCreatePricePerGb] = useState('4000');
  const [createSellPricePerGb, setCreateSellPricePerGb] = useState('10000');

  const fetchUsers = async (page = currentPage, phone = searchPhone) => {
    setIsLoading(true);
    try {
      const res = await getAllShops(page, 10, phone);
      setUsers(res.items);
      setTotalPages(res.total_pages || 1);
      setCurrentPage(res.current_page || 1);
    } catch (err) {
      toast.error(t('shopsManagement.messages.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers(1, searchPhone);
  };

  // --- هندلرهای عملیات ---

  const handleChargeWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chargeModal) return;

    // استخراج عدد خالص با حذف کاماها
    const amount = Number(chargeAmount.replace(/\D/g, ''));
    const formData = new FormData(e.currentTarget);
    const description = String(formData.get('description'));

    if (!amount || amount <= 0) {
      toast.error(t('shopsManagement.messages.invalidAmount'));
      return;
    }

    setIsSubmitting(true);
    try {
      await chargeShopWallet(chargeModal.user.id, amount, description);
      toast.success(t('shopsManagement.messages.chargeSuccess'));
      setChargeModal(null);
      setChargeAmount('');
      fetchUsers();
    } catch {
      toast.error(t('shopsManagement.messages.chargeError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDescription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!descModal) return;
    const formData = new FormData(e.currentTarget);
    const desc = String(formData.get('description_admin'));

    setIsSubmitting(true);
    try {
      await updateShopDescription(descModal.user.id, desc);
      toast.success(t('shopsManagement.messages.descUpdateSuccess'));
      setDescModal(null);
      fetchUsers();
    } catch {
      toast.error(t('shopsManagement.messages.descUpdateError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (user: AdminUserItem) => {
    if (!window.confirm(`${t('shopsManagement.messages.resetPasswordConfirmStart')}${user.username}${t('shopsManagement.messages.resetPasswordConfirmEnd')}`)) return;
    try {
      await resetShopPassword(user.id);
      toast.success(t('shopsManagement.messages.resetPasswordSuccess'));
    } catch {
      toast.error(t('shopsManagement.messages.resetPasswordError'));
    }
  };

  const openStatsModal = async (user: AdminUserItem) => {
    setStatsModal({ user, stats: null, loading: true });
    try {
      const stats = await getShopDashboardStats(user.id);
      setStatsModal({ user, stats, loading: false });
    } catch {
      toast.error(t('shopsManagement.messages.statsError'));
      setStatsModal(null);
    }
  };

  const handleCreateShop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // ساختن آبجکت نهایی با مقادیر عددی پاکسازی‌شده
    const data = {
      username: String(formData.get('username')),
      phone_number: String(formData.get('phone_number')),
      password: String(formData.get('password')),
      description_admin: String(formData.get('description_admin')),
      credit_limit: Number(createCreditLimit.replace(/\D/g, '')),
      price_per_gb: Number(createPricePerGb.replace(/\D/g, '')),
      sell_price_per_gb: Number(createSellPricePerGb.replace(/\D/g, '')),
    };

    setIsSubmitting(true);
    try {
      await createShop(data);
      toast.success(t('shopsManagement.messages.createShopSuccess'));
      setCreateModalOpen(false);
      // ریست استیت‌ها به پیش‌فرض
      setCreateCreditLimit('0');
      setCreatePricePerGb('4000');
      setCreateSellPricePerGb('10000');
      fetchUsers();
    } catch {
      toast.error(t('shopsManagement.messages.createShopError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* هدر و جستجو */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-indigo-600" size={28} />
            {t('shopsManagement.header.title')}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">{t('shopsManagement.header.subtitle')}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder={t('shopsManagement.header.searchPlaceholder')}
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              dir="rtl"
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm font-medium"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
              <Search size={18} />
            </button>
          </form>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={18} /> {t('shopsManagement.header.createShopBtn')}
          </button>
        </div>
      </div>

      {/* جدول کاربران (دسکتاپ) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-right text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="px-6 py-4">{t('shopsManagement.table.userAndPhone')}</th>
                <th className="px-6 py-4">{t('shopsManagement.table.adminDesc')}</th>
                <th className="px-6 py-4">{t('shopsManagement.table.balanceAndCredit')}</th>
                <th className="px-6 py-4">{t('shopsManagement.table.prices')}</th>
                <th className="px-6 py-4 text-center">{t('shopsManagement.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">{t('shopsManagement.table.loading')}</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-500">{t('shopsManagement.table.empty')}</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">{user.username}</p>
                      <p className="text-xs font-semibold text-slate-500 dir-ltr text-right mt-0.5">{user.phone_number}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium max-w-[200px] truncate" title={user.description_admin}>
                      {user.description_admin || t('shopsManagement.table.emptyDash')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 tabular-nums">{formatCurrency(user.balance)}</p>
                      <p className="text-xs text-indigo-600 font-semibold mt-0.5">{t('shopsManagement.table.limit')} {formatCurrency(user.credit_limit)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-emerald-600 tabular-nums">{formatCurrency(user.price_per_gb)}</p>
                      <p className="text-xs text-slate-500 mt-0.5 tabular-nums">{t('shopsManagement.table.sell')} {formatCurrency(user.sell_price_per_gb)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-1.5">
                        <button onClick={() => { setChargeAmount(''); setChargeModal({ user }); }} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title={t('shopsManagement.tooltips.chargeWallet')}><Wallet size={18} /></button>
                        <button onClick={() => openStatsModal(user)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title={t('shopsManagement.tooltips.salesStats')}><BarChart3 size={18} /></button>
                        <button onClick={() => setDescModal({ user })} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title={t('shopsManagement.tooltips.editDesc')}><Edit3 size={18} /></button>
                        <button onClick={() => handleResetPassword(user)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title={t('shopsManagement.tooltips.resetPassword')}><KeyRound size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* نمای موبایل (کارت‌ها) */}
        <div className="md:hidden flex flex-col divide-y divide-slate-100">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="p-5 h-48 animate-pulse bg-slate-50"></div>
            ))
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-500">{t('shopsManagement.table.empty')}</div>
          ) : (
            users.map(user => (
              <div key={user.id} className="p-5 flex flex-col gap-4 bg-white hover:bg-slate-50/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-lg">{user.username}</h3>
                    <p className="text-sm font-semibold text-slate-500 dir-ltr text-left mt-0.5">{user.phone_number}</p>
                  </div>
                  {user.is_active && (
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-lg border border-emerald-100">{t('shopsManagement.table.active')}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[11px] font-bold block mb-1">{t('shopsManagement.mobileCard.currentBalance')}</span>
                    <span className="font-black text-slate-800 text-sm tabular-nums">{formatCurrency(user.balance)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] font-bold block mb-1">{t('shopsManagement.mobileCard.creditLimit')}</span>
                    <span className="font-black text-indigo-600 text-sm tabular-nums">{formatCurrency(user.credit_limit)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] font-bold block mb-1">{t('shopsManagement.mobileCard.buyPerGb')}</span>
                    <span className="font-bold text-emerald-600 text-sm tabular-nums">{formatCurrency(user.price_per_gb)}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] font-bold block mb-1">{t('shopsManagement.mobileCard.defaultSell')}</span>
                    <span className="font-bold text-slate-600 text-sm tabular-nums">{formatCurrency(user.sell_price_per_gb)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-2 pt-1">
                  <button onClick={() => { setChargeAmount(''); setChargeModal({ user }); }} className="flex-1 flex flex-col items-center justify-center gap-1.5 p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                    <Wallet size={20} strokeWidth={2.5} /><span className="text-[10px] font-bold">{t('shopsManagement.actionsShort.charge')}</span>
                  </button>
                  <button onClick={() => openStatsModal(user)} className="flex-1 flex flex-col items-center justify-center gap-1.5 p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
                    <BarChart3 size={20} strokeWidth={2.5} /><span className="text-[10px] font-bold">{t('shopsManagement.actionsShort.stats')}</span>
                  </button>
                  <button onClick={() => setDescModal({ user })} className="flex-1 flex flex-col items-center justify-center gap-1.5 p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                    <Edit3 size={20} strokeWidth={2.5} /><span className="text-[10px] font-bold">{t('shopsManagement.actionsShort.edit')}</span>
                  </button>
                  <button onClick={() => handleResetPassword(user)} className="flex-1 flex flex-col items-center justify-center gap-1.5 p-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
                    <KeyRound size={20} strokeWidth={2.5} /><span className="text-[10px] font-bold">{t('shopsManagement.actionsShort.reset')}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* صفحه‌بندی */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
            <span className="text-sm font-medium text-slate-500">{t('shopsManagement.pagination.page')} <strong className="text-slate-800">{currentPage}</strong> {t('shopsManagement.pagination.of')} <strong className="text-slate-800">{totalPages}</strong></span>
            <div className="flex gap-2">
              <button onClick={() => fetchUsers(currentPage - 1)} disabled={currentPage === 1} className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50"><ChevronRight size={18} /></button>
              <button onClick={() => fetchUsers(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50"><ChevronLeft size={18} /></button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* ۱. مودال شارژ کیف پول با جداکننده سه‌رقمی */}
      {chargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-slate-800">{t('shopsManagement.modals.charge.title')} ({chargeModal.user.username})</h3>
              <button onClick={() => setChargeModal(null)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleChargeWallet} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('shopsManagement.modals.charge.amountLabel')}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  dir="ltr"
                  value={chargeAmount ? Number(chargeAmount).toLocaleString('en-US') : ''}
                  onChange={(e) => setChargeAmount(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-left font-semibold font-[inherit]"
                  placeholder={t('shopsManagement.modals.charge.amountPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">{t('shopsManagement.modals.charge.descLabel')}</label>
                <input name="description" type="text" required defaultValue={t('shopsManagement.modals.charge.descDefault')} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 text-sm font-medium" />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 flex justify-center shadow-sm">{isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('shopsManagement.modals.charge.submit')}</button>
            </form>
          </div>
        </div>
      )}

      {/* ۲. مودال ویرایش توضیحات */}
      {descModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-slate-800">{t('shopsManagement.modals.editDesc.title')}</h3>
              <button onClick={() => setDescModal(null)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>
            <form onSubmit={handleEditDescription} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <textarea name="description_admin" rows={4} defaultValue={descModal.user.description_admin} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 resize-none font-medium text-slate-700" placeholder={t('shopsManagement.modals.editDesc.placeholder')} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 flex justify-center shadow-sm">{isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('shopsManagement.modals.editDesc.submit')}</button>
            </form>
          </div>
        </div>
      )}

      {/* ۳. مودال آمار مغازه */}
      {statsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 shrink-0">
              <h3 className="font-bold text-slate-800">{t('shopsManagement.modals.stats.title')} ({statsModal.user.username})</h3>
              <button onClick={() => setStatsModal(null)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              {statsModal.loading ? (
                <div className="flex justify-center py-8"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>
              ) : statsModal.stats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold mb-1">{t('shopsManagement.modals.stats.salesCount')}</p>
                    <p className="text-xl font-black text-slate-800 tabular-nums">{statsModal.stats.total_sales_count}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-bold mb-1">{t('shopsManagement.modals.stats.activeServices')}</p>
                    <p className="text-xl font-black text-emerald-600 tabular-nums">{statsModal.stats.active_services_count}</p>
                  </div>
                  <div className="col-span-2 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center">
                    <span className="text-sm text-indigo-800 font-bold">{t('shopsManagement.modals.stats.netProfit')}</span>
                    <span className="text-lg font-black text-indigo-700 tabular-nums">{formatCurrency(statsModal.stats.net_profit)}</span>
                  </div>
                  <div className="col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-bold">{t('shopsManagement.modals.stats.totalIncome')}</span>
                    <span className="text-lg font-black text-slate-800 tabular-nums">{formatCurrency(statsModal.stats.total_cost)}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ۴. مودال ساخت مغازه جدید با جداکننده سه‌رقمی در تمام فیلدهای مالی */}
      {createModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="font-bold text-slate-800">{t('shopsManagement.modals.create.title')}</h3>
              <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateShop} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('shopsManagement.modals.create.username')}</label>
                  <input name="username" type="text" required dir="ltr" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('shopsManagement.modals.create.phone')}</label>
                  <input name="phone_number" type="text" required dir="ltr" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('shopsManagement.modals.create.password')}</label>
                  <input name="password" type="text" required dir="ltr" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-medium" />
                </div>

                {/* فیلد سقف اعتبار همراه با کاما */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('shopsManagement.modals.create.creditLimit')}</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={createCreditLimit ? Number(createCreditLimit).toLocaleString('en-US') : ''}
                    onChange={(e) => setCreateCreditLimit(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-bold font-[inherit]"
                  />
                </div>

                {/* فیلد قیمت خرید همراه با کاما */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('shopsManagement.modals.create.buyPrice')}</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={createPricePerGb ? Number(createPricePerGb).toLocaleString('en-US') : ''}
                    onChange={(e) => setCreatePricePerGb(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-bold font-[inherit]"
                  />
                </div>

                {/* فیلد قیمت فروش همراه با کاما */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('shopsManagement.modals.create.sellPrice')}</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={createSellPricePerGb ? Number(createSellPricePerGb).toLocaleString('en-US') : ''}
                    onChange={(e) => setCreateSellPricePerGb(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-bold font-[inherit]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('shopsManagement.modals.create.adminDesc')}</label>
                  <input name="description_admin" type="text" className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" />
                </div>
              </div>

              <div className="pt-4 mountaineer border-t border-slate-100">
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex justify-center shadow-sm transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('shopsManagement.modals.create.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}