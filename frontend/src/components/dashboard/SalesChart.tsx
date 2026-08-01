import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Electronics", value: 420 },
  { name: "Fashion", value: 280 },
  { name: "Food", value: 180 },
  { name: "Others", value: 120 },
];

const COLORS = [
  "#2B6F79",
  "#3CAEA3",
  "#F6C85F",
  "#ED553B",
];

export default function SalesChart() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-text-primary">
        Sales Category
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={90}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}