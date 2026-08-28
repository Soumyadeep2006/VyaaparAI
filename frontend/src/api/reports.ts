import api from "./axios";

export const getSalesReport = async () => (await api.get("/api/reports/sales")).data;
export const getDailySales = async () => (await api.get("/api/reports/daily")).data;
export const getMonthlySales = async () => (await api.get("/api/reports/monthly")).data;
export const getMonthlyRevenue = async () => (await api.get("/api/reports/revenue")).data;
export const getProductAnalytics = async () => (await api.get("/api/reports/products")).data;
export const getCategoryAnalytics = async () => (await api.get("/api/reports/categories")).data;
export const getRecentTransactions = async () => (await api.get("/api/reports/transactions")).data;
