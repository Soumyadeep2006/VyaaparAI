import { useQuery } from "@tanstack/react-query";
import { getRevenueChart } from "../api/dashboard";

export function useRevenue() {
  return useQuery({
    queryKey: ["revenue"],
    queryFn: getRevenueChart,
  });
}