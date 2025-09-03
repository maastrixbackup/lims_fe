import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Bell, Search, User, Home, BarChart, Mail, Settings, LogOut } from "lucide-react";

export default function AnalyticsDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 relative">
      {/* Sidebar */}
      <motion.div
        animate={{ width: sidebarOpen ? 256 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white shadow-lg flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className={`text-lg font-bold tracking-wide ${!sidebarOpen && "hidden"}`}>LIMS</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Home size={18} />
            {sidebarOpen && <span>Home</span>}
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <BarChart size={18} />
            {sidebarOpen && <span>Analytics</span>}
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Mail size={18} />
            {sidebarOpen && <span>Messages</span>}
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <Settings size={18} />
            {sidebarOpen && <span>Settings</span>}
          </div>
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow-md flex items-center justify-between px-6 relative">
          <div className="flex items-center gap-2 w-1/3 border rounded-lg px-3 py-2 bg-gray-50">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search Dashboard"
              className="w-full outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-6">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-20"
                >
                  <h4 className="font-semibold mb-2">Notifications</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="p-2 hover:bg-gray-100 rounded-md">New order received</li>
                    <li className="p-2 hover:bg-gray-100 rounded-md">Server restarted</li>
                    <li className="p-2 hover:bg-gray-100 rounded-md">You have 5 new messages</li>
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <User size={18} />
                </div>
                <span className="hidden md:inline font-medium">Admin</span>
              </div>

              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2 z-20"
                >
                  <ul className="text-sm">
                    <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2">
                      <User size={16} /> Profile
                    </li>
                    <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center gap-2 text-red-600">
                      <LogOut size={16} /> Logout
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="p-6 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md">
              <p className="text-sm">Products Sold</p>
              <h2 className="text-2xl font-bold">4565</h2>
              <p className="text-xs mt-1">Jan - March 2019</p>
            </div>
            <div className="p-6 rounded-xl text-white bg-gradient-to-r from-pink-500 to-red-500 shadow-md">
              <p className="text-sm">Net Profit</p>
              <h2 className="text-2xl font-bold">$8541</h2>
              <p className="text-xs mt-1">Jan - March 2019</p>
            </div>
            <div className="p-6 rounded-xl text-white bg-gradient-to-r from-orange-400 to-yellow-500 shadow-md">
              <p className="text-sm">New Customers</p>
              <h2 className="text-2xl font-bold">4565</h2>
              <p className="text-xs mt-1">Jan - March 2019</p>
            </div>
            <div className="p-6 rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
              <p className="text-sm">Customer Satisfaction</p>
              <h2 className="text-2xl font-bold">99%</h2>
              <p className="text-xs mt-1">Jan - March 2019</p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold mb-4">Product Sales</h3>
            <p className="text-gray-500 mb-4">Total Earnings of the Month</p>
            <div className="flex items-center justify-center h-64 text-gray-400">
              <span>Chart will go here 📊</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
