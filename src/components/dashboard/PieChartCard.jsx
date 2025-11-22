import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import useFetchDashboard from "../../hooks/useFetchDashboard";

const COLORS = ["#6366F1", "#EC4899", "#F59E0B"];

export default function PieChartCard() {
  const { data, loading, error } = useFetchDashboard();
  console.log('piechart dataaaa', data)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading dashboard</p>;

  // Convert API object → array for Recharts
  const landObj = data?.land_distribution || {};
  console.log('piechart dataaaa', landObj)

  const lands = [
    { name: "Govt Land", value: Number(landObj.govt_land || 1) },
    { name: "Pvt Land", value: Number(landObj.pvt_land || 2) },
    { name: "Forest Land", value: Number(landObj.forest_land || 3) },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold mb-4">Land Distribution</h3>

      <PieChart width={400} height={300}>
        <Pie
          data={lands}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {lands.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
