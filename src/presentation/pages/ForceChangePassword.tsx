import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PasswordChangeForm from '../components/PasswordChangeForm';
import { useTranslation } from 'react-i18next';

export default function ForceChangePassword() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleSuccess = () => {
    localStorage.removeItem('password_change_required');
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('access_token');
    localStorage.removeItem('password_change_required');
    toast.success(t('forceChangePassword.messages.logoutSuccess'));
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4">
      <div className="max-w-[420px] w-full bg-white/90 backdrop-blur-xl border border-red-100 rounded-3xl shadow-xl p-8 relative overflow-hidden">
        
        <div className="absolute top-0 inset-x-0 h-1.5 bg-red-500"></div>

        <div className="text-center mb-8 mt-2">
          <div className="mx-auto w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">{t('forceChangePassword.header.title')}</h2>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            {t('forceChangePassword.header.description')}
          </p>
        </div>

        <PasswordChangeForm onSuccess={handleSuccess} />

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <button 
            onClick={handleLogout}
            className="text-sm font-semibold text-slate-500 hover:text-red-600 transition-colors"
          >
            {t('forceChangePassword.buttons.logout')}
          </button>
        </div>
      </div>
    </div>
  );
}