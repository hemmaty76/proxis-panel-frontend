export const en = {
    header: {
        logoutSucces: 'Successfully logged out',
        connectedToServer: 'Connected to the server',
        welcome: 'Welcome',
        logOut: 'Log Out'
    },
    passwordChangeForm: {
        errors: {
            fillAllFields: 'Please fill in all fields',
            minLength: 'The new password must be at least 8 characters long',
            passwordMismatch: 'The new password and confirmation do not match',
            generalError: 'The current password is incorrect or an error occurred'
        },
        success: 'Your password has been changed successfully',
        labels: {
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            confirmPassword: 'Confirm New Password'
        },
        placeholders: {
            minLength: 'Minimum 8 characters',
        },
        buttons: {
            changing: 'Changing...',
            changePassword: 'Change Password'
        }
    },
    sidebar: {
        title: 'Proxy Management',
        menu: {
            dashboard: 'Dashboard & Stats',
            createConfig: 'Create Config',
            manageUsers: 'Manage Users',
            manageShop: 'Manage Shop',
            manageServices: 'Manage Services & Packages',
            customPrices: 'Selling Price Settings',
            panelSettings: 'Panel Settings',
            manageServers: 'Manage Servers'
        }
    },
    usersManagement: {
        currency: 'Toman',
        unlimited: 'Unlimited',
        gigabyte: 'GB',
        emptyDate: '—',
        messages: {
            fetchError: 'Error fetching the configs list',
            copySuccess: 'Subscription link copied successfully',
            copyError: 'Your browser does not support auto-copying',
        },
        header: {
            title: 'Users Management',
            subtitle: 'List of sold configs, volume status, and subscription links'
        },
        table: {
            username: 'Username',
            serviceVolume: 'Service Volume',
            createdAt: 'Created At',
            expireDate: 'Expiration',
            sellPrice: 'Sell Price',
            actions: 'Subscription Actions',
            noConfigs: 'No configs available to display.',
            volumeShort: 'Volume',
            createdShort: 'Created',
            expireShort: 'Expire',
        },
        tooltips: {
            showQr: 'Show QR Code',
            copyLink: 'Copy Subscription Link'
        },
        pagination: {
            page: 'Page',
            of: 'of'
        },
        qrModal: {
            title: 'Connection QR Code',
            guide: 'Scan this QR code in the app to connect.'
        }
    },
    login: {
        messages: {
            emptyFields: 'Please enter your username and password',
            success: 'Successfully logged in',
            invalidCredentials: 'Invalid username or password.',
        },
        header: {
            title: 'Panel Login',
            subtitle: 'Enter your credentials to access the dashboard'
        },
        labels: {
            username: 'Username',
            password: 'Password'
        },
        placeholders: {
            username: 'admin',
            password: '••••••••'
        },
        buttons: {
            authenticating: 'Authenticating...',
            login: 'Login'
        }
    },
    forceChangePassword: {
        messages: {
            logoutSuccess: 'Successfully logged out'
        },
        header: {
            title: 'Mandatory Password Change',
            description: 'For security reasons, you will not be able to access the system until you change your password.'
        },
        buttons: {
            logout: 'Log Out'
        }
    },
    dashboardHome: {
        currency: 'Toman',
        chargeModal: {
            "title": "Online Account Recharge",
            "amountLabel": "Recharge Amount (Toman)",
            "notice": "Upon successful payment, the amount will be immediately added to your account balance.",
            "vpnWarning": "Note: Please turn off your VPN before entering the payment gateway to avoid any payment errors.",
            "submitBtn": "Pay with Zarinpal"
        },
        paymentResult: {
            "successTitle": "Account Charged Successfully",
            "successDesc": "Your transaction has been verified successfully. The amount has been added to your balance.",
            "failedTitle": "Payment Failed or Cancelled",
            "failedDesc": "The payment process failed or was cancelled by you. If any amount was deducted, it will be refunded within 72 hours.",
            "closeBtn": "Got it"
        },
        messages: {
            fetchError: 'Could not connect to the server. Please refresh the page.',
            invalidPrice: 'Please enter a valid price',
            priceUpdateSuccess: 'Selling price was successfully updated in the system',
            priceUpdateError: 'Error updating the price. Please try again'
        },
        stats: {
            totalSales: 'Total Sales',
            activeServices: 'Active Services',
            totalCost: 'Total Cost',
            totalRevenue: 'Total Revenue',
            netProfit: 'Net Profit',
            upstreamDebt: 'Debt to Upstream (Marzban)',
            adminGrossRevenue: 'Admin Gross Revenue',
            adminNetProfit: 'Admin Net Profit'
        },
        header: {
            title: 'Dashboard',
            subtitle: 'Performance overview, account status, and sales settings'
        },
        sections: {
            generalStats: 'General Stats',
            profileAndOps: 'Profile & Operations'
        },
        adminActions: {
            servicesTitle: 'Packages & Services Management',
            servicesSubtitle: 'Configure service types, sales models, and define new volume/time package templates',
            servicesDesc: 'From this section, you can define service types (VIP, Normal), sales categories, and base purchase prices for shopkeepers.',
            servicesBtn: 'Go to Services & Packages'
        },
        profile: {
            title: 'Profile & Finances',
            chargeBtn: 'Account recharge',
            subtitle: 'Your account information',
            active: 'Active',
            username: 'Username',
            phone: 'Phone Number',
            createdAt: 'Account Created At',
            balance: 'Balance',
            creditLimit: 'Credit Limit',
            discountPercent: 'Default Discount Percent',
            notAvailable: 'Profile information is unavailable.',
            roles: {
                admin: 'System Admin',
                shopkeeper: 'Shopkeeper (Reseller)'
            }
        },
        sellPrice: {
            title: 'Final Customer Selling Price Settings',
            subtitle: 'Set custom selling prices to customer',
            desc: 'The package pricing system has been changed to unit-based and categorized. To edit and customize your selling prices for final customers based on service categories, go to the Selling Price Settings section.',
            btn: 'Selling Price Settings',
            currentPrice: 'Current Price:',
            emptyPrice: '—',
            newPriceLabel: 'New Sell Price (Toman / GB)',
            placeholder: 'e.g., 3,500',
            submitting: 'Submitting...',
            submitBtn: 'Submit New Price'
        },
        password: {
            title: 'Change Password',
            subtitle: 'Choose a strong password for better security'
        }
    },
    createConfig: {
        currency: 'Toman',
        unlimited: 'Unlimited',
        gigabyte: 'GB',
        days: 'Days',
        messages: {
            fetchError: 'Error fetching data. Please refresh the page.',
            purchaseSuccess: 'Config created successfully',
            purchaseErrorFallback: 'Purchase operation failed. Please try again.',
            copySuccess: 'Subscription link copied',
            copyError: 'Your browser does not support auto-copying',
        },
        header: {
            title: 'Create New Config',
            subtitle: 'Select your desired package and receive the config',
            currentBalance: 'Your Current Balance'
        },
        package: {
            notFound: 'No package found',
            volume: 'Volume:',
            validity: 'Validity:',
            costPrice: 'Cost Price (Buy):',
            sellPrice: 'Sell Price to Customer:',
            noExpiration: 'No expiration date'
        },
        recentPurchases: {
            title: 'Your Recent Purchases',
            deductedAmount: 'Deducted Amount:',
            copied: 'Copied',
            copyLink: 'Copy Link'
        },
        modal: {
            title: 'Confirm Package Purchase',
            confirmPromptStart: 'Are you sure you want to purchase the "',
            confirmPromptEnd: '" package?',
            amountToDeduct: 'Amount to deduct from wallet:',
            balanceAfter: 'Balance after purchase:',
            guideStart: 'Based on your settings, the suggested sell price for this config to the customer is',
            guideMiddle: '. Your profit from this sale will be',
            guideEnd: '.',
            cancel: 'Cancel',
            payAndReceive: 'Pay & Receive'
        },
        qrModal: {
            title: 'Connection QR Code'
        },
        labels: {
            allPackages: 'All Packages',
            serviceWithTypeName: 'Service {{typeName}}',
            customSellPrice: 'Selling Price to Customer (Toman)',
            customSellPricePlaceholder: 'e.g., 50,000',
            customSellPriceHelper: 'Suggested sell price: {{price}}'
        }
    },
    shopsManagement: {
        currency: 'Toman',
        messages: {
            fetchError: 'Error fetching the shop owners list',
            invalidAmount: 'Please enter a valid amount',
            chargeSuccess: 'Wallet recharged successfully',
            chargeError: 'Error recharging the wallet',
            descUpdateSuccess: 'Description updated successfully',
            descUpdateError: 'Error updating the description',
            resetPasswordConfirmStart: 'Are you sure you want to reset the password for the shop "',
            resetPasswordConfirmEnd: '"?',
            resetPasswordSuccess: 'Password reset successfully.',
            resetPasswordError: 'Error resetting password',
            statsError: 'Error fetching statistics',
            createShopSuccess: 'New shop created successfully',
            createShopError: 'Error creating the shop',
            updateSuccess: 'Shop settings updated successfully.',
            updateError: 'Error updating shop settings.'
        },
        header: {
            title: 'Shop Owners Management',
            subtitle: 'Full control over sellers, account recharges, and sales stats',
            searchPlaceholder: 'Search mobile number...',
            createShopBtn: 'Create New Shop'
        },
        table: {
            userAndPhone: 'Username / Phone',
            adminDesc: 'Admin Description',
            balanceAndCredit: 'Balance (Credit)',
            prices: 'Price (Buy / Sell)',
            actions: 'Actions',
            loading: 'Loading data...',
            empty: 'No shops found.',
            emptyDash: '—',
            limit: 'Limit:',
            sell: 'Sell:',
            active: 'Active',
            discountPercent: 'Discount'
        },
        mobileCard: {
            currentBalance: 'Current Balance',
            creditLimit: 'Credit Limit',
            buyPerGb: 'Buy per GB',
            defaultSell: 'Default Sell',
            discountPercent: 'Discount Percent'
        },
        tooltips: {
            chargeWallet: 'Recharge Wallet',
            salesStats: 'Sales Stats',
            editDesc: 'Edit Description',
            resetPassword: 'Reset Password',
            editShop: 'Edit Shop Details'
        },
        actionsShort: {
            charge: 'Recharge',
            stats: 'Stats',
            edit: 'Edit',
            reset: 'Reset Pass'
        },
        pagination: {
            page: 'Page',
            of: 'of'
        },
        modals: {
            charge: {
                title: 'Recharge Wallet',
                amountLabel: 'Recharge Amount (Toman)',
                amountPlaceholder: 'e.g., 500,000',
                descLabel: 'Description',
                descDefault: 'Manual wallet recharge by admin',
                submit: 'Confirm & Recharge'
            },
            editDesc: {
                title: 'Admin Description',
                placeholder: 'Address, location, or note...',
                submit: 'Save Changes'
            },
            edit: {
                title: 'Edit Settings',
                creditLimit: 'Credit Limit (Toman)',
                discountPercent: 'Shop Discount Percent (%)',
                isActive: 'Account is active',
                adminDesc: 'Admin Description',
                adminDescPlaceholder: 'Notes about the shopkeeper...',
                submit: 'Save Changes'
            },
            stats: {
                title: 'Shop Statistics',
                salesCount: 'Sales Count',
                activeServices: 'Active Services',
                netProfit: 'Net Profit (Seller):',
                totalIncome: 'Total Income (Purchases from you):'
            },
            create: {
                title: 'Create New Shop',
                username: 'Username (English)',
                phone: 'Phone Number',
                password: 'Password',
                creditLimit: 'Credit Limit (Toman)',
                buyPrice: 'Buy Price (per GB / Toman)',
                sellPrice: 'Default Sell Price (Toman)',
                adminDesc: 'Admin Description (Address/Note)',
                submit: 'Register Seller Shop',
                discountPercent: 'Shopkeeper Discount Percent (%)'
            }
        }
    },
    systemSettings: {
        messages: {
            fetchError: 'Error fetching system settings',
            saveSuccess: 'System settings updated successfully',
            saveError: 'Error saving settings'
        },
        header: {
            title: 'System Settings',
            subtitle: 'Manage dashboard messages and system version'
        },
        general: {
            title: 'General Settings',
            versionLabel: 'Dashboard Version'
        },
        notice: {
            title: 'Global User Notice',
            messageLabel: 'Message Text (Leave empty to hide)',
            messagePlaceholder: 'e.g., The server will have an hour of downtime on [Date]...',
            typeLabel: 'Message Type (Color & Icon)',
            types: {
                info: 'Standard Notice (Blue)',
                success: 'Success / Good News (Green)',
                warning: 'Warning (Yellow)',
                error: 'Critical Alert / Downtime (Red)'
            }
        },
        preview: {
            title: 'User Dashboard Preview',
            empty: 'No message to display'
        },
        buttons: {
            save: 'Save Settings'
        }
    },
    servicesManagement: {
        messages: {
            fetchError: 'Error loading services data.',
            createTypeSuccess: 'Config type created successfully.',
            createTypeError: 'Error registering config type.',
            deleteTypeConfirm: 'Are you sure you want to delete this service type? This will also delete all connected categories.',
            deleteTypeSuccess: 'Service type deleted successfully.',
            deleteTypeError: 'Error deleting service type. Probably due to active dependencies.',
            createCategorySuccess: 'New config category created successfully.',
            createCategoryError: 'Error registering config category.',
            updateCategorySuccess: 'Config category updated successfully.',
            updateCategoryError: 'Error updating config category.',
            deleteCategoryConfirm: 'Are you sure you want to delete this config category? All packages and custom price settings will be deleted.',
            deleteCategorySuccess: 'Service category deleted successfully.',
            deleteCategoryError: 'Error deleting service category.',
            createPackageSuccess: 'New package created successfully.',
            createPackageError: 'Error registering new package.',
            deletePackageConfirm: 'Are you sure you want to delete this template package?',
            deletePackageSuccess: 'Package deleted successfully.',
            deletePackageError: 'Error deleting package.',
            updatePackageSuccess: 'Package status updated successfully.',
            updatePackageError: 'Error updating package status.'
        },
        labels: {
            sellTypes: {
                volumeTime: 'Volume & Time (Limited)',
                unlimitedVolume: 'Unlimited Volume (Time-based)',
                unlimitedTime: 'Unlimited Time (Volume-based)'
            },
            title: 'Manage Services & Packages',
            subtitle: 'Manage config types (VIP / Normal), sales categories, and template packages',
            tabs: {
                packages: 'Purchase Packages',
                categories: 'Categories & Sales',
                types: 'Service Types'
            },
            forms: {
                createTypeTitle: 'Create New Service Type',
                typeName: 'Service Type Name',
                typeDesc: 'Description',
                typeDescPlaceholder: 'Optional description...',
                submitType: 'Register Service Type',
                createCategoryTitle: 'Create New Sales Category',
                selectType: 'Select Service Type',
                sellType: 'Sales & Accounting Model',
                categoryName: 'Category Display Name',
                adminCost: 'Admin Cost to Upstream (per Unit - Toman)',
                shopPrice: 'Base Shopkeeper Price (per Unit - Toman)',
                submitCategory: 'Register Sales Category',
                createPackageTitle: 'Create New Package',
                selectCategory: 'Select Service Category',
                packageName: 'Package Template Name',
                volumeGb: 'Volume (GB)',
                durationDays: 'Duration (Days)',
                submitPackage: 'Register Package Template',
                editPackageTitle: 'Edit Package Template',
                savePackage: 'Save Changes'
            },
            tables: {
                typeName: 'Service Type Name',
                description: 'Description',
                actions: 'Actions',
                noTypes: 'No service types registered.',
                sellType: 'Sales Model',
                categoryName: 'Display Name',
                adminCost: 'Admin Cost',
                shopPrice: 'Base Shop Price',
                noCategories: 'No sales categories registered.',
                noPackages: 'No package templates configured.',
                volume: 'Volume',
                duration: 'Duration',
                unlimited: 'Unlimited',
                noExpiration: 'No expiration',
                days: 'days',
                gigabytes: 'GB',
                deactivate: 'Deactivate',
                activate: 'Activate',
                activeStatus: 'Active',
                inactiveStatus: 'Inactive',
                edit: 'Edit'
            }
        }
    },
    shopCustomPrices: {
        messages: {
            fetchError: 'Error loading your custom prices.',
            invalidPrice: 'Please enter a valid price.',
            saveSuccess: 'Selling price updated successfully.',
            saveError: 'Error registering new price.'
        },
        labels: {
            title: 'Final Customer Selling Price Settings',
            subtitle: 'Here you can specify the final selling price per unit of service (per GB or day) for your customers.',
            guideTitle: 'How selling prices are computed:',
            guide1: 'For Volume & Time and Unlimited Time models, the final customer invoice is (price per unit × package volume in GB).',
            guide2: 'For Unlimited Volume models, pricing is typically day-based but follows the invoice format calculation.',
            noPrices: 'No price settings found for your account. The administrator must create active sales categories first.',
            cardTitle: 'Final Customer Selling Price',
            unitPrice: 'Price per Unit (GB/Day)',
            changeBtn: 'Change Price',
            cancelBtn: 'Cancel',
            saveTitle: 'Save Price',
            defaultServiceType: 'Service'
        }
    },
    common: {
        "currency": "Toman",
        "submitting": "Submitting...",
        "cancel": "Cancel"
    },
    settlements: {

        "messages": {
            "fetchError": "Failed to fetch data.",
            "invalidAmount": "Invalid amount.",
            "success": "Settlement recorded successfully.",
            "submitError": "Failed to record settlement.",
            "selectSupplier": "Please select a supplier."
        },
        "header": {
            "title": "Upstream Settlements",
            "subtitle": "Manage debts and payments to the main server provider"
        },
        "buttons": {
            "newSettlement": "New Settlement"
        },
        "stats": {
            "totalDebt": "Total Debt Generated",
            "totalPaid": "Total Amount Paid",
            "remainingDebt": "Current Remaining Debt"
        },
        "history": {
            "title": "Payment History",
            "empty": "No payments have been recorded yet."
        },
        "table": {
            "date": "Date & Time",
            "amount": "Amount Paid",
            "trackingCode": "Tracking Code / Note",
            "supplierName": "Supplier Name"
        },
        "modal": {
            "title": "Record New Settlement",
            "amountLabel": "Payment Amount (Toman)",
            "trackingCodeLabel": "Tracking Code or Note",
            "supplierLabel": "Select Supplier",
            "selectSupplierPlaceholder": "-- Select Supplier --",
            "submitBtn": "Submit Amount"
        }
    },
    servers: {
        "header": {
            "title": "Servers/Suppliers Management",
            "subtitle": "Add, edit and manage upstream Marzban servers"
        },
        "buttons": {
            "newServer": "Add New Server"
        },
        "table": {
            "name": "Supplier Name",
            "url": "Marzban Panel URL",
            "username": "Username",
            "status": "Status",
            "actions": "Actions"
        },
        "status": {
            "active": "Active",
            "inactive": "Inactive"
        },
        "modal": {
            "createTitle": "Add New Server",
            "editTitle": "Edit Server",
            "nameLabel": "Supplier/Server Name",
            "urlLabel": "Marzban Panel URL",
            "usernameLabel": "Username",
            "passwordLabel": "Password",
            "activeLabel": "Active server for new purchases",
            "activeWarning": "Activating this server will automatically deactivate the currently active server for new purchases."
        },
        "messages": {
            "fetchError": "Failed to load servers list.",
            "createSuccess": "Server registered successfully.",
            "createError": "Failed to register new server.",
            "updateSuccess": "Server updated successfully.",
            "updateError": "Failed to update server.",
            "deleteSuccess": "Server deleted successfully.",
            "deleteError": "Failed to delete server.",
            "deleteBlocked": "This server cannot be deleted because it has active configurations. Please disable its status instead."
        }
    },
    usageModal: {
        "title": "Config Usage Details",
        "loadingUser": "Loading...",
        "refreshTooltip": "Refresh",
        "fetchingInfo": "Fetching usage info from main server...",
        "status": {
            "title": "Service Status",
            "active": "Active",
            "onHold": "On Hold (Awaiting connection)",
            "expired": "Expired",
            "disabled": "Disabled"
        },
        "traffic": {
            "title": "Traffic Usage",
            "of": "of",
            "unlimited": "Unlimited",
            "used": "Used",
            "remaining": "Remaining"
        },
        "details": {
            "lifetime": "Total Traffic Usage (Lifetime)",
            "createdAt": "Config Creation Date",
            "duration": "Duration (after connection)",
            "days": "Days",
            "expire": "Expiration Date",
            "lastOnline": "Last Server Connection",
            "lastSubUpdate": "Last Subscription Update"
        },
        "closeBtn": "Close"
    }
};