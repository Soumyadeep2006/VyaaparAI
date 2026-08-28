import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useMonthlyRevenue } from "../../hooks/useReports";

export default function RevenueChart() {
  const { data = [], isLoading, isError } = useMonthlyRevenue();
  return <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm"><h2 className="mb-1 text-xl font-semibold text-text-primary">Monthly Revenue</h2><p className="mb-6 text-sm text-text-secondary">Real invoice revenue for the last 12 months</p>
    {isError ? <p className="py-20 text-center text-red-600">Unable to load revenue data.</p> : isLoading ? <div className="h-80 animate-pulse rounded-xl bg-surface-2"/> : data.length === 0 ? <p className="py-20 text-center text-text-secondary">No revenue data available.</p> : <div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/><XAxis dataKey="month"/><YAxis tickFormatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}/><Tooltip formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}/><Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }}/></LineChart></ResponsiveContainer></div>}
  </div>;
}
