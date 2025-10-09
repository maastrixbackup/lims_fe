import { motion } from "framer-motion";
import {
  Menu,
  LayoutDashboard,
  Map,
  ChevronDown,
  ChevronRight,
  ChartBarBig,
  ImageUp,
  User2Icon,
} from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.jpeg";
import { useNavigate, useLocation } from "react-router";

export default function Sidebar({ open, setOpen }) {
  const [active, setActive] = useState(
    localStorage.getItem("activeMenu") || "Dashboard"
  );
  const [expanded, setExpanded] = useState(
    localStorage.getItem("expandedMenu") || null
  );
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Get current user + role
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role_name?.trim();

  // 🔹 All menu items + their allowed roles
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "dashboard",
      roles: ["Super Admin", "Admin", "Client"],
    },
    {
      name: "Lands",
      icon: <Map size={20} />,
      submenu: ["Projects", "Villages", "Khatas", "Plots"],
      roles: ["Super Admin", "Admin"],
    },
    {
      name: "User Management",
      icon: <User2Icon size={20} />,
      path: "usersmanagement",
      roles: ["Super Admin", "Client"],
    },
    {
      name: "Import/Export",
      icon: <ImageUp size={20} />,
      path: "import",
      roles: ["Super Admin", "Admin"],
    },
    {
      name: "Reports",
      icon: <ChartBarBig size={20} />,
      path: "reports",
      roles: ["Super Admin"],
    },
  ];

  // 🔹 Filter menus based on user role
  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  // 🔹 Save active/expanded to localStorage
  useEffect(() => {
    localStorage.setItem("activeMenu", active);
  }, [active]);

  useEffect(() => {
    if (expanded) {
      localStorage.setItem("expandedMenu", expanded);
    } else {
      localStorage.removeItem("expandedMenu");
    }
  }, [expanded]);

  // 🔹 Sync active menu with current URL on refresh
  useEffect(() => {
    const path = location.pathname.replace("/", "");
    if (path) {
      const foundSubmenu = menuItems.find((m) =>
        m.submenu?.includes(capitalize(path))
      );
      if (foundSubmenu) {
        setExpanded(foundSubmenu.name);
        setActive(capitalize(path));
      } else {
        setActive("Dashboard");
      }
    }
  }, [location.pathname]);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const toggleSubmenu = (name) => {
    setExpanded(expanded === name ? null : name);
  };

  return (
    <motion.div
      animate={{ width: open ? 260 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 shadow-2xl flex flex-col rounded-r-3xl overflow-hidden z-50"
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

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredMenu.map((item) => (
          <div key={item.name}>
            {/* Main Menu */}
            <motion.div
              onClick={() => {
                if (item.submenu) {
                  toggleSubmenu(item.name);
                } else {
                  setActive(item.name);
                  navigate("/" + item.path.toLowerCase());
                }
              }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(sub);
                      navigate("/" + sub.toLowerCase());
                    }}
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
