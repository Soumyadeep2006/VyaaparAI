import api from "./axios";

export const getDashboard = async () => {
  const response = await api.get("/api/dashboard");
  return response.data;
};

export const getRevenueChart = async () => {
  const response = await api.get("/api/dashboard/revenue");
  return response.data;
};
