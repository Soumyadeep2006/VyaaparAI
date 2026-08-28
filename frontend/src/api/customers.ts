import api from "./axios";
import type { Customer } from "../types/customer";

export const getCustomers = async (): Promise<Customer[]> => {
  const res = await api.get("/api/customers/");

  return Array.isArray(res.data)
    ? res.data
    : [];
};


export const createCustomer = async (
  data: Omit<Customer, "id">
) => {
  const res = await api.post(
    "/api/customers/",
    data
  );

  return res.data;
};


export const updateCustomer = async (
  id: string,
  data: Partial<Customer>
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