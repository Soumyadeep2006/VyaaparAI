import { useQuery } from "@tanstack/react-query";
import { getInvoices } from "../api/billing";

export function useBilling() {
  return useQuery({
    queryKey: ["billing"],
    queryFn: getInvoices,
  });
}