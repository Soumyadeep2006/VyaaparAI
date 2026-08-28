import api from "./axios";

export const getInvoices = async () => {
  const response = await api.get("/api/billing/");
  return response.data;
};

export const createInvoice = async (data: unknown) => {
  const response = await api.post("/api/billing/", data);
  return response.data;
};

export const updateInvoiceStatus = async (
  invoiceId: string | number,
  status: "Pending" | "Paid" | "Cancelled"
) => {
  const response = await api.patch(
    `/api/billing/${invoiceId}/status`,
    null,
    {
      params: {
        status,
      },
    }
  );

  return response.data;
};

export interface RazorpayOrder {
  key_id: string;
  order_id: string;
  amount: number;
  currency: string;
  invoice_id: string;
  customer: string;
}

export const createRazorpayOrder = async (invoiceId: string) => {
  const response = await api.post<RazorpayOrder>(
    `/api/billing/${invoiceId}/payment/order`
  );
  return response.data;
};

export const verifyRazorpayPayment = async (
  invoiceId: string,
  data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
) => {
  const response = await api.post(
    `/api/billing/${invoiceId}/payment/verify`,
    data
  );
  return response.data;
};
