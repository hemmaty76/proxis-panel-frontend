import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  AlertOctagon,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Eye,
  EyeOff,
  Copy,
  User,
  Phone,
  RefreshCw,
  Tag,
  ShieldAlert,
  Calendar,
  X,
  UserCheck,
  Globe,
  ExternalLink,
  Mail,
  FileText
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  getAdminAccountReports,
  approveAdminReport,
  rejectAdminReport
} from '../../data/services/adminService';
import {
  getSupplierReports,
  approveSupplierReport,
  rejectSupplierReport
} from '../../data/services/supplierService';

export interface UnifiedAccountReport {
  id: string;
  purchase_id: string;
  sold_account_id?: string;
  shopkeeper_id?: string;
  supplier_id?: string;
  reason: string;
  status: string;
  replacement_sold_account_id?: string;
  created_at: string;
  resolved_at?: string;

  // Flat fields (returned by backend APIs)
  product_name?: string;
  shopkeeper_name?: string;
  shopkeeper_phone?: string;
  shop_name?: string;
  supplier_name?: string;
  supplier_username?: string;
  supplier_phone?: string;
  public_fields?: Record<string, any>;
  private_fields?: Record<string, any>;
  public_url?: string;

  // Nested fields
  shopkeeper_details?: {
    username: string;
    phone_number?: string;
    shop_name?: string;
  };
  supplier_details?: {
    username: string;
    phone_number?: string;
  };
  product_details?: {
    id: string;
    name: string;
    is_unique: boolean;
  };
  sold_account_details?: {
    id: string;
    public_fields: Record<string, any>;
    private_fields: Record<string, any>;
  };
}

const getProductName = (r: UnifiedAccountReport) => r.product_name || r.product_details?.name || 'محصول نامشخص';
const getShopkeeperName = (r: UnifiedAccountReport) => r.shopkeeper_name || r.shopkeeper_details?.username || 'خریدار (مغازه‌دار)';
const getShopkeeperPhone = (r: UnifiedAccountReport) => r.shopkeeper_phone || r.shopkeeper_details?.phone_number || '';
const getSupplierName = (r: UnifiedAccountReport) => r.supplier_name || r.supplier_username || r.supplier_details?.username || '';
const getSupplierPhone = (r: UnifiedAccountReport) => r.supplier_phone || r.supplier_details?.phone_number || '';

const getPublicFields = (r: UnifiedAccountReport): Record<string, any> => {
  if (r.public_fields && Object.keys(r.public_fields).length > 0) return r.public_fields;
  if (r.sold_account_details?.public_fields && Object.keys(r.sold_account_details.public_fields).length > 0) return r.sold_account_details.public_fields;
  return {};
};

const getPrivateFields = (r: UnifiedAccountReport): Record<string, any> => {
  if (r.private_fields && Object.keys(r.private_fields).length > 0) return r.private_fields;
  if (r.sold_account_details?.private_fields && Object.keys(r.sold_account_details.private_fields).length > 0) return r.sold_account_details.private_fields;
  return {};
};

const getPrimaryIdentifier = (pubFields: Record<string, any>) => {
  const keys = Object.keys(pubFields);
  if (keys.length === 0) return null;
  const lowerKeys = keys.map(k => k.toLowerCase());
  
  const emailIdx = lowerKeys.findIndex(k => k.includes('email') || k.includes('ایمیل') || k.includes('mail') || k.includes('apple') || k.includes('user'));
  if (emailIdx !== -1) {
    const key = keys[emailIdx];
    return { key, value: String(pubFields[key]) };
  }
  
  const firstKey = keys[0];
  return { key: firstKey, value: String(pubFields[firstKey]) };
};

export default function AccountReports() {
  useTranslation();
  const userRole = localStorage.getItem('user_role');
  const isAdmin = userRole === 'ADMIN';

  const [reports, setReports] = useState<UnifiedAccountReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingReportId, setProcessingReportId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visiblePrivateAccountIds, setVisiblePrivateAccountIds] = useState<Record<string, boolean>>({});

  // User Contact Modal State for Admin
  const [selectedUserModal, setSelectedUserModal] = useState<any>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const data = await getAdminAccountReports();
        setReports(data as UnifiedAccountReport[]);
      } else {
        const data = await getSupplierReports();
        setReports(data as UnifiedAccountReport[]);
      }
    } catch (error: any) {
      toast.error('خطا در دریافت گزارش‌های خرابی اکانت');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [isAdmin]);

  const handleApproveReport = async (reportId: string) => {
    const confirmMessage = isAdmin
      ? 'آیا از تایید این گزارش و تعویض اکانت برای خریدار اطمینان دارید؟'
      : 'آیا از تایید این گزارش و تعویض اکانت برای خریدار اطمینان دارید؟ یک اکانت سالم از انبار شما جایگزین خواهد شد.';

    if (!window.confirm(confirmMessage)) return;

    setProcessingReportId(reportId);
    try {
      if (isAdmin) {
        await approveAdminReport(reportId);
        toast.success('گزارش با موفقیت تایید شد و اکانت تعویض گردید.');
      } else {
        const res = await approveSupplierReport(reportId);
        toast.success(res.message || 'گزارش تایید شد و اکانت سالم تعویض گردید.');
      }
      fetchReports();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'خطا در تایید گزارش');
    } finally {
      setProcessingReportId(null);
    }
  };

  const handleRejectReport = async (reportId: string) => {
    const confirmMessage = isAdmin
      ? 'آیا از رد نهایی این گزارش اطمینان دارید؟'
      : 'آیا از رد این گزارش اطمینان دارید؟ در صورت رد، موضوع جهت تصمیم‌گیری نهایی به ادمین ارجاع می‌شود.';

    if (!window.confirm(confirmMessage)) return;

    setProcessingReportId(reportId);
    try {
      if (isAdmin) {
        await rejectAdminReport(reportId);
        toast.success('گزارش به طور نهایی رد شد.');
      } else {
        const res = await rejectSupplierReport(reportId);
        toast.success(res.message || 'گزارش رد شد و به ادمین ارجاع یافت.');
      }
      fetchReports();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'خطا در رد گزارش');
    } finally {
      setProcessingReportId(null);
    }
  };

  const toggleShowPrivateFields = (reportId: string) => {
    setVisiblePrivateAccountIds(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('در حافظه کپی شد');
  };

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const s = report.status as string;

      // Status Filter
      if (statusFilter === 'action_required') {
        if (isAdmin) {
          if (s !== 'REJECTED_BY_SUPPLIER' && s !== 'PENDING') return false;
        } else {
          if (s !== 'PENDING') return false;
        }
      } else if (statusFilter === 'approved') {
        if (s !== 'APPROVED_BY_ADMIN' && s !== 'RESOLVED_BY_SUPPLIER' && s !== 'APPROVED' && s !== 'RESOLVED') return false;
      } else if (statusFilter === 'rejected') {
        if (isAdmin) {
          if (s !== 'REJECTED_BY_ADMIN' && s !== 'REJECTED') return false;
        } else {
          if (s !== 'REJECTED_BY_SUPPLIER' && s !== 'REJECTED_BY_ADMIN' && s !== 'REJECTED') return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const productName = getProductName(report).toLowerCase();
        const shopkeeperName = getShopkeeperName(report).toLowerCase();
        const supplierName = getSupplierName(report).toLowerCase();
        const shopkeeperPhone = getShopkeeperPhone(report);
        const supplierPhone = getSupplierPhone(report);
        const purchaseId = (report.purchase_id || '').toLowerCase();
        const reason = (report.reason || '').toLowerCase();

        const pubFields = getPublicFields(report);
        const privFields = getPrivateFields(report);

        const publicVals = pubFields ? Object.values(pubFields).map(v => String(v)).join(' ').toLowerCase() : '';
        const privateVals = privFields ? Object.values(privFields).map(v => String(v)).join(' ').toLowerCase() : '';

        return productName.includes(q) ||
          shopkeeperName.includes(q) ||
          supplierName.includes(q) ||
          shopkeeperPhone.includes(q) ||
          supplierPhone.includes(q) ||
          purchaseId.includes(q) ||
          reason.includes(q) ||
          publicVals.includes(q) ||
          privateVals.includes(q);
      }

      return true;
    });
  }, [reports, statusFilter, searchQuery, isAdmin]);

  const stats = useMemo(() => {
    const total = reports.length;
    const actionRequired = isAdmin
      ? reports.filter(r => (r.status as string) === 'REJECTED_BY_SUPPLIER' || (r.status as string) === 'PENDING').length
      : reports.filter(r => (r.status as string) === 'PENDING').length;

    const approved = reports.filter(r => {
      const s = r.status as string;
      return s === 'APPROVED_BY_ADMIN' || s === 'RESOLVED_BY_SUPPLIER' || s === 'APPROVED' || s === 'RESOLVED';
    }).length;

    const rejected = isAdmin
      ? reports.filter(r => (r.status as string) === 'REJECTED_BY_ADMIN' || (r.status as string) === 'REJECTED').length
      : reports.filter(r => (r.status as string) === 'REJECTED_BY_SUPPLIER' || (r.status as string) === 'REJECTED_BY_ADMIN' || (r.status as string) === 'REJECTED').length;

    return { total, actionRequired, approved, rejected };
  }, [reports, isAdmin]);

  if (loading && reports.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto" dir="rtl">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold">
              <ShieldAlert size={14} />
              <span>پشتیبانی و بررسی گزارش‌های خرابی</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span>{isAdmin ? 'مدیریت نهایی گزارش‌های اکانت' : 'گزارش‌های مشکل اکانت'}</span>
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-300 max-w-2xl leading-relaxed">
              {isAdmin
                ? 'بررسی کامل مشخصات خریدار، تامین‌کننده، فیلدهای اکانت و لینک تحویل جهت تایید یا رد نهایی.'
                : 'مشاهده کامل ایمیل، رمزها، لینک اختصاصی پشتیبان و اطلاعات مغازه‌دار جهت بررسی خرابی و تعویض اکانت.'}
            </p>
          </div>

          <button
            onClick={fetchReports}
            className="flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-5 rounded-2xl border border-white/15 transition-all duration-200 text-xs shrink-0 backdrop-blur-md self-start md:self-auto shadow-sm active:scale-95"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>به‌روزرسانی اطلاعات</span>
          </button>
        </div>
      </div>

      {/* Modern KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-400 block">کل گزارش‌ها</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.total}</span>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
            <AlertOctagon size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
          <div>
            <span className={`text-xs font-extrabold block ${isAdmin ? 'text-rose-600' : 'text-amber-600'}`}>
              {isAdmin ? 'نیاز به اقدام ادمین' : 'در انتظار بررسی'}
            </span>
            <span className={`text-2xl font-black mt-1 block ${isAdmin ? 'text-rose-600' : 'text-amber-600'}`}>
              {stats.actionRequired}
            </span>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isAdmin ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
            <Clock size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-emerald-600 block">تایید و تعویض شده</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.approved}</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-slate-500 block">رد شده</span>
            <span className="text-2xl font-black text-slate-700 mt-1 block">{stats.rejected}</span>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600">
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAdmin ? "جستجو در ایمیل، نام محصول، مغازه‌دار، شناسه خرید، علت..." : "جستجو در ایمیل اکانت، نام محصول، مغازه‌دار، شناسه خرید..."}
            className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'همه' },
            { id: 'action_required', label: isAdmin ? `نیاز به بررسی (${stats.actionRequired})` : `در انتظار (${stats.actionRequired})` },
            { id: 'approved', label: `تایید شده (${stats.approved})` },
            { id: 'rejected', label: `رد شده (${stats.rejected})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all duration-150 ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List (Single Column Full-Width Cards) */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-sm space-y-3">
          <CheckCircle2 className="h-14 w-14 text-emerald-400 mx-auto" />
          <h3 className="text-lg font-black text-slate-800">هیچ گزارشی یافت نشد</h3>
          <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto">
            {statusFilter !== 'all' || searchQuery ? 'هیچ گزارشی با این فیلتر یا عبارت همخوانی ندارد.' : 'تمام گزارش‌ها بررسی و تعیین تکلیف شده‌اند.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredReports.map((report) => {
            const isShowPrivate = !!visiblePrivateAccountIds[report.id];

            const productName = getProductName(report);
            const shopkeeperName = getShopkeeperName(report);
            const shopkeeperPhone = getShopkeeperPhone(report);
            const supplierName = getSupplierName(report);

            const pubFields = getPublicFields(report);
            const privFields = getPrivateFields(report);
            const hasPublic = Object.keys(pubFields).length > 0;
            const hasPrivate = Object.keys(privFields).length > 0;
            const primaryId = getPrimaryIdentifier(pubFields);

            const rawLink = report.public_url || `/account/${report.purchase_id || report.sold_account_id || report.id}`;
            const fullPublicUrl = rawLink.startsWith('http') ? rawLink : `${window.location.origin}${rawLink.startsWith('/') ? '' : '/'}${rawLink}`;

            const isPendingForUser = isAdmin
              ? (report.status === 'REJECTED_BY_SUPPLIER' || report.status === 'PENDING')
              : (report.status === 'PENDING');

            const copyAllCredentials = () => {
              let text = `اطلاعات اکانت (${productName}):\n`;
              Object.entries(pubFields).forEach(([k, v]) => { text += `${k}: ${v}\n`; });
              Object.entries(privFields).forEach(([k, v]) => { text += `${k}: ${v}\n`; });
              if (fullPublicUrl) text += `لینک تحویل اکانت: ${fullPublicUrl}\n`;
              navigator.clipboard.writeText(text.trim());
              toast.success('تمامی اطلاعات اکانت در حافظه کپی شد');
            };

            return (
              <div
                key={report.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 space-y-3.5 relative overflow-hidden"
              >
                {/* Accent Status Line Top */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    (report.status as string) === 'PENDING' ? 'bg-amber-500' :
                    (report.status as string) === 'REJECTED_BY_SUPPLIER' ? 'bg-rose-500' :
                    ((report.status as string) === 'RESOLVED_BY_SUPPLIER' || (report.status as string) === 'APPROVED_BY_ADMIN' || (report.status as string) === 'APPROVED' || (report.status as string) === 'RESOLVED') ? 'bg-emerald-500' :
                    'bg-slate-400'
                  }`}
                />

                {/* 1. Meta & Status Header Inline */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 font-black text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl">
                      <Tag size={12} />
                      <span>{productName}</span>
                      {report.product_details?.is_unique && <span className="text-purple-700 font-black mr-1">(یکتا)</span>}
                    </span>

                    {report.purchase_id && (
                      <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl font-mono text-[11px] border border-slate-200">
                        <span className="font-sans font-bold text-slate-400">خرید:</span>
                        <span className="font-bold select-all dir-ltr">{report.purchase_id.substring(0, 8)}...</span>
                        <button onClick={() => copyToClipboard(report.purchase_id)} title="کپی کامل شناسه خرید"><Copy size={11} /></button>
                      </div>
                    )}

                    <div className="inline-flex items-center gap-1.5 bg-blue-50/70 text-blue-800 px-2.5 py-1 rounded-xl font-semibold border border-blue-100">
                      <User size={12} className="text-blue-600" />
                      <span className="font-bold">{shopkeeperName}</span>
                      {shopkeeperPhone && (
                        <>
                          <span className="text-blue-300">|</span>
                          <a href={`tel:${shopkeeperPhone}`} className="font-mono text-blue-600 hover:underline dir-ltr">{shopkeeperPhone}</a>
                          <button onClick={() => copyToClipboard(shopkeeperPhone)} title="کپی شماره"><Copy size={11} /></button>
                        </>
                      )}
                    </div>

                    {isAdmin && supplierName && (
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl font-semibold border border-slate-200">
                        <UserCheck size={12} className="text-emerald-600" />
                        <span>{supplierName}</span>
                      </div>
                    )}
                  </div>

                  <span className={`px-3 py-1 rounded-xl text-xs font-black shrink-0 flex items-center gap-1.5 border self-start md:self-auto ${
                    (report.status as string) === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    (report.status as string) === 'REJECTED_BY_SUPPLIER' ? (isAdmin ? 'bg-rose-100 text-rose-800 border-rose-300 font-black animate-pulse' : 'bg-rose-50 text-rose-700 border-rose-200') :
                    ((report.status as string) === 'RESOLVED_BY_SUPPLIER' || (report.status as string) === 'APPROVED_BY_ADMIN' || (report.status as string) === 'APPROVED' || (report.status as string) === 'RESOLVED') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {(report.status as string) === 'PENDING' && <><Clock size={13} /> {isAdmin ? 'در انتظار بررسی تامین‌کننده' : 'در انتظار بررسی شما'}</>}
                    {(report.status as string) === 'REJECTED_BY_SUPPLIER' && <><AlertOctagon size={13} /> {isAdmin ? 'رد تامین‌کننده (نیازمند بررسی ادمین)' : 'رد شده توسط شما (ارسال به ادمین)'}</>}
                    {(report.status as string) === 'APPROVED_BY_ADMIN' && <><CheckCircle2 size={13} /> {isAdmin ? 'تایید نهایی ادمین' : 'تایید نهایی شده توسط ادمین'}</>}
                    {(report.status as string) === 'RESOLVED_BY_SUPPLIER' && <><CheckCircle2 size={13} /> {isAdmin ? 'تعویض شده توسط تامین‌کننده' : 'تعویض شده توسط شما'}</>}
                    {((report.status as string) === 'APPROVED' || (report.status as string) === 'RESOLVED') && <><CheckCircle2 size={13} /> تایید و تعویض شده</>}
                    {((report.status as string) === 'REJECTED_BY_ADMIN' || (report.status as string) === 'REJECTED') && <><XCircle size={13} /> {isAdmin ? 'رد نهایی ادمین' : 'رد نهایی شده توسط ادمین'}</>}
                  </span>
                </div>

                {/* 2. HERO FEATURED REPORT MESSAGE (FOCAL POINT OF THE CARD) */}
                <div className="bg-amber-50/90 border-r-4 border-r-amber-500 border border-amber-200/80 p-3.5 rounded-2xl space-y-1 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-900 font-black text-xs flex items-center gap-1.5">
                      <ShieldAlert size={15} className="text-amber-600 shrink-0" />
                      <span>متن و علت گزارش خرابی خریدار:</span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Calendar size={11} /> {new Date(report.created_at).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                  <p className="text-slate-900 font-black text-sm sm:text-base leading-relaxed pr-1">
                    "{report.reason}"
                  </p>
                </div>

                {/* 3. COMPACT DATA VAULT & ACTIONS BAR */}
                <div className="bg-slate-900 text-white rounded-2xl p-3.5 space-y-2 border border-slate-800 shadow-inner text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    {/* Compact Inline Account Credentials */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs">
                      {primaryId && (
                        <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                          <Mail size={12} className="text-blue-400 shrink-0" />
                          <span className="text-slate-400 font-sans font-semibold">{primaryId.key}:</span>
                          <span className="text-blue-300 font-bold select-all dir-ltr">{primaryId.value}</span>
                          <button onClick={() => copyToClipboard(primaryId.value)} className="text-slate-500 hover:text-white" title="کپی ایمیل"><Copy size={11} /></button>
                        </div>
                      )}

                      {hasPrivate && Object.entries(privFields).map(([k, v]) => {
                        const strVal = String(v);
                        return (
                          <div key={k} className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-amber-900/40">
                            <span className="text-amber-400/80 font-sans font-semibold">{k}:</span>
                            <span className="text-amber-200 font-bold dir-ltr">{isShowPrivate ? strVal : '••••••••'}</span>
                            <button onClick={() => toggleShowPrivateFields(report.id)} className="text-slate-400 hover:text-white">
                              {isShowPrivate ? <EyeOff size={11} /> : <Eye size={11} />}
                            </button>
                            {isShowPrivate && (
                              <button onClick={() => copyToClipboard(strVal)} className="text-amber-400 hover:text-amber-200"><Copy size={11} /></button>
                            )}
                          </div>
                        );
                      })}

                      {hasPublic && Object.entries(pubFields).map(([k, v]) => {
                        if (primaryId && k === primaryId.key) return null;
                        return (
                          <div key={k} className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                            <span className="text-slate-400 font-sans font-semibold">{k}:</span>
                            <span className="text-slate-200 select-all font-bold dir-ltr">{String(v)}</span>
                            <button onClick={() => copyToClipboard(String(v))} className="text-slate-500 hover:text-white"><Copy size={11} /></button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tools & Action Buttons Inline */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                      <a
                        href={fullPublicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors shadow-sm"
                        title="مشاهده آنلاین صفحه تحویل"
                      >
                        <Globe size={12} />
                        <span>لینک پشتیبان</span>
                        <ExternalLink size={10} />
                      </a>
                      <button
                        onClick={copyAllCredentials}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 border border-slate-700 transition-colors"
                        title="کپی متنی کل مشخصات اکانت"
                      >
                        <FileText size={11} />
                        <span>کپی کل</span>
                      </button>

                      {isPendingForUser ? (
                        <>
                          <button
                            onClick={() => handleRejectReport(report.id)}
                            disabled={processingReportId === report.id}
                            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-900/50 font-extrabold rounded-lg text-xs transition-colors disabled:opacity-50 active:scale-95"
                          >
                            {isAdmin ? (report.status === 'REJECTED_BY_SUPPLIER' ? 'تایید رد' : 'رد') : 'رد'}
                          </button>
                          <button
                            onClick={() => handleApproveReport(report.id)}
                            disabled={processingReportId === report.id}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg text-xs transition-colors flex items-center gap-1 shadow-sm disabled:opacity-50 active:scale-95"
                          >
                            {processingReportId === report.id ? (
                              <RefreshCw className="animate-spin" size={12} />
                            ) : (
                              <><CheckCircle2 size={12} /> {isAdmin ? 'تایید ادمین' : 'تایید و تعویض'}</>
                            )}
                          </button>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                          {(report.status as string) === 'APPROVED_BY_ADMIN' && 'تایید ادمین'}
                          {(report.status as string) === 'RESOLVED_BY_SUPPLIER' && 'تایید تامین‌کننده'}
                          {((report.status as string) === 'APPROVED' || (report.status as string) === 'RESOLVED') && 'تایید شد'}
                          {(report.status as string) === 'REJECTED_BY_SUPPLIER' && 'رد تامین‌کننده'}
                          {((report.status as string) === 'REJECTED_BY_ADMIN' || (report.status as string) === 'REJECTED') && 'رد نهایی'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* User Details Modal for Admin */}
      {selectedUserModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-100">
            <div className="px-6 py-4.5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <User size={18} className="text-blue-600" />
                <span>اطلاعات تماس خریدار</span>
              </h3>
              <button
                onClick={() => setSelectedUserModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-semibold text-slate-700">
              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">نام کاربری:</span>
                  <span className="font-extrabold text-slate-900 text-sm">{selectedUserModal.username}</span>
                </div>
                {selectedUserModal.shop_name && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold">نام فروشگاه:</span>
                    <span className="font-extrabold text-blue-700">{selectedUserModal.shop_name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <span className="text-slate-400 font-bold flex items-center gap-1.5"><Phone size={14} /> شماره همراه:</span>
                  {selectedUserModal.phone_number ? (
                    <a href={`tel:${selectedUserModal.phone_number}`} className="font-mono font-bold text-blue-600 hover:underline text-sm dir-ltr">{selectedUserModal.phone_number}</a>
                  ) : (
                    <span className="text-slate-400">ثبت نشده</span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedUserModal(null)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs transition-colors"
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
