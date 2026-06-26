import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role'); 
    toast.success(t('header.logoutSuccess'));
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 shadow-sm shrink-0">
      
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -me-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-sm font-medium text-slate-600">{t('header.connectedToServer')}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => changeLanguage('fa')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${i18n.language === 'fa' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            FA
          </button>
          <button 
            onClick={() => changeLanguage('en')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${i18n.language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            EN
          </button>
          <button 
            onClick={() => changeLanguage('ar')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${i18n.language === 'ar' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            AR
          </button>
        </div>

        <div className="hidden sm:block text-start">
          <p className="text-sm font-semibold text-slate-700">{t('header.welcome')}</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title={t('header.logOut')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}