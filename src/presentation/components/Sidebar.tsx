import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BanknoteCheck, Store, Settings, FilePlus, Package, Server, FileSpreadsheet, Receipt, Headphones, AlertOctagon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAdminAccountReports } from '../../data/services/adminService';
import { getSupplierReports } from '../../data/services/supplierService';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  appVersion?: string | null;
}

export default function Sidebar({ isOpen, onClose, appVersion }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [userRole, setUserRole] = useState<string | null>(() => localStorage.getItem('user_role'));
  const [adminPendingReports, setAdminPendingReports] = useState<number>(0);
  const [supplierPendingReports, setSupplierPendingReports] = useState<number>(0);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    setUserRole(role);

    const fetchPendingCounts = async () => {
      if (role === 'ADMIN') {
        try {
          const reports = await getAdminAccountReports();
          if (Array.isArray(reports)) {
            const count = reports.filter(r => r.status === 'REJECTED_BY_SUPPLIER' || r.status === 'PENDING').length;
            setAdminPendingReports(count);
          }
        } catch {
          // Silent catch
        }
      } else if (role === 'SUPPLIER') {
        try {
          const reports = await getSupplierReports();
          if (Array.isArray(reports)) {
            const count = reports.filter(r => r.status === 'PENDING').length;
            setSupplierPendingReports(count);
          }
        } catch {
          // Silent catch
        }
      }
    };

    fetchPendingCounts();
  }, [location.pathname]);

  const menuItems = [
    { text: t('sidebar.menu.dashboard'), path: '/dashboard', icon: <LayoutDashboard size={20} strokeWidth={2.5} /> },
    ...(userRole !== 'SUPPLIER' && userRole !== 'VISITOR' ? [
      { text: t('sidebar.menu.configsStore'), path: '/shop/configs', icon: <Package size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.accountsStore'), path: '/shop/accounts', icon: <Store size={20} strokeWidth={2.5} /> }
    ] : []),
    ...(userRole === 'ADMIN' ? [
      { text: t('sidebar.menu.manageUsers'), path: '/admin/shops', icon: <Store size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.manageServices'), path: '/admin/services', icon: <Package size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.manageServers'), path: '/admin/servers', icon: <Server size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.panelSettings'), path: '/admin/settings', icon: <Settings size={20} strokeWidth={2.5} /> },
      { text: t('settlements.header.title'), path: '/admin/settlements', icon: <BanknoteCheck size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.transactions'), path: '/admin/transactions', icon: <Receipt size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.testConfigs'), path: '/visitor/test-configs', icon: <FileSpreadsheet size={20} strokeWidth={2.5} /> },
      { text: 'مدیریت محصولات اکانت', path: '/admin/account-products', icon: <Package size={20} strokeWidth={2.5} /> },
      { text: 'گزارش‌های مشکل اکانت', path: '/admin/account-reports', icon: <AlertOctagon size={20} strokeWidth={2.5} />, isRed: true, badgeCount: adminPendingReports },
      { text: t('sidebar.menu.supplierAccounts'), path: '/supplier/accounts', icon: <FilePlus size={20} strokeWidth={2.5} /> }
    ] : userRole === 'SUPPLIER' ? [
      { text: 'مدیریت و ثبت اکانت‌ها', path: '/supplier/accounts', icon: <FilePlus size={20} strokeWidth={2.5} /> },
      { text: 'گزارش‌های مشکل اکانت', path: '/supplier/reports', icon: <AlertOctagon size={20} strokeWidth={2.5} />, isRed: true, badgeCount: supplierPendingReports },
      { text: t('sidebar.menu.manageServices'), path: '/admin/services', icon: <Package size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.manageServers', 'مدیریت سرورها'), path: '/admin/servers', icon: <Server size={20} strokeWidth={2.5} /> },
      { text: t('settlements.header.title'), path: '/admin/settlements', icon: <BanknoteCheck size={20} strokeWidth={2.5} /> }
    ] : userRole === 'VISITOR' ? [
      { text: t('sidebar.menu.myShops', 'مغازه‌های من'), path: '/visitor/shops', icon: <Store size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.newTestConfig', 'کانفیگ تست جدید'), path: '/visitor/test-config', icon: <FilePlus size={20} strokeWidth={2.5} /> },
      { text: t('settlements.header.title'), path: '/admin/settlements', icon: <BanknoteCheck size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.testConfigs', 'کانفیگ‌های تست'), path: '/visitor/test-configs', icon: <FileSpreadsheet size={20} strokeWidth={2.5} /> }
    ] : [
      { text: t('sidebar.menu.shopSettings', 'تنظیمات پشتیبانی'), path: '/settings/shop', icon: <Settings size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.support', 'پشتیبانی'), path: '/support', icon: <Headphones size={20} strokeWidth={2.5} /> }
    ]),
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 right-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-l border-slate-800
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between border-b border-slate-800 px-6 shrink-0">
          <h1 className="text-xl font-black text-white tracking-wide">{t('sidebar.title')}</h1>
          <button onClick={onClose} className="md:hidden p-1 text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isRedItem = Boolean(item.badgeCount && item.badgeCount > 0);

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? isRedItem
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 font-bold'
                      : 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                    : isRedItem
                      ? 'bg-rose-950/50 text-rose-300 border border-rose-800/50 hover:bg-rose-900/60 hover:text-rose-100 font-bold'
                      : 'hover:bg-slate-800/60 hover:text-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-base ${isRedItem && !isActive ? 'text-rose-400' : ''}`}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>

                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {appVersion && (
          <div className="text-center mt-auto pt-4">
            <span className="text-[10px] font-bold text-slate-500 dir-ltr inline-block tracking-wider">
              v {appVersion}
            </span>
          </div>
        )}
      </aside>
    </>
  );
}