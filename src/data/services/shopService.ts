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
  discount_percent: number;
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




export interface ShopCustomPriceItem {
  id: string;
  config_category_id: string;
  config_type_name?: string;
  sell_type?: string;
  category_name?: string;
  sell_price_per_unit: number;
}

export const getShopCustomPrices = async (): Promise<ShopCustomPriceItem[]> => {
  const response = await apiClient.get<ShopCustomPriceItem[]>('/shop/custom-prices');
  return response.data;
};

export const updateShopCustomPrice = async (id: string, sell_price_per_unit: number): Promise<any> => {
  const response = await apiClient.put(`/shop/custom-prices/${id}`, { sell_price_per_unit });
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




export interface ConfigCategoryItem {
  id: string;
  config_type_id: string;
  sell_type: string;
  name?: string;
  admin_cost_per_unit: number;
  shop_price_per_unit: number;
  config_type?: {
    id: string;
    name: string;
    description?: string;
  };
}

export interface PackageItem {
  id: string;
  config_category_id: string;
  name: string;
  data_limit_gb: number;
  duration_days: number;
  cost_price: number;
  sell_price: number;
  category_name?: string;
  config_type_name?: string;
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

export const getShopCategories = async (): Promise<ConfigCategoryItem[]> => {
  const response = await apiClient.get<ConfigCategoryItem[]>('/shop/categories');
  return response.data;
};

export const purchasePackage = async (packageId: string, customSellPrice?: number | null): Promise<PurchaseResult> => {
  const body = customSellPrice !== undefined && customSellPrice !== null ? { custom_sell_price: customSellPrice } : undefined;
  const response = await apiClient.post<PurchaseResult>(`/shop/purchase/${packageId}`, body);
  return response.data;
};

export interface ConfigUsageResponse {
  username: string;
  status: string;
  used_traffic: number;
  lifetime_used_traffic: number;
  data_limit: number;
  expire: number | null;
  on_hold_expire_duration: number;
  on_hold_timeout: string | null;
  online_at: string | null;
  sub_updated_at: string | null;
  created_at: string;
  links: string[];
}

export const getConfigUsage = async (username: string): Promise<ConfigUsageResponse> => {
  const response = await apiClient.get<ConfigUsageResponse>(`/shop/configs/${username}/usage`);
  return response.data;
};

export const requestZarinpalCharge = async (amount: number): Promise<{ payment_url: string }> => {
  const response = await apiClient.post('/payments/zarinpal/request', { amount });
  return response.data;
};
