import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../data/services/authService';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error(t('login.messages.emptyFields'));
      return;
    }

    setIsLoading(true);

    try {
      const data = await login(username, password);
      localStorage.setItem('access_token', data.access_token);
      if (data.role) {
        localStorage.setItem('user_role', data.role);
      }
      toast.success(t('login.messages.success'));
      
      navigate('/dashboard');
    } catch (error) {
      toast.error(t('login.messages.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4 selection:bg-blue-200">
      <div className="max-w-[420px] w-full bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">
            {t('login.header.title')}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            {t('login.header.subtitle')}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-5 relative z-10"
        >
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {t('login.labels.username')}
            </label>
            <input
              dir="ltr"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all duration-200 dir-ltr text-left text-slate-700 font-medium placeholder:text-slate-400"
              placeholder={t('login.placeholders.username')}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {t('login.labels.password')}
            </label>
            <input
              dir="ltr"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all duration-200 dir-ltr text-left text-slate-700 font-medium placeholder:text-slate-400"
              placeholder={t('login.placeholders.password')}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-4 mt-2 rounded-xl text-white font-semibold shadow-sm transition-all duration-200 flex justify-center items-center gap-2
              ${isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('login.buttons.authenticating')}
              </span>
            ) : (
              t('login.buttons.login')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}