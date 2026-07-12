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
        title: 'مدیریت',
        menu: {
            dashboard: 'داشبورد و آمار',
            createConfig: 'ساخت کانفیگ',
            manageUsers: 'مدیریت کاربران',
            manageShop: 'مدیریت مغازه',
            manageServices: 'مدیریت خدمات و پکیج‌ها',
            customPrices: 'تنظیمات قیمت فروش',
            panelSettings: 'تنظیمات پنل',
            manageServers: 'مدیریت سرورها',
            shopSettings: 'تنظیمات پشتیبانی',
            myShops: 'مغازه‌های من',
            newTestConfig: 'کانفیگ تست جدید',
            testConfigs: 'کانفیگ‌های تست',
            transactions: 'تراکنش‌های واریزی'
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
        chargeModal: {
            "title": "شارژ آنلاین حساب",
            "amountLabel": "مبلغ شارژ (تومان)",
            "notice": "پس از پرداخت موفق، مبلغ بلافاصله به موجودی حساب شما افزوده خواهد شد.",
            "vpnWarning": "توجه: لطفاً قبل از ورود به درگاه پرداخت، فیلترشکن (VPN) خود را خاموش کنید تا در فرآیند پرداخت خطایی رخ ندهد.",
            "submitBtn": "پرداخت با زرین‌پال"
        },
        paymentResult: {
            "successTitle": "افزایش موجودی موفقیت‌آمیز بود",
            "successDesc": "تراکنش شما با موفقیت تایید شد. مبلغ پرداختی بلافاصله به موجودی حساب شما اضافه گردید.",
            "failedTitle": "پرداخت ناموفق یا انصراف از پرداخت",
            "failedDesc": "عملیات پرداخت با خطا مواجه شد و یا توسط شما لغو گردید. در صورت کسر وجه از حساب، مبلغ ظرف ۷۲ ساعت توسط بانک عودت داده خواهد شد.",
            "closeBtn": "متوجه شدم"
        },
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
            netProfit: 'سود خالص',
            upstreamDebt: 'کل بدهی',
            adminGrossRevenue: 'کل درآمد ناخالص ادمین',
            adminNetProfit: 'سود خالص ادمین'
        },
        header: {
            title: 'داشبورد',
            subtitle: 'نمای کلی عملکرد، وضعیت حساب و تنظیمات فروش'
        },
        sections: {
            generalStats: 'آمار کلی',
            profileAndOps: 'پروفایل و عملیات'
        },
        adminActions: {
            servicesTitle: 'مدیریت پکیج‌ها و خدمات',
            servicesSubtitle: 'پیکربندی نوع سرویس‌ها، مدل‌های فروش و تعریف بسته‌های حجمی/زمانی جدید',
            servicesDesc: 'از این بخش می‌توانید انواع سرویس‌ها (VIP، نرمال)، دسته‌بندی‌های فروش و قیمت پایه خرید هر دسته را برای مغازه‌داران تعریف کنید.',
            servicesBtn: 'برو به مدیریت خدمات و پکیج‌ها'
        },
        profile: {
            title: 'پروفایل و مالی',
            chargeBtn: 'شارژ حساب',
            subtitle: 'اطلاعات حساب کاربری شما',
            active: 'فعال',
            username: 'نام کاربری',
            phone: 'شماره تماس',
            createdAt: 'تاریخ ایجاد حساب',
            balance: 'موجودی',
            creditLimit: 'سقف اعتبار',
            discountPercent: 'درصد تخفیف پیش‌فرض',
            notAvailable: 'اطلاعات پروفایل در دسترس نیست.',
            roles: {
                admin: 'مدیر سیستم',
                supplier: 'تامین‌کننده سیستم',
                visitor: 'ویزیتور',
                shopkeeper: 'نماینده فروش (مغازه‌دار)'
            }
        },
        sellPrice: {
            title: 'تنظیم درصد سود مغازه (جهت حسابداری و فروش)',
            subtitle: 'تعیین درصد سود پیش‌فرض برای محاسبه قیمت فروش پکیج‌ها',
            desc: 'این درصد سود صرفاً برای اهداف حسابداری مغازه‌دار و تعیین قیمت پیش‌فرض فروش پکیج‌ها به مشتری نهایی است. قیمت نهایی فروش بر اساس فرمول: قیمت خرید + (قیمت خرید × درصد سود / ۱۰۰) محاسبه شده و در فاکتور ثبت می‌شود. همچنین در زمان خرید، امکان وارد کردن دستی قیمت نهایی فروش همچنان وجود دارد.',
            label: 'درصد سود پیش‌فرض مغازه‌دار',
            saving: 'در حال ذخیره...',
            saveBtn: 'به‌روزرسانی درصد سود'
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
            sellPrice: 'قیمت فروش به مشتری:',
            noExpiration: 'بدون تاریخ انقضا'
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
        },
        labels: {
            allPackages: 'همه پکیج‌ها',
            serviceWithTypeName: 'سرویس {{typeName}}',
            customSellPrice: 'قیمت فروش به مشتری (تومان)',
            customSellPricePlaceholder: 'مثال: ۵۰,۰۰۰',
            customSellPriceHelper: 'قیمت فروش پیشنهادی: {{price}}'
        }
    },
    shopsManagement: {
        currency: 'تومان',
        tabs: {
            suppliers: 'تامین‌کنندگان',
            visitors: 'ویزیتورها'
        },
        buttons: {
            addSupplier: 'افزودن تامین‌کننده جدید',
            addVisitor: 'افزودن ویزیتور جدید'
        },
        roles: {
            shop: 'مغازه‌دار (SHOP)',
            supplier: 'تامین‌کننده (SUPPLIER)',
            visitor: 'ویزیتور (VISITOR)'
        },
        labels: {
            userRole: 'نقش کاربر'
        },
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
            createShopError: 'خطا در ایجاد مغازه',
            updateSuccess: 'مشخصات مغازه با موفقیت ویرایش شد.',
            updateError: 'خطا در ثبت تغییرات مغازه.'
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
            active: 'فعال',
            discountPercent: 'تخفیف',
            testConfigsCount: 'تعداد کانفیگ تست ساخته‌شده'
        },
        mobileCard: {
            currentBalance: 'موجودی فعلی',
            creditLimit: 'سقف اعتبار',
            buyPerGb: 'خرید هر گیگ',
            defaultSell: 'فروش پیش‌فرض',
            discountPercent: 'میزان تخفیف'
        },
        tooltips: {
            chargeWallet: 'شارژ کیف پول',
            salesStats: 'آمار فروش',
            editDesc: 'ویرایش توضیحات',
            resetPassword: 'ریست رمز عبور',
            editShop: 'ویرایش مشخصات مغازه'
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
            edit: {
                title: 'ویرایش تنظیمات',
                creditLimit: 'سقف اعتبار (تومان)',
                discountPercent: 'درصد تخفیف مغازه (٪)',
                isActive: 'حساب کاربری فعال باشد',
                adminDesc: 'توضیحات ادمین',
                adminDescPlaceholder: 'توضیحات مربوط به مغازه‌دار...',
                submit: 'ثبت تغییرات'
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
                submit: 'ثبت مغازه فروشنده',
                discountPercent: 'درصد تخفیف مغازه‌دار (٪)'
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
    },
    servicesManagement: {
        messages: {
            fetchError: 'خطا در بارگذاری داده‌های خدمات.',
            createTypeSuccess: 'نوع کانفیگ با موفقیت ساخته شد.',
            createTypeError: 'خطا در ثبت نوع کانفیگ.',
            deleteTypeConfirm: 'آیا از حذف این نوع سرویس مطمئن هستید؟ با این کار تمام دسته‌بندی‌های متصل نیز حذف می‌شوند.',
            deleteTypeSuccess: 'نوع سرویس با موفقیت حذف شد.',
            deleteTypeError: 'خطا در حذف نوع سرویس. احتمالاً به علت وجود وابستگی‌های فعال است.',
            updateTypeSuccess: 'نوع کانفیگ با موفقیت ویرایش شد.',
            updateTypeError: 'خطا در ویرایش نوع کانفیگ.',
            createCategorySuccess: 'دسته کانفیگ جدید با موفقیت ایجاد شد.',
            createCategoryError: 'خطا در ثبت دسته کانفیگ.',
            updateCategorySuccess: 'دسته کانفیگ با موفقیت ویرایش شد.',
            updateCategoryError: 'خطا در ویرایش دسته کانفیگ.',
            deleteCategoryConfirm: 'آیا از حذف این دسته کانفیگ مطمئن هستید؟ تمام پکیج‌ها و تنظیمات قیمت سفارشی متصل حذف می‌شوند.',
            deleteCategorySuccess: 'دسته سرویس با موفقیت حذف شد.',
            deleteCategoryError: 'خطا در حذف دسته سرویس.',
            createPackageSuccess: 'پکیج جدید با موفقیت ایجاد شد.',
            createPackageError: 'خطا در ثبت پکیج جدید.',
            deletePackageConfirm: 'آیا از حذف این پکیج قالب مطمئن هستید؟',
            deletePackageSuccess: 'پکیج با موفقیت حذف شد.',
            deletePackageError: 'خطا در حذف پکیج.',
            updatePackageSuccess: 'وضعیت پکیج با موفقیت بروزرسانی شد.',
            updatePackageError: 'خطا در تغییر وضعیت پکیج.'
        },
        labels: {
            sellTypes: {
                volumeTime: 'حجمی زمانی (محدود)',
                unlimitedVolume: 'حجم نامحدود (زمانی)',
                unlimitedTime: 'زمان نامحدود (حجمی)'
            },
            title: 'مدیریت سرویس‌ها و پکیج‌ها',
            subtitle: 'مدیریت انواع کانفیگ (VIP / معمولی)، دسته‌بندی‌های فروش و قالب‌های پکیج آماده',
            tabs: {
                packages: 'پکیج‌های خرید',
                categories: 'دسته‌بندی و تعیین فروش',
                types: 'نوع سرویس‌ها'
            },
            forms: {
                createTypeTitle: 'ساخت نوع سرویس جدید',
                typeName: 'نام نوع سرویس',
                typeDesc: 'توضیحات',
                typeDescPlaceholder: 'توضیحات اختیاری...',
                typeKey: 'کلید نوع سرویس',
                typeKeyPlaceholder: 'مثال: 1',
                typeServer: 'سرور متصل',
                typeServerPlaceholder: 'انتخاب سرور...',
                submitType: 'ثبت نوع سرویس',
                createCategoryTitle: 'ایجاد دسته فروش جدید',
                selectType: 'انتخاب نوع سرویس',
                sellType: 'مدل فروش و حسابداری',
                categoryName: 'نام نمایشی دسته',
                adminCost: 'هزینه ادمین به سرور اصلی (هر واحد - تومان)',
                shopPrice: 'قیمت فروش پایه به مغازه‌دار (هر واحد - تومان)',
                submitCategory: 'ثبت دسته فروش',
                createPackageTitle: 'ساخت پکیج جدید',
                selectCategory: 'انتخاب دسته سرویس',
                packageName: 'نام پکیج قالب',
                volumeGb: 'حجم (گیگابایت)',
                durationDays: 'مدت اعتبار (روز)',
                submitPackage: 'ثبت پکیج قالب',
                editPackageTitle: 'ویرایش پکیج قالب',
                savePackage: 'ذخیره تغییرات'
            },
            tables: {
                typeName: 'نام نوع سرویس',
                description: 'توضیحات',
                typeKey: 'کلید',
                serverName: 'سرور متصل',
                actions: 'عملیات',
                noTypes: 'هیچ نوع سرویسی ثبت نشده است.',
                sellType: 'مدل فروش',
                categoryName: 'نام نمایشی',
                adminCost: 'هزینه ادمین',
                shopPrice: 'قیمت پایه مغازه',
                noCategories: 'هیچ دسته‌بندی فروشی ثبت نشده است.',
                noPackages: 'هیچ قالب پکیجی طراحی نشده است.',
                volume: 'حجم',
                duration: 'اعتبار',
                unlimited: 'نامحدود',
                noExpiration: 'بدون تاریخ انقضا',
                days: 'روز',
                gigabytes: 'گیگ',
                deactivate: 'غیرفعال‌سازی فروش',
                activate: 'فعال‌سازی فروش',
                activeStatus: 'فعال',
                inactiveStatus: 'غیرفعال',
                edit: 'ویرایش'
            }
        }
    },
    shopCustomPrices: {
        messages: {
            fetchError: 'خطا در بارگذاری قیمت‌های سفارشی شما.',
            invalidPrice: 'لطفاً قیمت معتبری وارد کنید.',
            saveSuccess: 'قیمت فروش دسته با موفقیت به‌روزرسانی شد.',
            saveError: 'خطا در ثبت قیمت جدید.'
        },
        labels: {
            title: 'تنظیمات قیمت فروش به مشتری نهایی',
            subtitle: 'در این بخش می‌توانید قیمت نهایی فروش هر واحد سرویس (به ازای هر گیگابایت یا روز) را برای مشتریان خود مشخص کنید.',
            guideTitle: 'راهنمای محاسبه قیمت فروش نهایی:',
            guide1: 'در مدل‌های حجمی زمانی و زمان نامحدود، قیمت نهایی فاکتور فروش مشتری شما برابر با (قیمت فروش هر واحد × حجم گیگابایت پکیج) خواهد بود.',
            guide2: 'در مدل‌های حجم نامحدود، ملاک قیمت‌گذاری معمولاً بر اساس روز است اما فرمول فروش نهایی از مقداردهی فاکتور پیروی می‌کند.',
            noPrices: 'هیچ تنظیمات قیمتی برای شما ثبت نشده است. ادمین باید دسته‌بندی‌های فروش فعال بسازد.',
            cardTitle: 'تعرفه فروش به مشتری نهایی',
            unitPrice: 'قیمت هر واحد (گیگابایت/روز)',
            changeBtn: 'تغییر تعرفه',
            cancelBtn: 'لغو',
            saveTitle: 'ذخیره قیمت',
            defaultServiceType: 'سرویس'
        }
    },
    adminFinancialReports: {
        title: 'گزارش‌های مالی ادمین',
        subtitle: 'مشاهده سود خالص، درآمد کل و تراکنش‌های سیستم',
        stats: {
            totalSales: 'مجموع فروش کل',
            netProfit: 'سود خالص ادمین',
            pendingCredit: 'اعتبار در انتظار تسویه'
        }
    },
    common: {
        "currency": "تومان",
        "submitting": "در حال ثبت...",
        "cancel": "انصراف"
    },
    settlements: {
        roles: {
            visitor: 'ویزیتور',
            supplier: 'تامین‌کننده'
        },
        labels: {
            userFilter: 'نام کاربر:',
            allUsers: 'همه کاربران'
        },
        "messages": {
            "fetchError": "دریافت اطلاعات با خطا مواجه شد.",
            "invalidAmount": "مبلغ معتبر نیست.",
            "success": "پرداختی با موفقیت ثبت شد.",
            "submitError": "خطا در ثبت پرداختی.",
            "selectSupplier": "لطفاً تامین‌کننده را انتخاب کنید."
        },
        "header": {
            "title": "تسویه‌حساب آپ‌استریم",
            "subtitle": "مدیریت بدهی‌ها و پرداختی‌ها به ارائه‌دهنده سرور اصلی"
        },
        "buttons": {
            "newSettlement": "ثبت پرداختی جدید"
        },
        "filter": {
            "serverLabel": "سرور:",
            "allServers": "همه سرورها"
        },
        "stats": {
            "totalDebt": "کل بدهی تولید شده",
            "totalPaid": "کل مبلغ تسویه شده",
            "remainingDebt": "مانده بدهی فعلی",
            "serverDebt": "بدهی تولید شده سرور",
            "serverPaid": "مبلغ تسویه شده سرور",
            "serverRemainingDebt": "مانده بدهی سرور"
        },
        "history": {
            "title": "تاریخچه پرداختی‌ها",
            "empty": "هیچ پرداختی تا کنون ثبت نشده است."
        },
        "table": {
            "date": "تاریخ و ساعت",
            "amount": "مبلغ پرداختی",
            "trackingCode": "کد پیگیری / یادداشت",
            "supplierName": "نام تامین‌کننده",
            you: 'شما'
        },
        "modal": {
            "title": "ثبت پرداختی جدید",
            "amountLabel": "مبلغ پرداختی (تومان)",
            "trackingCodeLabel": "کد پیگیری یا یادداشت",
            "supplierLabel": "انتخاب تامین‌کننده",
            "selectSupplierPlaceholder": "-- انتخاب کنید --",
            "submitBtn": "ثبت مبلغ",
            selectUser: 'انتخاب تامین‌کننده / ویزیتور *',
            selectPlaceholder: '-- انتخاب کنید --'
        }
    },
    servers: {
        "header": {
            "title": "مدیریت سرورها/تامین‌کنندگان",
            "subtitle": "افزودن، ویرایش و مدیریت سرورهای مرزبان بالاسری"
        },
        "buttons": {
            "newServer": "افزودن سرور جدید"
        },
        "table": {
            "name": "نام تامین‌کننده",
            "url": "آدرس پنل مرزبان",
            "username": "نام کاربری",
            "type": "نوع پنل",
            "status": "وضعیت",
            "actions": "عملیات"
        },
        "status": {
            "active": "فعال",
            "inactive": "غیرفعال"
        },
        "types": {
            "marzban": "مرزبان (Marzban)",
            "pasargad": "پاسارگاد (Pasargad)"
        },
        "modal": {
            "createTitle": "ثبت سرور جدید",
            "editTitle": "ویرایش سرور",
            "nameLabel": "نام تامین‌کننده/سرور",
            "urlLabel": "آدرس پنل مرزبان",
            "subLabel": "آدرس ساب (sub)",
            "usernameLabel": "نام کاربری",
            "passwordLabel": "رمز عبور",
            "typeLabel": "نوع پنل سرور",
            "activeLabel": "سرور فعال برای خریدهای جدید",
            "activeWarning": "فعال‌سازی این سرور باعث غیرفعال شدن خودکار سرور فعال فعلی برای خریدهای جدید خواهد شد."
        },
        "messages": {
            "fetchError": "خطا در بارگذاری لیست سرورها.",
            "createSuccess": "سرور با موفقیت ثبت شد.",
            "createError": "خطا در ثبت سرور جدید.",
            "updateSuccess": "سرور با موفقیت بروزرسانی شد.",
            "updateError": "خطا در بروزرسانی سرور.",
            "deleteSuccess": "سرور با موفقیت حذف شد.",
            "deleteError": "خطا در حذف سرور.",
            "deleteBlocked": "امکان حذف این سرور وجود ندارد زیرا دارای کانفیگ‌های فعال است. لطفاً به جای حذف، وضعیت آن را غیرفعال کنید."
        }
    },
    usageModal: {
        "title": "جزئیات مصرف کانفیگ",
        "loadingUser": "در حال بارگذاری...",
        "refreshTooltip": "بروزرسانی",
        "fetchingInfo": "دریافت اطلاعات مصرف از سرور اصلی...",
        "status": {
            "title": "وضعیت سرویس",
            "active": "فعال (Active)",
            "onHold": "در انتظار اولین اتصال (On Hold)",
            "expired": "منقضی شده (Expired)",
            "disabled": "غیرفعال (Disabled)"
        },
        "traffic": {
            "title": "ترافیک مصرفی",
            "of": "از",
            "unlimited": "نامحدود",
            "used": "مصرف شده",
            "remaining": "باقی‌مانده"
        },
        "details": {
            "lifetime": "کل ترافیک مصرفی (Lifetime)",
            "createdAt": "تاریخ ایجاد کانفیگ",
            "duration": "مدت دوره (پس از اتصال)",
            "days": "روز",
            "expire": "تاریخ انقضا",
            "lastOnline": "آخرین اتصال به سرور",
            "lastSubUpdate": "آخرین بروزرسانی ساب"
        },
        "closeBtn": "بستن"
    },
    shopSettings: {
        messages: {
            fetchError: "خطا در بارگذاری اطلاعات فروشگاه.",
            saveSuccess: "اطلاعات پشتیبانی فروشگاه با موفقیت ذخیره شد.",
            saveError: "خطا در ذخیره اطلاعات فروشگاه."
        },
        labels: {
            title: "تنظیمات فروشگاه و پشتیبانی",
            subtitle: "اطلاعات زیر در لینک سابسکریپشن نمایش داده می‌شود و برای کانفیگ‌های جدید اعمال خواهد شد.",
            shopName: "نام فروشگاه",
            supportChannel: "آدرس کانال پشتیبانی (بله، تلگرام و...)",
            supportId: "آدرس آیدی پشتیبانی (بله، تلگرام و...)",
            supportPhone: "شماره تماس پشتیبانی"
        },
        placeholders: {
            shopName: "فروشگاه آنلاین من"
        },
        buttons: {
            saving: "در حال ذخیره...",
            save: "ذخیره تنظیمات"
        }
    },
    visitor: {
        dashboard: {
            title: 'پنل ویزیتور',
            subtitle: 'مدیریت مغازه‌های زیرمجموعه و پورسانت‌های دریافتی',
            searchPlaceholder: 'جستجوی مغازه...',
            addShopBtn: 'مغازه‌دار جدید',
            stats: {
                totalEarnings: 'کل درآمد پورسانت',
                totalPaid: 'مجموع تسویه‌ها',
                remainingBalance: 'طلب باقیمانده شما',
                totalSales: 'تعداد کل فروش',
                testConfigsCount: 'کانفیگ تست ساخته‌شده'
            },
            shopsList: {
                title: 'لیست مغازه‌داران شما',
                subtitle: 'مغازه‌های ثبت شده توسط شما که از خریدهای آن‌ها پورسانت دریافت می‌کنید.'
            },
            table: {
                userAndPhone: 'نام کاربری و تلفن',
                desc: 'توضیحات',
                balanceAndCredit: 'موجودی و سقف اعتبار',
                discountPercent: 'درصد تخفیف',
                actions: 'عملیات',
                loading: 'در حال بارگذاری اطلاعات...',
                empty: 'مغازه‌ای یافت نشد.',
                creditLimitLabel: 'سقف اعتبار: '
            },
            tooltips: {
                edit: 'ویرایش مغازه‌دار',
                resetPassword: 'تغییر رمز عبور به 123456'
            },
            modals: {
                edit: {
                    title: 'ویرایش مغازه‌دار',
                    creditLimit: 'سقف اعتبار (تومان)',
                    discountPercent: 'درصد تخفیف مغازه‌دار',
                    isActive: 'فعال بودن حساب مغازه',
                    desc: 'توضیحات',
                    descPlaceholder: 'توضیحات اختیاری...',
                    submit: 'ثبت تغییرات'
                },
                create: {
                    title: 'ثبت مغازه‌دار جدید',
                    username: 'نام کاربری',
                    phone: 'تلفن همراه',
                    password: 'رمز عبور',
                    submit: 'ثبت و ساخت اکانت'
                }
            },
            messages: {
                fetchError: 'خطا در دریافت اطلاعات داشبورد.',
                createSuccess: 'مغازه‌دار جدید با موفقیت ثبت شد.',
                createError: 'خطا در ثبت مغازه‌دار جدید.',
                updateSuccess: 'اطلاعات مغازه‌دار با موفقیت بروزرسانی شد.',
                updateError: 'خطا در بروزرسانی اطلاعات.',
                resetPasswordConfirm: 'آیا از تغییر رمز عبور کاربر {{username}} به "123456" اطمینان دارید؟',
                resetPasswordSuccess: 'رمز عبور مغازه‌دار به "123456" بازنشانی شد.',
                resetPasswordError: 'خطا در بازنشانی رمز عبور.'
            }
        },
        testConfig: {
            title: 'ایجاد کانفیگ تست رایگان',
            subtitle: 'ساخت اکانت‌های تست موقت برای بررسی سرعت و اتصال',
            rules: {
                title: 'قوانین اکانت تست ویزیتور:',
                rule1: 'حجم کل این اکانت‌ها برابر ۱ گیگابایت است.',
                rule2: 'مدت زمان فعال بودن اکانت‌ها حداکثر ۱۰ روز می‌باشد.',
                rule3: 'ساخت کانفیگ تست کاملاً رایگان است و هیچ هزینه‌ای برای مغازه‌دار یا شما ندارد.',
                rule4: 'این اکانت‌ها در لیست اصلی فاکتورها ثبت نمی‌شوند اما تعداد آن‌ها در اطلاعات شما شمارش می‌شود.'
            },
            form: {
                locationLabel: 'انتخاب نوع سرویس/لوکیشن',
                loadingLocations: 'در حال دریافت لوکیشن‌ها...',
                clientNameLabel: 'نام دلخواه برای تفکیک مشتری (انگلیسی)',
                clientNameHelper: 'نام کاربری نهایی شامل پیشوند ویزیتوری شما خواهد بود.',
                submitting: 'در حال ساخت اکانت در مرزبان...',
                submitBtn: 'ایجاد کانفیگ تست'
            },
            result: {
                successTitle: 'کانفیگ با موفقیت در سرور ایجاد شد!',
                usernameLabel: 'نام کاربری در سرور:',
                subLinkLabel: 'لینک اشتراک (Subscription URL):',
                copyBtn: 'کپی لینک'
            },
            messages: {
                fetchTypesError: 'خطا در دریافت لیست سرویس‌ها.',
                selectTypeRequired: 'لطفاً نوع سرویس را انتخاب کنید.',
                clientNameRequired: 'لطفاً نام مشتری را وارد کنید.',
                createSuccess: 'کانفیگ تست با موفقیت ایجاد شد!',
                createError: 'خطا در ایجاد کانفیگ تست.',
                copySuccess: 'لینک اشتراک کپی شد.'
            }
        },
        testConfigsList: {
            messages: {
                updateDescSuccess: 'توضیحات با موفقیت ویرایش شد.',
                updateDescError: 'خطا در ویرایش توضیحات.'
            },
            header: {
                title: 'کانفیگ‌های تست رایگان',
                subtitle: 'لیست کامل اکانت‌های تست موقت صادر شده توسط ویزیتورها و وضعیت آن‌ها'
            },
            buttons: {
                create: 'ساخت کانفیگ تست جدید'
            },
            loading: 'در حال دریافت لیست کانفیگ‌های تست...',
            empty: {
                title: 'هیچ کانفیگ تستی صادر نشده است',
                description: 'در صورت صادر شدن اکانت‌های تست توسط ویزیتورها، مشخصات و لینک‌های آن‌ها در این بخش نمایش داده خواهد شد.'
            },
            table: {
                username: 'نام کاربری',
                visitor: 'ویزیتور',
                server: 'سرور / لوکیشن',
                volume: 'حجم (اعتبار)',
                description: 'توضیحات (ارائه شده به)',
                createdAt: 'تاریخ ساخت',
                actions: 'عملیات',
                unknown: 'نامشخص',
                noDescription: 'بدون توضیح'
            },
            tooltips: {
                editDescription: 'مشاهده / ویرایش توضیحات',
                copyLink: 'کپی لینک اشتراک',
                showQr: 'نمایش بارکد (QR Code)'
            },
            pagination: {
                total: 'مجموع: {{count}} کانفیگ',
                pageOf: 'صفحه {{current}} از {{total}}'
            },
            modals: {
                qr: {
                    title: 'بارکد اتصال کانفیگ تست',
                    guide: 'برای اتصال، این بارکد را در اپلیکیشن کلاینت خود اسکن کنید.'
                },
                desc: {
                    title: 'توضیحات کانفیگ تست',
                    label: 'توضیحات (ارائه شده به):',
                    placeholder: 'توضیحات ارائه این کانفیگ تست...',
                    cancel: 'انصراف',
                    submit: 'ثبت تغییرات'
                }
            },
            volumeFormat: {
                zero: '۰ گیگابایت',
                gb: '{{gb}} گیگابایت'
            }
        }
    },
    transactions: {
        messages: {
            fetchError: 'خطا در بارگذاری تراکنش‌ها.'
        },
        status: {
            success: 'موفق',
            failed: 'ناموفق',
            pending: 'در انتظار'
        },
        gateway: {
            zarinpal: 'زرین‌پال',
            crypto: 'رمزارز',
            manual: 'دستی (ادمین)'
        },
        header: {
            title: 'تراکنش‌های واریزی',
            subtitle: 'مشاهده و فیلتر تمامی پرداخت‌ها، شارژهای دستی و تراکنش‌های بانکی',
            searchPlaceholder: 'فیلتر شماره تلفن...'
        },
        empty: {
            title: 'تراکنشی یافت نشد',
            withFilter: 'هیچ تراکنشی با این شماره تلفن ثبت نشده است.',
            noFilter: 'تاکنون هیچ تراکنشی در سیستم ثبت نگردیده است.',
            clearFilter: 'پاک کردن فیلتر'
        },
        table: {
            user: 'کاربر',
            phone: 'شماره تلفن',
            amount: 'مبلغ واریزی',
            balanceAfter: 'موجودی پس از تراکنش',
            gateway: 'درگاه پرداخت',
            reference: 'شناسه مرجع / Authority',
            status: 'وضعیت',
            description: 'توضیحات',
            date: 'تاریخ تراکنش',
            unknownUser: 'نامشخص',
            noPhone: 'بدون شماره',
            noDescription: 'بدون توضیح'
        },
        pagination: {
            total: 'تعداد کل: {{count}} تراکنش',
            prev: 'قبلی',
            next: 'بعدی',
            pageOf: '{{current}} از {{total}}'
        }
    }
}