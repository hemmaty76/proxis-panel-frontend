import { useEffect, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { 
  Wallet, 
  Plus, 
  Loader2, 
  Info, 
  HelpCircle, 
  TrendingDown, 
  CheckCircle2, 
  AlertCircle,
  X,
  History
} from 'lucide-react';
import { 
  type SettlementDashboardResponse, 
  getSettlementDashboard, 
  createSettlement 
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

  const [data, setData] = useState<SettlementDashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAmount, setNewAmount] = useState('');
  const [newTrackingCode, setNewTrackingCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await getSettlementDashboard();
      setData(response);
    } catch {
      toast.error(t('settlements.messages.fetchError', 'خطا در بارگذاری اطلاعات تسویه‌حساب.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenModal = () => {
    setNewAmount('');
    setNewTrackingCode('');
    setIsModalOpen(true);
  };

  const handleSubmitSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(newAmount.replace(/\D/g, ''));
    
    if (!numericAmount || numericAmount <= 0) {
      toast.error(t('settlements.messages.invalidAmount', 'لطفاً مبلغ معتبری وارد کنید.'));
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createSettlement(numericAmount, newTrackingCode);
      toast.success(t('settlements.messages.success', 'پرداختی با موفقیت ثبت شد.'));
      setIsModalOpen(false);
      fetchDashboardData();
    } catch {
      toast.error(t('settlements.messages.submitError', 'خطا در ثبت پرداختی.'));
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <button 
          onClick={handleOpenModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus size={20} />
          {t('settlements.buttons.newSettlement', 'ثبت پرداختی جدید')}
        </button>
      </div>



      {/* Main Content */}
      {isLoading || !data ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-indigo-600" size={36} /></div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title={t('settlements.stats.totalDebt', 'کل بدهی تولید شده')}
              value={formatCurrency(data.total_debt)}
              accent="slate"
              icon={<TrendingDown size={22} />}
            />
            <StatCard
              title={t('settlements.stats.totalPaid', 'کل مبلغ تسویه شده')}
              value={formatCurrency(data.total_paid)}
              accent="green"
              icon={<CheckCircle2 size={22} />}
            />
            <StatCard
              title={t('settlements.stats.remainingDebt', 'مانده بدهی فعلی')}
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
            
            {data.history.length === 0 ? (
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
                      <th className="px-6 py-4">{t('settlements.table.amount', 'مبلغ پرداختی')}</th>
                      <th className="px-6 py-4">{t('settlements.table.trackingCode', 'کد پیگیری / یادداشت')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.history.map((record) => (
                      <tr key={record.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900">{formatDate(record.created_at)}</td>
                        <td className="px-6 py-4 font-black text-emerald-600">{formatCurrency(record.amount)}</td>
                        <td className="px-6 py-4 font-medium text-slate-600">{record.tracking_code || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
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