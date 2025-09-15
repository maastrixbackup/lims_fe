import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/projects": "Projects",
    "/villages": "Villages",
    "/plots": "Plots",
     "/import": "Import/Export",
  };

  const heading = pageTitles[location.pathname] || "";

  const sidebarWidth = sidebarOpen ? 260 : 80;

  return (
    <div className="bg-gray-50 text-gray-800 h-screen">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header heading={heading} sidebarWidth={sidebarWidth} />
        {/* Make the Outlet fill the available space */}
        <main
          className="pt-16 h-full overflow-y-auto transition-all duration-300"
          style={{ paddingLeft: sidebarWidth }}
        >
          <div className="p-6 space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
