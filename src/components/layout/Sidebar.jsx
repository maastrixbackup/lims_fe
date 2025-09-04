import { motion } from "framer-motion";
import {
  Menu,
  LayoutDashboard,
  Map,
  TreePine,
  MapPin,
  Grid3x3,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Projects", icon: <Map size={20} /> },
    { name: "Villages", icon: <TreePine size={20} /> },
    { name: "Plots", icon: <MapPin size={20} /> },
    { name: "Sub-Plots", icon: <Grid3x3 size={20} /> },
  ];

  return (
    <motion.div
      animate={{ width: open ? 260 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 shadow-2xl flex flex-col h-screen rounded-r-3xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {open && (
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-extrabold tracking-wide text-white drop-shadow-sm"
          >
            LIMS
          </motion.h1>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 hover:bg-white/20 rounded-lg transition"
        >
          <Menu size={22} className="text-white" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-3">
        {menuItems.map((item) => (
          <motion.div
            key={item.name}
            onClick={() => setActive(item.name)}
            whileHover={{ scale: 1.07, x: 6 }}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300
              ${
                active === item.name
                  ? "bg-white/25 text-white shadow-lg backdrop-blur-md"
                  : "hover:bg-white/10 text-gray-100"
              }
            `}
          >
            <span
              className={`${
                active === item.name ? "text-yellow-300" : "text-white"
              }`}
            >
              {item.icon}
            </span>
            {open && (
              <span
                className={`tracking-wide ${
                  active === item.name ? "font-semibold" : ""
                }`}
              >
                {item.name}
              </span>
            )}
          </motion.div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/20 text-xs text-white/80">
        {open ? "© 2025 LIMS" : "©"}
      </div>
    </motion.div>
  );
}
