import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Edit, RefreshCw, AlertCircle, Calendar, ListPlus, Key, X, Search, Code } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import {
  getAdminProductAccounts,
  createAdminProductAccount,
  updateAdminProductAccount,
  deleteAdminProductAccount,
  recalculateProductStock,
  type AdminProductAccount
} from '../../../data/services/adminService';
import DynamicIcon from '../../components/DynamicIcon';

interface SchemaFieldRow {
  name: string;
  type: 'string' | 'integer' | 'boolean';
  required: boolean;
  is_private: boolean;
  icon?: string;
  hint?: string;
  multiline?: boolean;
}

const PRESET_FRONTEND_KEYS = [
  { key: 'apple_id', label: 'Apple ID (apple_id)' },
  { key: 'apple_id_icloud', label: 'Apple ID iCloud (apple_id_icloud)' },
  { key: 'gemini_sub', label: 'Gemini Sub (gemini_sub)' },
  { key: 'telegram_premium', label: 'Telegram Premium (telegram_premium)' },
  { key: 'chatgpt_plus', label: 'ChatGPT Plus (chatgpt_plus)' },
  { key: 'netflix_4k', label: 'Netflix 4K (netflix_4k)' },
  { key: 'spotify_family', label: 'Spotify Family (spotify_family)' }
];


export default function AccountProductsManagement() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<AdminProductAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductAccount | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [frontendKey, setFrontendKey] = useState('');
  const [isUnique, setIsUnique] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [fields, setFields] = useState<SchemaFieldRow[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleToggleActive = async (product: AdminProductAccount) => {
    try {
      const updatedStatus = !(product.is_active ?? true);
      await updateAdminProductAccount(product.id, { is_active: updatedStatus });
      toast.success(updatedStatus ? 'محصول فعال شد و در فروشگاه قرار گرفت.' : 'محصول غیرفعال شد و از فروشگاه مخفی گردید.');
      fetchData();
    } catch (error: any) {
      toast.error('خطا در تغییر وضعیت محصول');
    }
  };



  const filteredProducts = products.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.frontend_key && p.frontend_key.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getAdminProductAccounts();
      setProducts(data);
    } catch (error: any) {
      toast.error(t('adminAccountProducts.fetchError', 'خطا در دریافت اطلاعات'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setImageUrl('');
    setFrontendKey('');
    setIsUnique(false);
    setIsActive(true);
    setFields([
      { name: 'email', type: 'string', required: true, is_private: true, icon: 'Mail', hint: t('adminAccountProducts.hintEmail', 'آدرس ایمیل اکانت'), multiline: false },
      { name: 'password', type: 'string', required: true, is_private: true, icon: 'Lock', hint: t('adminAccountProducts.hintPassword', 'رمز عبور اکانت'), multiline: false }
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: AdminProductAccount) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || '');
    setImageUrl(product.image_url || '');
    setFrontendKey(product.frontend_key || '');
    setIsUnique(product.is_unique);
    setIsActive(product.is_active ?? true);
    
    // Parse fields schema properties to rows
    const schemaProps = product.fields_schema?.properties || {};
    const parsedFields: SchemaFieldRow[] = Object.entries(schemaProps).map(([key, val]: [string, any]) => ({
      name: key,
      type: (val.type as any) || 'string',
      required: !!val.required,
      is_private: !!val.is_private,
      icon: val.icon || '',
      hint: val.hint || '',
      multiline: !!val.multiline
    }));
    setFields(parsedFields);
    setIsModalOpen(true);
  };

  const addFieldRow = () => {
    setFields(prev => [...prev, { name: '', type: 'string', required: false, is_private: false, multiline: false }]);
  };

  const updateFieldRow = (index: number, key: keyof SchemaFieldRow, value: any) => {
    setFields(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: value } as any;
      return copy;
    });
  };

  const removeFieldRow = (index: number) => {
    setFields(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(t('adminAccountProducts.nameRequired', 'لطفا نام محصول را وارد کنید.'));
      return;
    }

    // Verify fields are valid
    if (fields.length === 0) {
      toast.error(t('adminAccountProducts.minFieldRequired', 'لطفا حداقل یک فیلد برای قالب اکانت تعریف کنید.'));
      return;
    }
    const hasEmptyFieldName = fields.some(f => !f.name.trim());
    if (hasEmptyFieldName) {
      toast.error(t('adminAccountProducts.fieldNameRequired', 'نام تمامی فیلدها باید پر شود.'));
      return;
    }

    setSubmitting(true);
    try {
      // Build fields_schema
      const properties: Record<string, any> = {};
      fields.forEach(f => {
        properties[f.name.trim()] = {
          type: f.type,
          required: f.required,
          is_private: f.is_private,
          icon: f.icon?.trim() || undefined,
          hint: f.hint?.trim() || undefined,
          multiline: f.type === 'string' ? !!f.multiline : undefined
        };
      });

      const payload = {
        name,
        description: description || undefined,
        price: null,
        is_unique: isUnique,
        is_active: isActive,
        image_url: imageUrl.trim() || undefined,
        frontend_key: frontendKey.trim() || undefined,
        fields_schema: { properties }
      };




      if (editingProduct) {
        await updateAdminProductAccount(editingProduct.id, payload);
        toast.success(t('adminAccountProducts.updateSuccess', 'محصول با موفقیت ویرایش شد.'));
      } else {
        await createAdminProductAccount(payload);
        toast.success(t('adminAccountProducts.createSuccess', 'محصول با موفقیت ساخته شد.'));
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || t('adminAccountProducts.saveError', 'خطا در ذخیره اطلاعات محصول'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm(t('adminAccountProducts.deleteConfirm', 'آیا از حذف این محصول مطمئن هستید؟ تمامی اکانت‌های فروخته نشده متناظر حذف خواهند شد.'))) return;
    try {
      await deleteAdminProductAccount(productId);
      toast.success(t('adminAccountProducts.deleteSuccess', 'محصول با موفقیت حذف شد.'));
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || t('adminAccountProducts.deleteError', 'خطا در حذف محصول'));
    }
  };

  const handleSyncStock = async (productId: string) => {
    try {
      const res = await recalculateProductStock(productId);
      toast.success(`${t('adminAccountProducts.syncSuccess', 'موجودی مجدداً محاسبه شد. تعداد موجود: ')}${res.stock}`);
      fetchData();
    } catch (error: any) {
      toast.error(t('adminAccountProducts.syncError', 'خطا در همگام‌سازی موجودی'));
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('adminAccountProducts.pageTitle', 'مدیریت محصولات اکانت')}</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">{t('adminAccountProducts.pageSubtitle', 'محصولاتی مثل نتفلیکس و اسپاتیفای را به همراه قالب فیلدهایشان تعریف کنید.')}</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl shadow-lg shadow-blue-600/10 transition-all duration-200"
        >
          <Plus size={20} />
          <span>{t('adminAccountProducts.createBtn', 'ایجاد محصول جدید')}</span>
        </button>
      </div>

      <div className="space-y-4">

            {/* Search & Counter Bar */}
            {products.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جستجو بر اساس نام، کلید فرانت یا توضیحات..."
                    className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="text-xs text-slate-500 font-bold self-end sm:self-auto">
                  نمایش {filteredProducts.length} از {products.length} قالب
                </div>
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">هیچ قالبی با این مشخصات یافت نشد</h3>
                <p className="text-sm text-slate-500 mt-1">کلمه دیگری را جستجو کنید یا دکمه "ایجاد محصول جدید" را بزنید.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map(prod => (
                  <div key={prod.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 overflow-hidden">
                    <div className="space-y-3">
                      {prod.image_url && (
                        <div className="h-36 -mx-5 -mt-5 mb-3 bg-white overflow-hidden relative flex items-center justify-center p-2">
                          <img
                            src={prod.image_url}
                            alt={prod.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        </div>
                      )}


                      {/* Title & Actions */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-2">
                            <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-black px-2.5 py-1 rounded-lg">
                              {prod.is_unique ? t('adminAccountProducts.productUnique', 'یکتا / اختصاصی') : t('adminAccountProducts.productBulk', 'عمومی / Bulk')}
                            </span>
                            {prod.frontend_key && (
                              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-black text-purple-700 bg-purple-50 border border-purple-200/60 px-2 py-0.5 rounded-lg">
                                <Code size={11} />
                                <span>key: {prod.frontend_key}</span>
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-black text-slate-900">{prod.name}</h3>
                        </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleToggleActive(prod)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-black border transition-all duration-150 flex items-center gap-1.5 ${
                          prod.is_active ?? true ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                        }`}
                        title={prod.is_active ?? true ? 'غیرفعال کردن فروش این محصول' : 'فعال کردن فروش این محصول'}
                      >
                        <span className={`w-2 h-2 rounded-full ${prod.is_active ?? true ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                        <span>{prod.is_active ?? true ? 'فعال' : 'غیرفعال'}</span>
                      </button>
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all duration-150"
                        title={t('adminAccountProducts.editBtn', 'ویرایش')}
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-150"
                        title={t('adminAccountProducts.deleteBtn', 'حذف')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-500 line-clamp-2 min-h-[40px]">{prod.description || t('adminAccountProducts.noDescription', 'توضیحاتی اضافه نشده است.')}</p>

                  {/* Pricing / Stock */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl text-xs font-semibold text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t('adminAccountProducts.publicPrice', 'قیمت عمومی')}</span>
                      <span className="text-slate-800 text-sm mt-0.5 block">
                        {prod.is_unique ? t('adminAccountProducts.variablePrice', 'قیمت متغیر') : prod.price ? `${prod.price.toLocaleString()} ${t('adminAccountProducts.currency', 'تومان')}` : t('adminAccountProducts.notDefined', 'تعریف نشده')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">{t('adminAccountProducts.stock', 'موجودی انبار')}</span>
                      <span className="text-slate-800 text-sm mt-0.5 block flex items-center gap-1">
                        <span>{prod.stock} عدد</span>
                        <button
                          onClick={() => handleSyncStock(prod.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title={t('adminAccountProducts.syncStockTooltip', 'همگام‌سازی و بروزرسانی تعداد موجودی')}
                        >
                          <RefreshCw size={12} />
                        </button>
                      </span>
                    </div>
                  </div>

                  {/* Fields Schema Summary */}
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">{t('adminAccountProducts.fieldsSchema', 'قالب فیلدهای اطلاعاتی:')}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(prod.fields_schema?.properties || {}).map(([key, val]) => (
                        <span key={key} dir="ltr" className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${val.is_private ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                          {val.is_private && <Key size={10} />}
                          <span>{key}</span>
                          <span className="text-[8px] text-slate-400 font-normal">({val.type})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <Calendar size={12} />
                  <span>{t('adminAccountProducts.createdAt', 'تاریخ ایجاد: ')}{new Date(prod.created_at).toLocaleDateString('fa-IR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-black text-slate-900">
                {editingProduct ? `${t('adminAccountProducts.editTitlePrefix', 'ویرایش محصول: ')}${editingProduct.name}` : t('adminAccountProducts.createTitle', 'ایجاد محصول اکانت جدید')}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                بستن
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('adminAccountProducts.formName', 'نام محصول')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={t('adminAccountProducts.formNamePlaceholder', 'مثلا: Netflix Premium')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('adminAccountProducts.formDesc', 'توضیحات محصول (اختیاری)')}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('adminAccountProducts.formDescPlaceholder', 'توضیحاتی درباره این محصول بنویسید...')}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-semibold"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">آدرس تصویر محصول (Image URL - اختیاری)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/product-logo.png"
                  dir="ltr"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
                />
                {imageUrl.trim() && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                    <img
                      src={imageUrl.trim()}
                      alt="پیش‌نمایش"
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <span className="text-xs font-bold text-slate-500">پیش‌نمایش تصویر محصول</span>
                  </div>
                )}
              </div>

              {/* Frontend Key */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 space-y-3">
                <div>
                  <label className="block text-sm font-black text-slate-800 flex items-center justify-between">
                    <span>کلید فرانت‌اند (Frontend Key - اختیاری)</span>
                    <span className="text-[11px] font-normal text-slate-400">جهت شناسایی توسط فرانت‌اند</span>
                  </label>
                  <p className="text-xs text-slate-500 mt-1">
                    یک شناسه انگلیسی اختصاصی انتخاب یا تایپ کنید تا فرانت با متوجه شدن آن، صفحه/کامپوننت مربوطه را به این محصول اختصاص دهد.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 block">انتخاب از شناسه پیش‌فرض (Presets):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_FRONTEND_KEYS.map(preset => (
                      <button
                        key={preset.key}
                        type="button"
                        onClick={() => setFrontendKey(preset.key)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-colors ${
                          frontendKey === preset.key ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={frontendKey}
                    onChange={(e) => setFrontendKey(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    placeholder="یا شناسه دلخواه مانند: telegram_premium"
                    dir="ltr"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-slate-800 text-left focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>



              {/* Product Type (Unique / Bulk) Toggle */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800">{t('adminAccountProducts.formIsUnique', 'نوع محصول یکتا / اختصاصی است؟')}</label>
                  <p className="text-xs text-slate-500 mt-1">
                    اگر بله باشد، هر اکانت ثبت شده یک قیمت مشخص و ویژگی منحصر بفرد دارد. اگر خیر باشد، تمام اکانت‌ها یکسان هستند و قیمت مشخص سراسری دارند.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isUnique}
                  onChange={(e) => setIsUnique(e.target.checked)}
                  className="h-6 w-6 text-blue-600 border-slate-300 rounded focus:ring-blue-500 shrink-0"
                />
              </div>

              {/* Product Active Status Toggle */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800">وضعیت فعال بودن محصول در فروشگاه</label>
                  <p className="text-xs text-slate-500 mt-1">
                    اگر فعال باشد، محصول در فروشگاه مغازه‌داران نمایش داده می‌شود. در صورت غیرفعال بودن، فروش آن متوقف شده و از فروشگاه مخفی خواهد شد.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-6 w-6 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 shrink-0 cursor-pointer"
                />
              </div>


              {/* Schema Fields Section */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                    <ListPlus className="w-4 h-4 text-slate-400" />
                    تعریف فیلدهای قالب اکانت
                  </h3>
                  <button
                    type="button"
                    onClick={addFieldRow}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-blue-600 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>{t('adminAccountProducts.addFieldBtn', 'افزودن فیلد جدید')}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  فیلدهایی که تأمین‌کننده در هنگام آپلود اکانت باید پر کند. برای فیلدهای ورود حساس (مثل پسورد یا کوکی) حتما گزینه رمزنگاری را فعال کنید.
                </p>

                {/* Fields Builder List */}
                <div className="space-y-4 p-1">
                  {fields.map((field, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 relative shadow-sm">
                      {/* Name & Delete */}
                      <div className="flex justify-between items-center gap-3">
                        <div className="flex-1">
                          <label className="text-xs font-bold text-slate-500 block mb-1">{t('adminAccountProducts.fieldName', 'نام فیلد (شناسه انگلیسی)')}</label>
                          <input
                            type="text"
                            value={field.name}
                            onChange={(e) => updateFieldRow(index, 'name', e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                            placeholder={t('adminAccountProducts.fieldNamePlaceholder', 'مثال: Username یا Access_Token')}
                            required
                            dir="ltr"
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFieldRow(index)}
                          className="text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-all duration-150 self-end"
                          title={t('adminAccountProducts.removeFieldTitle', 'حذف فیلد')}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      {/* Field parameters */}
                      <div className="grid grid-cols-4 gap-4">
                        {/* Type Select */}
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">{t('adminAccountProducts.dataType', 'نوع داده')}</label>
                          <select
                            value={field.type}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateFieldRow(index, 'type', val);
                              if (val !== 'string') {
                                updateFieldRow(index, 'multiline', false);
                              }
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          >
                            <option value="string">{t('adminAccountProducts.typeString', 'متن (String)')}</option>
                            <option value="integer">{t('adminAccountProducts.typeInteger', 'عدد (Integer)')}</option>
                            <option value="boolean">{t('adminAccountProducts.typeBoolean', 'بله/خیر (Boolean)')}</option>
                          </select>
                        </div>

                        {/* Required Checkbox */}
                        <div className="flex items-center gap-2 pt-6 justify-center">
                          <input
                            type="checkbox"
                            id={`req-${index}`}
                            checked={field.required}
                            onChange={(e) => updateFieldRow(index, 'required', e.target.checked)}
                            className="h-5 w-5 text-blue-600 rounded border-slate-355 focus:ring-blue-500"
                          />
                          <label htmlFor={`req-${index}`} className="text-sm font-bold text-slate-655 cursor-pointer select-none">{t('adminAccountProducts.isRequired', 'الزامی؟')}</label>
                        </div>

                        {/* Private Checkbox */}
                        <div className="flex items-center gap-2 pt-6 justify-center">
                          <input
                            type="checkbox"
                            id={`priv-${index}`}
                            checked={field.is_private}
                            onChange={(e) => updateFieldRow(index, 'is_private', e.target.checked)}
                            className="h-5 w-5 text-red-655 rounded border-slate-355 focus:ring-red-500"
                          />
                          <label htmlFor={`priv-${index}`} className="text-sm font-bold text-red-655 cursor-pointer select-none">{t('adminAccountProducts.isPrivate', 'رمزنگاری؟')}</label>
                        </div>

                        {/* Multiline Checkbox */}
                        <div className="flex items-center gap-2 pt-6 justify-center">
                          {field.type === 'string' ? (
                            <>
                              <input
                                type="checkbox"
                                id={`multi-${index}`}
                                checked={field.multiline || false}
                                onChange={(e) => updateFieldRow(index, 'multiline', e.target.checked)}
                                className="h-5 w-5 text-indigo-650 rounded border-slate-355 focus:ring-indigo-500"
                              />
                              <label htmlFor={`multi-${index}`} className="text-sm font-bold text-indigo-655 cursor-pointer select-none">{t('adminAccountProducts.isMultiline', 'چندخطی؟')}</label>
                            </>
                          ) : (
                            <span className="text-slate-300 text-xs font-semibold select-none pt-1">—</span>
                          )}
                        </div>
                      </div>

                      {/* Icon & Hint */}
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200/60">
                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">{t('adminAccountProducts.iconName', 'نام آیکون Lucide (اختیاری)')}</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={field.icon || ''}
                              onChange={(e) => updateFieldRow(index, 'icon', e.target.value)}
                              placeholder={t('adminAccountProducts.iconPlaceholder', 'مثال: Mail یا Lock')}
                              className="flex-1 bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-sm font-mono text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                            {field.icon && (
                              <div className="bg-slate-200/50 p-2.5 rounded-xl shrink-0 flex items-center justify-center border border-slate-200" title={t('adminAccountProducts.iconPreview', 'پیش‌نمایش آیکون')}>
                                <DynamicIcon name={field.icon} size={16} className="text-slate-600" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-500 block mb-1">{t('adminAccountProducts.hint', 'راهنمای فیلد (Placeholder)')}</label>
                          <input
                            type="text"
                            value={field.hint || ''}
                            onChange={(e) => updateFieldRow(index, 'hint', e.target.value)}
                            placeholder={t('adminAccountProducts.hintPlaceholder', 'توضیح راهنما برای تامین‌کننده')}
                            className="w-full bg-white border border-slate-250 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/10 focus:outline-none transition-all duration-150 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    'ثبت و ذخیره محصول'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition-all duration-150"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
