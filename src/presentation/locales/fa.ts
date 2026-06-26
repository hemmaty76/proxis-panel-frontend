export const fa = {
    header: {
        logoutSucces: 'با موفقیت خارج شدید',
        connectedToServer: 'اتصال به سرور برقرار است',
        welcome: 'خوش آمدید',
        logOut: 'خروج از حساب'
    },
    passwordChangeForm: {
        errors: {
            fillAllFields: 'لطفاً تمام فیلدها را پر کنید',
            minLength: 'رمز عبور جدید باید حداقل ۸ کاراکتر باشد',
            passwordMismatch: 'رمز عبور جدید و تکرار آن یکسان نیستند',
            generalError: 'رمز عبور فعلی اشتباه است یا خطایی رخ داده'
        },
        success: 'رمز عبور شما با موفقیت تغییر یافت',
        labels: {
            currentPassword: 'رمز عبور فعلی',
            newPassword: 'رمز عبور جدید',
            confirmPassword: 'تکرار رمز عبور جدید'
        },
        placeholders: {
            minLength: 'حداقل ۸ کاراکتر',
        },
        buttons: {
            changing: 'در حال تغییر...',
            changePassword: 'تغییر رمز عبور'
        }
    },
    sidebar: {
        title: 'مدیریت پروکسی',
        menu: {
            dashboard: 'داشبورد و آمار',
            createConfig: 'ساخت کانفیگ',
            manageUsers: 'مدیریت کاربران',
            manageShop: 'مدیریت مغازه',
            panelSettings: 'تنظیمات پنل'
        }
    },
    usersManagement: {
        currency: 'تومان',
        unlimited: 'نامحدود',
        gigabyte: 'گیگابایت',
        emptyDate: '—',
        messages: {
            fetchError: 'خطا در دریافت لیست کانفیگ‌ها',
            copySuccess: 'لینک اشتراک با موفقیت کپی شد',
            copyError: 'مرورگر از کپی خودکار پشتیبانی نمی‌کند',
        },
        header: {
            title: 'مدیریت کاربران',
            subtitle: 'لیست کانفیگ‌های فروخته شده، وضعیت حجم و لینک‌های اشتراک'
        },
        table: {
            username: 'نام کاربری',
            serviceVolume: 'حجم سرویس',
            createdAt: 'تاریخ ایجاد',
            expireDate: 'انقضا',
            sellPrice: 'قیمت فروش',
            actions: 'عملیات اشتراک',
            noConfigs: 'هیچ کانفیگی برای نمایش وجود ندارد.',
            volumeShort: 'حجم',
            createdShort: 'ایجاد',
            expireShort: 'انقضا',
        },
        tooltips: {
            showQr: 'نمایش بارکد (QR Code)',
            copyLink: 'کپی لینک اشتراک'
        },
        pagination: {
            page: 'صفحه',
            of: 'از'
        },
        qrModal: {
            title: 'بارکد اتصال',
            guide: 'برای اتصال، این بارکد را در اپلیکیشن اسکن کنید.'
        }
    },
    login: {
        messages: {
            emptyFields: 'لطفاً نام کاربری و رمز عبور را وارد کنید',
            success: 'ورود با موفقیت انجام شد',
            invalidCredentials: 'نام کاربری یا رمز عبور اشتباه است.',
        },
        header: {
            title: 'ورود به پنل',
            subtitle: 'جهت دسترسی به داشبورد، مشخصات خود را وارد کنید'
        },
        labels: {
            username: 'نام کاربری',
            password: 'رمز عبور'
        },
        placeholders: {
            username: 'admin',
            password: '••••••••'
        },
        buttons: {
            authenticating: 'در حال احراز هویت...',
            login: 'ورود به حساب'
        }
    },
    forceChangePassword: {
        messages: {
            logoutSuccess: 'خروج با موفقیت انجام شد'
        },
        header: {
            title: 'تغییر اجباری رمز عبور',
            description: 'به دلایل امنیتی، تا زمانی که رمز عبور خود را تغییر ندهید امکان دسترسی به سیستم را نخواهید داشت.'
        },
        buttons: {
            logout: 'خروج از حساب کاربری'
        }
    },
    dashboardHome: {
        currency: 'تومان',
        messages: {
            fetchError: 'ارتباط با سرور برقرار نشد. لطفاً صفحه را رفرش کنید.',
            invalidPrice: 'لطفاً یک قیمت معتبر وارد کنید',
            priceUpdateSuccess: 'قیمت فروش با موفقیت در سیستم ثبت شد',
            priceUpdateError: 'خطا در بروزرسانی قیمت. لطفاً دوباره تلاش کنید'
        },
        stats: {
            totalSales: 'تعداد کل فروش',
            activeServices: 'سرویس‌های فعال',
            totalCost: 'کل هزینه',
            totalRevenue: 'کل درآمد',
            netProfit: 'سود خالص'
        },
        header: {
            title: 'داشبورد',
            subtitle: 'نمای کلی عملکرد، وضعیت حساب و تنظیمات فروش'
        },
        sections: {
            generalStats: 'آمار کلی',
            profileAndOps: 'پروفایل و عملیات'
        },
        profile: {
            title: 'پروفایل و مالی',
            subtitle: 'اطلاعات حساب کاربری شما',
            active: 'فعال',
            username: 'نام کاربری',
            phone: 'شماره تماس',
            createdAt: 'تاریخ ایجاد حساب',
            balance: 'موجودی',
            creditLimit: 'سقف اعتبار',
            buyPricePerGb: 'قیمت خرید هر گیگ',
            notAvailable: 'اطلاعات پروفایل در دسترس نیست.'
        },
        sellPrice: {
            title: 'تغییر قیمت فروش',
            currentPrice: 'قیمت فعلی:',
            emptyPrice: '—',
            newPriceLabel: 'قیمت فروش جدید (تومان / گیگ)',
            placeholder: 'مثلاً ۳,۵۰۰',
            submitting: 'در حال ثبت...',
            submitBtn: 'ثبت قیمت جدید'
        },
        password: {
            title: 'تغییر رمز عبور',
            subtitle: 'برای امنیت بیشتر، رمز عبور قوی انتخاب کنید'
        }
    },
    createConfig: {
        currency: 'تومان',
        unlimited: 'نامحدود',
        gigabyte: 'گیگابایت',
        days: 'روز',
        messages: {
            fetchError: 'خطا در دریافت اطلاعات. لطفا صفحه را رفرش کنید.',
            purchaseSuccess: 'کانفیگ با موفقیت ساخته شد',
            purchaseErrorFallback: 'خطا در عملیات خرید. دوباره تلاش کنید.',
            copySuccess: 'لینک اشتراک کپی شد',
            copyError: 'مرورگر از کپی خودکار پشتیبانی نمی‌کند',
        },
        header: {
            title: 'ساخت کانفیگ جدید',
            subtitle: 'پکیج مورد نظر خود را انتخاب کرده و کانفیگ را تحویل بگیرید',
            currentBalance: 'موجودی فعلی شما'
        },
        package: {
            notFound: 'پکیجی یافت نشد',
            volume: 'حجم:',
            validity: 'اعتبار:',
            costPrice: 'قیمت تمام‌شده (خرید):',
            sellPrice: 'قیمت فروش به مشتری:'
        },
        recentPurchases: {
            title: 'خریدهای اخیر شما در این سیستم',
            deductedAmount: 'مبلغ کسر شده:',
            copied: 'کپی شد',
            copyLink: 'کپی لینک'
        },
        modal: {
            title: 'تایید خرید پکیج',
            confirmPromptStart: 'آیا از خرید پکیج «',
            confirmPromptEnd: '» اطمینان دارید؟',
            amountToDeduct: 'مبلغ کسر از کیف پول:',
            balanceAfter: 'موجودی پس از خرید:',
            guideStart: 'طبق تنظیمات شما، قیمت پیشنهادی برای فروش این کانفیگ به مشتری',
            guideMiddle: 'می‌باشد. سود شما از این فروش',
            guideEnd: 'خواهد بود.',
            cancel: 'انصراف',
            payAndReceive: 'پرداخت و دریافت'
        },
        qrModal: {
            title: 'بارکد اتصال'
        }
    },
    shopsManagement: {
        currency: 'تومان',
        messages: {
            fetchError: 'خطا در دریافت لیست مغازه‌داران',
            invalidAmount: 'لطفاً مبلغ معتبری وارد کنید',
            chargeSuccess: 'کیف پول با موفقیت شارژ شد',
            chargeError: 'خطا در شارژ کیف پول',
            descUpdateSuccess: 'توضیحات با موفقیت بروزرسانی شد',
            descUpdateError: 'خطا در ثبت توضیحات',
            resetPasswordConfirmStart: 'آیا از ریست کردن رمز عبور مغازه «',
            resetPasswordConfirmEnd: '» مطمئن هستید؟',
            resetPasswordSuccess: 'رمز عبور با موفقیت ریست شد.',
            resetPasswordError: 'خطا در ریست رمز عبور',
            statsError: 'خطا در دریافت آمار',
            createShopSuccess: 'مغازه جدید با موفقیت ایجاد شد',
            createShopError: 'خطا در ایجاد مغازه'
        },
        header: {
            title: 'مدیریت مغازه‌داران',
            subtitle: 'کنترل کامل روی فروشندگان، شارژ حساب و آمار فروش',
            searchPlaceholder: 'جستجوی شماره موبایل...',
            createShopBtn: 'ایجاد مغازه جدید'
        },
        table: {
            userAndPhone: 'نام کاربری / شماره',
            adminDesc: 'توضیحات ادمین',
            balanceAndCredit: 'موجودی (اعتبار)',
            prices: 'قیمت (خرید / فروش)',
            actions: 'عملیات',
            loading: 'در حال دریافت اطلاعات...',
            empty: 'هیچ مغازه‌ای یافت نشد.',
            emptyDash: '—',
            limit: 'سقف:',
            sell: 'فروش:',
            active: 'فعال'
        },
        mobileCard: {
            currentBalance: 'موجودی فعلی',
            creditLimit: 'سقف اعتبار',
            buyPerGb: 'خرید هر گیگ',
            defaultSell: 'فروش پیش‌فرض'
        },
        tooltips: {
            chargeWallet: 'شارژ کیف پول',
            salesStats: 'آمار فروش',
            editDesc: 'ویرایش توضیحات',
            resetPassword: 'ریست رمز عبور'
        },
        actionsShort: {
            charge: 'شارژ',
            stats: 'آمار',
            edit: 'ویرایش',
            reset: 'ریست رمز'
        },
        pagination: {
            page: 'صفحه',
            of: 'از'
        },
        modals: {
            charge: {
                title: 'شارژ کیف پول',
                amountLabel: 'مبلغ شارژ (تومان)',
                amountPlaceholder: 'مثلاً ۵۰۰,۰۰۰',
                descLabel: 'توضیحات',
                descDefault: 'شارژ دستی کیف پول توسط ادمین',
                submit: 'تایید و شارژ'
            },
            editDesc: {
                title: 'توضیحات ادمین',
                placeholder: 'آدرس، نشانی یا یادداشت...',
                submit: 'ذخیره تغییرات'
            },
            stats: {
                title: 'آمار مغازه',
                salesCount: 'تعداد فروش',
                activeServices: 'سرویس‌های فعال',
                netProfit: 'سود خالص (فروشنده):',
                totalIncome: 'درآمد کل (خرید از شما):'
            },
            create: {
                title: 'ایجاد مغازه جدید',
                username: 'نام کاربری (انگلیسی)',
                phone: 'شماره تماس',
                password: 'رمز عبور',
                creditLimit: 'سقف اعتبار (تومان)',
                buyPrice: 'قیمت خرید (هر گیگ / تومان)',
                sellPrice: 'قیمت فروش پیش‌فرض (تومان)',
                adminDesc: 'توضیحات ادمین (آدرس/یادداشت)',
                submit: 'ثبت مغازه فروشنده'
            }
        }
    },
    systemSettings: {
        messages: {
            fetchError: 'خطا در دریافت تنظیمات سیستم',
            saveSuccess: 'تنظیمات سیستم با موفقیت بروزرسانی شد',
            saveError: 'خطا در ذخیره تنظیمات'
        },
        header: {
            title: 'تنظیمات سیستم',
            subtitle: 'مدیریت پیام‌های داشبورد و نسخه سیستم'
        },
        general: {
            title: 'تنظیمات عمومی',
            versionLabel: 'نسخه داشبورد (Version)'
        },
        notice: {
            title: 'اطلاعیه سراسری کاربران',
            messageLabel: 'متن پیام (خالی بگذارید تا مخفی شود)',
            messagePlaceholder: 'مثلاً: سرور در تاریخ فلان به مدت یک ساعت قطعی خواهد داشت...',
            typeLabel: 'نوع پیام (رنگ و آیکون)',
            types: {
                info: 'اطلاعیه عادی (آبی)',
                success: 'موفقیت / خبر خوب (سبز)',
                warning: 'هشدار (زرد)',
                error: 'اخطار مهم / قطعی (قرمز)'
            }
        },
        preview: {
            title: 'پیش‌نمایش در داشبورد کاربران',
            empty: 'پیامی برای نمایش وجود ندارد'
        },
        buttons: {
            save: 'ذخیره تنظیمات'
        }
    }

}