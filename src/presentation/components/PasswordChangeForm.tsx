import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { changePassword } from '../../data/services/shopService';
import { useTranslation } from 'react-i18next';

interface PasswordChangeFormProps {
  onSuccess?: () => void;
}

export default function PasswordChangeForm({ onSuccess }: PasswordChangeFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { t } = useTranslation();
  const handlePasswordSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t('passwordChangeForm.errors.fillAllFields'));
      return;
    }
    if (newPassword.length < 8) {
      toast.error(t('passwordChangeForm.errors.minLength'));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t('passwordChangeForm.errors.passwordMismatch'));
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({
        old_password: currentPassword,
        new_password: newPassword,
      });

      toast.success(t('passwordChangeForm.success'));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      if (onSuccess) onSuccess();

    } catch {
      toast.error(t('passwordChangeForm.errors.generalError'));
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('passwordChangeForm.labels.currentPassword')}</label>
        <input
          dir="ltr"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          disabled={isChangingPassword}
          className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all duration-200 dir-ltr text-left text-slate-700 font-medium placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('passwordChangeForm.labels.newPassword')}</label>
        <input
          dir="ltr"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={isChangingPassword}
          className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all duration-200 dir-ltr text-left text-slate-700 font-medium placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder={t('passwordChangeForm.placeholders.minLength')}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('passwordChangeForm.labels.confirmPassword')}</label>
        <input
          dir="ltr"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isChangingPassword}
          className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all duration-200 dir-ltr text-left text-slate-700 font-medium placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isChangingPassword}
        className={`w-full py-3 px-4 rounded-xl text-white font-semibold shadow-sm transition-all duration-200 flex justify-center items-center gap-2 min-h-[48px]
          ${isChangingPassword ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-900 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'}`}
      >
        {isChangingPassword ? t('passwordChangeForm.buttons.changing') : t('passwordChangeForm.buttons.changePassword')}
      </button>
    </form>
  );
}