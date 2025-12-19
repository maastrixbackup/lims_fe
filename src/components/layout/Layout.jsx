import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // const pageTitles = {
  //   "/dashboard": "Dashboard",
  //   "/projects": "Projects",
  //   "/khatas": "Khatas",
  //   "/villages": "Villages",
  //   "/plots": "Plots",
  //   "/usersmanagement": "UsersManagement",
  //   "/import": "Import Plots",
  //   "/reoprts": "Reports",
  //   "/profile": "Profile",
  //   "/changepassword": "Change Password",
  //   "/compensation": "Compensation",
  // };

  // const heading = pageTitles[location.pathname] || "";
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div data-theme="light" className="bg-gray-50 text-gray-800 h-screen">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        isMobile={isMobile}
      />
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        />
      )}

      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        // heading={heading}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile ? "" : sidebarOpen ? "ml-[260px]" : "ml-[80px]"
        }`}
      >
        <main className="pt-16 h-full overflow-y-auto">
          <div className="p-6 space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
