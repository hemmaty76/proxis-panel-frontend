import { useEffect, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PasswordChangeForm from '../components/PasswordChangeForm';
import { useTranslation } from 'react-i18next';
import {
  type UserProfile,
  type DashboardStats,
  getProfile,
  getDashboardStats,
} from '../../data/services/shopService';
import { getFinancialReport, type FinancialReport } from '../../data/services/adminService';

import { Wallet, Loader2, X, CreditCard, CheckCircle2, XCircle } from 'lucide-react';
import { requestZarinpalCharge } from '../../data/services/shopService';


interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  accent: 'default' | 'slate' | 'indigo' | 'green';
}

function StatCard({ title, value, icon, accent }: StatCardProps) {
  const accentStyles = {
    default: {
      ring: 'ring-slate-100',
      iconBg: 'bg-slate-100 text-slate-600',
      value: 'text-slate-900',
    },
    slate: {
      ring: 'ring-slate-200',
      iconBg: 'bg-slate-200/70 text-slate-700',
      value: 'text-slate-800',
    },
    indigo: {
      ring: 'ring-indigo-100',
      iconBg: 'bg-indigo-50 text-indigo-600',
      value: 'text-indigo-700',
    },
    green: {
      ring: 'ring-emerald-100',
      iconBg: 'bg-emerald-50 text-emerald-600',
      value: 'text-emerald-700',
    },
  }[accent];

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm ring-1 ${accentStyles.ring} transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 min-h-[132px] flex flex-col justify-between`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentStyles.iconBg} transition-transform duration-300 group-hover:scale-105`}
        >
          {icon}
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p
          className={`text-2xl font-extrabold tracking-tight tabular-nums ${accentStyles.value}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const getLocale = () => {
    switch (i18n.language) {
      case 'en': return 'en-US';
      case 'ar': return 'ar-EG';
      case 'fa': default: return 'fa-IR';
    }
  };


  const formatNumber = (value: number) =>
    value.toLocaleString(getLocale());

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(getLocale(), {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [adminReport, setAdminReport] = useState<FinancialReport | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const formatCurrency = (value: number) =>
    `${value.toLocaleString(getLocale())} ${t('dashboardHome.currency', 'تومان')}`;


  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
  const [chargeAmount, setChargeAmount] = useState('');
  const [isCharging, setIsCharging] = useState(false);

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

  const [searchParams, setSearchParams] = useSearchParams();
  const paymentStatus = searchParams.get('payment'); // مقدار 'success' یا 'failed' را می‌گیرد

  const [isResultModalOpen, setIsResultModalOpen] = useState(!!paymentStatus);

  const handleCloseResultModal = () => {
    setIsResultModalOpen(false);
    searchParams.delete('payment');
    setSearchParams(searchParams, { replace: true });
  };


  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const profileData = await getProfile();
        if (cancelled) return;
        setProfile(profileData);

        if (profileData.role === 'ADMIN') {
          const reportData = await getFinancialReport();
          if (cancelled) return;
          setAdminReport(reportData);
        } else {
          const statsData = await getDashboardStats();
          if (cancelled) return;
          setStats(statsData);
        }
      } catch {
        if (!cancelled) {
          toast.error(t('dashboardHome.messages.fetchError', 'ارتباط با سرور برقرار نشد. لطفاً صفحه را رفرش کنید.'));
        }
      } finally {
        if (!cancelled) setIsLoadingData(false);
      }
    };

    fetchDashboardData();
    return () => {
      cancelled = true;
    };
  }, []);

  const statCards: StatCardProps[] = [];

  if (profile?.role === 'ADMIN' && adminReport) {
    statCards.push(
      {
        title: t('dashboardHome.stats.upstreamDebt', 'بدهی به آپ‌استریم (مرزبان)'),
        value: formatCurrency(adminReport.total_debt_to_upstream),
        accent: 'slate',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        title: t('dashboardHome.stats.adminGrossRevenue', 'کل درآمد ناخالص ادمین'),
        value: formatCurrency(adminReport.admin_gross_revenue),
        accent: 'indigo',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
      },
      {
        title: t('dashboardHome.stats.adminNetProfit', 'سود خالص ادمین'),
        value: formatCurrency(adminReport.admin_net_profit),
        accent: 'green',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      }
    );
  } else if (stats) {
    statCards.push(
      {
        title: t('dashboardHome.stats.totalSales', 'تعداد کل فروش'),
        value: formatNumber(stats.total_sales_count),
        accent: 'default',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
      },
      {
        title: t('dashboardHome.stats.activeServices', 'سرویس‌های فعال'),
        value: formatNumber(stats.active_services_count),
        accent: 'default',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
      {
        title: t('dashboardHome.stats.totalCost', 'کل هزینه'),
        value: formatCurrency(stats.total_cost),
        accent: 'slate',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        title: t('dashboardHome.stats.totalRevenue', 'کل درآمد'),
        value: formatCurrency(stats.total_revenue),
        accent: 'indigo',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
      },
      {
        title: t('dashboardHome.stats.netProfit', 'سود خالص'),
        value: formatCurrency(stats.net_profit),
        accent: 'green',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    );
  }

  const skeletonCount = profile?.role === 'ADMIN' ? 3 : 5;

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('dashboardHome.header.title', 'داشبورد')}
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          {t('dashboardHome.header.subtitle', 'نمای کلی عملکرد، وضعیت حساب و تنظیمات فروش')}
        </p>
      </header>

      <section aria-label={t('dashboardHome.sections.generalStats', 'آمار کلی')}>
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${profile?.role === 'ADMIN' ? 'xl:grid-cols-3' : 'xl:grid-cols-5'} gap-4`}>
          {isLoadingData
            ? Array.from({ length: skeletonCount }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm min-h-[132px] animate-pulse"
              >
                <div className="h-11 w-11 rounded-xl bg-slate-100" />
                <div className="mt-4 space-y-2">
                  <div className="h-4 w-24 rounded bg-slate-100" />
                  <div className="h-7 w-32 rounded bg-slate-100" />
                </div>
              </div>
            ))
            : statCards.map((card) => (
              <StatCard key={card.title} {...card} />
            ))}
        </div>
      </section>

      <section
        aria-label={t('dashboardHome.sections.profileAndOps', 'پروفایل و عملیات')}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-l from-slate-50/80 to-white">
            <h2 className="text-lg font-bold text-slate-800">{t('dashboardHome.profile.title', 'پروفایل و مالی')}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{t('dashboardHome.profile.subtitle', 'اطلاعات حساب کاربری شما')}</p>
          </div>

          <div className="p-6 space-y-6 min-h-[420px]">
            {isLoadingData ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 w-24 rounded-full bg-slate-100" />
                <div className="h-6 w-40 rounded bg-slate-100" />
                <div className="h-4 w-56 rounded bg-slate-100" />
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="h-20 rounded-xl bg-slate-100" />
                  <div className="h-20 rounded-xl bg-slate-100" />
                </div>
              </div>
            ) : profile ? (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-pulse" />
                    {profile.role === 'ADMIN' ? t('dashboardHome.profile.roles.admin', 'مدیر سیستم') : t('dashboardHome.profile.roles.shopkeeper', 'نماینده فروش (مغازه‌دار)')}
                  </span>
                  {profile.is_active && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {t('dashboardHome.profile.active', 'فعال')}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1">{t('dashboardHome.profile.username', 'نام کاربری')}</p>
                    <p className="text-lg font-bold text-slate-800 dir-ltr text-right">
                      {profile.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1">{t('dashboardHome.profile.phone', 'شماره تماس')}</p>
                    <p className="text-base font-semibold text-slate-700 dir-ltr text-right tabular-nums">
                      {profile.phone_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1">{t('dashboardHome.profile.createdAt', 'تاریخ ایجاد حساب')}</p>
                    <p className="text-sm font-medium text-slate-600">
                      {formatDate(profile.created_at)}
                    </p>
                  </div>
                </div>

                {profile.role !== 'ADMIN' && (
                  < div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 min-h-[88px] flex flex-col justify-between transition-colors duration-200 hover:bg-slate-50">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-semibold text-slate-500 mb-1">{t('dashboardHome.profile.balance', 'موجودی')}</p>
                        <button
                          onClick={() => setIsChargeModalOpen(true)}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <Wallet size={14} />
                          {t('dashboardHome.profile.chargeBtn', 'شارژ حساب')}
                        </button>
                      </div>
                      <p className="text-xl font-extrabold text-slate-900 tabular-nums mt-2">
                        {formatCurrency(profile.balance)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 min-h-[88px] flex flex-col justify-center transition-colors duration-200 hover:bg-indigo-50/60">
                      <p className="text-xs font-semibold text-indigo-600/80 mb-1">{t('dashboardHome.profile.creditLimit', 'سقف اعتبار')}</p>
                      <p className="text-xl font-extrabold text-indigo-700 tabular-nums">
                        {formatCurrency(profile.credit_limit)}
                      </p>
                    </div>
                  </div>
                )}

              
              </>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">
                {t('dashboardHome.profile.notAvailable', 'اطلاعات پروفایل در دسترس نیست.')}
              </p>
            )}
          </div>
        </div>

        {/* Right: Operational Actions */}
        <div className="space-y-6">
          {/* Form A: Custom Prices Settings / Admin Settings Shortcut */}
          {profile?.role === 'ADMIN' ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-l from-indigo-50/30 to-white">
                <h2 className="text-lg font-bold text-indigo-900">{t('dashboardHome.adminActions.servicesTitle', 'مدیریت پکیج‌ها و خدمات')}</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {t('dashboardHome.adminActions.servicesSubtitle', 'پیکربندی نوع سرویس‌ها، مدل‌های فروش و تعریف بسته‌های حجمی/زمانی جدید')}
                </p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('dashboardHome.adminActions.servicesDesc', 'از این بخش می‌توانید انواع سرویس‌ها (VIP، نرمال)، دسته‌بندی‌های فروش و قیمت پایه خرید هر دسته را برای مغازه‌داران تعریف کنید.')}
                </p>
                <button
                  onClick={() => navigate('/admin/services')}
                  className="w-full py-3 px-4 rounded-xl text-white font-semibold shadow-sm bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex justify-center items-center gap-2"
                >
                  {t('dashboardHome.adminActions.servicesBtn', 'برو به مدیریت خدمات و پکیج‌ها')}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-l from-blue-50/30 to-white">
                <h2 className="text-lg font-bold text-blue-900">{t('dashboardHome.sellPrice.title', 'قیمت‌گذاری فروش به مشتری')}</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {t('dashboardHome.sellPrice.subtitle', 'تنظیم قیمت‌های اختصاصی فروش به مشتری')}
                </p>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('dashboardHome.sellPrice.desc', 'سیستم قیمت‌گذاری پکیج‌ها به صورت واحدی و طبقه‌بندی شده تغییر یافته است. برای تغییر و شخصی‌سازی قیمت‌های فروش خود به مشتری بر اساس دسته‌بندی سرویس‌ها، از بخش تنظیمات قیمت فروش اقدام کنید.')}
                </p>
                <button
                  onClick={() => navigate('/settings/prices')}
                  className="w-full py-3 px-4 rounded-xl text-white font-semibold shadow-sm bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex justify-center items-center gap-2"
                >
                  {t('dashboardHome.sellPrice.btn', 'تنظیمات قیمت فروش')}
                </button>
              </div>
            </div>
          )}

          {/* Form B: Change Password */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">{t('dashboardHome.password.title', 'تغییر رمز عبور')}</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {t('dashboardHome.password.subtitle', 'برای امنیت بیشتر، رمز عبور قوی انتخاب کنید')}
              </p>
            </div>
            <div className="p-6 min-h-[280px]">
              <PasswordChangeForm />
            </div>
          </div>
        </div>
      </section >
      {/* مُدال شارژ حساب آنلاین */}
      {isChargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <CreditCard className="text-emerald-600" size={20} />
                {t('dashboardHome.chargeModal.title', 'شارژ آنلاین حساب')}
              </h3>
              <button onClick={() => setIsChargeModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
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

      {/* مُدال نمایش نتیجه پرداخت زرین‌پال */}
      {isResultModalOpen && paymentStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center space-y-4">

            {/* حالت پرداخت موفق */}
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
              /* حالت پرداخت ناموفق */
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
    </div >
  );
}
