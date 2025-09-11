// src/components/Loader.jsx
export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-4 border-white/30 animate-ping absolute" />

        <span className="loading loading-spinner loading-lg text-white relative z-10"></span>

        <p className="mt-6 text-center text-white font-bold tracking-widest drop-shadow-lg">
          Loading LIMS...
        </p>
      </div>
    </div>
  );
}
