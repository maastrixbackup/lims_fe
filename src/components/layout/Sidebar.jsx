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
  Logs,
  LandPlotIcon,
  TreeDeciduous,
  Trash,
  MapPinHouse,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import logo from "../../assets/logo.jpeg";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role_name?.trim();

  const [active, setActive] = useState(
    localStorage.getItem("activeMenu") || "Dashboard"
  );

  const storedExpanded = localStorage.getItem("expandedMenu");
  const [expanded, setExpanded] = useState(
    storedExpanded !== "null" ? storedExpanded : null
  );

  // ✅ Helper function — moved above useEffect to fix hoisting bug
  const sanitize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).replace("-", " ");

  const menuItems = useMemo(
    () => [
      {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "dashboard",
        roles: ["Admin", "Data Entry User", "Viewer"],
      },
      {
        name: "Project",
        icon: LandPlotIcon,
        path: "projects",
        roles: ["Admin", "Data Entry User", "Viewer"],
      },
      {
        name: "Private Land",
        icon: Map,
        basePath: "private-land",
        submenu: ["Villages", "Khatas", "Plots", "Compensation", "Social Survey"],
        roles: ["Admin", "Data Entry User", "Viewer"],
      },
      {
        name: "Govt Land",
        icon: MapPinHouse,
        basePath: "govt-land",
        submenu: ["Village", "Khata", "Plot", "Compensation"],
        roles: ["Admin"],
      },
      {
        name: "Forest Land",
        icon: TreeDeciduous,
        basePath: "forest-land",
        submenu: ["Villages", "Khatas", "Plots", "Compensation"],
        roles: ["Admin"],
      },
      {
        name: "User Management",
        icon: User2Icon,
        path: "usersmanagement",
        roles: ["Admin"],
      },
      {
        name: "Import/Export",
        icon: ImageUp,
        path: "import",
        roles: ["Admin", "Data Entry User"],
      },
      {
        name: "Reports",
        icon: ChartBarBig,
        path: "reports",
        roles: ["Admin", "Data Entry User", "Viewer"],
      },
      { name: "Logs", icon: Logs, path: "logs", roles: ["Admin"] },
      {
        name: "Deleted Records",
        icon: Trash,
        path: "deletedrecords",
        roles: ["Admin"],
      },
    ],
    []
  );

  const filteredMenu = useMemo(
    () => menuItems.filter((item) => item.roles.includes(userRole)),
    [menuItems, userRole]
  );

  // ✅ Persist active & expanded menus
  useEffect(() => localStorage.setItem("activeMenu", active), [active]);
  useEffect(() => {
    expanded
      ? localStorage.setItem("expandedMenu", expanded)
      : localStorage.removeItem("expandedMenu");
  }, [expanded]);

  // ✅ Update active state on route change
  useEffect(() => {
    const path = location.pathname.replace("/", "");
    if (!path) return;

    const [main, sub] = path.split("/");

    const foundMain = menuItems.find(
      (m) => m.path?.toLowerCase() === main || m.basePath === main
    );

    if (foundMain) {
      setExpanded(foundMain.submenu ? foundMain.name : null);

      if (
        sub &&
        foundMain.submenu?.some(
          (s) => s.toLowerCase().replace(/\s+/g, "-") === sub
        )
      ) {
        setActive(sanitize(sub));
      } else {
        setActive(foundMain.name);
      }
    } else {
      setActive("Dashboard");
    }
  }, [location.pathname]);

  const handleClick = (item) => {
    if (item.submenu)
      return setExpanded(expanded === item.name ? null : item.name);
    setActive(item.name);
    navigate("/" + item.path.toLowerCase());
  };

  const handleSubClick = (parent, sub) => {
    setActive(sub);
    const path = `/${parent.basePath}/${sub
      .toLowerCase()
      .replace(/\s+/g, "-")}`;
    navigate(path);
  };

  return (
    <motion.div
      animate={{ width: open ? 260 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 shadow-2xl flex flex-col rounded-r-3xl overflow-hidden z-50" 
      
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        {open && (
          <div className="flex items-center gap-3">
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
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 hover:bg-white/20 rounded-lg transition"
        >
          <Menu size={22} className="text-white" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/60"  style={{
          // maxHeight: "350px",           
          scrollbarWidth: "thin",  
        }}
    >
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;
          const isExpanded = expanded === item.name;

          return (
            <div key={item.name} >
              <motion.div
                onClick={() => handleClick(item)}
                whileHover={{ x: 4 }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "bg-white/25 text-white shadow-md backdrop-blur-sm"
                    : "hover:bg-white/15 text-gray-100 hover:text-white"
                }`}
                
              >
                <div className="flex items-center gap-3" >
                  <Icon
                    className={`transition-colors duration-300 ${
                      isActive
                        ? "text-yellow-300"
                        : "text-white group-hover:text-yellow-200"
                    }`}
                    size={20}
                  />
                  {open && (
                    <span
                      className={`tracking-wide transition-colors duration-300 ${
                        isActive ? "font-semibold" : ""
                      }`}
                    >
                      {item.name}
                    </span>
                  )}
                </div>
                {open &&
                  item.submenu &&
                  (isExpanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  ))}
              </motion.div>

              {item.submenu && isExpanded && open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="ml-10 mt-2 space-y-1"
                >
                  {item.submenu.map((sub) => (
                    <div
                      key={sub}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubClick(item, sub);
                      }}
                      className={`cursor-pointer text-sm p-2 rounded-lg transition-all duration-300 ${
                        active.toLowerCase() === sub.toLowerCase()
                          ? "bg-white/25 text-yellow-200"
                          : "text-gray-100 hover:bg-white/15 hover:text-yellow-100"
                      }`}
                    >
                      {sub}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/20 text-xs text-white/80">
        {open ? "© 2025 LIMS" : "©"}
      </div>
    </motion.div>
  );
}
