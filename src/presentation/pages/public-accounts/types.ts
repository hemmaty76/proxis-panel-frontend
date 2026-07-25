export interface AccountLayoutProps {
  accountData: {
    product_name: string;
    product_description: string | null;
    public_fields: Record<string, any>;
    private_fields: Record<string, any>;
    customer_phone: string | null;
    purchased_at: string;
    shop_name: string | null;
    shop_support_channel: string | null;
    shop_support_id: string | null;
    shop_support_phone: string | null;
  };
  mainFields: [string, any][];
  securityFields: [string, any][];
  otherFields: [string, any][];
  copiedKey: string | null;
  handleCopy: (text: string, key: string) => void;
  translateKey: (key: string) => string;
}
