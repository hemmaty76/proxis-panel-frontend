import { apiClient } from '../../core/api/axios';
import { type PurchaseItem } from './shopService';

export interface SupplierDashboardStats {
  total_debt: number;
  total_paid: number;
  remaining_debt: number;
  total_sales_count: number;
}

export interface SupplierSalesSummaryItem {
  server_name: string;
  config_type_name: string;
  sell_type: string;
  package_name?: string;
  sales_count: number;
  total_cost: number;
}

export interface SupplierConfigsResponse {
  total_count: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  items: PurchaseItem[];
}

export const getSupplierDashboard = async (): Promise<SupplierDashboardStats> => {
  const response = await apiClient.get<SupplierDashboardStats>('/supplier/dashboard');
  return response.data;
};

export const getSupplierSalesSummary = async (): Promise<SupplierSalesSummaryItem[]> => {
  const response = await apiClient.get<SupplierSalesSummaryItem[]>('/supplier/sales-summary');
  return response.data;
};

export const getSupplierConfigs = async (page: number = 1, size: number = 10): Promise<SupplierConfigsResponse> => {
  const response = await apiClient.get<SupplierConfigsResponse>(`/supplier/configs?page=${page}&page_size=${size}`);
  return response.data;
};
