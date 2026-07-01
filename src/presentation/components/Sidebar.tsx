import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BanknoteCheck, Store, Settings, FilePlus, Package, Coins, Server } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  appVersion?: string | null;
}

export default function Sidebar({ isOpen, onClose, appVersion }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const userRole = localStorage.getItem('user_role');

  const menuItems = [
    { text: t('sidebar.menu.dashboard'), path: '/dashboard', icon: <LayoutDashboard size={20} strokeWidth={2.5} /> },
    { text: t('sidebar.menu.createConfig'), path: '/proxies', icon: <FilePlus size={20} strokeWidth={2.5} /> },
    { text: t('sidebar.menu.manageUsers'), path: '/users', icon: <Users size={20} strokeWidth={2.5} /> },
    ...(userRole === 'ADMIN' ? [
      { text: t('sidebar.menu.manageShop'), path: '/admin/shops', icon: <Store size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.manageServices'), path: '/admin/services', icon: <Package size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.manageServers', 'مدیریت سرورها'), path: '/admin/servers', icon: <Server size={20} strokeWidth={2.5} /> },
      { text: t('sidebar.menu.panelSettings'), path: '/admin/settings', icon: <Settings size={20} strokeWidth={2.5} /> },
      { text: t('settlements.header.title'), path: '/admin/settlements', icon: <BanknoteCheck size={20} strokeWidth={2.5} /> }
    ] : [
      { text: t('sidebar.menu.customPrices'), path: '/settings/prices', icon: <Coins size={20} strokeWidth={2.5} /> }
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
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10'
                    : 'hover:bg-slate-800/60 hover:text-slate-100'}`}
              >
                <span className="text-base">{item.icon}</span>
                {item.text}
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