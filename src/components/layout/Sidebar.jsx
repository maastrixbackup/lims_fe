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
  TreePalm,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import logo from "../../assets/logo.jpeg";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ open, setOpen, isMobile }) {
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

  const [reportGroupExpanded, setReportGroupExpanded] = useState(
    JSON.parse(localStorage.getItem("reportGroups")) || {}
  );

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
        submenu: ["Villages", "Khatas", "Plots", "Land Cost", "Social Survey"],
        roles: ["Admin", "Data Entry User", "Viewer"],
      },
      {
        name: "Govt Land",
        icon: MapPinHouse,
        basePath: "govt-land",
        submenu: ["Government Village", "Government Khata","Government Plot", "Land Cost"],
        roles: ["Admin", "Data Entry User", "Viewer"],
      },
      {
        name: "Forest Land",
        icon: TreeDeciduous,
        basePath: "forest-land",
        submenu: ["Villages", "Khatas", "Plots", "Land Cost"],
        roles: ["Admin", "Data Entry User", "Viewer"],
      },
      {
        name: "CA Land",
        icon: TreePalm,
        basePath: "govt-land",
        submenu: [],
        roles: ["Admin", "Data Entry User", "Viewer"],
      },
      {
        name: "User Management",
        icon: User2Icon,
        path: "usersmanagement",
        roles: ["Admin"],
      },
      {
        name: "Import Plots",
        icon: ImageUp,
        path: "import",
        roles: ["Admin", "Data Entry User"],
      },
      {
        name: "Reports",
        icon: ChartBarBig,
        basePath: "reports",
        submenuGroups: [
          {
            title: "Khata Reports",
            base: "khata-reports",
            children: ["Khata Summary", "Khata Document"],
          },
          {
            title: "Village Reports",
            base: "village-reports",
            children: ["Village Land Register", "Village Document Report"],
          },
          {
            title: "Plot Reports",
            base: "plot-reports",
            children: ["Plot Details", "Plot Owner History"],
          },
          {
            title: "Project Reports",
            base: "project-reports",
            children: [
              "Project Summary",
              "Project Document Register",
              "Total Tenants",
            ],
          },
          {
            title: "Document Reports",
            base: "document-reports",
            children: ["Document Upload Report", "Missing Documents Report"],
          },
          {
            title: "GIS / Maps Reports",
            base: "maps-reports",
            children: ["KMZ Availability", "Map Summary Report"],
          },
          {
            title: "User Reports",
            base: "user-reports",
            children: ["Activity Log", "Audit Trail"],
          },
        ],
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

  useEffect(() => localStorage.setItem("activeMenu", active), [active]);
  useEffect(() => {
    expanded
      ? localStorage.setItem("expandedMenu", expanded)
      : localStorage.removeItem("expandedMenu");
  }, [expanded]);
  useEffect(() => {
    localStorage.setItem("reportGroups", JSON.stringify(reportGroupExpanded));
  }, [reportGroupExpanded]);

  useEffect(() => {
    const parts = location.pathname.split("/").filter(Boolean);
    if (!parts.length) return;

    const main = parts[0];
    const sub = parts[1]; 
    const group = parts[2];

    const foundMain = menuItems.find(
      (m) => m.path?.toLowerCase() === main || m.basePath === main
    );

    if (foundMain) {
      setExpanded(
        foundMain.submenu || foundMain.submenuGroups ? foundMain.name : null
      );

      if (foundMain.name === "Reports" && group) {
        const reportGroup = foundMain.submenuGroups.find(
          (g) => g.base === group
        );
        if (reportGroup) {
          setReportGroupExpanded((prev) => ({
            ...prev,
            [reportGroup.title]: true,
          }));
          if (sub) setActive(sanitize(sub));
        }
      } else {
        if (sub) setActive(sanitize(sub));
        else setActive(foundMain.name);
      }
    }
  }, [location.pathname]);
  const handleClick = (item) => {
    if (item.submenu || item.submenuGroups)
      return setExpanded(expanded === item.name ? null : item.name);

    setActive(item.name);
    navigate("/" + item.path.toLowerCase());
  };

  const handleSubClick = (parentPath, sub) => {
    let subPath = sub.toLowerCase().replace(/\s+/g, "-");

    if (["private-land", "govt-land", "forest-land"].includes(parentPath)) {
      if (subPath === "khata") subPath = "khatas";
      if (subPath === "plot") subPath = "plots";
      if (subPath === "village") subPath = "villages";
    }

    const path = `/${parentPath}/${subPath}`;
    setActive(sub);
    navigate(path);
  };

  return (
    <motion.div
      animate={{
        x: isMobile ? (open ? 0 : -260) : 0,
        width: isMobile ? 260 : open ? 260 : 80,
      }}
      transition={{ duration: 0.3 }}
      className={`
    fixed top-0 left-0 h-screen z-50 
    bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500
    shadow-2xl flex flex-col 
    ${isMobile ? "rounded-none" : "rounded-r-3xl"}
  `}
    >
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
          <ChevronRight size={22} className="text-white" />
        </button>
      </div>
      <nav
        className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent"
        style={{ scrollbarWidth: "thin" }}
      >
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.name;
          const isExpanded = expanded === item.name;

          return (
            <div key={item.name}>
              <motion.div
                onClick={() => handleClick(item)}
                whileHover={{ x: 4 }}
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  isActive
                    ? "bg-white/25 text-white shadow-md backdrop-blur-sm"
                    : "hover:bg-white/15 text-gray-100 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`${isActive ? "text-yellow-300" : "text-white"}`}
                    size={20}
                  />
                  {open && (
                    <span className={`${isActive ? "font-semibold" : ""}`}>
                      {item.name}
                    </span>
                  )}
                </div>

                {open &&
                  (item.submenu || item.submenuGroups) &&
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
                  transition={{ duration: 0.3 }}
                  className="ml-10 mt-2 space-y-1"
                >
                  {item.submenu.map((sub) => (
                    <div
                      key={sub}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSubClick(item.basePath, sub);
                      }}
                      className={`cursor-pointer text-sm p-2 rounded-lg ${
                        active.toLowerCase() === sub.toLowerCase()
                          ? "bg-white/25 text-yellow-200"
                          : "text-gray-100 hover:bg-white/15"
                      }`}
                    >
                      {sub}
                    </div>
                  ))}
                </motion.div>
              )}
              {item.submenuGroups && isExpanded && open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="ml-8 mt-2 space-y-2"
                >
                  {item.submenuGroups.map((group) => {
                    const isGroupOpen = reportGroupExpanded[group.title];

                    return (
                      <div key={group.title}>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setReportGroupExpanded((prev) => ({
                              ...prev,
                              [group.title]: !prev[group.title],
                            }));
                          }}
                          className="flex justify-between cursor-pointer text-white/80 p-2 hover:text-white"
                        >
                          <span>{group.title}</span>
                          {isGroupOpen ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </div>
                        {isGroupOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.25 }}
                            className="ml-6 space-y-1"
                          >
                            {group.children.map((sub) => (
                              <div
                                key={sub}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubClick(
                                    item.basePath + "/" + group.base,
                                    sub
                                  );
                                }}
                                className={`cursor-pointer text-sm p-2 rounded-lg ${
                                  active.toLowerCase() === sub.toLowerCase()
                                    ? "bg-white/25 text-yellow-200"
                                    : "text-gray-100 hover:bg-white/15"
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
