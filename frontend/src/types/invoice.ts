export interface Customer {
  id: number;
  name: string;
  phone: string;
}

export interface InvoiceItem {
  productId?: string;
  product?: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id?: string;
  _id?: string;
  customer: string;
  items?: InvoiceItem[];
  total: number;
  status?: "Pending" | "Paid" | "Cancelled";
  created_at?: string;
  date?: string;
}