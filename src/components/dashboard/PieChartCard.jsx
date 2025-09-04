import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Projects", value: 12 },
  { name: "Villages", value: 24 },
  { name: "Plots", value: 40 },
  { name: "Sub-Plots", value: 30 },
];

const COLORS = ["#6366F1", "#EC4899", "#F59E0B", "#3B82F6"];

export default function PieChartCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4">Land Distribution</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
