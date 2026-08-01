import api from "./axios";

export const getCustomers = async () => {
  const res = await api.get("/api/customers/");
  return res.data;
};

export const createCustomer = async (data: any) => {
  const res = await api.post("/api/customers/", data);
  return res.data;
};

export const updateCustomer = async (
  id: string,
  data: any
) => {
  const res = await api.put(
    `/api/customers/${id}`,
    data
  );

  return res.data;
};

export const deleteCustomer = async (
  id: string
) => {
  const res = await api.delete(
    `/api/customers/${id}`
  );

  return res.data;
};