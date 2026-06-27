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
  active_services_count: number;
  total_cost: number;
  total_revenue: number;
  net_profit: number;
}

export interface SystemSettings {
  dashboard_message: string;
  dashboard_message_type: 'success' | 'warning' | 'error' | 'info';
  dashboard_version: string;
}

// --- API Calls ---

export const getAllShops = async (page: number = 1, size: number = 10, phone?: string) => {
  const params = new URLSearchParams({ page: String(page), page_size: String(size) });
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
}
export const getConfigTypes = async (): Promise<ConfigTypeItem[]> => {
  const response = await apiClient.get<ConfigTypeItem[]>('/admin/config-types');
  return response.data;
};
export const createConfigType = async (data: { name: string; description?: string }): Promise<ConfigTypeItem> => {
  const response = await apiClient.post<ConfigTypeItem>('/admin/config-types', data);
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
  shop_price_per_unit: number;
}): Promise<ConfigCategoryItem> => {
  const response = await apiClient.post<ConfigCategoryItem>('/admin/config-categories', data);
  return response.data;
};
export const updateConfigCategory = async (id: string, data: {
  name?: string;
  admin_cost_per_unit?: number;
  shop_price_per_unit?: number;
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