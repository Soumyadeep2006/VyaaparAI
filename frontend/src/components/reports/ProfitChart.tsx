import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { monthlyRevenue } from "../../constants/reportsData";

export default function ProfitChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <h2 className="mb-6 text-xl font-semibold">
        Monthly Profit
      </h2>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={monthlyRevenue}>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <Tooltip />

          <Bar
            dataKey="profit"
            fill="#16A34A"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}