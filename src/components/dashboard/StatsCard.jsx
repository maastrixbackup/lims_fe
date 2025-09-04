export default function StatsCard({ title, value, subtitle, gradient }) {
  return (
    <div className={`p-6 rounded-xl text-white ${gradient} shadow-md`}>
      <p className="text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-xs mt-1">{subtitle}</p>
    </div>
  );
}
