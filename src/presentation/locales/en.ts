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
            panelSettings: 'Panel Settings'
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
            netProfit: 'Net Profit'
        },
        header: {
            title: 'Dashboard',
            subtitle: 'Performance overview, account status, and sales settings'
        },
        sections: {
            generalStats: 'General Stats',
            profileAndOps: 'Profile & Operations'
        },
        profile: {
            title: 'Profile & Finances',
            subtitle: 'Your account information',
            active: 'Active',
            username: 'Username',
            phone: 'Phone Number',
            createdAt: 'Account Created At',
            balance: 'Balance',
            creditLimit: 'Credit Limit',
            buyPricePerGb: 'Buy Price per GB',
            notAvailable: 'Profile information is unavailable.'
        },
        sellPrice: {
            title: 'Change Sell Price',
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
            sellPrice: 'Sell Price to Customer:'
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
            createShopError: 'Error creating the shop'
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
            active: 'Active'
        },
        mobileCard: {
            currentBalance: 'Current Balance',
            creditLimit: 'Credit Limit',
            buyPerGb: 'Buy per GB',
            defaultSell: 'Default Sell'
        },
        tooltips: {
            chargeWallet: 'Recharge Wallet',
            salesStats: 'Sales Stats',
            editDesc: 'Edit Description',
            resetPassword: 'Reset Password'
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
                submit: 'Register Seller Shop'
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
    }
};