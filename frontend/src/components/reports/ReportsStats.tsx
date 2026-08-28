import { IndianRupee, ShoppingCart, CheckCircle2, Clock3 } from "lucide-react";
import { useSalesReport } from "../../hooks/useReports";

export default function ReportsStats() {
  const { data, isLoading, isError } = useSalesReport();
  const stats = [
    { title: "Revenue", value: data?.total_sales ?? 0, icon: IndianRupee },
    { title: "Orders", value: data?.total_orders ?? 0, icon: ShoppingCart },
    { title: "Paid Orders", value: data?.paid_orders ?? 0, icon: CheckCircle2 },
    { title: "Pending Orders", value: data?.pending_orders ?? 0, icon: Clock3 },
  ];
  if (isError) return <div className="rounded-2xl border border-red-200 bg-white p-6 text-red-600">Unable to load report summary.</div>;
  return <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
    {stats.map(({ title, value, icon: Icon }) => <div key={title} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between"><div><p className="text-sm text-text-secondary">{title}</p><h2 className="mt-2 text-3xl font-bold text-text-primary">{isLoading ? "—" : title === "Revenue" ? `₹${Number(value).toLocaleString("en-IN")}` : value}</h2></div><div className="rounded-xl bg-surface-2 p-3 text-text-primary"><Icon size={26}/></div></div>
    </div>)}
  </div>;
}
