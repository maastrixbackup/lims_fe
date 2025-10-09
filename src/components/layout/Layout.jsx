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
    "/khatas": "Khatas",
    "/villages": "Villages",
    "/plots": "Plots",
    "/usersmanagement": "UsersManagement",
    "/import": "Import/Export",
  };

  const heading = pageTitles[location.pathname] || "";
  const sidebarWidth = sidebarOpen ? 260 : 80;

  return (
    <div className="flex h-screen bg-white text-gray-800">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        <Header heading={heading} sidebarWidth={sidebarWidth} />

        <main
          className="pt-16 h-full overflow-y-auto transition-all duration-300 bg-white"
          style={{ paddingLeft: sidebarWidth }}
        >
          <div className="p-6 space-y-6 min-h-screen bg-white">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
