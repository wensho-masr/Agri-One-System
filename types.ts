
export enum InvoiceStatus {
  Pending = 'جاري التوصيل',
  Delivered = 'تم التوصيل',
  Collected = 'تم التحصيل'
}

export enum CustomerCategory {
  New = 'عميل جديد',
  Regular = 'عميل دائم',
  Wholesaler = 'تاجر جملة',
  Farm = 'مزرعة'
}

export interface InvoiceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Invoice {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCategory: CustomerCategory;
  items: InvoiceItem[];
  status: InvoiceStatus;
  notes: string;
  date: string;
  total: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  category: CustomerCategory;
}
