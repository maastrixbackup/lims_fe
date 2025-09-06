export default function StatsCard({ title, value, gradient }) {
  return (
    <div
      className={`
        p-6 rounded-xl text-white ${gradient} shadow-md
        transform transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-2xl
        cursor-pointer group relative overflow-hidden
      `}
    >
      {/* Animated background overlay */}
      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-white ring-opacity-0 group-hover:ring-opacity-30 transition-all duration-300"></div>

      {/* Content with enhanced hover animations */}
      <p className="text-sm transition-all duration-300 group-hover:text-opacity-90 group-hover:transform group-hover:translate-y-[-2px]">
        {title}
      </p>

      <h2 className="text-2xl font-bold transition-all duration-300 group-hover:scale-110 group-hover:text-shadow-lg">
        {value}
      </h2>

      {/* Subtle shine effect */}
      <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 group-hover:left-[100%] transition-all duration-700 ease-out"></div>
    </div>
  );
}
