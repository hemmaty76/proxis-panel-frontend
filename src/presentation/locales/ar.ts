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
            createConfig: 'إنشاء تكوين (كونفيج)',  
            manageUsers: 'إدارة المستخدمين',  
            manageShop: 'إدارة المتجر',  
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
        messages: {
            fetchError: 'تعذر الاتصال بالخادم. يرجى تحديث الصفحة.',  
            invalidPrice: 'يرجى إدخال سعر صحيح',  
            priceUpdateSuccess: 'تم تسجيل سعر البيع في النظام بنجاح',  
            priceUpdateError: 'خطأ في تحديث السعر. يرجى المحاولة مرة أخرى'  
        },
        stats: {
            totalSales: 'إجمالي المبيعات',  
            activeServices: 'الخدمات النشطة',  
            totalCost: 'إجمالي التكلفة',  
            totalRevenue: 'إجمالي الإيرادات',  
            netProfit: 'صافي الربح'  
        },
        header: {
            title: 'لوحة التحكم',  
            subtitle: 'نظرة عامة على الأداء، حالة الحساب وإعدادات البيع'  
        },
        sections: {
            generalStats: 'الإحصائيات العامة',  
            profileAndOps: 'الملف الشخصي والعمليات'  
        },
        profile: {
            title: 'الملف الشخصي والمالية',  
            subtitle: 'معلومات حسابك',  
            active: 'نشط',  
            username: 'اسم المستخدم',  
            phone: 'رقم الهاتف',  
            createdAt: 'تاريخ إنشاء الحساب',  
            balance: 'الرصيد',  
            creditLimit: 'الحد الائتماني',  
            buyPricePerGb: 'سعر الشراء لكل جيجابايت',  
            notAvailable: 'معلومات الملف الشخصي غير متاحة.'  
        },
        sellPrice: {
            title: 'تغيير سعر البيع',  
            currentPrice: 'السعر الحالي:',  
            emptyPrice: '—',  
            newPriceLabel: 'سعر البيع الجديد (تومان / جيجابايت)',  
            placeholder: 'مثال: 3,500',  
            submitting: 'جاري التسجيل...',  
            submitBtn: 'تسجيل السعر الجديد'  
        },
        password: {
            title: 'تغيير كلمة المرور',  
            subtitle: 'لمزيد من الأمان، اختر كلمة مرور قوية'  
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
            sellPrice: 'سعر البيع للعميل:'  
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
            createShopError: 'خطأ في إنشاء المتجر'  
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
            active: 'نشط'  
        },
        mobileCard: {
            currentBalance: 'الرصيد الحالي',  
            creditLimit: 'الحد الائتماني',  
            buyPerGb: 'شراء لكل جيجابايت',  
            defaultSell: 'البيع الافتراضي'  
        },
        tooltips: {
            chargeWallet: 'شحن المحفظة',  
            salesStats: 'إحصائيات البيع',  
            editDesc: 'تعديل الوصف',  
            resetPassword: 'إعادة تعيين كلمة المرور'  
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
                submit: 'تسجيل متجر البائع'  
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
            title: 'معاينة في لوحة تحكم المستخدمين',  
            empty: 'لا توجد رسالة لعرضها'  
        },
        buttons: {
            save: 'حفظ الإعدادات'  
        }
    }
};  