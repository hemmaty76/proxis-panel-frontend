import { apiClient } from '../../core/api/axios';
import { type ConfigItem } from './shopService';
import { type AdminUserItem } from './adminService';

export interface VisitorDashboardStats {
  total_earnings: number;
  total_paid: number;
  remaining_balance: number;
  total_sales_count: number;
  active_services_count: number;
  test_configs_count: number;
}

export interface VisitorConfigsResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  items: ConfigItem[];
}

export interface TestConfigCreateInput {
  config_type_id: string;
  username: string;
  description: string;
}

export interface TestConfigResult {
  username: string;
  subscription_url: string;
}

export interface TestConfigItem {
  id: string;
  marzban_username: string;
  sub_link: string;
  data_limit: number;
  expire_date: string | null;
  description: string;
  created_at: string;
  visitor_id: string;
  visitor_username?: string;
  server_id: string;
  server_name?: string;
}

export interface VisitorTestConfigsResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  items: TestConfigItem[];
}

export const getVisitorDashboard = async (): Promise<VisitorDashboardStats> => {
  const response = await apiClient.get<VisitorDashboardStats>('/visitor/dashboard');
  return response.data;
};

export interface VisitorShopsResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  items: AdminUserItem[];
}

export const getVisitorShops = async (page: number = 1, size: number = 10): Promise<VisitorShopsResponse> => {
  const response = await apiClient.get<VisitorShopsResponse>(`/visitor/shops?page=${page}&page_size=${size}`);
  return response.data;
};

export const getVisitorConfigs = async (page: number = 1, size: number = 10): Promise<VisitorConfigsResponse> => {
  const response = await apiClient.get<VisitorConfigsResponse>(`/visitor/configs?page=${page}&page_size=${size}`);
  return response.data;
};

export const createShopUnderVisitor = async (data: any): Promise<AdminUserItem> => {
  const response = await apiClient.post<AdminUserItem>('/visitor/shops', data);
  return response.data;
};

export const createVisitorTestConfig = async (data: TestConfigCreateInput): Promise<TestConfigResult> => {
  const response = await apiClient.post<TestConfigResult>('/visitor/test-config', data);
  return response.data;
};

export const getVisitorTestConfigs = async (page: number = 1, size: number = 10): Promise<VisitorTestConfigsResponse> => {
  const response = await apiClient.get<VisitorTestConfigsResponse>(`/visitor/test-configs?page=${page}&page_size=${size}`);
  return response.data;
};

export const updateVisitorTestConfigDescription = async (configId: string, description: string): Promise<any> => {
  const response = await apiClient.put(`/visitor/test-configs/${configId}/description`, { description });
  return response.data;
};
