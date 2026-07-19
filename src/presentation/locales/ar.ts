export const ar = {
    header: {
        logoutSucces: 'تم تسجيل الخروج بنجاح',
        connectedToServer: 'تم الاتصال بالخادم',
        welcome: 'مرحباً بك',
        logOut: 'تسجيل الخروج'
    },
    passwordChangeForm: {
        errors: {
            fillAllFields: 'يرجى ملء جميع الحقول',
            minLength: 'يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل',
            passwordMismatch: 'كلمة المرور الجديدة وتأكيدها غير متطابقين',
            generalError: 'كلمة المرور الحالية غير صحيحة أو حدث خطأ'
        },
        success: 'تم تغيير كلمة المرور بنجاح',
        labels: {
            currentPassword: 'كلمة المرور الحالية',
            newPassword: 'كلمة المرور الجديدة',
            confirmPassword: 'تأكيد كلمة المرور الجديدة'
        },
        placeholders: {
            minLength: '8 أحرف كحد أدنى',
        },
        buttons: {
            changing: 'جاري التغيير...',
            changePassword: 'تغيير كلمة المرور'
        }
    },
    sidebar: {
        title: 'إدارة الوكيل',
        menu: {
            dashboard: 'لوحة التحكم والإحصائيات',
            createConfig: 'إنشاء تكوین (كونفيج)',
            manageUsers: 'إدارة المستخدمين',
            manageShop: 'إدارة المتجر',
            manageServices: 'إدارة الخدمات والحزم',
            customPrices: 'إعدادات سعر البيع',
            panelSettings: 'إعدادات اللوحة',
            manageServers: 'إدارة الخوادم',
            shopSettings: 'إعدادات الدعم',
            myShops: 'متاجري',
            newTestConfig: 'تكوين اختبار جديد',
            testConfigs: 'تكوينات الاختبار',
            transactions: 'معاملات الإيداع',
            support: 'الدعم وتقديم الاقتراحات'
        }
    },
    usersManagement: {
        currency: 'تومان',
        unlimited: 'غير محدود',
        gigabyte: 'جيجابايت',
        emptyDate: '—',
        messages: {
            fetchError: 'خطأ في جلب قائمة التكوينات',
            copySuccess: 'تم نسخ رابط الاشتراك بنجاح',
            copyError: 'المتصفح لا يدعم النسخ التلقائي',
        },
        header: {
            title: 'إدارة المستخدمين',
            subtitle: 'قائمة التكوينات المباعة، حالة الحجم، وروابط الاشتراك'
        },
        table: {
            username: 'اسم المستخدم',
            serviceVolume: 'حجم الخدمة',
            createdAt: 'تاريخ الإنشاء',
            expireDate: 'تاريخ الانتهاء',
            sellPrice: 'سعر البيع',
            actions: 'عمليات الاشتراك',
            noConfigs: 'لا توجد تكوينات لعرضها.',
            volumeShort: 'الحجم',
            createdShort: 'إنشاء',
            expireShort: 'انتهاء',
        },
        tooltips: {
            showQr: 'عرض رمز الاستجابة السريعة (QR Code)',
            copyLink: 'نسخ رابط الاشتراك'
        },
        pagination: {
            page: 'صفحة',
            of: 'من'
        },
        qrModal: {
            title: 'رمز الاستجابة للاتصال',
            guide: 'للاتصال، قم بمسح هذا الرمز في التطبيق.'
        }
    },
    login: {
        messages: {
            emptyFields: 'يرجى إدخال اسم المستخدم وكلمة المرور',
            success: 'تم تسجيل الدخول بنجاح',
            invalidCredentials: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
        },
        header: {
            title: 'تسجيل الدخول إلى اللوحة',
            subtitle: 'للوصول إلى لوحة التحكم، أدخل بياناتك'
        },
        labels: {
            username: 'اسم المستخدم',
            password: 'كلمة المرور'
        },
        placeholders: {
            username: 'admin',
            password: '••••••••'
        },
        buttons: {
            authenticating: 'جاري المصادقة...',
            login: 'تسجيل الدخول'
        }
    },
    forceChangePassword: {
        messages: {
            logoutSuccess: 'تم تسجيل الخروج بنجاح'
        },
        header: {
            title: 'تغيير إلزامي لكلمة المرور',
            description: 'لأسباب أمنية، لن تتمكن من الوصول إلى النظام حتى تقوم بتغيير كلمة المرور الخاصة بك.'
        },
        buttons: {
            logout: 'تسجيل الخروج من الحساب'
        }
    },
    dashboardHome: {
        currency: 'تومان',
        chargeModal: {
            "title": "شحن الحساب عبر الإنترنت",
            "amountLabel": "مبلغ الشحن (تومان)",
            "notice": "بعد الدفع الناجح، سيتم إضافة المبلغ فوراً إلى رصيد حسابك.",
            "vpnWarning": "ملاحظة: يرجى إيقاف تشغيل الـ VPN قبل الدخول إلى بوابة الدفع لتجنب حدوث أي خطأ في عملية الدفع.",
            "submitBtn": "الدفع عبر زرين‌بال"
        },
        paymentResult: {
            "successTitle": "تم شحن الحساب بنجاح",
            "successDesc": "تم التحقق من معاملتك بنجاح. تم إضافة المبلغ إلى رصيدك فوراً.",
            "failedTitle": "فشلت عملية الدفع أو تم إلغاؤها",
            "failedDesc": "فشلت عملية الدفع أو تم إلغاؤها من قبلك. إذا تم خصم أي مبلغ، فسيتم استرداده خلال 72 ساعة.",
            "closeBtn": "حسناً"
        },
        messages: {
            fetchError: 'فشل الاتصال بالخادم. يرجى إعادة تحميل الصفحة.',
            invalidPrice: 'يرجى إدخال سعر صالح',
            priceUpdateSuccess: 'تم تحديث سعر البيع بنجاح في النظام',
            priceUpdateError: 'خطأ في تحديث السعر. يرجى المحاولة مرة أخرى'
        },
        stats: {
            totalSales: 'إجمالي المبيعات',
            activeServices: 'الخدمات النشطة',
            totalCost: 'إجمالي التكلفة',
            totalRevenue: 'إجمالي الإيرادات',
            netProfit: 'صافي الأرباح',
            upstreamDebt: 'إجمالي الديون',
            adminGrossRevenue: 'إجمالي إيرادات المسؤول',
            adminNetProfit: 'صافي أرباح المسؤول'
        },
        header: {
            title: 'لوحة التحكم',
            subtitle: 'نظرة عامة على الأداء وحالة الحساب وإعدادات المبيعات'
        },
        sections: {
            generalStats: 'الإحصائيات العامة',
            profileAndOps: 'الملف الشخصي والعمليات'
        },
        adminActions: {
            servicesTitle: 'إدارة الباقات والخدمات',
            servicesSubtitle: 'تكوين أنواع الخدمات ونماذج المبيعات وتحديد قوالب الحزم الجديدة',
            servicesDesc: 'من هذا القسم يمكنك تحديد أنواع الخدمات (VIP، عادي) وفئات المبيعات وأسعار الشراء الأساسية للتاجر.',
            servicesBtn: 'الذهاب إلى الخدمات والباقات'
        },
        profile: {
            title: 'الملف الشخصي والمالي',
            chargeBtn: 'إعادة شحن الحساب',
            subtitle: 'معلومات حسابك الخاص',
            active: 'نشط',
            username: 'اسم المستخدم',
            phone: 'رقم الهاتف',
            createdAt: 'تاريخ إنشاء الحساب',
            balance: 'الرصيد',
            creditLimit: 'حد الائتممان',
            discountPercent: 'نسبة الخصم الافتراضية',
            notAvailable: 'معلومات الملف الشخصي غير متوفرة.',
            roles: {
                admin: 'مدير النظام',
                supplier: 'تامین‌کننده سیستم',
                visitor: 'ویزیتور',
                shopkeeper: 'صاحب المتجر (موجه مبيعات)'
            }
        },
        sellPrice: {
            title: 'إعدادات نسبة ربح المتجر (للمحاسبة والمبيعات)',
            subtitle: 'تحديد نسبة الربح الافتراضية لحساب أسعار بيع الباقات للعملاء',
            desc: 'هذه النسبة مخصصة للأغراض المحاسبية لصاحب المتجر وتحديد أسعار بيع الباقات الافتراضية للعميل النهائي. يتم احتساب سعر البيع النهائي كالتالي: تكلفة الشراء + (تكلفة الشراء × نسبة الربح / ١٠٠). كما لا يزال بإمكانك تعديل سعر البيع النهائي يدوياً عند إتمام الشراء.',
            label: 'نسبة الربح الافتراضية لصاحب المتجر',
            saving: 'جاري الحفظ...',
            saveBtn: 'تحديث نسبة الربح'
        },
        password: {
            title: 'تغيير كلمة المرور',
            subtitle: 'اختر كلمة مرور قوية لمزيد من الأمان'
        }
    },
    createConfig: {
        currency: 'تومان',
        unlimited: 'غير محدود',
        gigabyte: 'جيجابايت',
        days: 'أيام',
        messages: {
            fetchError: 'خطأ في جلب البيانات. يرجى تحديث الصفحة.',
            purchaseSuccess: 'تم إنشاء التكوين بنجاح',
            purchaseErrorFallback: 'خطأ في عملية الشراء. يرجى المحاولة مرة أخرى.',
            copySuccess: 'تم نسخ رابط الاشتراك',
            copyError: 'المتصفح لا يدعم النسخ التلقائي',
        },
        header: {
            title: 'إنشاء تكوين جديد',
            subtitle: 'اختر الباقة المطلوبة واستلم التكوين',
            currentBalance: 'رصيدك الحالي'
        },
        package: {
            notFound: 'لم يتم العثور على أي باقة',
            volume: 'الحجم:',
            validity: 'الصلاحية:',
            costPrice: 'سعر التكلفة (الشراء):',
            sellPrice: 'سعر البيع للعميل:',
            noExpiration: 'بدون تاريخ انتهاء'
        },
        recentPurchases: {
            title: 'مشترياتك الأخيرة في هذا النظام',
            deductedAmount: 'المبلغ المخصوم:',
            copied: 'تم النسخ',
            copyLink: 'نسخ الرابط'
        },
        modal: {
            title: 'تأكيد شراء الباقة',
            confirmPromptStart: 'هل أنت متأكد من شراء الباقة «',
            confirmPromptEnd: '»؟',
            amountToDeduct: 'المبلغ المخصوم من المحفظة:',
            balanceAfter: 'الرصيد بعد الشراء:',
            guideStart: 'وفقاً لإعداداتك، السعر المقترح لبيع هذا التكوين للعميل',
            guideMiddle: 'هو. ربحك من هذا البيع',
            guideEnd: 'سيكون.',
            cancel: 'إلغاء',
            payAndReceive: 'الدفع والاستلام'
        },
        qrModal: {
            title: 'رمز الاستجابة للاتصال'
        },
        labels: {
            allPackages: 'جميع الحزم',
            serviceWithTypeName: 'خدمة {{typeName}}',
            customSellPrice: 'سعر البيع للعميل (تومان)',
            customSellPricePlaceholder: 'مثال: ٥٠,٠٠٠',
            customSellPriceHelper: 'سعر البيع المقترح: {{price}}'
        }
    },
    shopsManagement: {
        currency: 'تومان',
        tabs: {
            suppliers: 'الموردين',
            visitors: 'الزوار'
        },
        buttons: {
            addSupplier: 'إضافة مورد جديد',
            addVisitor: 'إضافة زائر جديد'
        },
        roles: {
            shop: 'صاحب المتجر (SHOP)',
            supplier: 'مورد (SUPPLIER)',
            visitor: 'زائر (VISITOR)'
        },
        labels: {
            userRole: 'دور المستخدم'
        },
        messages: {
            fetchError: 'خطأ في جلب قائمة أصحاب المتاجر',
            invalidAmount: 'يرجى إدخال مبلغ صحيح',
            chargeSuccess: 'تم شحن المحفظة بنجاح',
            chargeError: 'خطأ في شحن المحفظة',
            descUpdateSuccess: 'تم تحديث الوصف بنجاح',
            descUpdateError: 'خطأ في تسجيل الوصف',
            resetPasswordConfirmStart: 'هل أنت متأكد من إعادة تعيين كلمة مرور المتجر «',
            resetPasswordConfirmEnd: '»؟',
            resetPasswordSuccess: 'تم إعادة تعيين كلمة المرور بنجاح.',
            resetPasswordError: 'خطأ في إعادة تعيين كلمة المرور',
            statsError: 'خطأ في جلب الإحصائيات',
            createShopSuccess: 'تم إنشاء متجر جديد بنجاح',
            createShopError: 'خطأ في إنشاء المتجر',
            updateSuccess: 'تم تعديل بيانات المتجر بنجاح.',
            updateError: 'خطأ في تعديل بيانات المتجر.'
        },
        header: {
            title: 'إدارة أصحاب المتاجر',
            subtitle: 'تحكم كامل بالبائعين، شحن الحساب، وإحصائيات البيع',
            searchPlaceholder: 'البحث عن رقم هاتف محمول...',
            createShopBtn: 'إنشاء متجر جديد'
        },
        table: {
            userAndPhone: 'اسم المستخدم / الرقم',
            adminDesc: 'وصف المسؤول',
            balanceAndCredit: 'الرصيد (الائتمان)',
            prices: 'السعر (شراء / بيع)',
            actions: 'العمليات',
            loading: 'جاري جلب البيانات...',
            empty: 'لم يتم العثور على أي متجر.',
            emptyDash: '—',
            limit: 'الحد:',
            sell: 'البيع:',
            active: 'نشط',
            discountPercent: 'الخصم',
            testConfigsCount: 'عدد التكوينات التجريبية المنشأة'
        },
        mobileCard: {
            currentBalance: 'الرصيد الحالي',
            creditLimit: 'الحد الائتماني',
            buyPerGb: 'شراء لكل جيجابايت',
            defaultSell: 'البيع الافتراضي',
            discountPercent: 'نسبة الخصم'
        },
        tooltips: {
            chargeWallet: 'شحن المحفظة',
            salesStats: 'إحصائيات البيع',
            editDesc: 'تعديل الوصف',
            resetPassword: 'إعادة تعيين كلمة المرور',
            editShop: 'تعديل بيانات المتجر'
        },
        actionsShort: {
            charge: 'شحن',
            stats: 'إحصائيات',
            edit: 'تعديل',
            reset: 'إعادة تعيين'
        },
        pagination: {
            page: 'صفحة',
            of: 'من'
        },
        modals: {
            charge: {
                title: 'شحن المحفظة',
                amountLabel: 'مبلغ الشحن (تومان)',
                amountPlaceholder: 'مثال: 500,000',
                descLabel: 'الوصف',
                descDefault: 'شحن يدوي للمحفظة بواسطة المسؤول',
                submit: 'تأكيد وشحن'
            },
            editDesc: {
                title: 'وصف المسؤول',
                placeholder: 'العنوان أو ملاحظة...',
                submit: 'حفظ التغييرات'
            },
            edit: {
                title: 'تعديل الإعدادات',
                creditLimit: 'حد الائتمان (تومان)',
                discountPercent: 'نسبة خصم المتجر (٪)',
                isActive: 'الحساب نشط',
                adminDesc: 'توضيحات المسؤول',
                adminDescPlaceholder: 'ملاحظات حول صاحب المتجر...',
                submit: 'حفظ التغييرات'
            },
            stats: {
                title: 'إحصائيات المتجر',
                salesCount: 'عدد المبيعات',
                activeServices: 'الخدمات النشطة',
                netProfit: 'صافي الربح (البائع):',
                totalIncome: 'إجمالي الدخل (الشراء منك):'
            },
            create: {
                title: 'إنشاء متجر جديد',
                username: 'اسم المستخدم (باللغة الإنجليزية)',
                phone: 'رقم الهاتف',
                password: 'كلمة المرور',
                creditLimit: 'الحد الائتماني (تومان)',
                buyPrice: 'سعر الشراء (لكل جيجا / تومان)',
                sellPrice: 'سعر البيع الافتراضي (تومان)',
                adminDesc: 'وصف المسؤول (عنوان/ملاحظة)',
                submit: 'تسجيل متجر البائع',
                discountPercent: 'نسبة خصم صاحب المتجر (٪)'
            }
        }
    },
    systemSettings: {
        messages: {
            fetchError: 'خطأ في جلب إعدادات النظام',
            saveSuccess: 'تم تحديث إعدادات النظام بنجاح',
            saveError: 'خطأ في حفظ الإعدادات'
        },
        header: {
            title: 'إعدادات النظام',
            subtitle: 'إدارة رسائل لوحة التحكم وإصدار النظام'
        },
        general: {
            title: 'الإعدادات العامة',
            versionLabel: 'إصدار لوحة التحكم (Version)'
        },
        notice: {
            title: 'إشعار عام للمستخدمين',
            messageLabel: 'نص الرسالة (اتركه فارغاً لإخفائه)',
            messagePlaceholder: 'مثال: سينقطع الاتصال بالخادم في التاريخ المحدد لمدة ساعة...',
            typeLabel: 'نوع الرسالة (اللون والأيقونة)',
            types: {
                info: 'إشعار عادي (أزرق)',
                success: 'نجاح / خبر سار (أخضر)',
                warning: 'تحذير (أصفر)',
                error: 'تنبيه هام / انقطاع (أحمر)'
            }
        },
        preview: {
            title: 'معاينة لوحة تحكم المستخدم',
            empty: 'لا توجد رسالة لعرضها'
        },
        buttons: {
            save: 'حفظ الإعدادات'
        }
    },
    servicesManagement: {
        messages: {
            fetchError: 'خطأ في تحميل بيانات الخدمة.',
            createTypeSuccess: 'تم إنشاء نوع التكوين بنجاح.',
            createTypeError: 'خطأ في تسجيل نوع التكوين.',
            deleteTypeConfirm: 'هل أنت متأكد من حذف نوع الخدمة هذا؟ سيؤدي هذا أيضًا إلى حذف جميع الفئات المرتبطة.',
            deleteTypeSuccess: 'تم حذف نوع الخدمة بنجاح.',
            deleteTypeError: 'خطأ في حذف نوع الخدمة. ربما بسبب وجود تبعيات نشطة.',
            updateTypeSuccess: 'تم تعديل نوع التكوين بنجاح.',
            updateTypeError: 'خطأ في تعديل نوع التكوين.',
            createCategorySuccess: 'تم إنشاء فئة تكوين جديدة بنجاح.',
            createCategoryError: 'خطأ في تسجيل فئة التكوين.',
            deleteCategoryConfirm: 'هل أنت متأكد من حذف فئة التكوين هذه؟ سيتم حذف جميع الحزم وإعدادات الأسعار المخصصة المرتبطة بها.',
            deleteCategorySuccess: 'تم حذف فئة الخدمة بنجاح.',
            deleteCategoryError: 'خطأ في حذف فئة الخدمة.',
            createPackageSuccess: 'تم إنشاء الحزمة الجديدة بنجاح.',
            createPackageError: 'خطا في تسجيل الحزمة الجديدة.',
            deletePackageConfirm: 'هل أنت متأكد من حذف قالب الحزمة هذا؟',
            deletePackageSuccess: 'تم حذف الحزمة بنجاح.',
            deletePackageError: 'خطأ في حذف الحزمة.',
            updatePackageSuccess: 'تم تحديث حالة الحزمة بنجاح.',
            updatePackageError: 'خطأ في تغيير حالة الحزمة.'
        },
        labels: {
            sellTypes: {
                volumeTime: 'حجم ووقت (محدود)',
                unlimitedVolume: 'حجم غير محدود (محدد بالوقت)',
                unlimitedTime: 'وقت غير محدود (محدد بالحجم)'
            },
            title: 'إدارة الخدمات والحزم',
            subtitle: 'إدارة أنواع التكوين (VIP / عادي) وفئات المبيعات وقوالب الحزم',
            tabs: {
                packages: 'حزم الشراء',
                categories: 'الفئات والمبيعات',
                types: 'أنواع الخدمات'
            },
            forms: {
                createTypeTitle: 'إنشاء نوع خدمة جديد',
                typeName: 'اسم نوع الخدمة',
                typeDesc: 'الوصف',
                typeDescPlaceholder: 'وصف اختياري...',
                typeKey: 'مفتاح نوع الخدمة',
                typeKeyPlaceholder: 'مثال: 1',
                submitType: 'تسجيل نوع الخدمة',
                createCategoryTitle: 'إنشاء فئة مبيعات جديدة',
                selectType: 'اختر نوع الخدمة',
                sellType: 'نموذج المبيعات والمحاسبة',
                adminCost: 'تكلفة المسؤول للمزود (لكل وحدة - تومان)',
                shopPrice: 'سعر البيع الأساسي للتاجر (لكل وحدة - تومان)',
                submitCategory: 'تسجيل فئة المبيعات',
                editCategoryTitle: 'تعديل فئة المبيعات',
                saveCategory: 'حفظ التغييرات',
                createPackageTitle: 'إنشاء حزمة جديدة',
                selectCategory: 'اختر فئة الخدمة',
                packageName: 'اسم قالب الحزمة',
                volumeGb: 'الحجم (جيجابايت)',
                durationDays: 'المدة (أيام)',
                submitPackage: 'تسجيل قالب الحزمة',
                visitorTestAllow: 'السماح للزائر بإنشاء تكوين تجريبي'
            },
            tables: {
                typeName: 'اسم نوع الخدمة',
                description: 'الوصف',
                typeKey: 'المفتاح',
                actions: 'العمليات',
                noTypes: 'لم يتم تسجيل أي نوع خدمة.',
                sellType: 'نموذج المبيعات',
                adminCost: 'تكلفة المسؤول',
                shopPrice: 'سعر التاجر الأساسي',
                visitorTest: 'تجربة الزائر',
                allowed: 'مسموح به',
                notAllowed: 'غير مسموح به',
                noCategories: 'لم يتم تسجيل أي فئة مبيعات.',
                noPackages: 'لم يتم إعداد قوالب حزم بعد.',
                volume: 'الحجم',
                duration: 'المدة',
                unlimited: 'غير محدود',
                noExpiration: 'بدون تاريخ انتهاء',
                days: 'يوم',
                gigabytes: 'جيجا',
                deactivate: 'إيقاف المبيعات',
                activate: 'تفعيل المبيعات',
                activeStatus: 'نشط',
                inactiveStatus: 'غير نشط'
            }
        }
    },
    shopCustomPrices: {
        messages: {
            fetchError: 'خطأ في تحميل أسعارك المخصصة.',
            invalidPrice: 'يرجى إدخال سعر صالح.',
            saveSuccess: 'تم تحديث سعر البيع بنجاح.',
            saveError: 'خطأ في تسجيل السعر الجديد.'
        },
        labels: {
            title: 'إعدادات سعر البيع للزبائن',
            subtitle: 'هنا يمكنك تحديد سعر البيع النهائي لكل وحدة خدمة (لكل جيجابايت أو يوم) لزبائنك.',
            guideTitle: 'كيفية حساب أسعار البيع:',
            guide1: 'في نماذج الحجم والوقت والوقت غير المحدود، تكون الفاتورة النهائية للزبون (السعر لكل وحدة × حجم الحزمة بالجيجابايت).',
            guide2: 'في نماذج الحجم غير المحدود، يكون التسعير عادةً على أساس اليوم ولكنه يتبع حساب تنسيق الفاتورة.',
            noPrices: 'لم يتم العثور على إعدادات أسعار لحسابك. يجب على المسؤول إنشاء فئات مبيعات نشطة أولاً.',
            cardTitle: 'تعرفة البيع النهائي للزبائن',
            unitPrice: 'السعر لكل وحدة (جيجابايت/يوم)',
            changeBtn: 'تغيير التعرفة',
            cancelBtn: 'إلغاء',
            saveTitle: 'حفظ السعر',
            defaultServiceType: 'خدمة'
        }
    },
    common: {
        "currency": "تومان",
        "submitting": "جاري الإرسال...",
        "cancel": "إلغاء"
    },
    settlements: {
        roles: {
            visitor: 'زائر',
            supplier: 'مورد'
        },
        labels: {
            userFilter: 'المستخدم:',
            allUsers: 'جميع المستخدمين'
        },
        "messages": {
            "fetchError": "حدث خطأ أثناء جلب البيانات.",
            "invalidAmount": "المبلغ غير صالح.",
            "success": "تم تسجيل الدفع بنجاح.",
            "submitError": "فشل في تسجيل الدفع.",
            "selectSupplier": "الرجاء تحديد المورد."
        },
        "header": {
            "title": "تسويات الخادم بالاسري",
            "subtitle": "إدارة الديون والمدفوعات لمزود الخادم الرئيسي"
        },
        "buttons": {
            "newSettlement": "تسجيل دفعة جديدة"
        },
        "stats": {
            "totalDebt": "إجمالي الدين المتراكم",
            "totalPaid": "إجمالي المبلغ المدفوع",
            "remainingDebt": "الدين المتبقي الحالي"
        },
        "history": {
            "title": "تاريخ المدفوعات",
            "empty": "لم يتم تسجيل أي مدفوعات حتى الآن."
        },
        "table": {
            "date": "التاريخ والوقت",
            "amount": "المبلغ المدفوع",
            "trackingCode": "رمز التتبع / ملاحظة",
            "supplierName": "اسم المورد",
            you: 'أنت'
        },
        "modal": {
            "title": "تسجيل دفعة جديدة",
            "amountLabel": "مبلغ الدفع (تومان)",
            "trackingCodeLabel": "رمز التتبع أو الملاحظة",
            "supplierLabel": "اختر المورد",
            "selectSupplierPlaceholder": "-- اختر المورد --",
            "submitBtn": "تأكيد المبلغ",
            selectUser: 'اختر المورد / الزائر *',
            selectPlaceholder: '-- اختر --'
        }
    },
    servers: {
        "header": {
            "title": "إدارة الخوادم / الموردين",
            "subtitle": "إضافة وتعديل وإدارة خوادم مرزبان بالاسري"
        },
        "buttons": {
            "newServer": "إضافة خادم جديد"
        },
        "table": {
            "name": "اسم المورد",
            "url": "عنوان لوحة مرزبان",
            "username": "اسم المستخدم",
            "status": "الحالة",
            "actions": "العمليات"
        },
        "status": {
            "active": "نشط",
            "inactive": "غير نشط"
        },
        "modal": {
            "createTitle": "إضافة خادم جديد",
            "editTitle": "تعديل الخادم",
            "nameLabel": "اسم المورد/الخادم",
            "urlLabel": "عنوان لوحة مرزبان",
            "subLabel": "عنوان الساب (sub)",
            "usernameLabel": "اسم المستخدم",
            "passwordLabel": "كلمة المرور",
            "activeLabel": "الخادم النشط للمشتريات الجديدة",
            "activeWarning": "سيؤدي تنشيط هذا الخادم إلى إلغاء تنشيط الخادم النشط حاليًا للمشتريات الجديدة تلقائيًا."
        },
        "messages": {
            "fetchError": "فشل تحميل قائمة الخوادم.",
            "createSuccess": "تم تسجيل الخادم بنجاح.",
            "createError": "فشل تسجيل الخادم الجديد.",
            "updateSuccess": "تم تحديث الخادم بنجاح.",
            "updateError": "فشل تحديث الخادم.",
            "deleteSuccess": "تم حذف الخادم بنجاح.",
            "deleteError": "فشل حذف الخادم.",
            "deleteBlocked": "لا يمكن حذف هذا الخادم لأنه يحتوي على إعدادات نشطة. يرجى إلغاء تنشيط حالته بدلاً من ذلك."
        }
    },
    usageModal: {
        "title": "تفاصيل استهلاك الإعداد",
        "loadingUser": "جاري التحميل...",
        "refreshTooltip": "تحديث",
        "fetchingInfo": "جاري جلب معلومات الاستهلاك من الخادم الرئيسي...",
        "status": {
            "title": "حالة الخدمة",
            "active": "نشط (Active)",
            "onHold": "قيد الانتظار (On Hold)",
            "expired": "منتهي الصلاحية (Expired)",
            "disabled": "معطل (Disabled)"
        },
        "traffic": {
            "title": "حركة المرور المستهلكة",
            "of": "من",
            "unlimited": "غير محدود",
            "used": "مستهلك",
            "remaining": "متبقي"
        },
        "details": {
            "lifetime": "إجمالي الاستهلاك (Lifetime)",
            "createdAt": "تاريخ إنشاء الإعداد",
            "duration": "المدة (بعد الاتصال)",
            "days": "أيام",
            "expire": "تاريخ الانتهاء",
            "lastOnline": "آخر اتصال بالخادم",
            "lastSubUpdate": "آخر تحديث للاشتراك"
        },
        "closeBtn": "إغلاق"
    },
    shopSettings: {
        messages: {
            fetchError: "خطأ في تحميل معلومات المتجر.",
            saveSuccess: "تم حفظ معلومات دعم المتجر بنجاح.",
            saveError: "خطأ في حفظ معلومات المتجر."
        },
        labels: {
            title: "إعدادات المتجر والدعم",
            subtitle: "تظهر هذه المعلومات في رابط الاشتراك وتُطبق على التكوينات الجديدة.",
            shopName: "اسم المتجر",
            supportChannel: "عنوان قناة الدعم (تلغرام، إلخ.)",
            supportId: "عنوان معرف الدعم (تلغرام، إلخ.)",
            supportPhone: "رقم هاتف الدعم"
        },
        placeholders: {
            shopName: "متجري الإلكتروني"
        },
        buttons: {
            saving: "جاري الحفظ...",
            save: "حفظ الإعدادات"
        }
    },
    visitor: {
        dashboard: {
            title: 'لوحة الزائر',
            subtitle: 'إدارة المتاجر التابعة وأرباح العمولات',
            searchPlaceholder: 'البحث عن متجر...',
            addShopBtn: 'صاحب متجر جديد',
            chargeWalletBtn: 'شحن الحساب',
            stats: {
                totalEarnings: 'إجمالي أرباح العمولة',
                totalPaid: 'إجمالي التسويات',
                remainingBalance: 'رصيدك المتبقي',
                totalSales: 'إجمالي المبيعات',
                testConfigsCount: 'عدد التكوينات التجريبية المنشأة',
                walletBalance: 'رصيد المحفظة'
            },
            shopsList: {
                title: 'قائمة أصحاب المتاجر الخاصة بك',
                subtitle: 'المتاجر المسجلة بواسطتك والتي تحصل منها على عمولة.'
            },
            table: {
                userAndPhone: 'اسم المستخدم والهاتف',
                desc: 'الوصف',
                balanceAndCredit: 'الرصيد والحد الائتماني',
                discountPercent: 'نسبة الخصم',
                actions: 'العمليات',
                loading: 'جاري تحميل البيانات...',
                empty: 'لم يتم العثور على أي متجر.',
                creditLimitLabel: 'الحد الائتماني: '
            },
            tooltips: {
                edit: 'تعديل صاحب المتجر',
                resetPassword: 'إعادة تعيين كلمة المرور إلى 123456'
            },
            modals: {
                edit: {
                    title: 'تعديل صاحب المتجر',
                    creditLimit: 'الحد الائتماني (تومان)',
                    discountPercent: 'نسبة خصم صاحب المتجر',
                    isActive: 'حالة النشاط',
                    desc: 'الوصف',
                    descPlaceholder: 'وصف اختياري...',
                    submit: 'حفظ التغييرات'
                },
                create: {
                    title: 'تسجيل صاحب متجر جديد',
                    username: 'اسم المستخدم',
                    phone: 'رقم الهاتف',
                    password: 'كلمة المرور',
                    submit: 'إنشاء الحساب'
                }
            },
            messages: {
                fetchError: 'خطأ في جلب بيانات لوحة التحكم.',
                createSuccess: 'تم تسجيل صاحب المتجر الجديد بنجاح.',
                createError: 'خطأ في تسجيل صاحب المتجر الجديد.',
                updateSuccess: 'تم تحديث بيانات صاحب المتجر بنجاح.',
                updateError: 'خطأ في تحديث البيانات.',
                resetPasswordConfirm: 'هل أنت متأكد من إعادة تعيين كلمة المرور للمستخدم {{username}} إلى "123456"؟',
                resetPasswordSuccess: 'تم إعادة تعيين كلمة المرور إلى "123456".',
                resetPasswordError: 'خطأ في إعادة تعيين كلمة المرور.'
            }
        },
        testConfig: {
            title: 'إنشاء تكوين اختبار',
            subtitle: 'إنشاء تكوينات اختبار مؤقتة للتحقق من الاتصال والسرعة',
            rules: {
                title: 'قواعد تكوين اختبار الزائر:',
                rule1: 'الحد الأقصى للحجم هو 1 جيجابايت.',
                rule2: 'مدة الصلاحية هي 10 أيام كحد أقصى.',
                rule3: 'سيتم خصم التكلفة الأساسية لتكوين الاختبار (بدون إضافة نسبة المسؤول أو الزائر) من رصيدك.',
                rule4: 'لا يتم حفظ هذه التكوينات في قاعدة البيانات ولكن يتم احتسابها في ملفك الشخصي.'
            },
            form: {
                locationLabel: 'اختر الموقع/نوع الخدمة',
                loadingLocations: 'جاري تحميل المواقع...',
                clientNameLabel: 'اسم العميل (بالإنجليزية)',
                clientNameHelper: 'سيحتوي اسم المستخدم النهائي على بادئة الزائر الخاصة بك.',
                submitting: 'جاري إنشاء الحساب على الخادم...',
                submitBtn: 'إنشاء تكوين اختبار'
            },
            result: {
                successTitle: 'تم إنشاء التكوين بنجاح على الخادم!',
                usernameLabel: 'اسم المستخدم على الخادم:',
                subLinkLabel: 'رابط الاشتراك:',
                copyBtn: 'نسخ الرابط'
            },
            messages: {
                fetchTypesError: 'خطأ في جلب قائمة الخدمات.',
                selectTypeRequired: 'يرجى اختيار نوع الخدمة.',
                clientNameRequired: 'يرجى إدخال اسم العميل.',
                createSuccess: 'تم إنشاء تكوين الاختبار بنجاح!',
                createError: 'خطأ في إنشاء تكوين الاختبار.',
                copySuccess: 'تم نسخ رابط الاشتراك.'
            }
        },
        testConfigsList: {
            messages: {
                updateDescSuccess: 'تم تعديل الوصف بنجاح.',
                updateDescError: 'خطأ في تعديل الوصف.'
            },
            header: {
                title: 'تكوينات الاختبار المجانية',
                subtitle: 'القائمة الكاملة لحسابات الاختبار المؤقتة الصادرة عن الزوار وحالتها'
            },
            buttons: {
                create: 'إنشاء تكوين اختبار جديد'
            },
            loading: 'جاري تحميل قائمة تكوينات الاختبار...',
            empty: {
                title: 'لم يتم إصدار أي تكوينات اختبار بعد',
                description: 'بمجرد إصدار حسابات الاختبار بواسطة الزوار، ستظهر تفاصيلها وروابطها هنا.'
            },
            table: {
                username: 'اسم المستخدم',
                visitor: 'الزائر',
                server: 'الخادم / الموقع',
                volume: 'الحجم (الصلاحية)',
                description: 'الوصف (مقدم إلى)',
                createdAt: 'تاريخ الإنشاء',
                actions: 'العمليات',
                unknown: 'غير معروف',
                noDescription: 'بلا وصف'
            },
            tooltips: {
                editDescription: 'عرض / تعديل الوصف',
                copyLink: 'نسخ رابط الاشتراك',
                showQr: 'عرض رمز الاستجابة السريعة (QR Code)'
            },
            pagination: {
                total: 'الإجمالي: {{count}} تكوينات',
                pageOf: 'صفحة {{current}} من {{total}}'
            },
            modals: {
                qr: {
                    title: 'رمز الاستجابة السريعة لتكوين الاختبار',
                    guide: 'امسح هذا الرمز في تطبيق العميل الخاص بك للاتصال.'
                },
                desc: {
                    title: 'وصف تكوين الاختبار',
                    label: 'الوصف (مقدم إلى):',
                    placeholder: 'وصف لتكوين الاختبار هذا...',
                    cancel: 'إلغاء',
                    submit: 'حفظ التغييرات'
                }
            },
            volumeFormat: {
                zero: '0 جيجابايت',
                gb: '{{gb}} جيجابايت'
            }
        }
    },
    transactions: {
        messages: {
            fetchError: 'خطأ في تحميل المعاملات.'
        },
        status: {
            success: 'موفق',
            failed: 'فاشل',
            pending: 'قيد الانتظار'
        },
        gateway: {
            zarinpal: 'زرين بال',
            crypto: 'العملات الرقمية',
            manual: 'يدوي (المسؤول)'
        },
        header: {
            title: 'معاملات الإيداع',
            subtitle: 'عرض وتصفية جميع المدفوعات والشحن اليدوي والمعاملات المصرفية',
            searchPlaceholder: 'تصفية رقم الهاتف...'
        },
        empty: {
            title: 'لم يتم العثور على معاملات',
            withFilter: 'لا توجد معاملات مسجلة برقم الهاتف هذا.',
            noFilter: 'لم يتم تسجيل أي معاملات في النظام حتى الآن.',
            clearFilter: 'مسح التصفية'
        },
        table: {
            user: 'المستخدم',
            phone: 'رقم الهاتف',
            amount: 'المبلغ المودع',
            balanceAfter: 'الرصيد بعد المعاملة',
            gateway: 'بوابة الدفع',
            reference: 'معرف المرجع / السلطة',
            status: 'الحالة',
            description: 'الوصف',
            date: 'تاريخ المعاملة',
            unknownUser: 'غير معروف',
            noPhone: 'بلا رقم',
            noDescription: 'بلا وصف'
        },
        pagination: {
            total: 'الإجمالي: {{count}} معاملات',
            prev: 'السابق',
            next: 'التالي',
            pageOf: '{{current}} من {{total}}'
        }
    },
    support: {
        title: 'الدعم وتقديم الاقتراحات',
        warning: 'يرجى مراسلة الدعم الفني فقط في حالة انقطاع الخدمة. لا توجد مسؤولية أثناء الانقطاعات العامة، والخدمات التي لها تاريخ انتهاء لن يتم تجديدها بمجرد انتهائها.',
        qualityDesc: 'نسعى دائمًا لتقديم أعلى مستويات الجودة والاستقرار لخدماتكم. إذا كنت بحاجة إلى مساعدة أو ترغب في إرسال ملاحظات واقتراحات، يرجى استخدام النموذج أدناه.',
        placeholder: 'اكتب رسالتك هنا...',
        sendBtn: 'إرسال الاقتراح أو الشكوى',
        sending: 'جاري الإرسال...',
        sendSuccess: 'تم إرسال رسالتك بنجاح.',
        sendError: 'خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
        telegramTitle: 'الإبلاغ عن انقطاع الخدمة عبر تليجرام',
        telegramBtn: 'إرسال رسالة على تليجرام',
        suggestionTitle: 'تقديم الاقتراحات والملاحظات',
        suggestionDesc: 'يرجى استخدام النموذج أدناه لإرسال أي اقتراحات أو ملاحظات أو أفكار جديدة لتحسين اللوحة.',
        support24h: 'دعم على مدار الساعة',
        telegramNotConfigured: 'لم يتم إعداد الدعم عبر تليجرام.'
    }
};