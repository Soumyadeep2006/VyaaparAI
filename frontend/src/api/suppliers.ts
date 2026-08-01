import api from "./axios";

export const getSuppliers = async () => {
  const res = await api.get("/api/suppliers/");
  return res.data;
};

export const createSupplier = async (data: any) => {
  const res = await api.post(
    "/api/suppliers/",
    data
  );

  return res.data;
};

export const updateSupplier = async (
  id: string,
  data: any
) => {
  const res = await api.put(
    `/api/suppliers/${id}`,
    data
  );

  return res.data;
};

export const deleteSupplier = async (
  id: string
) => {
  const res = await api.delete(
    `/api/suppliers/${id}`
  );

  return res.data;
};