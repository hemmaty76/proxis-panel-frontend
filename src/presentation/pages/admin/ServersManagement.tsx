import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  Server,
  Plus,
  Loader2,
  Edit,
  Trash2,
  X,
  Check,
  Globe,
  User,
  Key
} from 'lucide-react';
import {
  type ServerResponse,
  getServers,
  createServer,
  updateServer,
  deleteServer
} from '../../../data/services/adminService';

export default function ServersManagement() {
  const { t } = useTranslation();
  const userRole = localStorage.getItem('user_role');
  const [servers, setServers] = useState<ServerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerResponse | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [sub, setSub] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [serverType, setServerType] = useState('PASARGAD');
  const [isSaving, setIsSaving] = useState(false);

  const fetchServers = async () => {
    setIsLoading(true);
    try {
      const data = await getServers();
      setServers(data);
    } catch {
      toast.error(t('servers.messages.fetchError', 'خطا در بارگذاری لیست سرورها.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingServer(null);
    setName('');
    setBaseUrl('');
    setSub('');
    setUsername('');
    setPassword('');
    setIsActive(false);
    setServerType('PASARGAD');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (server: ServerResponse) => {
    setEditingServer(server);
    setName(server.name);
    setBaseUrl(server.base_url);
    setSub(server.sub || '');
    setUsername(server.username);
    setPassword(''); // Keep password blank unless changing it
    setIsActive(server.is_active);
    setServerType(server.type || 'PASARGAD');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingServer) {
        const updateData: any = {
          name,
          base_url: baseUrl,
          sub: sub || undefined,
          username,
          is_active: isActive,
          type: serverType
        };
        if (password) {
          updateData.password = password;
        }
        await updateServer(editingServer.id, updateData);
        toast.success(t('servers.messages.updateSuccess', 'سرور با موفقیت بروزرسانی شد.'));
      } else {
        await createServer({
          name,
          base_url: baseUrl,
          sub: sub || undefined,
          username,
          password,
          is_active: isActive,
          type: serverType
        });
        toast.success(t('servers.messages.createSuccess', 'سرور با موفقیت ثبت شد.'));
      }
      setIsModalOpen(false);
      fetchServers();
    } catch {
      toast.error(
        editingServer
          ? t('servers.messages.updateError', 'خطا در بروزرسانی سرور.')
          : t('servers.messages.createError', 'خطا در ثبت سرور جدید.')
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('common.confirmDelete', 'آیا از حذف این سرور مطمئن هستید؟'))) {
      return;
    }
    try {
      await deleteServer(id);
      toast.success(t('servers.messages.deleteSuccess', 'سرور با موفقیت حذف شد.'));
      fetchServers();
    } catch (err: any) {
      if (err?.response?.status === 400) {
        toast.error(
          t(
            'servers.messages.deleteBlocked',
            'امکان حذف این سرور وجود ندارد زیرا دارای کانفیگ‌های فعال است. لطفاً به جای حذف، وضعیت آن را غیرفعال کنید.'
          )
        );
      } else {
        toast.error(t('servers.messages.deleteError', 'خطا در حذف سرور.'));
      }
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Server className="text-indigo-600" size={28} />
            {t('servers.header.title', 'مدیریت سرورها/تامین‌کنندگان')}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {t('servers.header.subtitle', 'افزودن، ویرایش و مدیریت سرورهای مرزبان بالاسری')}
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus size={20} />
          {t('servers.buttons.newServer', 'افزودن سرور جدید')}
        </button>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-indigo-600" size={36} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {servers.length === 0 ? (
            <div className="p-12 text-center bg-slate-50/50">
              <Server className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-500">
                {t('servers.table.empty', 'هیچ سروری تا کنون ثبت نشده است.')}
              </h3>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center text-slate-500">
                <thead className="text-xs font-bold text-slate-700 bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">{t('servers.table.name', 'نام سرور')}</th>
                    {userRole === 'ADMIN' && (
                      <th className="px-6 py-4">ثبت کننده / صاحب سرور</th>
                    )}
                    <th className="px-6 py-4">{t('servers.table.url', 'آدرس پنل مرزبان')}</th>
                    <th className="px-6 py-4">{t('servers.table.username', 'نام کاربری')}</th>
                    <th className="px-6 py-4">{t('servers.table.type', 'نوع پنل')}</th>
                    <th className="px-6 py-4">{t('servers.table.status', 'وضعیت')}</th>
                    <th className="px-6 py-4">{t('servers.table.actions', 'عملیات')}</th>
                  </tr>
                </thead>
                <tbody>
                  {servers.map((srv) => (
                    <tr
                      key={srv.id}
                      className={`border-b border-slate-50 hover:bg-slate-50/80 transition-colors ${
                        srv.is_active ? 'bg-indigo-50/20' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div className="flex items-center justify-center gap-2">
                          {srv.name}
                          {srv.is_active && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                              {t('servers.status.active', 'فعال')}
                            </span>
                          )}
                        </div>
                      </td>
                      {userRole === 'ADMIN' && (
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {srv.owner ? srv.owner.username : 'مدیر سیستم'}
                        </td>
                      )}
                      <td className="px-6 py-4 font-medium text-slate-600 dir-ltr">
                        <div>{srv.base_url}</div>
                        {srv.sub && (
                          <div className="text-xs text-slate-400 mt-1 font-semibold">
                            Sub: {srv.sub}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">{srv.username}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {srv.type === 'MARZBAN' ? t('servers.types.marzban', 'مرزبان') : t('servers.types.pasargad', 'پاسارگاد')}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            srv.is_active
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              srv.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {srv.is_active
                            ? t('servers.status.active', 'فعال')
                            : t('servers.status.inactive', 'غیرفعال')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(srv)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(srv.id)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <Server className="text-indigo-600" size={20} />
                {editingServer
                  ? t('servers.modal.editTitle', 'ویرایش سرور')
                  : t('servers.modal.createTitle', 'ثبت سرور جدید')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {t('servers.modal.nameLabel', 'نام تامین‌کننده/سرور')}
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: سرور آلمان"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-slate-800"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {t('servers.modal.urlLabel', 'آدرس پنل مرزبان')}
                </label>
                <div className="relative flex items-center">
                  <Globe className="absolute right-3.5 text-slate-400" size={18} />
                  <input
                    type="url"
                    required
                    dir="ltr"
                    placeholder="https://core.example.com:12000"
                    className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-slate-800"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {t('servers.modal.subLabel', 'آدرس ساب (sub)')}
                </label>
                <div className="relative flex items-center">
                  <Globe className="absolute right-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="https://sub.example.com"
                    className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-slate-800"
                    value={sub}
                    onChange={(e) => setSub(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {t('servers.modal.usernameLabel', 'نام کاربری')}
                </label>
                <div className="relative flex items-center">
                  <User className="absolute right-3.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    dir="ltr"
                    placeholder="admin"
                    className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-slate-800"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {t('servers.modal.passwordLabel', 'رمز عبور')}
                </label>
                <div className="relative flex items-center">
                  <Key className="absolute right-3.5 text-slate-400" size={18} />
                  <input
                    type="password"
                    required={!editingServer}
                    placeholder="••••••••"
                    className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-slate-800"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {t('servers.modal.typeLabel', 'نوع پنل سرور')}
                </label>
                <select
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none bg-white text-slate-800 font-semibold cursor-pointer"
                  value={serverType}
                  onChange={(e) => setServerType(e.target.value)}
                >
                  <option value="PASARGAD">{t('servers.types.pasargad', 'پاسارگاد (Pasargad)')}</option>
                  <option value="MARZBAN">{t('servers.types.marzban', 'مرزبان (Marzban)')}</option>
                </select>
              </div>

              {/* is_active Toggle */}
              <div className="pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">
                    {t('servers.modal.activeLabel', 'سرور فعال برای خریدهای جدید')}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all flex justify-center items-center gap-2 shadow-sm"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                  {editingServer ? t('common.save', 'ذخیره تغییرات') : t('common.create', 'ایجاد سرور')}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
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
