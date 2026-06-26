import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Settings, Save, Loader2, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAdminSettings, updateAdminSettings, type SystemSettings } from '../../../data/services/adminService';

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    dashboard_message: '',
    dashboard_message_type: 'info',
    dashboard_version: '1.0.0'
  });
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getAdminSettings()
      .then(data => setSettings(data))
      .catch(() => toast.error(t('systemSettings.messages.fetchError')))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAdminSettings(settings);
      toast.success(t('systemSettings.messages.saveSuccess'));
    } catch {
      toast.error(t('systemSettings.messages.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  // تابع کمکی برای رندر کردن آیکون و رنگ پیش‌نمایش
  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'success': return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: <CheckCircle className="text-emerald-500" size={24} /> };
      case 'warning': return { bg: 'bg-amber-50 border-amber-200 text-amber-800', icon: <AlertTriangle className="text-amber-500" size={24} /> };
      case 'error': return { bg: 'bg-red-50 border-red-200 text-red-800', icon: <XCircle className="text-red-500" size={24} /> };
      case 'info': default: return { bg: 'bg-blue-50 border-blue-200 text-blue-800', icon: <Info className="text-blue-500" size={24} /> };
    }
  };

  const previewStyle = getAlertStyles(settings.dashboard_message_type);

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600" size={32} /></div>;
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
      <header>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="text-indigo-600" size={28} />
          {t('systemSettings.header.title')}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">{t('systemSettings.header.subtitle')}</p>
      </header>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">

          {/* بخش تنظیمات عمومی */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">{t('systemSettings.general.title')}</h3>
            <div className="max-w-xs">
              <label className="block text-sm font-semibold text-slate-700 mb-1">{t('systemSettings.general.versionLabel')}</label>
              <input
                name="dashboard_version"
                value={settings.dashboard_version}
                onChange={handleChange}
                dir="ltr"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-bold font-[inherit]"
              />
            </div>
          </section>

          {/* بخش پیام داشبورد */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">{t('systemSettings.notice.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('systemSettings.notice.messageLabel')}</label>
                  <textarea
                    name="dashboard_message"
                    value={settings.dashboard_message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium"
                    placeholder={t('systemSettings.notice.messagePlaceholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">{t('systemSettings.notice.typeLabel')}</label>
                  <select
                    name="dashboard_message_type"
                    value={settings.dashboard_message_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
                  >
                    <option value="info">{t('systemSettings.notice.types.info')}</option>
                    <option value="success">{t('systemSettings.notice.types.success')}</option>
                    <option value="warning">{t('systemSettings.notice.types.warning')}</option>
                    <option value="error">{t('systemSettings.notice.types.error')}</option>
                  </select>
                </div>
              </div>

              {/* پیش‌نمایش */}
              <div className="md:col-span-1 border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col justify-center bg-slate-50/50">
                <span className="text-xs font-bold text-slate-400 mb-3 text-center">{t('systemSettings.preview.title')}</span>
                {settings.dashboard_message ? (
                  <div className={`p-4 rounded-xl border flex items-start gap-3 ${previewStyle.bg}`}>
                    <div className="shrink-0 mt-0.5">{previewStyle.icon}</div>
                    <p className="text-sm font-semibold leading-relaxed">{settings.dashboard_message}</p>
                  </div>
                ) : (
                  <div className="text-center text-sm text-slate-400 font-medium py-4">{t('systemSettings.preview.empty')}</div>
                )}
              </div>
            </div>
          </section>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition-all disabled:opacity-70"
            >
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {t('systemSettings.buttons.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}