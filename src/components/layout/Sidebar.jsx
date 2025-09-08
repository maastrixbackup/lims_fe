import { motion } from "framer-motion";
import {
  Menu,
  LayoutDashboard,
  Map,
  TreePine,
  MapPin,
  Grid3x3,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import logo from "../../assets/logo.jpeg";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("Dashboard");
  const [expanded, setExpanded] = useState(null); // track which submenu is expanded

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      submenu: ["Overview", "Analytics", "Reports"],
    },
    {
      name: "Projects",
      icon: <Map size={20} />,
      submenu: ["Active Projects", "Archived Projects"],
    },
    {
      name: "Villages",
      icon: <TreePine size={20} />,
      submenu: ["Village List", "Add Village"],
    },
    {
      name: "Plots",
      icon: <MapPin size={20} />,
      submenu: ["All Plots", "Add Plot"],
    },
    {
      name: "Sub-Plots",
      icon: <Grid3x3 size={20} />,
      submenu: ["All Sub-Plots", "Add Sub-Plot"],
    },
  ];

  const toggleSubmenu = (name) => {
    setExpanded(expanded === name ? null : name);
  };

  return (
    <motion.div
      animate={{ width: open ? 260 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 shadow-2xl flex flex-col h-screen rounded-r-3xl overflow-hidden"
    >
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          {open && (
            <>
              <motion.img
                src={logo}
                alt="LIMS Logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="w-10 h-10 object-contain rounded-md shadow-md bg-white"
              />
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-extrabold tracking-wide text-white drop-shadow-sm"
              >
                LIMS
              </motion.h1>
            </>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 hover:bg-white/20 rounded-lg transition"
        >
          <Menu size={22} className="text-white" />
        </button>
      </div>

      {/* Navigation with Submenus */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <div key={item.name}>
            {/* Main Menu */}
            <motion.div
              onClick={() =>
                item.submenu ? toggleSubmenu(item.name) : setActive(item.name)
              }
              whileHover={{ scale: 1.05, x: 4 }}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                active === item.name
                  ? "bg-white/25 text-white shadow-lg backdrop-blur-md"
                  : "hover:bg-white/10 text-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
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
              </div>
              {open && item.submenu && (
                <span>
                  {expanded === item.name ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </span>
              )}
            </motion.div>

            {/* Submenu */}
            {item.submenu && expanded === item.name && open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-10 mt-2 space-y-2"
              >
                {item.submenu.map((sub) => (
                  <div
                    key={sub}
                    onClick={() => setActive(sub)}
                    className={`cursor-pointer text-sm p-2 rounded-lg transition ${
                      active === sub
                        ? "bg-white/20 text-yellow-200"
                        : "text-gray-100 hover:bg-white/10"
                    }`}
                  >
                    {sub}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/20 text-xs text-white/80">
        {open ? "© 2025 LIMS" : "©"}
      </div>
    </motion.div>
  );
}
