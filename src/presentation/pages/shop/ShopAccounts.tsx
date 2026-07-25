import { useEffect, useState, useRef } from 'react';

import toast from 'react-hot-toast';
import {
  ShoppingBag,
  CheckCircle2,
  ExternalLink,
  Clock,
  ShieldAlert,
  X,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  UserCheck,
  Wallet,
  Store,
  Phone,
  ShieldCheck

} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  getShopAccountProducts,
  getShopAccountProductOffers,
  buyShopAccount,
  getShopAccountPurchases,
  reportShopAccount,
  getProfile,
  type ShopAccountProduct,
  type BulkProductOffer,
  type ShopAccountPurchaseResult
} from '../../../data/services/shopService';

export default function ShopAccounts() {
  useTranslation();
  const [products, setProducts] = useState<ShopAccountProduct[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'store' | 'purchases'>('store');


  const [percentShop, setPercentShop] = useState<number>(0);

  // Purchases Pagination & Search State
  const [purchasesPage, setPurchasesPage] = useState(1);
  const [purchasesPageSize] = useState(10);
  const [purchasesTotalPages, setPurchasesTotalPages] = useState(1);
  const [purchasesTotalCount, setPurchasesTotalCount] = useState(0);
  const [phoneSearch, setPhoneSearch] = useState('');
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  // Step 2: Offers Panel State (Selected Product)
  const [drawerProduct, setDrawerProduct] = useState<ShopAccountProduct | null>(null);
  const [offers, setOffers] = useState<BulkProductOffer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);

  // Step 3: Customer Checkout Modal State (Selected Offer)
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [checkoutOffer, setCheckoutOffer] = useState<BulkProductOffer | null>(null);
  const [customerPhone, setCustomerPhone] = useState('');
  const [customSellPrice, setCustomSellPrice] = useState<number | null>(null);
  const [buying, setBuying] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<ShopAccountPurchaseResult | null>(null);

  // Report Modal State
  const [reportingPurchaseId, setReportingPurchaseId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);

  const fetchPurchasesData = async (page: number = 1, phone: string = '') => {
    setLoadingPurchases(true);
    try {
      const purchRes = await getShopAccountPurchases(page, purchasesPageSize, phone);
      setPurchases(purchRes.items);
      setPurchasesTotalCount(purchRes.total_count);
      setPurchasesTotalPages(purchRes.total_pages);
      setPurchasesPage(purchRes.current_page);
    } catch (error: any) {
      toast.error('خطا در دریافت تاریخچه خریدهای اکانت');
    } finally {
      setLoadingPurchases(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodsData, purchRes, profileData] = await Promise.all([
        getShopAccountProducts(),
        getShopAccountPurchases(1, purchasesPageSize, phoneSearch).catch(() => ({ items: [], total_count: 0, total_pages: 1, current_page: 1, page_size: 10 })),
        getProfile().catch(() => null)
      ]);
      setProducts(prodsData);
      setPurchases(purchRes.items);
      setPurchasesTotalCount(purchRes.total_count);
      setPurchasesTotalPages(purchRes.total_pages);
      setPurchasesPage(purchRes.current_page);
      if (profileData && profileData.balance !== undefined) {
        setBalance(profileData.balance);
      }
      if (profileData && profileData.percent_shop !== undefined) {
        setPercentShop(profileData.percent_shop);
      }
    } catch (error: any) {
      toast.error('خطا در دریافت اطلاعات فروشگاه اکانت‌ها');
    } finally {
      setLoading(false);
    }
  };

  const isInitialMount = useRef(true);

  useEffect(() => {
    fetchData();
  }, []);

  // Debounce phone search to prevent sending API requests on every keystroke
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      fetchPurchasesData(1, phoneSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [phoneSearch]);

  const handlePhoneSearchChange = (val: string) => {
    setPhoneSearch(val);
  };

  const handleClearPhoneSearch = () => {
    setPhoneSearch('');
    fetchPurchasesData(1, '');
  };



  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= purchasesTotalPages) {
      fetchPurchasesData(newPage, phoneSearch);
    }
  };

  const openOffersDrawer = async (product: ShopAccountProduct) => {
    setDrawerProduct(product);
    setCheckoutOffer(null);
    setCheckoutStep(1);
    setCustomerPhone('');
    setCustomSellPrice(null);
    setPurchaseResult(null);
    setOffers([]);
    setLoadingOffers(true);

    try {
      if (!product.is_unique) {
        const productOffers = await getShopAccountProductOffers(product.id);
        setOffers(productOffers);
      }
    } catch (error: any) {
      toast.error('خطا در دریافت ارائه‌دهندگان این محصول');
    } finally {
      setLoadingOffers(false);
    }
  };

  const openCustomerCheckout = (offer: BulkProductOffer) => {
    setCheckoutOffer(offer);
    setCheckoutStep(2);
    setPurchaseResult(null);
    if (customSellPrice === null || checkoutOffer?.id !== offer.id) {
      const defaultSell = Math.round(offer.price * (1 + (percentShop || 0) / 100));
      setCustomSellPrice(defaultSell);
    }
  };

  const goToInvoiceStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone || !customerPhone.trim()) {
      toast.error('ثبت شماره همراه مشتری برای خرید اکانت الزامی است.');
      return;
    }
    setCheckoutStep(3);
  };

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!drawerProduct || !checkoutOffer) return;

    if (!customerPhone || !customerPhone.trim()) {
      toast.error('ثبت شماره همراه مشتری برای خرید اکانت الزامی است.');
      setCheckoutStep(2);
      return;
    }

    setBuying(true);
    try {
      const res = await buyShopAccount({
        product_id: drawerProduct.id,
        offer_id: checkoutOffer.id,
        customer_phone: customerPhone.trim(),
        custom_sell_price: customSellPrice !== null ? customSellPrice : undefined
      });
      setPurchaseResult(res);
      toast.success('خرید اکانت با موفقیت انجام شد!');
      
      // Update balance
      if (balance !== null) {
        setBalance(prev => prev !== null ? prev - checkoutOffer.price : prev);
      }
      
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'خطا در خرید اکانت. موجودی حساب یا انبار را بررسی کنید.');
    } finally {
      setBuying(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingPurchaseId || !reportReason.trim()) return;

    setReporting(true);
    try {
      await reportShopAccount({
        purchase_id: reportingPurchaseId,
        reason: reportReason.trim()
      });
      toast.success('گزارش خرابی اکانت با موفقیت ثبت شد و به تامین‌کننده ارجاع داده شد.');
      setReportingPurchaseId(null);
      setReportReason('');
      fetchPurchasesData(purchasesPage, phoneSearch);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'خطا در ثبت گزارش خرابی اکانت');
    } finally {
      setReporting(false);
    }
  };



  const getImageUrl = (url?: string, key?: string) => {
    if (url && url.trim() !== '') {
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/')) return url;
      return `/${url}`;
    }
    if (key === 'apple_id') return '/images/apst.webp';
    if (key === 'apple_id_icloud') return '/images/apcl.webp';
    return '/images/apst.webp';
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto" dir="rtl">
      {/* Header with Balance Widget */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            فروشگاه اکانت‌های آماده و لایسنس
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            خرید آنی اکانت‌های یکتا، عمومی و لایسنس‌ها برای مشتریان خود
          </p>
        </div>

        <div className="bg-white px-4 sm:px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4 shrink-0 justify-between sm:justify-start">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
            <Wallet size={20} strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-400 mb-0.5">موجودی کیف پول شما</p>
            <p className="text-base sm:text-lg font-black text-slate-800 tabular-nums">
              {balance !== null ? `${balance.toLocaleString('fa-IR')} تومان` : '...'}
            </p>
          </div>
        </div>
      </header>

      {/* Centered Tabs Menu */}
      <div className="flex bg-slate-100 p-1.5 rounded-xl w-full sm:max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('store')}
          className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'store' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Store size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>خرید اکانت</span>
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'purchases' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span>اکانت‌های خریداری شده ({purchasesTotalCount})</span>
        </button>
      </div>

      {/* Tab 1: Store Products */}
      {activeTab === 'store' && (
        <div className="space-y-6">
          {products.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 sm:p-12 text-center shadow-sm">
              <ShoppingBag className="h-10 w-10 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm sm:text-base font-bold text-slate-800">هیچ محصول اکانتی یافت نشد</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">در حال حاضر محصولی در این دسته‌بندی فعال نیست.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(prod => {

                const imgPath = getImageUrl(prod.image_url, prod.frontend_key);

                return (
                  <div
                    key={prod.id}
                    className="bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-500/60 shadow-sm hover:shadow-xl transition-all duration-200 group flex flex-col justify-between overflow-hidden relative"
                  >
                    <div>
                      {/* Top Image Header with Stock Badge overlay */}
                      <div className="h-44 sm:h-48 w-full bg-white overflow-hidden relative flex items-center justify-center p-5 border-b border-slate-100/80">

                        {/* Stock Badge Overlay */}
                        <div className="absolute top-3.5 right-3.5 z-10">
                          {prod.stock > 0 ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-white font-black text-[11px] rounded-full shadow-md shadow-emerald-500/20 backdrop-blur-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                              <span>موجودی: {prod.stock.toLocaleString('fa-IR')} عدد</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-300 font-bold text-[11px] rounded-full shadow-md backdrop-blur-md">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                              <span>اتمام موجودی</span>
                            </span>
                          )}
                        </div>

                        {/* Product Image */}
                        <img
                          src={imgPath}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/apst.webp';
                          }}
                        />

                      </div>

                      {/* Content Details */}
                      <div className="p-5 space-y-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {prod.name}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 min-h-[36px] leading-relaxed font-medium">
                          {prod.description || 'اکانت کاملاً معتبر به همراه پشتیبانی و گارانتی اختصاصی تحویل فوری'}
                        </p>
                      </div>
                    </div>

                    {/* Card Action Button */}
                    <div className="p-5 pt-2">
                      <button
                        onClick={() => openOffersDrawer(prod)}
                        disabled={prod.stock === 0}
                        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md hover:shadow-lg disabled:shadow-none transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <span>{prod.stock > 0 ? 'مشاهده ارائه‌دهندگان و خرید' : 'ناموجود'}</span>
                        {prod.stock > 0 && <ChevronLeft size={18} className="group-hover/btn:-translate-x-1 transition-transform" />}
                      </button>
                    </div>
                  </div>

                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Purchases History (Table View with Phone Search & Pagination) */}
      {activeTab === 'purchases' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-6 space-y-4">
          {/* Header Controls: Search by Customer Phone */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">خریدهای انجام شده شما</h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">مجموع خریدهای ثبت‌شده: {purchasesTotalCount} اکانت</p>
            </div>

            {/* Phone Search Input */}
            <div className="relative w-full sm:w-80">
              <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={phoneSearch}
                onChange={(e) => handlePhoneSearchChange(e.target.value)}
                placeholder="جستجو بر اساس شماره خریدار / مشتری..."
                dir="ltr"
                className="w-full pr-10 pl-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {phoneSearch && (
                <button
                  onClick={handleClearPhoneSearch}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  <X size={14} />
                </button>

              )}
            </div>
          </div>

          {/* Responsive Dual View: Table on Desktop, Cards on Mobile */}
          {loadingPurchases ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs font-bold text-slate-500">در حال بروزرسانی اطلاعات خریدهای شما...</p>
            </div>
          ) : purchases.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">هیچ خریدی یافت نشد.</p>
              {phoneSearch && (
                <p className="text-xs text-slate-400">هیچ خریدی با شماره {phoneSearch} ثبت نشده است.</p>
              )}
            </div>
          ) : (
            <>
              {/* Desktop View: Table (hidden md:block) */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100/80 text-slate-700 font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">محصول</th>
                      <th className="py-3 px-4">شماره خریدار / مشتری</th>
                      <th className="py-3 px-4">مبلغ خرید (کیف‌پول)</th>
                      <th className="py-3 px-4">فروش به مشتری</th>
                      <th className="py-3 px-4">سود شما</th>
                      <th className="py-3 px-4">تاریخ خرید</th>
                      <th className="py-3 px-4">تاریخ مهلت گارانتی</th>
                      <th className="py-3 px-4 text-center">صفحه تحویل مشتری</th>
                      <th className="py-3 px-4 text-center">گزارش خرابی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {purchases.map(p => {
                      const dateStr = p.purchased_at || p.created_at;
                      const createdTime = dateStr ? new Date(dateStr).getTime() : Date.now();
                      const warrantyDays = p.warranty_days || 2;
                      const warrantyExpiresAt = createdTime + warrantyDays * 86400000;
                      const expDateObj = new Date(warrantyExpiresAt);
                      const formattedExpDate = expDateObj.toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric'
                      });
                      const now = new Date().getTime();
                      const isWarrantyActive = now <= warrantyExpiresAt;

                      const rawLink = p.public_url || `/account/${p.purchase_id || p.id}`;
                      const fullPublicUrl = rawLink.startsWith('http') ? rawLink : `${window.location.origin}${rawLink.startsWith('/') ? '' : '/'}${rawLink}`;

                      return (
                        <tr key={`dt-${p.id || p.purchase_id}`} className="hover:bg-slate-50/80 transition-colors">
                          {/* Product Name */}
                          <td className="py-3.5 px-4 font-black text-slate-900">
                            {p.product_name || 'خرید اکانت'}
                          </td>

                          {/* Customer Phone */}
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700" dir="ltr">
                            {p.customer_phone ? p.customer_phone : 'ثبت‌نشده'}
                          </td>

                          {/* Price Paid (Buy Price) */}
                          <td className="py-3.5 px-4 font-bold text-blue-700">
                            {(p.shop_buy_price || p.price_paid || 0).toLocaleString('fa-IR')} تومان
                          </td>

                          {/* Customer Sell Price */}
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {(p.shop_sell_price || p.shop_buy_price || p.price_paid || 0).toLocaleString('fa-IR')} تومان
                          </td>

                          {/* Profit */}
                          <td className="py-3.5 px-4 font-black text-emerald-600">
                            {(p.profit !== undefined ? p.profit : ((p.shop_sell_price || p.shop_buy_price || 0) - (p.shop_buy_price || 0))).toLocaleString('fa-IR')} تومان
                          </td>

                          {/* Purchased Date */}
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            {dateStr ? new Date(dateStr).toLocaleDateString('fa-IR') : 'نامشخص'}
                          </td>

                          {/* Warranty Expiration Date Badge */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isWarrantyActive ? (
                              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 font-black px-2.5 py-1 rounded-lg border border-emerald-200/80 shadow-2xs">
                                <ShieldCheck size={13} className="text-emerald-600" />
                                <span>مهلت تا {formattedExpDate}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-lg border border-slate-200/60">
                                <span>پایان مهلت در {formattedExpDate}</span>
                              </span>
                            )}
                          </td>


                          {/* Delivery URL Button */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <a
                              href={fullPublicUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors border border-indigo-200/60"
                            >
                              <ExternalLink size={13} />
                              <span>باز کردن تحویل</span>
                            </a>
                          </td>

                          {/* Report Action / Status */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            {p.report && (p.report.status === 'PENDING' || p.report.status === 'REJECTED_BY_SUPPLIER') ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200" title={`علت گزارش قبلی: ${p.report.reason || ''}`}>
                                <Clock size={12} className="text-amber-500 animate-pulse" />
                                <span>در حال بررسی</span>
                              </span>
                            ) : isWarrantyActive ? (
                              <button
                                onClick={() => {
                                  setReportingPurchaseId(p.id || p.purchase_id);
                                  setReportReason('');
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-lg border border-rose-200 transition-colors shadow-sm"
                                title={p.report ? "ثبت گزارش جدید" : "ثبت گزارش خرابی"}
                              >
                                <ShieldAlert size={13} />
                                <span>{p.report ? "گزارش مجدد" : "گزارش خرابی"}</span>
                              </button>
                            ) : (
                              <span className="text-[11px] font-bold text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60 inline-block">
                                پایان مهلت گزارش
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile View: Cards List (block md:hidden) */}
              <div className="block md:hidden space-y-3">
                {purchases.map(p => {
                  const dateStr = p.purchased_at || p.created_at;
                  const createdTime = dateStr ? new Date(dateStr).getTime() : Date.now();
                  const warrantyDays = p.warranty_days || 2;
                  const warrantyExpiresAt = createdTime + warrantyDays * 86400000;
                  const expDateObj = new Date(warrantyExpiresAt);
                  const formattedExpDate = expDateObj.toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric'
                  });
                  const now = new Date().getTime();
                  const isWarrantyActive = now <= warrantyExpiresAt;

                  const rawLink = p.public_url || `/account/${p.purchase_id || p.id}`;
                  const fullPublicUrl = rawLink.startsWith('http') ? rawLink : `${window.location.origin}${rawLink.startsWith('/') ? '' : '/'}${rawLink}`;

                  return (
                    <div key={`mob-${p.id || p.purchase_id}`} className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-sm">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-black text-slate-900 text-sm">{p.product_name || 'خرید اکانت'}</h4>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs mt-1">
                            <span className="font-bold text-blue-700">خرید: {(p.shop_buy_price || p.price_paid || 0).toLocaleString('fa-IR')}</span>
                            <span className="text-slate-400">|</span>
                            <span className="font-bold text-slate-700">فروش: {(p.shop_sell_price || p.shop_buy_price || 0).toLocaleString('fa-IR')}</span>
                            <span className="text-slate-400">|</span>
                            <span className="font-black text-emerald-600">سود: {(p.profit !== undefined ? p.profit : ((p.shop_sell_price || p.shop_buy_price || 0) - (p.shop_buy_price || 0))).toLocaleString('fa-IR')} تومان</span>
                          </div>
                        </div>

                        {isWarrantyActive ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 font-black px-2 py-0.5 rounded-md border border-emerald-200/80 shrink-0">
                            🛡️ مهلت تا {formattedExpDate}
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-200/70 text-slate-500 font-bold px-2 py-0.5 rounded-md shrink-0">
                            پایان مهلت در {formattedExpDate}
                          </span>
                        )}
                      </div>


                      <div className="flex items-center justify-between text-xs text-slate-600 font-medium pt-2 border-t border-slate-200/60">
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span>{dateStr ? new Date(dateStr).toLocaleDateString('fa-IR') : 'نامشخص'}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono font-bold text-slate-700" dir="ltr">
                          <Phone size={12} className="text-slate-400" />
                          <span>{p.customer_phone || 'بدون شماره'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={fullPublicUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 shadow-sm"
                        >
                          <ExternalLink size={13} />
                          <span>صفحه تحویل به مشتری</span>
                        </a>

                        {p.report && (p.report.status === 'PENDING' || p.report.status === 'REJECTED_BY_SUPPLIER') ? (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200 flex items-center gap-1 shrink-0">
                            <Clock size={12} className="text-amber-500 animate-pulse" />
                            <span>در حال بررسی</span>
                          </span>
                        ) : isWarrantyActive ? (
                          <button
                            onClick={() => {
                              setReportingPurchaseId(p.id || p.purchase_id);
                              setReportReason('');
                            }}
                            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl border border-rose-200 transition-colors flex items-center gap-1 shrink-0"
                            title={p.report ? "ثبت گزارش جدید" : "ثبت گزارش خرابی"}
                          >
                            <ShieldAlert size={13} />
                            <span>{p.report ? "گزارش مجدد" : "گزارش"}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-400 bg-slate-200/50 px-2.5 py-1 rounded-xl text-center shrink-0">
                            پایان مهلت گزارش
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </>
          )}


          {/* Pagination Controls */}
          {purchasesTotalPages > 1 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500">
                صفحه {purchasesPage} از {purchasesTotalPages} (کل: {purchasesTotalCount} خرید)
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(purchasesPage - 1)}
                  disabled={purchasesPage === 1 || loadingPurchases}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl font-bold text-xs flex items-center gap-1 text-slate-700 transition-colors"
                >
                  <ChevronRight size={15} />
                  <span>صفحه قبلی</span>
                </button>

                <button
                  onClick={() => handlePageChange(purchasesPage + 1)}
                  disabled={purchasesPage >= purchasesTotalPages || loadingPurchases}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl font-bold text-xs flex items-center gap-1 text-slate-700 transition-colors"
                >
                  <span>صفحه بعدی</span>
                  <ChevronLeft size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Unified 3-Step Purchase Modal (Single Backdrop UX) */}
      {drawerProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs" dir="rtl">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header with Step indicator */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                {checkoutStep > 1 && !purchaseResult ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (checkoutStep === 3) setCheckoutStep(2);
                      else if (checkoutStep === 2) {
                        setCheckoutStep(1);
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl flex items-center gap-1 text-xs font-bold transition-colors"
                    title="بازگشت به مرحله قبل"
                  >
                    <ChevronRight size={18} />
                    <span className="hidden sm:inline">بازگشت</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerProduct(null);
                      setCheckoutOffer(null);
                      setCheckoutStep(1);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl"
                  >
                    <X size={20} />
                  </button>
                )}
                
                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                    <span>{drawerProduct.name}</span>
                    {!purchaseResult && (
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md font-bold">
                        {checkoutStep === 1 && 'گام ۱: انتخاب آفر'}
                        {checkoutStep === 2 && 'گام ۲: شماره مشتری'}
                        {checkoutStep === 3 && 'گام ۳: فاکتور و تایید'}
                      </span>
                    )}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                    {purchaseResult
                      ? 'خرید با موفقیت انجام شد'
                      : checkoutStep === 1
                      ? 'انتخاب آفر و تامین‌کننده محصول'
                      : checkoutStep === 2
                      ? 'ثبت شماره همراه مشتری برای ارسال پیامک'
                      : 'بررسی فاکتور، قیمت فروش و پرداخت نهایی'}
                  </p>
                </div>
              </div>

              {/* 3-Step Progress Indicator */}
              {!purchaseResult && (
                <div className="flex items-center gap-1.5 shrink-0" title={`مرحله ${checkoutStep} از ۳`}>
                  <span className={`w-2.5 h-2.5 rounded-full transition-all ${checkoutStep === 1 ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-emerald-500'}`}></span>
                  <span className={`w-3.5 h-0.5 ${checkoutStep >= 2 ? 'bg-emerald-400' : 'bg-slate-200'}`}></span>
                  <span className={`w-2.5 h-2.5 rounded-full transition-all ${checkoutStep === 2 ? 'bg-blue-600 ring-4 ring-blue-100' : checkoutStep > 2 ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <span className={`w-3.5 h-0.5 ${checkoutStep >= 3 ? 'bg-emerald-400' : 'bg-slate-200'}`}></span>
                  <span className={`w-2.5 h-2.5 rounded-full transition-all ${checkoutStep === 3 ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300'}`}></span>
                </div>
              )}
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
              {/* STEP 1: Offer Selection */}
              {checkoutStep === 1 && (
                <>
                  {/* Product Info Summary */}
                  <div className="flex items-center gap-3 sm:gap-4 bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-100">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-2 shrink-0">
                      <img
                        src={getImageUrl(drawerProduct.image_url, drawerProduct.frontend_key)}
                        alt={drawerProduct.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/images/apst.webp';
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm sm:text-base">{drawerProduct.name}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{drawerProduct.description || 'بدون توضیحات عمومی'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2 mb-1">
                      <PackageCheck className="text-blue-600" size={18} />
                      <span>لیست ارائه‌دهندگان و توضیحات کامل بسته‌ها</span>
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                      آفر مدنظر خود را انتخاب کنید تا وارد مرحله ثبت اطلاعات مشتری شوید:
                    </p>
                  </div>

                  {loadingOffers ? (
                    <div className="py-12 text-center">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-xs font-bold text-slate-500">در حال دریافت لیست ارائه‌دهندگان...</p>
                    </div>
                  ) : offers.length === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-2">
                      <p className="text-sm font-black text-amber-900">در حال حاضر ارائه‌ای برای این محصول فعال نیست.</p>
                      <p className="text-xs text-amber-700">به محض ثبت ارائه توسط تامین‌کنندگان، لیست در این بخش قرار می‌گیرد.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5 sm:space-y-4">
                      {offers.map(offer => (
                        <div
                          key={offer.id}
                          className="bg-white border border-slate-200 hover:border-blue-500 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
                            <div>
                              <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md mb-1 inline-block">
                                تامین‌کننده: {offer.supplier_name || offer.supplier_username || 'تامین‌کننده معتبر'}
                              </span>
                              <h4 className="font-black text-slate-900 text-sm sm:text-base">
                                {offer.title || 'ارائه عمومی استاندارد'}
                              </h4>
                            </div>

                            <div className="text-right sm:text-left shrink-0">
                              <span className="text-base font-black text-blue-700 block">
                                {offer.price.toLocaleString('fa-IR')} تومان
                              </span>
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1 border border-emerald-100">
                                🛡️ {offer.warranty_days || 2} روز گارانتی تعویض
                              </span>
                            </div>
                          </div>

                          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                            <span className="text-[10px] font-black text-slate-400 block">توضیحات و شرایط ارائه تامین‌کننده:</span>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">
                              {offer.description || 'توضیحات اختصاصی ثبت نشده است. این اکانت شامل گارانتی کامل تعویض در صورت بروز مشکل می‌باشد.'}
                            </p>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => openCustomerCheckout(offer)}
                              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                            >
                              <UserCheck size={16} />
                              <span>انتخاب این آفر و ادامه</span>
                              <ChevronLeft size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: Customer Phone Input */}
              {checkoutStep === 2 && checkoutOffer && !purchaseResult && (
                <form onSubmit={goToInvoiceStep} className="space-y-5">
                  {/* Selected Offer Summary Header */}
                  <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-500">محصول:</span>
                      <span className="font-black text-slate-900">{drawerProduct.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-500">آفر انتخاب‌شده:</span>
                      <span className="font-bold text-slate-800">{checkoutOffer.title || 'ارائه عمومی'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-500">تامین‌کننده:</span>
                      <span className="font-bold text-slate-800">{checkoutOffer.supplier_name || checkoutOffer.supplier_username}</span>
                    </div>
                  </div>

                  {/* Customer Phone Input (Mandatory) */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <label className="block text-xs font-black text-slate-800">
                      شماره همراه مشتری / خریدار <span className="text-rose-500">*</span> <span className="text-[10px] text-rose-600 font-semibold">(اجباری)</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="مثال: 09123456789"
                      dir="ltr"
                      autoFocus
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-3 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                    <p className="text-[11px] text-blue-700 font-bold leading-relaxed flex items-center gap-1.5 pt-1">
                      <span>📱</span>
                      <span>لینک تحویل اکانت پس از پرداخت، با نام و برند فروشگاه شما به شماره مشتری پیامک خواهد شد.</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutStep(1);
                      }}
                      className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1"
                    >
                      <ChevronRight size={16} />
                      <span>تغییر آفر</span>
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md flex items-center gap-1.5"
                    >
                      <span>ادامه و مشاهده فاکتور</span>
                      <ChevronLeft size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Invoice Preview, Custom Price & Final Payment */}
              {checkoutStep === 3 && checkoutOffer && (
                <>
                  {!purchaseResult ? (
                    <form onSubmit={handleBuy} className="space-y-4">
                      {/* Invoice Summary Badge */}
                      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-3.5 sm:p-4 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-500">محصول:</span>
                          <span className="font-black text-slate-900">{drawerProduct.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-500">آفر:</span>
                          <span className="font-bold text-slate-800">{checkoutOffer.title || 'ارائه عمومی'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-500">تامین‌کننده:</span>
                          <span className="font-bold text-slate-800">{checkoutOffer.supplier_name || checkoutOffer.supplier_username}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-500">شماره مشتری:</span>
                          <span className="font-mono font-bold text-slate-800" dir="ltr">{customerPhone}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-500">مهلت گارانتی تعویض:</span>
                          <span className="font-bold text-emerald-700">🛡️ {checkoutOffer.warranty_days || 2} روز گارانتی</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-blue-200/60">
                          <span className="font-bold text-slate-700">مبلغ کسر از کیف پول (خرید شما):</span>
                          <span className="font-black text-blue-700 text-sm tabular-nums">{checkoutOffer.price.toLocaleString('fa-IR')} تومان</span>
                        </div>
                        {balance !== null && (
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-slate-500">موجودی کیف پول پس از خرید:</span>
                            <span className={`font-bold tabular-nums ${balance - checkoutOffer.price < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {(balance - checkoutOffer.price).toLocaleString('fa-IR')} تومان
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Custom Sell Price Input */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            مبلغ فروش به مشتری (تومان)
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const defaultSell = Math.round(checkoutOffer.price * (1 + (percentShop || 0) / 100));
                              setCustomSellPrice(defaultSell);
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition-colors"
                            title="تنظیم بر اساس درصد پیش‌فرض پروفایل"
                          >
                            بازنشانی به قیمت تنظیمات ({percentShop}٪)
                          </button>
                        </div>
                        <input
                          type="number"
                          min="0"
                          value={customSellPrice !== null ? customSellPrice : ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setCustomSellPrice(null);
                            } else {
                              const num = parseInt(val, 10);
                              if (!isNaN(num) && num >= 0) {
                                setCustomSellPrice(num);
                              }
                            }
                          }}
                          placeholder={`پیش‌فرض تنظیمات: ${Math.round(checkoutOffer.price * (1 + (percentShop || 0) / 100)).toLocaleString('fa-IR')} تومان`}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <p className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-between font-medium">
                          <span>قیمت بر اساس تنظیمات ({percentShop}٪ سود):</span>
                          <span className="font-bold text-indigo-700">{Math.round(checkoutOffer.price * (1 + (percentShop || 0) / 100)).toLocaleString('fa-IR')} تومان</span>
                        </p>
                      </div>

                      {/* Profit Info Box */}
                      {(() => {
                        const defaultSellPrice = Math.round(checkoutOffer.price * (1 + (percentShop || 0) / 100));
                        const effectiveSellPrice = customSellPrice !== null ? customSellPrice : defaultSellPrice;
                        const estimatedProfit = effectiveSellPrice - checkoutOffer.price;

                        return (
                          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 text-xs space-y-1.5">
                            <div className="flex justify-between items-center text-slate-700">
                              <span>مبلغ پرداختی شما (کسر از کیف‌پول):</span>
                              <span className="font-bold">{checkoutOffer.price.toLocaleString('fa-IR')} تومان</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-700">
                              <span>مبلغ دریافتی از مشتری:</span>
                              <span className="font-bold text-blue-700">
                                {effectiveSellPrice.toLocaleString('fa-IR')} تومان
                              </span>
                            </div>
                            <div className="flex justify-between items-center pt-1.5 border-t border-emerald-200/80 font-black text-emerald-800">
                              <span>سود خالص برآوردی شما:</span>
                              <span className="text-sm">
                                {estimatedProfit.toLocaleString('fa-IR')} تومان
                              </span>
                            </div>
                          </div>
                        );
                      })()}

                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep(2)}
                          className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1"
                        >
                          <ChevronRight size={16} />
                          <span>مرحله قبل</span>
                        </button>
                        <button
                          type="submit"
                          disabled={buying}
                          className="px-6 py-2.5 text-xs font-black text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl shadow-md flex items-center gap-1.5"
                        >
                          <ShoppingBag size={15} />
                          <span>{buying ? 'در حال پرداخت...' : 'تایید و پرداخت آنی'}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="py-4 space-y-4 text-center">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-in zoom-in duration-300" />
                      <h4 className="font-black text-slate-900 text-base">خرید با موفقیت انجام شد!</h4>
                      <p className="text-xs text-slate-500 font-bold">لینک اختصاصی زیر جهت تحویل به مشتری به شماره {customerPhone} پیامک شد و در اختیار شما قرار گرفت:</p>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-xs text-blue-600 select-all truncate" dir="ltr">
                        {window.location.origin}/account/{purchaseResult.purchase_id}
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row gap-2">
                        <a
                          href={`${window.location.origin}/account/${purchaseResult.purchase_id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-sm"
                        >
                          <ExternalLink size={14} />
                          <span>صفحه تحویل به مشتری</span>
                        </a>
                        <button
                          onClick={() => {
                            setCheckoutOffer(null);
                            setDrawerProduct(null);
                          }}
                          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                        >
                          بستن
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportingPurchaseId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-5 sm:p-6 space-y-4">
            <h3 className="font-black text-slate-900 text-base">ثبت گزارش خرابی اکانت</h3>
            <p className="text-xs text-slate-500 font-medium">توضیح دهید اکانت چه مشکلی دارد تا تامین‌کننده آن را بررسی و تعویض کند:</p>

            <form onSubmit={handleReport} className="space-y-4">
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                required
                placeholder="علت خرابی (مثلاً: رمز اشتباه است یا وارد نمی‌شود...)"
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setReportingPurchaseId(null)} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl">انصراف</button>
                <button type="submit" disabled={reporting} className="px-5 py-2 text-xs font-black text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-xl shadow-md">
                  {reporting ? 'در حال ثبت...' : 'ارسال گزارش خرابی'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
