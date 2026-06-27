import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  Layers, Package, Settings, Plus, Trash2, Loader2, HardDrive, Clock, X
} from 'lucide-react';
import {
  getConfigTypes, createConfigType, deleteConfigType,
  getConfigCategories, createConfigCategory, updateConfigCategory, deleteConfigCategory,
  adminGetPackages, adminCreatePackage, adminDeletePackage, adminUpdatePackage,
  type ConfigTypeItem, type ConfigCategoryItem, type AdminPackageItem
} from '../../../data/services/adminService';

type TabType = 'types' | 'categories' | 'packages';

export default function ServicesManagement() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('packages');
  const [isLoading, setIsLoading] = useState(true);

  // States
  const [types, setTypes] = useState<ConfigTypeItem[]>([]);
  const [categories, setCategories] = useState<ConfigCategoryItem[]>([]);
  const [packages, setPackages] = useState<AdminPackageItem[]>([]);

  // Create Form States
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Config Type inputs
  const [typeName, setTypeName] = useState('');
  const [typeDesc, setTypeDesc] = useState('');

  // 2. Config Category inputs
  const [catTypeId, setCatTypeId] = useState('');
  const [catSellType, setCatSellType] = useState('VOLUME_TIME');
  const [catName, setCatName] = useState('');
  const [catAdminCost, setCatAdminCost] = useState('');
  const [catShopPrice, setCatShopPrice] = useState('');

  // Category inline edit states
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatAdminCost, setEditCatAdminCost] = useState('');
  const [editCatShopPrice, setEditCatShopPrice] = useState('');

  // 3. Package inputs
  const [pkgCatId, setPkgCatId] = useState('');
  const [pkgName, setPkgName] = useState('');
  const [pkgDataLimit, setPkgDataLimit] = useState('');
  const [pkgDuration, setPkgDuration] = useState('');

  // Package edit modal states
  const [editingPkg, setEditingPkg] = useState<AdminPackageItem | null>(null);
  const [editPkgName, setEditPkgName] = useState('');
  const [editPkgDataLimit, setEditPkgDataLimit] = useState('');
  const [editPkgDuration, setEditPkgDuration] = useState('');
  const [editPkgCatId, setEditPkgCatId] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [tList, cList, pList] = await Promise.all([
        getConfigTypes(),
        getConfigCategories(),
        adminGetPackages()
      ]);
      setTypes(tList);
      setCategories(cList);
      setPackages(pList);

      // Pre-select first options if available
      if (tList.length > 0) setCatTypeId(tList[0].id);
      if (cList.length > 0) setPkgCatId(cList[0].id);
    } catch (err) {
      toast.error(t('servicesManagement.messages.fetchError', 'خطا در بارگذاری داده‌های خدمات.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Handlers ---
  const handleCreateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName) return;
    setIsSubmitting(true);
    try {
      await createConfigType({ name: typeName, description: typeDesc });
      toast.success(t('servicesManagement.messages.createTypeSuccess', 'نوع کانفیگ با موفقیت ساخته شد.'));
      setTypeName('');
      setTypeDesc('');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('servicesManagement.messages.createTypeError', 'خطا در ثبت نوع کانفیگ.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteType = async (id: string) => {
    if (!window.confirm(t('servicesManagement.messages.deleteTypeConfirm', 'آیا از حذف این نوع سرویس مطمئن هستید؟ با این کار تمام دسته‌بندی‌های متصل نیز حذف می‌شوند.'))) return;
    try {
      await deleteConfigType(id);
      toast.success(t('servicesManagement.messages.deleteTypeSuccess', 'نوع سرویس با موفقیت حذف شد.'));
      fetchData();
    } catch {
      toast.error(t('servicesManagement.messages.deleteTypeError', 'خطا در حذف نوع سرویس. احتمالاً به علت وجود وابستگی‌های فعال است.'));
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catTypeId || !catAdminCost || !catShopPrice) return;
    setIsSubmitting(true);
    try {
      await createConfigCategory({
        config_type_id: catTypeId,
        sell_type: catSellType,
        name: catName,
        admin_cost_per_unit: Number(catAdminCost.replace(/\D/g, '')),
        shop_price_per_unit: Number(catShopPrice.replace(/\D/g, ''))
      });
      toast.success(t('servicesManagement.messages.createCategorySuccess', 'دسته کانفیگ جدید با موفقیت ایجاد شد.'));
      setCatName('');
      setCatAdminCost('');
      setCatShopPrice('');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('servicesManagement.messages.createCategoryError', 'خطا در ثبت دسته کانفیگ.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm(t('servicesManagement.messages.deleteCategoryConfirm', 'آیا از حذف این دسته کانفیگ مطمئن هستید؟ تمام پکیج‌ها و تنظیمات قیمت سفارشی متصل حذف می‌شوند.'))) return;
    try {
      await deleteConfigCategory(id);
      toast.success(t('servicesManagement.messages.deleteCategorySuccess', 'دسته سرویس با موفقیت حذف شد.'));
      fetchData();
    } catch {
      toast.error(t('servicesManagement.messages.deleteCategoryError', 'خطا در حذف دسته سرویس.'));
    }
  };

  const startEditingCategory = (c: ConfigCategoryItem) => {
    setEditingCatId(c.id);
    setEditCatName(c.name || '');
    setEditCatAdminCost(c.admin_cost_per_unit.toString());
    setEditCatShopPrice(c.shop_price_per_unit.toString());
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editCatAdminCost || !editCatShopPrice) return;
    try {
      await updateConfigCategory(id, {
        name: editCatName,
        admin_cost_per_unit: Number(editCatAdminCost),
        shop_price_per_unit: Number(editCatShopPrice)
      });
      toast.success(t('servicesManagement.messages.updateCategorySuccess', 'دسته کانفیگ با موفقیت ویرایش شد.'));
      setEditingCatId(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('servicesManagement.messages.updateCategoryError', 'خطا در ویرایش دسته کانفیگ.'));
    }
  };

  const handleCreatePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgCatId || !pkgName || !pkgDataLimit || !pkgDuration) return;
    setIsSubmitting(true);
    try {
      await adminCreatePackage({
        config_category_id: pkgCatId,
        name: pkgName,
        data_limit_gb: Number(pkgDataLimit.replace(/\D/g, '')),
        duration_days: Number(pkgDuration.replace(/\D/g, ''))
      });
      toast.success(t('servicesManagement.messages.createPackageSuccess', 'پکیج جدید با موفقیت ایجاد شد.'));
      setPkgName('');
      setPkgDataLimit('');
      setPkgDuration('');
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('servicesManagement.messages.createPackageError', 'خطا در ثبت پکیج جدید.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm(t('servicesManagement.messages.deletePackageConfirm', 'آیا از حذف این پکیج قالب مطمئن هستید؟'))) return;
    try {
      await adminDeletePackage(id);
      toast.success(t('servicesManagement.messages.deletePackageSuccess', 'پکیج با موفقیت حذف شد.'));
      fetchData();
    } catch {
      toast.error(t('servicesManagement.messages.deletePackageError', 'خطا در حذف پکیج.'));
    }
  };

  const handleTogglePackageActive = async (id: string, currentStatus: boolean) => {
    try {
      await adminUpdatePackage(id, { is_active: !currentStatus });
      toast.success(t('servicesManagement.messages.updatePackageSuccess', 'وضعیت پکیج با موفقیت بروزرسانی شد.'));
      fetchData();
    } catch {
      toast.error(t('servicesManagement.messages.updatePackageError', 'خطا در تغییر وضعیت پکیج.'));
    }
  };

  const startEditingPackage = (pkg: AdminPackageItem) => {
    setEditingPkg(pkg);
    setEditPkgName(pkg.name);
    setEditPkgDataLimit(pkg.data_limit_gb.toString());
    setEditPkgDuration(pkg.duration_days.toString());
    setEditPkgCatId(pkg.config_category_id);
  };

  const handleUpdatePackageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg || !editPkgName || !editPkgDataLimit || !editPkgDuration || !editPkgCatId) return;
    setIsSubmitting(true);
    try {
      await adminUpdatePackage(editingPkg.id, {
        name: editPkgName,
        data_limit_gb: Number(editPkgDataLimit),
        duration_days: Number(editPkgDuration),
        config_category_id: editPkgCatId
      });
      toast.success(t('servicesManagement.messages.updatePackageSuccess', 'پکیج با موفقیت بروزرسانی شد.'));
      setEditingPkg(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || t('servicesManagement.messages.updatePackageError', 'خطا در ویرایش پکیج.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper
  const getSellTypeLabel = (val: string) => {
    switch (val) {
      case 'VOLUME_TIME': return t('servicesManagement.labels.sellTypes.volumeTime', 'حجمی زمانی (محدود)');
      case 'UNLIMITED_VOLUME': return t('servicesManagement.labels.sellTypes.unlimitedVolume', 'حجم نامحدود (زمانی)');
      case 'UNLIMITED_TIME': return t('servicesManagement.labels.sellTypes.unlimitedTime', 'زمان نامحدود (حجمی)');
      default: return val;
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* هدر */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="text-indigo-600" size={28} />
          {t('servicesManagement.labels.title', 'مدیریت سرویس‌ها و پکیج‌ها')}
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">{t('servicesManagement.labels.subtitle', 'مدیریت انواع کانفیگ (VIP / معمولی)، دسته‌بندی‌های فروش و قالب‌های پکیج آماده')}</p>
      </div>

      {/* زبانه ناوبری */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'packages' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Package size={18} /> {t('servicesManagement.labels.tabs.packages', 'پکیج‌های خرید')}
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'categories' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers size={18} /> {t('servicesManagement.labels.tabs.categories', 'دسته‌بندی و تعیین فروش')}
        </button>
        <button
          onClick={() => setActiveTab('types')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'types' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Settings size={18} /> {t('servicesManagement.labels.tabs.types', 'نوع سرویس‌ها')}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-16"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* بخش فرم ساخت در سمت چپ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit">
            {activeTab === 'types' && (
              <form onSubmit={handleCreateType} className="space-y-4">
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-1.5"><Plus size={18} className="text-indigo-600" /> {t('servicesManagement.labels.forms.createTypeTitle', 'ساخت نوع سرویس جدید')}</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.typeName', 'نام نوع سرویس')}</label>
                  <input type="text" placeholder="مثلاً: VIP" required value={typeName} onChange={e => setTypeName(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.typeDesc', 'توضیحات')}</label>
                  <textarea placeholder={t('servicesManagement.labels.forms.typeDescPlaceholder', 'توضیحات اختیاری...')} value={typeDesc} onChange={e => setTypeDesc(e.target.value)} rows={3} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium resize-none" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex justify-center shadow-sm transition-all">{isSubmitting ? <Loader2 className="animate-spin" size={18} /> : t('servicesManagement.labels.forms.submitType', 'ثبت نوع سرویس')}</button>
              </form>
            )}

            {activeTab === 'categories' && (
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-1.5"><Plus size={18} className="text-indigo-600" /> {t('servicesManagement.labels.forms.createCategoryTitle', 'ایجاد دسته فروش جدید')}</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.selectType', 'انتخاب نوع سرویس')}</label>
                  <select required value={catTypeId} onChange={e => setCatTypeId(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium">
                    {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.sellType', 'مدل فروش و حسابداری')}</label>
                  <select required value={catSellType} onChange={e => setCatSellType(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium">
                    <option value="VOLUME_TIME">{t('servicesManagement.labels.sellTypes.volumeTime', 'حجمی و زمانی محدود')}</option>
                    <option value="UNLIMITED_VOLUME">{t('servicesManagement.labels.sellTypes.unlimitedVolume', 'حجم نامحدود با زمان محدود')}</option>
                    <option value="UNLIMITED_TIME">{t('servicesManagement.labels.sellTypes.unlimitedTime', 'زمان نامحدود با حجم محدود')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.categoryName', 'نام نمایشی دسته')}</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: معمولی - حجمی زمانی"
                    value={catName}
                    onChange={e => setCatName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.adminCost', 'هزینه ادمین به سرور اصلی (هر واحد - تومان)')}</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={catAdminCost ? Number(catAdminCost).toLocaleString('en-US') : ''}
                    onChange={e => setCatAdminCost(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-bold text-sm"
                    placeholder="مثلاً: 400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.shopPrice', 'قیمت فروش پایه به مغازه‌دار (هر واحد - تومان)')}</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={catShopPrice ? Number(catShopPrice).toLocaleString('en-US') : ''}
                    onChange={e => setCatShopPrice(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-bold text-sm"
                    placeholder="مثلاً: 1,000"
                  />
                </div>
                <button type="submit" disabled={isSubmitting || types.length === 0} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex justify-center shadow-sm transition-all disabled:opacity-50">{isSubmitting ? <Loader2 className="animate-spin" size={18} /> : t('servicesManagement.labels.forms.submitCategory', 'ثبت دسته فروش')}</button>
              </form>
            )}

            {activeTab === 'packages' && (
              <form onSubmit={handleCreatePackage} className="space-y-4">
                <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-1.5"><Plus size={18} className="text-indigo-600" /> {t('servicesManagement.labels.forms.createPackageTitle', 'ساخت پکیج جدید')}</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.selectCategory', 'انتخاب دسته سرویس')}</label>
                  <select required value={pkgCatId} onChange={e => setPkgCatId(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium">
                    {categories.map(c => {
                      const typeName = types.find(t => t.id === c.config_type_id)?.name || '';
                      return <option key={c.id} value={c.id}>{typeName} - {getSellTypeLabel(c.sell_type)}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.packageName', 'نام پکیج قالب')}</label>
                  <input type="text" placeholder="مثلاً: ۳۰ گیگ یک ماهه معمولی" required value={pkgName} onChange={e => setPkgName(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.volumeGb', 'حجم (گیگابایت)')}</label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={pkgDataLimit ? Number(pkgDataLimit).toLocaleString('en-US') : ''}
                      onChange={e => setPkgDataLimit(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-bold text-sm"
                      placeholder="مثلاً: 30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.durationDays', 'مدت اعتبار (روز)')}</label>
                    <input
                      type="text"
                      required
                      dir="ltr"
                      value={pkgDuration ? Number(pkgDuration).toLocaleString('en-US') : ''}
                      onChange={e => setPkgDuration(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-bold text-sm"
                      placeholder="مثلاً: 30"
                    />
                  </div>
                </div>
                <button type="submit" disabled={isSubmitting || categories.length === 0} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex justify-center shadow-sm transition-all disabled:opacity-50">{isSubmitting ? <Loader2 className="animate-spin" size={18} /> : t('servicesManagement.labels.forms.submitPackage', 'ثبت پکیج قالب')}</button>
              </form>
            )}
          </div>

          {/* لیست نمایش اطلاعات در سمت راست */}
          <div className="lg:col-span-2 space-y-4">
            {activeTab === 'types' && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="min-w-full text-right text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="px-6 py-3">{t('servicesManagement.labels.tables.typeName', 'نام نوع سرویس')}</th>
                      <th className="px-6 py-3">{t('servicesManagement.labels.tables.description', 'توضیحات')}</th>
                      <th className="px-6 py-3 text-center w-20">{t('servicesManagement.labels.tables.actions', 'عملیات')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {types.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-400">{t('servicesManagement.labels.tables.noTypes', 'هیچ نوع سرویسی ثبت نشده است.')}</td></tr>
                    ) : (
                      types.map(tItem => (
                        <tr key={tItem.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800">{tItem.name}</td>
                          <td className="px-6 py-4 text-slate-500">{tItem.description || '—'}</td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => handleDeleteType(tItem.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="min-w-full text-right text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="px-6 py-3">{t('servicesManagement.labels.tables.typeName', 'نوع سرویس')}</th>
                      <th className="px-6 py-3">{t('servicesManagement.labels.tables.sellType', 'مدل فروش')}</th>
                      <th className="px-6 py-3">{t('servicesManagement.labels.tables.categoryName', 'نام نمایشی')}</th>
                      <th className="px-6 py-3">{t('servicesManagement.labels.tables.adminCost', 'هزینه ادمین')}</th>
                      <th className="px-6 py-3">{t('servicesManagement.labels.tables.shopPrice', 'قیمت پایه مغازه')}</th>
                      <th className="px-6 py-3 text-center w-28">{t('servicesManagement.labels.tables.actions', 'عملیات')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {categories.length === 0 ? (
                      <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400">{t('servicesManagement.labels.tables.noCategories', 'هیچ دسته‌بندی فروشی ثبت نشده است.')}</td></tr>
                    ) : (
                      categories.map(c => {
                        const typeName = types.find(tItem => tItem.id === c.config_type_id)?.name || 'نامشخص';
                        if (editingCatId === c.id) {
                          return (
                            <tr key={c.id} className="bg-indigo-50/20">
                              <td className="px-6 py-3.5 font-bold text-slate-800">{typeName}</td>
                              <td className="px-6 py-3.5 text-slate-500">{getSellTypeLabel(c.sell_type)}</td>
                              <td className="px-6 py-3.5">
                                <input
                                  type="text"
                                  value={editCatName}
                                  onChange={e => setEditCatName(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                              </td>
                              <td className="px-6 py-3.5">
                                <input
                                  type="text"
                                  value={editCatAdminCost}
                                  onChange={e => setEditCatAdminCost(e.target.value.replace(/\D/g, ''))}
                                  className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-left focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                              </td>
                              <td className="px-6 py-3.5">
                                <input
                                  type="text"
                                  value={editCatShopPrice}
                                  onChange={e => setEditCatShopPrice(e.target.value.replace(/\D/g, ''))}
                                  className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-left text-indigo-600 focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                              </td>
                              <td className="px-6 py-3.5 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button onClick={() => handleUpdateCategory(c.id)} className="px-2.5 py-1 bg-indigo-600 text-white rounded-md font-bold text-[10px] hover:bg-indigo-700 transition-colors">ثبت</button>
                                  <button onClick={() => setEditingCatId(null)} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md font-bold text-[10px] hover:bg-slate-200 transition-colors">لغو</button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                        return (
                          <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800">{typeName}</td>
                            <td className="px-6 py-4 text-slate-500">{getSellTypeLabel(c.sell_type)}</td>
                            <td className="px-6 py-4 text-slate-600 font-bold">{c.name || '—'}</td>
                            <td className="px-6 py-4 text-slate-700 font-bold tabular-nums">{c.admin_cost_per_unit.toLocaleString()} {t('usersManagement.currency', 'تومان')}</td>
                            <td className="px-6 py-4 text-indigo-600 font-bold tabular-nums">{c.shop_price_per_unit.toLocaleString()} {t('usersManagement.currency', 'تومان')}</td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button onClick={() => startEditingCategory(c)} className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors font-bold text-xs">ویرایش</button>
                                <button onClick={() => handleDeleteCategory(c.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'packages' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {packages.length === 0 ? (
                  <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-base font-bold text-slate-500">{t('servicesManagement.labels.tables.noPackages', 'هیچ قالب پکیجی طراحی نشده است.')}</h3>
                  </div>
                ) : (
                  packages.map(pkg => {
                    const c = categories.find(cat => cat.id === pkg.config_category_id);
                    const typeName = c ? (types.find(tItem => tItem.id === c.config_type_id)?.name || 'سرویس') : 'سرویس';
                    return (
                      <div key={pkg.id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[175px] group">
                        <div>
                          <div className="flex justify-between items-start gap-4 mb-3">
                            <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md border border-indigo-100 shrink-0">{typeName}</span>
                              {c && (
                                <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-medium rounded-md border border-slate-100 shrink-0">
                                  {c.name || getSellTypeLabel(c.sell_type)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleTogglePackageActive(pkg.id, pkg.is_active)}
                                className={`px-2 py-0.5 text-[9px] font-black rounded-md border transition-all cursor-pointer ${
                                  pkg.is_active
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                                    : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                                }`}
                                title={pkg.is_active ? t('servicesManagement.labels.tables.deactivate', 'غیرفعال‌سازی فروش') : t('servicesManagement.labels.tables.activate', 'فعال‌سازی فروش')}
                              >
                                {pkg.is_active ? t('servicesManagement.labels.tables.activeStatus', 'فعال') : t('servicesManagement.labels.tables.inactiveStatus', 'غیرفعال')}
                              </button>
                              <button onClick={() => startEditingPackage(pkg)} className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors" title={t('servicesManagement.labels.tables.edit', 'ویرایش')}><Settings size={14} /></button>
                              <button onClick={() => handleDeletePackage(pkg.id)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title={t('servicesManagement.labels.tables.actions', 'حذف پکیج')}><Trash2 size={14} /></button>
                            </div>
                          </div>
                          <h4 className="text-base font-extrabold text-slate-800">{pkg.name}</h4>
                        </div>
                        <div className="flex gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-semibold mt-4">
                          <span className="flex items-center gap-1"><HardDrive size={14} /> {t('servicesManagement.labels.tables.volume', 'حجم')}: {pkg.data_limit_gb === 0 ? t('servicesManagement.labels.tables.unlimited', 'نامحدود') : `${pkg.data_limit_gb} ${t('servicesManagement.labels.tables.gigabytes', 'گیگ')}`}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {t('servicesManagement.labels.tables.duration', 'اعتبار')}:{' '}
                            {pkg.duration_days === 0
                              ? t('servicesManagement.labels.tables.noExpiration', 'بدون تاریخ انقضا')
                              : `${pkg.duration_days} ${t('servicesManagement.labels.tables.days', 'روز')}`}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

        </div>
      )}

      {/* مودال ویرایش پکیج قالب */}
      {editingPkg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="font-bold text-slate-800">{t('servicesManagement.labels.forms.editPackageTitle', 'ویرایش پکیج قالب')}</h3>
              <button onClick={() => setEditingPkg(null)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleUpdatePackageSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.selectCategory', 'انتخاب دسته سرویس')}</label>
                <select required value={editPkgCatId} onChange={e => setEditPkgCatId(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium">
                  {categories.map(c => {
                    const typeName = types.find(t => t.id === c.config_type_id)?.name || '';
                    return <option key={c.id} value={c.id}>{c.name || `${typeName} - ${getSellTypeLabel(c.sell_type)}`}</option>;
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.packageName', 'نام پکیج قالب')}</label>
                <input type="text" required value={editPkgName} onChange={e => setEditPkgName(e.target.value)} className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.volumeGb', 'حجم (گیگابایت)')}</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={editPkgDataLimit ? Number(editPkgDataLimit).toLocaleString('en-US') : ''}
                    onChange={e => setEditPkgDataLimit(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">{t('servicesManagement.labels.forms.durationDays', 'مدت اعتبار (روز)')}</label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={editPkgDuration ? Number(editPkgDuration).toLocaleString('en-US') : ''}
                    onChange={e => setEditPkgDuration(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-left font-bold text-sm"
                  />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 flex justify-center shadow-sm transition-all">{isSubmitting ? <Loader2 className="animate-spin" size={20} /> : t('servicesManagement.labels.forms.savePackage', 'ذخیره تغییرات')}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
