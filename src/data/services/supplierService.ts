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

// Supplier Account Management & Reports APIs

export interface ProductAccount {
  id: string;
  name: string;
  description?: string;
  price?: number;
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

export interface SupplierAccount {
  id: string;
  product_id: string;
  product_name: string;
  is_unique: boolean;
  price: number;
  customer_phone?: string;
  public_fields: Record<string, any>;
  private_fields: Record<string, any>;
  created_at: string;
  offer_title?: string;
  warranty_days?: number;
}

export interface SupplierProductPrice {
  id: string;
  product_id: string;
  price: number;
  title?: string;
  warranty_days?: number;
  description?: string;
  product_name?: string;
}


export interface SupplierAccountReport {
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

export const getSupplierTemplates = async (): Promise<ProductAccount[]> => {
  const response = await apiClient.get('/supplier/accounts/products');
  return response.data;
};

export const getSupplierAccounts = async (): Promise<SupplierAccount[]> => {
  const response = await apiClient.get('/supplier/accounts');
  return response.data;
};

export const registerSupplierAccount = async (payload: {
  product_id: string;
  offer_id?: string;
  price?: number;
  customer_phone?: string;
  public_fields: Record<string, any>;
  private_fields: Record<string, any>;
  warranty_days?: number;
  description?: string;
}): Promise<SupplierAccount> => {
  const response = await apiClient.post('/supplier/accounts', payload);
  return response.data;
};


export const deleteSupplierAccount = async (id: string): Promise<void> => {
  await apiClient.delete(`/supplier/accounts/${id}`);
};

export const getSupplierPrices = async (): Promise<SupplierProductPrice[]> => {
  const response = await apiClient.get('/supplier/accounts/prices');
  return response.data;
};

export const setSupplierPrice = async (payload: {
  product_id: string;
  price: number;
  title?: string;
  warranty_days?: number;
  description?: string;
  offer_id?: string;
}): Promise<SupplierProductPrice> => {
  const response = await apiClient.post('/supplier/accounts/prices', payload);
  return response.data;
};

export const deleteSupplierOffer = async (offerId: string): Promise<void> => {
  await apiClient.delete(`/supplier/accounts/prices/${offerId}`);
};

export const getSupplierReports = async (): Promise<SupplierAccountReport[]> => {
  const response = await apiClient.get('/supplier/accounts/reports');
  return response.data;
};

export const approveSupplierReport = async (reportId: string, payload?: { public_fields: Record<string, any>; private_fields: Record<string, any> }): Promise<any> => {
  const response = await apiClient.post(`/supplier/accounts/reports/${reportId}/approve`, payload);
  return response.data;
};

export const rejectSupplierReport = async (reportId: string): Promise<any> => {
  const response = await apiClient.post(`/supplier/accounts/reports/${reportId}/reject`);
  return response.data;
};


