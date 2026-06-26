import { apiClient } from '../../core/api/axios';

// --- Interfaces ---

export interface AdminUserItem {
  id: string;
  username: string;
  phone_number: string;
  description_admin: string;
  balance: number;
  credit_limit: number;
  price_per_gb: number;
  sell_price_per_gb: number;
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