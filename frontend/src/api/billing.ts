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