import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Calendar,
  Key,
  Tag,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';



import { useTranslation } from 'react-i18next';
import {
  getSupplierTemplates,
  getSupplierAccounts,
  registerSupplierAccount,
  deleteSupplierAccount,
  getSupplierPrices,
  setSupplierPrice,
  deleteSupplierOffer,
  type ProductAccount,
  type SupplierAccount,
  type SupplierProductPrice
} from '../../../data/services/supplierService';
import DynamicIcon from '../../components/DynamicIcon';

export default function SupplierAccounts() {
  useTranslation();
  const [activeTab, setActiveTab] = useState<'accounts' | 'prices'>('accounts');
  const [accounts, setAccounts] = useState<SupplierAccount[]>([]);
  const [templates, setTemplates] = useState<ProductAccount[]>([]);
  const [supplierPrices, setSupplierPrices] = useState<SupplierProductPrice[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload Account Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [warrantyDays, setWarrantyDays] = useState<number | ''>(2);
  const [accountDescription, setAccountDescription] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const [fieldValues, setFieldValues] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showSensitiveId, setShowSensitiveId] = useState<string | null>(null);

  // Offer Modal State (Create / Edit Bulk Offers)
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SupplierProductPrice | null>(null);
  const [offerProductId, setOfferProductId] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [offerPrice, setOfferPrice] = useState<number | ''>('');
  const [offerWarrantyDays, setOfferWarrantyDays] = useState<number | ''>(2);
  const [offerDescription, setOfferDescription] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTemplate, setFilterTemplate] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchData = async () => {
    setLoading(true);
    try {
      const [accData, tempData, priceData] = await Promise.all([
        getSupplierAccounts(),
        getSupplierTemplates(),
        getSupplierPrices()
      ]);
      setAccounts(accData);
      setTemplates(tempData);
      setSupplierPrices(priceData);
    } catch (error: any) {
      toast.error('خطا در دریافت اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('آیا از حذف این اکانت اطمینان دارید؟')) return;
    try {
      await deleteSupplierAccount(id);
      toast.success('اکانت با موفقیت حذف گردید.');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'خطا در حذف اکانت.');
    }
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedTemplateId(id);
    setPrice('');
    setFieldValues({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId) {
      toast.error('لطفا محصول را انتخاب کنید.');
      return;
    }

    const selectedTemp = templates.find(t => t.id === selectedTemplateId);
    if (selectedTemp?.is_unique && (!price || Number(price) <= 0)) {
      toast.error('برای اکانت‌های یکتا، وارد کردن قیمت الزامی است.');
      return;
    }

    setSubmitting(true);
    try {
      const schemaProps = selectedTemp?.fields_schema?.properties || {};
      const publicFields: Record<string, any> = {};
      const privateFields: Record<string, any> = {};

      Object.keys(schemaProps).forEach(key => {
        const val = fieldValues[key];
        const isPrivate = schemaProps[key]?.is_private;
        if (val !== undefined && val !== '') {
          if (isPrivate) {
            privateFields[key] = val;
          } else {
            publicFields[key] = val;
          }
        }
      });

      await registerSupplierAccount({
        product_id: selectedTemplateId,
        offer_id: selectedOfferId || undefined,
        price: selectedTemp?.is_unique && price !== '' ? Number(price) : undefined,
        customer_phone: customerPhone.trim() || undefined,
        public_fields: publicFields,
        private_fields: privateFields,
        warranty_days: warrantyDays !== '' ? Number(warrantyDays) : 2,
        description: accountDescription.trim() || undefined
      });

      toast.success('اکانت با موفقیت ثبت شد.');
      setIsModalOpen(false);
      setSelectedTemplateId('');
      setSelectedOfferId('');
      setPrice('');

      setWarrantyDays(2);
      setAccountDescription('');
      setCustomerPhone('');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'خطا در ثبت اکانت');
    } finally {
      setSubmitting(false);
    }
  };

  // Offer Actions (Tab 2)
  const openAddOfferModal = (templateId?: string) => {
    setEditingOffer(null);
    setOfferProductId(templateId || (templates.find(t => !t.is_unique)?.id || ''));
    setOfferTitle('');
    setOfferPrice('');
    setOfferWarrantyDays(2);
    setOfferDescription('');
    setIsOfferModalOpen(true);
  };

  const openEditOfferModal = (offer: SupplierProductPrice) => {
    setEditingOffer(offer);
    setOfferProductId(offer.product_id);
    setOfferTitle(offer.title || '');
    setOfferPrice(offer.price);
    setOfferWarrantyDays(offer.warranty_days || 2);
    setOfferDescription(offer.description || '');
    setIsOfferModalOpen(true);
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerProductId || !offerPrice || Number(offerPrice) <= 0) {
      toast.error('لطفاً محصول و قیمت معتبر وارد کنید.');
      return;
    }

    setSubmittingOffer(true);
    try {
      await setSupplierPrice({
        offer_id: editingOffer?.id,
        product_id: offerProductId,
        price: Number(offerPrice),
        title: offerTitle.trim() || undefined,
        warranty_days: offerWarrantyDays !== '' ? Number(offerWarrantyDays) : 2,
        description: offerDescription.trim() || undefined
      });

      toast.success(editingOffer ? 'ارائه با موفقیت به‌روزرسانی شد.' : 'ارائه جدید با موفقیت ایجاد گردید.');
      setIsOfferModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'خطا در ثبت ارائه');
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleDeleteOffer = async (offerId: string) => {
    if (!window.confirm('آیا از حذف این ارائه اطمینان دارید؟')) return;
    try {
      await deleteSupplierOffer(offerId);
      toast.success('ارائه با موفقیت حذف گردید.');
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'خطا در حذف ارائه');
    }
  };

  const copyToClipboard = (text: string, _id: string) => {
    navigator.clipboard.writeText(text);
    toast.success('کپی شد!');
  };

  const filteredAccounts = useMemo(() => {
    let result = [...accounts];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(acc => {
        const template = templates.find(t => t.id === acc.product_id);
        const prodName = template?.name?.toLowerCase() || '';
        const publicKeys = Object.keys(acc.public_fields).join(' ').toLowerCase();
        const publicVals = Object.values(acc.public_fields).map(v => String(v)).join(' ').toLowerCase();
        const privateKeys = Object.keys(acc.private_fields).join(' ').toLowerCase();
        const privateVals = Object.values(acc.private_fields).map(v => String(v)).join(' ').toLowerCase();

        return prodName.includes(q) ||
          publicKeys.includes(q) ||
          publicVals.includes(q) ||
          privateKeys.includes(q) ||
          privateVals.includes(q);
      });
    }

    if (filterTemplate !== '') {
      result = result.filter(acc => acc.product_id === filterTemplate);
    }

    if (filterType !== 'all') {
      result = result.filter(acc => {
        const template = templates.find(t => t.id === acc.product_id);
        const isUnique = template?.is_unique ?? false;
        return filterType === 'unique' ? isUnique : !isUnique;
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return 0;
    });

    return result;
  }, [accounts, templates, searchQuery, filterTemplate, filterType, sortBy]);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAccounts, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterTemplate, filterType, sortBy]);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  if (loading && accounts.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">ثبت و مدیریت اکانت‌ها</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">اکانت‌های فروشی خود را ثبت، قیمت‌گذاری و گارانتی آن‌ها را مدیریت کنید.</p>
        </div>
        <button
          onClick={() => {
            setSelectedTemplateId('');
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-xl shadow-lg shadow-blue-600/10 transition-all duration-200"
        >
          <Plus size={20} />
          <span>افزودن اکانت جدید</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab('accounts')}
          className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 ${activeTab === 'accounts'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          اکانت‌های موجود ({accounts.length})
        </button>
        <button
          onClick={() => setActiveTab('prices')}
          className={`flex-1 py-2.5 px-3 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 ${activeTab === 'prices'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
            }`}
        >
          مدیریت ارائه‌ها و گارانتی ({supplierPrices.length})
        </button>
      </div>

      {/* Tab 1: Accounts Inventory */}
      {activeTab === 'accounts' && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در نام محصول، ایمیل یا فیلدها..."
                className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select
                value={filterTemplate}
                onChange={(e) => setFilterTemplate(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">همه محصولات</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="all">همه انواع</option>
                <option value="unique">اکانت‌های یکتا</option>
                <option value="bulk">اکانت‌های عمومی (Bulk)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="newest">جدیدترین</option>
                <option value="oldest">قدیمی‌ترین</option>
              </select>

              <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 rounded-lg transition-all duration-150 ${viewMode === 'card' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="نمایش کارتی"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all duration-150 ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                  title="نمایش جدولی"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {filteredAccounts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
              <Key className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">هیچ اکانتی یافت نشد</h3>
              <p className="text-sm text-slate-500 mt-1">با استفاده از دکمه «افزودن اکانت جدید» اولین اکانت خود را ثبت کنید.</p>
            </div>
          ) : viewMode === 'table' ? (
            /* Table View */
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-4 px-5">محصول</th>
                      <th className="py-4 px-5">نوع</th>
                      <th className="py-4 px-5">مشخصات عمومی</th>
                      <th className="py-4 px-5">اطلاعات حساس (رمزها)</th>
                      <th className="py-4 px-5 text-center">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium">
                    {paginatedAccounts.map(acc => {
                      const template = templates.find(t => t.id === acc.product_id);
                      const isUnique = template?.is_unique ?? false;
                      const isShowingSensitive = showSensitiveId === acc.id;

                      return (
                        <tr key={acc.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-5 font-bold text-slate-900">
                            {template?.name || 'محصول نامشخص'}
                          </td>
                          <td className="py-4 px-5">
                            <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold ${isUnique ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                              {isUnique ? 'یکتا' : 'عمومی (Bulk)'}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <div className="space-y-1">
                              {Object.entries(acc.public_fields).map(([k, v]) => (
                                <div key={k} className="text-slate-600">
                                  <span className="font-bold text-slate-500 ml-1">{k}:</span>
                                  <span className="font-mono dir-ltr inline-block">{String(v)}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setShowSensitiveId(isShowingSensitive ? null : acc.id)}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                              >
                                {isShowingSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>

                              <div className="space-y-1">
                                {Object.entries(acc.private_fields).map(([k, v]) => {
                                  const strVal = String(v);
                                  return (
                                    <div key={k} className="flex items-center gap-1">
                                      <span className="font-bold text-slate-500">{k}:</span>
                                      <span className="font-mono text-slate-800 dir-ltr bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                        {isShowingSensitive ? strVal : '••••••••'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5 text-center">
                            <button
                              onClick={() => handleDelete(acc.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-150"
                              title="حذف اکانت"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Card View */
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
              {paginatedAccounts.map(acc => {
                const template = templates.find(t => t.id === acc.product_id);
                const isShowingSensitive = showSensitiveId === acc.id;


                return (
                  <div key={acc.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Top Bar */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="inline-block bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg mb-2">
                            {template?.name || 'محصول نامشخص'}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-slate-400" />
                            اکانت فروشی
                          </h3>
                        </div>
                        <button
                          onClick={() => handleDelete(acc.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-150"
                          title="حذف اکانت"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Public details */}
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>ثبت: {new Date(acc.created_at).toLocaleDateString('fa-IR')}</span>
                        </div>

                        {Object.entries(acc.public_fields).length > 0 && (
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 text-xs">
                            {Object.entries(acc.public_fields).map(([k, v]) => (
                              <div key={k} className="flex justify-between items-center">
                                <span className="font-semibold text-slate-500">{k}:</span>
                                <span className="font-mono font-bold text-slate-800 dir-ltr select-all">{String(v)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Private Sensitive Data */}
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                            <Key className="w-3.5 h-3.5 text-amber-500" />
                            اطلاعات حساس (رمز عبور)
                          </span>
                          <button
                            onClick={() => setShowSensitiveId(isShowingSensitive ? null : acc.id)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            {isShowingSensitive ? (
                              <><EyeOff size={14} /> مخفی‌سازی</>
                            ) : (
                              <><Eye size={14} /> نمایش رمز</>
                            )}
                          </button>
                        </div>

                        <div className="bg-slate-900 rounded-xl p-3 text-white space-y-2 text-xs font-mono">
                          {Object.entries(acc.private_fields).map(([k, v]) => {
                            const strVal = String(v);
                            return (
                              <div key={k} className="flex items-center justify-between">
                                <span className="text-slate-400">{k}:</span>
                                <div className="flex items-center gap-2">
                                  <span>{isShowingSensitive ? strVal : '••••••••'}</span>
                                  {isShowingSensitive && (
                                    <button
                                      onClick={() => copyToClipboard(strVal, acc.id)}
                                      className="text-slate-400 hover:text-white"
                                      title="کپی"
                                    >
                                      <Copy size={13} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4 select-none">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all duration-150"
              >
                <ChevronRight size={18} />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pNum = i + 1;
                return (
                  <button
                    key={pNum}
                    onClick={() => setCurrentPage(pNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all duration-150 ${currentPage === pNum
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {pNum.toLocaleString('fa-IR')}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all duration-150"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Manage Offers, Prices & Warranty */}
      {activeTab === 'prices' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">تنظیم ارائه‌ها و قیمت محصولات عمومی (Bulk)</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">
                برای هر دسته از محصولات عمومی، ارائه‌ها و قیمت‌های مدنظر خود را ثبت کنید. اکانت‌های عمومی شما با این ارائه‌ها به فروش خواهند رسید.
              </p>
            </div>
            <button
              onClick={() => openAddOfferModal()}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-5 rounded-xl shadow-md shadow-emerald-600/10 transition-all shrink-0 text-xs sm:text-sm"
            >
              <Plus size={18} />
              <span>افزودن ارائه جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.filter(t => !t.is_unique).map(template => {
              const productOffers = supplierPrices.filter(sp => sp.product_id === template.id);

              return (
                <div key={template.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 overflow-hidden">
                  <div>
                    {/* Header Image */}
                    {template.image_url && (
                      <div className="h-36 -mx-5 -mt-5 mb-4 bg-white border-b border-slate-100 overflow-hidden relative flex items-center justify-center p-3">
                        <img
                          src={template.image_url}
                          alt={template.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                        />
                      </div>
                    )}

                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4 className="font-black text-slate-900 text-base">{template.name}</h4>
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded-md">
                        {productOffers.length} ارائه فعال
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{template.description || 'بدون توضیحات عمومی'}</p>

                    {/* Registered Offers Section */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <span className="text-[11px] font-black text-slate-400 block mb-2">ارائه‌ها و قیمت‌های ثبت‌شده:</span>

                      {productOffers.length === 0 ? (
                        <div className="bg-slate-50 rounded-xl p-3 text-center border border-dashed border-slate-200">
                          <p className="text-xs text-slate-400 font-bold">هنوز هیچ قیمتی برای این دسته ثبت نشده است.</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {productOffers.map(offer => (
                            <div key={offer.id} className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex items-center justify-between gap-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-black text-slate-800 text-xs">{offer.title || 'ارائه عمومی'}</span>
                                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold border border-emerald-100">
                                    🛡️ {offer.warranty_days || 2} روز گارانتی
                                  </span>
                                </div>
                                <div className="text-xs font-black text-blue-600 dir-ltr text-right">
                                  {offer.price.toLocaleString('fa-IR')} تومان
                                </div>
                                {offer.description && (
                                  <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{offer.description}</p>
                                )}
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => openEditOfferModal(offer)}
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                                  title="ویرایش"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteOffer(offer.id)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                                  title="حذف"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Add Offer Button for this specific template */}
                  <div className="pt-2">
                    <button
                      onClick={() => openAddOfferModal(template.id)}
                      className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-blue-200/60 transition-all duration-150 shadow-sm"
                    >
                      <Plus size={15} />
                      <span>افزودن قیمت / ارائه به {template.name}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Upload Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h2 className="text-lg font-black text-slate-900">ثبت اکانت جدید</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                بستن
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Product Template Dropdown */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">انتخاب محصول (قالب اکانت)</label>
                <select
                  value={selectedTemplateId}
                  onChange={handleTemplateChange}
                  required
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="">-- انتخاب کنید --</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.is_unique ? 'یکتا' : 'عمومی'})</option>
                  ))}
                </select>
              </div>

              {selectedTemplate && (
                <>
                  {selectedTemplate.is_unique ? (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">قیمت پیشنهادی فروش اکانت (تومان)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        required
                        placeholder="مثال: 150000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        انتخاب نوع ارائه / بسته مرتبط (اختیاری)
                      </label>
                      <select
                        value={selectedOfferId}
                        onChange={(e) => {
                          const offId = e.target.value;
                          setSelectedOfferId(offId);
                          const off = supplierPrices.find(sp => sp.id === offId);
                          if (off) {
                            if (off.warranty_days) setWarrantyDays(off.warranty_days);
                            if (off.description) setAccountDescription(off.description);
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="">-- بدون ارائه خاص (ارائه عمومی استاندارد) --</option>
                        {supplierPrices.filter(sp => sp.product_id === selectedTemplateId).map(off => (
                          <option key={off.id} value={off.id}>
                            {off.title || 'ارائه عمومی'} | {off.price.toLocaleString('fa-IR')} تومان ({off.warranty_days || 2} روز گارانتی)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}


                  {/* Dynamic Fields Generation */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase border-b border-slate-100 pb-1.5">
                      ورود اطلاعات مشخصات اکانت
                    </h3>

                    {Object.entries(selectedTemplate.fields_schema.properties).map(([key, prop]: [string, any]) => {
                      const isRequired = prop.required;
                      const isPrivate = prop.is_private;

                      return (
                        <div key={key}>
                          <label className="block text-xs font-bold text-slate-650 mb-1.5 flex items-center gap-1.5">
                            {prop.icon && <DynamicIcon name={prop.icon} className="text-slate-400" size={14} />}
                            <span>{key}</span>
                            {isRequired && <span className="text-red-500">*</span>}
                            {isPrivate && <span className="text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-bold">حساس / رمزنگاری‌شده</span>}
                          </label>

                          {prop.type === 'boolean' ? (
                            <select
                              value={fieldValues[key] ?? ''}
                              onChange={(e) => setFieldValues(prev => ({ ...prev, [key]: e.target.value === 'true' }))}
                              required={isRequired}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            >
                              <option value="">-- انتخاب کنید --</option>
                              <option value="true">بله / True</option>
                              <option value="false">خیر / False</option>
                            </select>
                          ) : prop.multiline ? (
                            <textarea
                              value={fieldValues[key] || ''}
                              onChange={(e) => setFieldValues(prev => ({ ...prev, [key]: e.target.value }))}
                              required={isRequired}
                              placeholder={prop.hint || `مقدار ${key} را وارد کنید...`}
                              rows={3}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          ) : (
                            <input
                              type={prop.type === 'integer' ? 'number' : 'text'}
                              value={fieldValues[key] || ''}
                              onChange={(e) => setFieldValues(prev => ({ ...prev, [key]: prop.type === 'integer' ? Number(e.target.value) : e.target.value }))}
                              required={isRequired}
                              placeholder={prop.hint || `مقدار ${key} را وارد کنید...`}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-5 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-2"
                    >
                      {submitting ? 'در حال ثبت...' : 'ثبت نهایی اکانت'}
                    </button>
                  </div>
                </>
              )}
            </form>

          </div>
        </div>
      )}

      {/* Offer Modal (Create / Edit Offer) */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900">
                {editingOffer ? 'ویرایش ارائه محصول' : 'تعریف ارائه جدید (Offer)'}
              </h2>
              <button
                onClick={() => setIsOfferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                بستن
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">انتخاب محصول عمومی</label>
                <select
                  value={offerProductId}
                  onChange={(e) => setOfferProductId(e.target.value)}
                  disabled={!!editingOffer}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">-- انتخاب کنید --</option>
                  {templates.filter(t => !t.is_unique).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان ارائه (اختیاری)</label>
                <input
                  type="text"
                  value={offerTitle}
                  onChange={(e) => setOfferTitle(e.target.value)}
                  placeholder="مثال: پکیج ویژه با پشتیبانی سریع"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">قیمت فروش (تومان)</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    placeholder="مثال: 150000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">مهلت گارانتی (روز)</label>
                  <input
                    type="number"
                    min={0}
                    value={offerWarrantyDays}
                    onChange={(e) => setOfferWarrantyDays(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    placeholder="مثال: 7"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">توضیحات و شرایط تعویض ارائه</label>
                <textarea
                  value={offerDescription}
                  onChange={(e) => setOfferDescription(e.target.value)}
                  placeholder="شرایط گارانتی و اطلاعات اختصاصی خریدار..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOfferModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={submittingOffer}
                  className="px-5 py-2 text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {submittingOffer ? 'در حال ثبت...' : 'ذخیره ارائه'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}