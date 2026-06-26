import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import { fa } from '../../presentation/locales/fa';
import { en } from '../../presentation/locales/en';
import { ar } from '../../presentation/locales/ar';

// تابع کمکی برای تنظیم دقیق و ایمن تگ html
const updateHtmlAttributes = (detectedLng: string) => {
  if (!detectedLng) return;
  
  // استخراج زبان اصلی (برای جلوگیری از باگ‌هایی مثل en-US)
  const primaryLng = detectedLng.split('-')[0];
  
  // تعیین جهت صفحه
  const dir = primaryLng === 'en' ? 'ltr' : 'rtl';
  
  document.documentElement.dir = dir;
  document.documentElement.lang = primaryLng;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  // ۱. قرار دادن شنونده قبل از init برای جا نماندن از اولین لود
  .on('languageChanged', (lng: string) => {
    updateHtmlAttributes(lng);
  })
  .init({
    resources: {
      fa: { translation: fa },
      en: { translation: en },
      ar: { translation: ar },
    },
    // ۲. زبان پیش‌فرض (Fallback) روی فارسی تنظیم شد
    fallbackLng: 'fa',
    interpolation: {
      escapeValue: false, 
    },
    detection: {
      // ۳. کلید اصلی برای پیش‌فرض بودن فارسی: فقط لوکال استوریج را چک کن. 
      // با حذف 'navigator'، زبان مرورگر کلاً نادیده گرفته می‌شود.
      order: ['localStorage'],
      caches: ['localStorage'], 
    }
  });

// ۴. اطمینان از اعمال تغییرات در همان میلی‌ثانیه اول
updateHtmlAttributes(i18n.language || 'fa');

export default i18n;