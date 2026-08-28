import { useQuery } from "@tanstack/react-query";
import { getSalesReport, getDailySales, getMonthlySales, getMonthlyRevenue, getProductAnalytics, getCategoryAnalytics, getRecentTransactions } from "../api/reports";

export const useSalesReport = () => useQuery({ queryKey: ["reports", "sales"], queryFn: getSalesReport });
export const useDailySales = () => useQuery({ queryKey: ["reports", "daily"], queryFn: getDailySales });
export const useMonthlySales = () => useQuery({ queryKey: ["reports", "monthly"], queryFn: getMonthlySales });
export const useMonthlyRevenue = () => useQuery({ queryKey: ["reports", "revenue"], queryFn: getMonthlyRevenue });
export const useProductAnalytics = () => useQuery({ queryKey: ["reports", "products"], queryFn: getProductAnalytics });
export const useCategoryAnalytics = () => useQuery({ queryKey: ["reports", "categories"], queryFn: getCategoryAnalytics });
export const useRecentTransactions = () => useQuery({ queryKey: ["reports", "transactions"], queryFn: getRecentTransactions });
