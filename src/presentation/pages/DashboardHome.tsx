import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import PasswordChangeForm from '../components/PasswordChangeForm';
import { useTranslation } from 'react-i18next';
import {
  type UserProfile,
  type DashboardStats,
  getProfile,
  getDashboardStats,
  updateSellPricePerGb,
} from '../../data/services/shopService';






function Spinner({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={`animate-spin text-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

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
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [sellPrice, setSellPrice] = useState('');
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
  const formatCurrency = (value: number) =>
  `${value.toLocaleString(getLocale())} ${t('dashboardHome.currency')}`;

  useEffect(() => {
    let cancelled = false;

    const fetchDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const [profileData, statsData] = await Promise.all([
          getProfile(),
          getDashboardStats(),
        ]);

        if (cancelled) return;

        setProfile(profileData);
        setStats(statsData);
        setSellPrice(String(profileData.sell_price_per_gb));
      } catch {
        if (!cancelled) {
          toast.error(t('dashboardHome.messages.fetchError'));
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

  const handleSellPriceSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsed = Number(sellPrice);
    if (!sellPrice.trim() || Number.isNaN(parsed) || parsed < 0) {
      toast.error(t('dashboardHome.messages.invalidPrice'));
      return;
    }

    setIsUpdatingPrice(true);
    try {
      await updateSellPricePerGb(parsed);

      setProfile((prev) =>
        prev ? { ...prev, sell_price_per_gb: parsed } : prev
      );
      toast.success(t('dashboardHome.messages.priceUpdateSuccess'));
    } catch {
      toast.error(t('dashboardHome.messages.priceUpdateError'));
    } finally {
      setIsUpdatingPrice(false);
    }
  };

  const statCards: StatCardProps[] = stats
    ? [
      {
        title: t('dashboardHome.stats.totalSales'),
        value: formatNumber(stats.total_sales_count),
        accent: 'default',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        ),
      },
      {
        title: t('dashboardHome.stats.activeServices'),
        value: formatNumber(stats.active_services_count),
        accent: 'default',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
      {
        title: t('dashboardHome.stats.totalCost'),
        value: formatCurrency(stats.total_cost),
        accent: 'slate',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        title: t('dashboardHome.stats.totalRevenue'),
        value: formatCurrency(stats.total_revenue),
        accent: 'indigo',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
      },
      {
        title: t('dashboardHome.stats.netProfit'),
        value: formatCurrency(stats.net_profit),
        accent: 'green',
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    ]
    : [];

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('dashboardHome.header.title')}
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          {t('dashboardHome.header.subtitle')}
        </p>
      </header>

      <section aria-label={t('dashboardHome.sections.generalStats')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {isLoadingData
            ? Array.from({ length: 5 }).map((_, i) => (
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
        aria-label={t('dashboardHome.sections.profileAndOps')}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-l from-slate-50/80 to-white">
            <h2 className="text-lg font-bold text-slate-800">{t('dashboardHome.profile.title')}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{t('dashboardHome.profile.subtitle')}</p>
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
                    {profile.role}
                  </span>
                  {profile.is_active && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {t('dashboardHome.profile.active')}
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1">{t('dashboardHome.profile.username')}</p>
                    <p className="text-lg font-bold text-slate-800 dir-ltr text-right">
                      {profile.username}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1">{t('dashboardHome.profile.phone')}</p>
                    <p className="text-base font-semibold text-slate-700 dir-ltr text-right tabular-nums">
                      {profile.phone_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-400 mb-1">{t('dashboardHome.profile.createdAt')}</p>
                    <p className="text-sm font-medium text-slate-600">
                      {formatDate(profile.created_at)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 min-h-[88px] flex flex-col justify-center transition-colors duration-200 hover:bg-slate-50">
                    <p className="text-xs font-semibold text-slate-500 mb-1">{t('dashboardHome.profile.balance')}</p>
                    <p className="text-xl font-extrabold text-slate-900 tabular-nums">
                      {formatCurrency(profile.balance)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 min-h-[88px] flex flex-col justify-center transition-colors duration-200 hover:bg-indigo-50/60">
                    <p className="text-xs font-semibold text-indigo-600/80 mb-1">{t('dashboardHome.profile.creditLimit')}</p>
                    <p className="text-xl font-extrabold text-indigo-700 tabular-nums">
                      {formatCurrency(profile.credit_limit)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm pt-1 border-t border-slate-100">
                  <span className="text-slate-500">{t('dashboardHome.profile.buyPricePerGb')}</span>
                  <span className="font-bold text-slate-700 tabular-nums">
                    {formatCurrency(profile.price_per_gb)}
                  </span>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">
                {t('dashboardHome.profile.notAvailable')}
              </p>
            )}
          </div>
        </div>

        {/* Right: Operational Actions */}
        <div className="space-y-6">
          {/* Form A: Change Selling Price */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">{t('dashboardHome.sellPrice.title')}</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {t('dashboardHome.sellPrice.currentPrice')}{' '}
                <span className="font-bold text-slate-700 tabular-nums">
                  {profile
                    ? formatCurrency(profile.sell_price_per_gb)
                    : t('dashboardHome.sellPrice.emptyPrice')}
                </span>
              </p>
            </div>

            <form
              onSubmit={handleSellPriceSubmit}
              className="p-6 space-y-4 min-h-[180px]"
            >
              <div>
                <label
                  htmlFor="sell-price"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  {t('dashboardHome.sellPrice.newPriceLabel')}
                </label>
                <input
                  dir="ltr"
                  id="sell-price"
                  type="text"
                  inputMode="numeric"
                  value={sellPrice ? Number(sellPrice).toLocaleString('en-US') : ''}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, '');
                    setSellPrice(rawValue);
                  }}
                  disabled={isUpdatingPrice}
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-left text-slate-700 font-medium font-sans placeholder:text-slate-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder={t('dashboardHome.sellPrice.placeholder')}
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingPrice}
                className={`w-full py-3 px-4 rounded-xl text-white font-semibold shadow-sm transition-all duration-200 flex justify-center items-center gap-2 min-h-[48px]
                  ${isUpdatingPrice
                    ? 'bg-slate-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'
                  }`}
              >
                {isUpdatingPrice ? (
                  <>
                    <Spinner />
                    {t('dashboardHome.sellPrice.submitting')}
                  </>
                ) : (
                  t('dashboardHome.sellPrice.submitBtn')
                )}
              </button>
            </form>
          </div>

          {/* Form B: Change Password */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">{t('dashboardHome.password.title')}</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {t('dashboardHome.password.subtitle')}
              </p>
            </div>
            <div className="p-6 min-h-[280px]">
              <PasswordChangeForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}