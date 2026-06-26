import { apiClient } from '../../core/api/axios';







// List of Configs
export interface ConfigItem {
  id: string;
  marzban_username: string;
  sub_link: string;
  data_limit: number;
  expire_date: string;
  shop_buy_price: number;
  shop_sell_price: number;
  created_at: string;
}

export interface PaginatedConfigs {
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  items: ConfigItem[];
}


export const getShopConfigs = async (page: number = 1, size: number = 10): Promise<PaginatedConfigs> => {
  const response = await apiClient.get<PaginatedConfigs>(`/shop/configs?page=${page}&size=${size}`);
  return response.data;
};


// UserProfile
export interface UserProfile {
  username: string;
  phone_number: string;
  id: string;
  balance: number;
  credit_limit: number;
  price_per_gb: number;
  sell_price_per_gb: number;
  role: string;
  is_active: boolean;
  created_at: string;
}
export interface SystemSettings {
  dashboard_message: string;
  dashboard_message_type: 'success' | 'warning' | 'error' | 'info';
  dashboard_version: string;
}

export const getSettings = async (): Promise<SystemSettings> => {
  const response = await apiClient.get<SystemSettings>('/static/settings');
  return response.data;
};
export const getProfile = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/shop/me');
  return response.data;
};



export interface DashboardStats {
  total_sales_count: number;
  active_services_count: number;
  total_cost: number;
  total_revenue: number;
  net_profit: number;
}
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/shop/dashboard');
  return response.data;
};




export const updateSellPricePerGb = async (sell_price_per_gb: number) => {
  const response = await apiClient.patch('/shop/settings/sell-price', {
    sell_price_per_gb,
  });
  return response.data;
};



export interface ChangePasswordPayload {
  old_password: string;
  new_password: string;
}

export const changePassword = async (payload: ChangePasswordPayload) => {
  const response = await apiClient.put('/shop/me/password', payload);
  return response.data;
};




export interface PackageItem {
  id: string;
  name: string;
  data_limit_gb: number;
  duration_days: number;
  base_fee: number;
  cost_price: number;
  sell_price: number;
}

export interface PurchaseResult {
  config_details: {
    marzban_username: string;
    sub_link: string;
    expire_date: string;
    price_paid: number;
  };
}

export const getShopPackages = async (): Promise<PackageItem[]> => {
  const response = await apiClient.get<PackageItem[]>('/shop/packages');
  return response.data;
};

export const purchasePackage = async (packageId: string): Promise<PurchaseResult> => {
  const response = await apiClient.post<PurchaseResult>(`/shop/purchase/${packageId}`);
  return response.data;
};