import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import useFetchDashboard from "../../hooks/useFetchDashboard";

const COLORS = ["#6366F1", "#EC4899", "#F59E0B"];

export default function PieChartCard({ data }) {

  const landObj = data?.land_distribution || {};

  const lands = [
    { name: "Govt Land", value: Number(landObj.govt_land || 1) },
    { name: "Pvt Land", value: Number(landObj.pvt_land || 2) },
    { name: "Forest Land", value: Number(landObj.forest_land || 3) },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl w-full">
      <h3 className="text-lg font-semibold mb-4">Land Distribution</h3>

      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={lands}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              label
              dataKey="value"
              labelLine={false}
            >
              {lands.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
