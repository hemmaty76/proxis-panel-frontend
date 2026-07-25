import { apiClient } from '../../core/api/axios';

// --- Interfaces ---

export interface AdminUserItem {
  id: string;
  username: string;
  phone_number: string;
  description_admin: string;
  balance: number;
  credit_limit: number;
  discount_percent: number;
  role: string;
  is_active: boolean;
  visitor_id?: string;
  test_configs_count?: number;
  created_at: string;
}

export interface AdminUsersResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  items: AdminUserItem[];
}

export interface AdminUserStats {
  total_sales_count: number;
  total_cost: number;
  total_revenue: number;
  net_profit: number;
}

export interface SystemSettings {
  dashboard_message: string;
  dashboard_message_type: 'success' | 'warning' | 'error' | 'info';
  dashboard_version: string;
  PercentAdminCost?: number;
}

// --- API Calls ---

export const getAllShops = async (page: number = 1, size: number = 10, phone?: string, role: string = 'SHOP') => {
  const params = new URLSearchParams({ page: String(page), page_size: String(size), role });
  if (phone) params.append('phone_number', phone);
  
  const response = await apiClient.get<AdminUsersResponse>(`/admin/users?${params.toString()}`);
  return response.data;
};

export const createShop = async (data: any) => {
  const response = await apiClient.post<AdminUserItem>('/admin/users', data);
  return response.data;
};

export const chargeShopWallet = async (userId: string, amount: number, description: string) => {
  const response = await apiClient.post(`/admin/users/${userId}/charge`, { amount, description });
  return response.data;
};

export const resetShopPassword = async (userId: string) => {
  const response = await apiClient.post(`/admin/users/${userId}/reset-password`);
  return response.data; // ممکن است رمز جدید را برگرداند یا فقط پیام موفقیت بدهد
};

export const updateShopDescription = async (userId: string, description_admin: string) => {
  const response = await apiClient.patch(`/admin/users/${userId}/description`, { description_admin });
  return response.data;
};

export const getShopDashboardStats = async (userId: string) => {
  const response = await apiClient.get<AdminUserStats>(`/admin/users/${userId}/dashboard`);
  return response.data;
};




// گرفتن تنظیمات (ادمین)
export const getAdminSettings = async (): Promise<SystemSettings> => {
  const response = await apiClient.get<SystemSettings>('/admin/settings');
  return response.data;
};

// ویرایش تنظیمات (ادمین)
export const updateAdminSettings = async (data: Partial<SystemSettings>): Promise<SystemSettings> => {
  const response = await apiClient.patch<SystemSettings>('/admin/settings', data);
  return response.data;
};

// ویرایش مشخصات کاربر (ادمین)
export const updateShop = async (userId: string, data: any): Promise<AdminUserItem> => {
  const response = await apiClient.patch<AdminUserItem>(`/admin/users/${userId}`, data);
  return response.data;
};

// دریافت گزارش مالی (ادمین)
export interface FinancialReport {
  total_debt_to_upstream: number;
  admin_gross_revenue: number;
  admin_net_profit: number;
}
export const getFinancialReport = async (): Promise<FinancialReport> => {
  const response = await apiClient.get<FinancialReport>('/admin/financial-report');
  return response.data;
};

// سرویس‌های ConfigType
export interface ConfigTypeItem {
  id: string;
  name: string;
  description?: string;
  key: string;
  server_id: string;
  server_name?: string;
  categories_name_str?: string;
}
export const getConfigTypes = async (): Promise<ConfigTypeItem[]> => {
  const response = await apiClient.get<ConfigTypeItem[]>('/admin/config-types');
  return response.data;
};
export const createConfigType = async (data: { name: string; description?: string; key: string; server_id: string }): Promise<ConfigTypeItem> => {
  const response = await apiClient.post<ConfigTypeItem>('/admin/config-types', data);
  return response.data;
};
export const updateConfigType = async (id: string, data: { name: string; description?: string; key: string }): Promise<ConfigTypeItem> => {
  const response = await apiClient.patch<ConfigTypeItem>(`/admin/config-types/${id}`, data);
  return response.data;
};
export const deleteConfigType = async (id: string): Promise<any> => {
  const response = await apiClient.delete(`/admin/config-types/${id}`);
  return response.data;
};

// سرویس‌های ConfigCategory
export interface ConfigCategoryItem {
  id: string;
  config_type_id: string;
  sell_type: 'VOLUME_TIME' | 'UNLIMITED_VOLUME' | 'UNLIMITED_TIME';
  name?: string;
  admin_cost_per_unit: number;
  shop_price_per_unit: number;
  allow_test: boolean;
  config_type?: ConfigTypeItem;
}
export const getConfigCategories = async (): Promise<ConfigCategoryItem[]> => {
  const response = await apiClient.get<ConfigCategoryItem[]>('/admin/config-categories');
  return response.data;
};
export const createConfigCategory = async (data: {
  config_type_id: string;
  sell_type: string;
  name?: string;
  admin_cost_per_unit: number;
  shop_price_per_unit?: number;
  allow_test?: boolean;
}): Promise<ConfigCategoryItem> => {
  const response = await apiClient.post<ConfigCategoryItem>('/admin/config-categories', data);
  return response.data;
};
export const updateConfigCategory = async (id: string, data: {
  name?: string;
  admin_cost_per_unit?: number;
  shop_price_per_unit?: number;
  config_type_id?: string;
  sell_type?: string;
  allow_test?: boolean;
}): Promise<ConfigCategoryItem> => {
  const response = await apiClient.patch<ConfigCategoryItem>(`/admin/config-categories/${id}`, data);
  return response.data;
};
export const deleteConfigCategory = async (id: string): Promise<any> => {
  const response = await apiClient.delete(`/admin/config-categories/${id}`);
  return response.data;
};

// سرویس‌های Package
export interface AdminPackageItem {
  id: string;
  config_category_id: string;
  name: string;
  data_limit_gb: number;
  duration_days: number;
  is_active: boolean;
}
export const adminGetPackages = async (): Promise<AdminPackageItem[]> => {
  const response = await apiClient.get<AdminPackageItem[]>('/admin/packages');
  return response.data;
};
export const adminCreatePackage = async (data: {
  config_category_id: string;
  name: string;
  data_limit_gb: number;
  duration_days: number;
}): Promise<AdminPackageItem> => {
  const response = await apiClient.post<AdminPackageItem>('/admin/packages', data);
  return response.data;
};
export const adminDeletePackage = async (id: string): Promise<any> => {
  const response = await apiClient.delete(`/admin/packages/${id}`);
  return response.data;
};
export const adminUpdatePackage = async (id: string, data: Partial<AdminPackageItem>): Promise<AdminPackageItem> => {
  const response = await apiClient.patch<AdminPackageItem>(`/admin/packages/${id}`, data);
  return response.data;
};

export const getSettlementDashboard = async (params?: { page?: number; page_size?: number; user_id?: string }): Promise<SettlementDashboardResponse> => {
  const response = await apiClient.get<SettlementDashboardResponse>('/admin/settlements/', { params });
  return response.data;
};

export const createSettlement = async (userId: string, amount: number, trackingCode: string): Promise<SettlementResponse> => {
  const response = await apiClient.post('/admin/settlements/', {
    user_id: userId,
    amount,
    tracking_code: trackingCode,
  });
  return response.data;
};

export interface ServerResponse {
  id: string;
  name: string;
  base_url: string;
  sub?: string;
  username: string;
  password?: string;
  is_active: boolean;
  type: string;
  owner_id?: string;
  owner?: {
    id: string;
    username: string;
  } | null;
}

export interface ServerCreateInput {
  name: string;
  base_url: string;
  sub?: string;
  username: string;
  password?: string;
  is_active: boolean;
  type: string;
}

export interface ServerUpdateInput {
  name?: string;
  base_url?: string;
  sub?: string;
  username?: string;
  password?: string;
  is_active?: boolean;
  type?: string;
}

export const getServers = async (): Promise<ServerResponse[]> => {
  const response = await apiClient.get('/admin/servers/');
  return response.data;
};

export const createServer = async (data: ServerCreateInput): Promise<ServerResponse> => {
  const response = await apiClient.post('/admin/servers/', data);
  return response.data;
};

export const updateServer = async (id: string, data: ServerUpdateInput): Promise<ServerResponse> => {
  const response = await apiClient.patch(`/admin/servers/${id}`, data);
  return response.data;
};

export const deleteServer = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/servers/${id}`);
};

export interface SettlementResponse {
  id: string;
  user_id: string;
  amount: number;
  tracking_code: string | null;
  created_at: string;
}

export interface SettlementDashboardResponse {
  total_debt: number;
  total_paid: number;
  remaining_debt: number;
  history: {
    total_count: number;
    total_pages: number;
    current_page: number;
    page_size: number;
    items: SettlementResponse[];
  };
}

export interface TransactionItem {
  id: string;
  amount: number;
  balance_after: number;
  type: 'DEPOSIT' | 'PURCHASE';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  gateway: 'MANUAL' | 'ZARINPAL' | 'CRYPTO';
  description: string | null;
  created_at: string;
  username: string | null;
  phone_number: string | null;
  reference_id: string | null;
}

export interface PaginatedTransactionsResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  items: TransactionItem[];
}

export const getTransactions = async (
  page = 1,
  pageSize = 10,
  phoneNumber?: string
): Promise<PaginatedTransactionsResponse> => {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('page_size', String(pageSize));
  if (phoneNumber) params.append('phone_number', phoneNumber);

  const response = await apiClient.get<PaginatedTransactionsResponse>(`/admin/transactions?${params.toString()}`);
  return response.data;
};


// Product Accounts & Reports APIs for Admin


export interface AdminProductAccount {
  id: string;
  name: string;
  description?: string;
  price?: number;
  is_unique: boolean;
  is_active: boolean;
  image_url?: string;
  frontend_key?: string;
  fields_schema: {
    properties: Record<string, {
      type: string;
      required: boolean;
      is_private?: boolean;
      icon?: string;
      hint?: string;
      multiline?: boolean;
    }>;
  };
  created_at: string;
  stock: number;
}

export interface AdminProductAccountCreatePayload {
  name: string;
  description?: string;
  price?: number | null;
  is_unique: boolean;
  is_active?: boolean;
  image_url?: string;
  frontend_key?: string;
  fields_schema: {
    properties: Record<string, {
      type: string;
      required: boolean;
      is_private?: boolean;
      icon?: string;
      hint?: string;
      multiline?: boolean;
    }>;
  };
}

export interface AdminAccountReport {
  id: string;
  purchase_id: string;
  sold_account_id: string;
  shopkeeper_id: string;
  supplier_id: string;
  reason: string;
  status: 'PENDING' | 'APPROVED_BY_ADMIN' | 'REJECTED_BY_ADMIN' | 'RESOLVED_BY_SUPPLIER' | 'REJECTED_BY_SUPPLIER';
  replacement_sold_account_id?: string;
  created_at: string;
  resolved_at?: string;
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

export const getAdminProductAccounts = async (): Promise<AdminProductAccount[]> => {
  const response = await apiClient.get('/admin/accounts/products');
  return response.data;
};

export const createAdminProductAccount = async (payload: AdminProductAccountCreatePayload): Promise<AdminProductAccount> => {
  const response = await apiClient.post('/admin/accounts/products', payload);
  return response.data;
};

export const updateAdminProductAccount = async (id: string, payload: Partial<AdminProductAccountCreatePayload>): Promise<AdminProductAccount> => {
  const response = await apiClient.patch(`/admin/accounts/products/${id}`, payload);
  return response.data;
};

export const deleteAdminProductAccount = async (id: string): Promise<void> => {
  await apiClient.delete(`/admin/accounts/products/${id}`);
};

export const recalculateProductStock = async (id: string): Promise<{ stock: number }> => {
  const response = await apiClient.post(`/admin/accounts/products/${id}/sync-stock`);
  return response.data;
};

export const getAdminAccountReports = async (): Promise<AdminAccountReport[]> => {
  const response = await apiClient.get('/admin/accounts/reports');
  return response.data;
};

export const approveAdminReport = async (reportId: string): Promise<void> => {
  await apiClient.post(`/admin/accounts/reports/${reportId}/approve`);
};

export const rejectAdminReport = async (reportId: string): Promise<void> => {
  await apiClient.post(`/admin/accounts/reports/${reportId}/reject`);
};

export interface UserDebtItem {
  user_id: string;
  username: string;
  role: string;
  balance: number;
  credit_limit: number;
  debt_amount: number;
  remaining_debt: number;
  total_debt: number;
  total_paid: number;
  shop_name?: string;
  phone_number?: string;
  last_settlement_at?: string;
}



export const getAdminUserDebts = async (): Promise<UserDebtItem[]> => {
  const response = await apiClient.get('/admin/settlements/debts');
  return response.data;
};




