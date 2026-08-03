import api from "./axios";

export const getSalesReport = async () => {
  const res = await api.get("/api/reports/sales");
  return res.data;
};

export const getDailySales = async () => {
  const res = await api.get("/api/reports/daily");
  return res.data;
};

export const getMonthlySales = async () => {
  const res = await api.get("/api/reports/monthly");
  return res.data;
};