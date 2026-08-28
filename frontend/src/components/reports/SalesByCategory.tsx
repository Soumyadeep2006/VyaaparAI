import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useCategoryAnalytics } from "../../hooks/useReports";
const COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#EF4444", "#8B5CF6", "#14B8A6"];
export default function SalesByCategory() {
  const { data = [], isLoading, isError } = useCategoryAnalytics();
  return <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm"><h2 className="mb-1 text-xl font-semibold text-text-primary">Sales by Category</h2><p className="mb-4 text-sm text-text-secondary">Calculated from invoice line items</p>{isError ? <p className="py-20 text-center text-red-600">Unable to load category data.</p> : isLoading ? <div className="h-80 animate-pulse rounded-xl bg-surface-2"/> : data.length === 0 ? <p className="py-20 text-center text-text-secondary">No category sales yet.</p> : <div className="h-80"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="value" nameKey="name" outerRadius={110} label>{data.map((_: unknown, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}</Pie><Tooltip formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}/><Legend/></PieChart></ResponsiveContainer></div>}</div>;
}
