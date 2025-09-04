import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", Projects: 30, Villages: 20 },
  { name: "Feb", Projects: 45, Villages: 25 },
  { name: "Mar", Projects: 50, Villages: 40 },
  { name: "Apr", Projects: 70, Villages: 35 },
  { name: "May", Projects: 90, Villages: 50 },
];

export default function BarChartCard() {
  return (
    <div className="card bg-white shadow-xl rounded-2xl">
      <div className="card-body p-6">
        <h2 className="card-title text-gray-700 mb-4">
          Projects vs Villages
        </h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  border: "1px solid #E5E7EB",
                }}
              />
              <Bar
                dataKey="Projects"
                fill="url(#projectsGradient)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="Villages"
                fill="url(#villagesGradient)"
                radius={[6, 6, 0, 0]}
              />

              <defs>
                <linearGradient id="projectsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="villagesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F472B6" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#EF4444" stopOpacity={0.7} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
