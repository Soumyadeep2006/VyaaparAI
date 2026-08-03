import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import { useRevenue } from "../../hooks/useRevenue";

interface RevenueData {
  month: string;
  revenue: number;
}

export default function RevenueChart() {
  const { data, isLoading, isError } = useRevenue();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text-primary">
          Revenue Overview
        </h2>

        <p className="mt-2 text-sm text-text-secondary">
          Loading revenue...
        </p>

        <div className="mt-6 h-80 animate-pulse rounded-xl bg-surface-2" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-surface p-6 shadow-sm">
        <h2 className="text-xl font-bold text-text-primary">
          Revenue Overview
        </h2>

        <p className="mt-2 text-sm text-red-600">
          Unable to load revenue data.
        </p>
      </div>
    );
  }

  const revenueData: RevenueData[] = data ?? [];

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary">
          Revenue Overview
        </h2>

        <p className="text-sm text-text-secondary">
          Monthly revenue performance
        </p>
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        {revenueData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-text-secondary">
            No revenue data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData}
              margin={{
                top: 10,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
              />

              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 12,
                  fill: "var(--text-secondary)",
                }}
                axisLine={{
                  stroke: "var(--border)",
                }}
                tickLine={{
                  stroke: "var(--border)",
                }}
              />

              <YAxis
                tick={{
                  fontSize: 12,
                  fill: "var(--text-secondary)",
                }}
                axisLine={{
                  stroke: "var(--border)",
                }}
                tickLine={{
                  stroke: "var(--border)",
                }}
                tickFormatter={(value) =>
                  `₹${Number(value) / 1000}k`
                }
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  color: "var(--text)",
                }}
                labelStyle={{
                  color: "var(--text)",
                }}
                itemStyle={{
                  color: "var(--text)",
                }}
                formatter={(value) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "var(--primary)",
                }}
                activeDot={{
                  r: 6,
                  fill: "var(--primary)",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}