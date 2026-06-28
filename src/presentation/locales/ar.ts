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
        title: 'إدارة الوكيل (البروكسي)',
        menu: {
            dashboard: 'لوحة التحكم والإحصائيات',
            createConfig: 'إنشاء تكوین (كونفيج)',
            manageUsers: 'إدارة المستخدمين',
            manageShop: 'إدارة المتجر',
            manageServices: 'إدارة الخدمات والحزم',
            customPrices: 'إعدادات سعر البيع',
            panelSettings: 'إعدادات اللوحة'
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
            upstreamDebt: 'الديون للمزود (مرزبان)',
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
                shopkeeper: 'صاحب المتجر (موجه مبيعات)'
            }
        },
        sellPrice: {
            title: 'إعدادات سعر البيع للزبائن',
            subtitle: 'تخصيص أسعار البيع للزبائن',
            desc: 'تم تغيير نظام تسعير الباقات ليكون على أساس الوحدة والتصنيف. لتعديل وتخصيص أسعار البيع للزبائن النهائيين بناءً على فئات الخدمات، انتقل إلى قسم إعدادات سعر البيع.',
            btn: 'إعدادات سعر البيع',
            currentPrice: 'السعر الحالي:',
            emptyPrice: '—',
            newPriceLabel: 'سعر البيع الجديد (تومان / جيجابايت)',
            placeholder: 'مثلاً ۳,۵۰۰',
            submitting: 'جاري الإرسال...',
            submitBtn: 'حفظ السعر الجديد'
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
            serviceWithTypeName: 'خدمة {{typeName}}'
        }
    },
    shopsManagement: {
        currency: 'تومان',
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
            discountPercent: 'الخصم'
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
                submitType: 'تسجيل نوع الخدمة',
                createCategoryTitle: 'إنشاء فئة مبيعات جديدة',
                selectType: 'اختر نوع الخدمة',
                sellType: 'نموذج المبيعات والمحاسبة',
                adminCost: 'تكلفة المسؤول للمزود (لكل وحدة - تومان)',
                shopPrice: 'سعر البيع الأساسي للتاجر (لكل وحدة - تومان)',
                submitCategory: 'تسجيل فئة المبيعات',
                createPackageTitle: 'إنشاء حزمة جديدة',
                selectCategory: 'اختر فئة الخدمة',
                packageName: 'اسم قالب الحزمة',
                volumeGb: 'الحجم (جيجابايت)',
                durationDays: 'المدة (أيام)',
                submitPackage: 'تسجيل قالب الحزمة'
            },
            tables: {
                typeName: 'اسم نوع الخدمة',
                description: 'الوصف',
                actions: 'العمليات',
                noTypes: 'لم يتم تسجيل أي نوع خدمة.',
                sellType: 'نموذج المبيعات',
                adminCost: 'تكلفة المسؤول',
                shopPrice: 'سعر التاجر الأساسي',
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

        "messages": {
            "fetchError": "حدث خطأ أثناء جلب البيانات.",
            "invalidAmount": "المبلغ غير صالح.",
            "success": "تم تسجيل الدفع بنجاح.",
            "submitError": "فشل في تسجيل الدفع."
        },
        "header": {
            "title": "تسويات الخادم",
            "subtitle": "إدارة الديون والمدفوعات لمزود الخادم"
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
            "trackingCode": "رمز التتبع / ملاحظة"
        },
        "modal": {
            "title": "تسجيل دفعة جديدة",
            "amountLabel": "مبلغ الدفع (تومان)",
            "trackingCodeLabel": "رمز التتبع أو الملاحظة",
            "submitBtn": "تأكيد المبلغ"
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
    }
};