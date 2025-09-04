import { motion } from "framer-motion";
import { Menu, LayoutDashboard, Map, TreePine, MapPin, Grid3x3 } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Projects", icon: <Map size={18} /> },
    { name: "Villages", icon: <TreePine size={18} /> },
    { name: "Plots", icon: <MapPin size={18} /> },
    { name: "Sub-Plots", icon: <Grid3x3 size={18} /> },
  ];

  return (
    <motion.div
      animate={{ width: open ? 256 : 80 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-lg flex flex-col h-screen"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className={`text-lg font-bold ${!open && "hidden"}`}>LIMS</h1>
        <button onClick={() => setOpen(!open)} className="p-2 hover:bg-gray-100 rounded-lg">
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition 
              ${active === item.name ? "bg-indigo-100 text-indigo-600 font-semibold" : "hover:bg-gray-100"}
            `}
          >
            {item.icon}
            {open && <span>{item.name}</span>}
          </div>
        ))}
      </nav>
    </motion.div>
  );
}
