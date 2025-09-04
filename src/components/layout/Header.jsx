import { Bell, User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-between px-6 relative z-50">
      <h2 className="text-xl font-bold text-indigo-600">Dashboard</h2>

      {/* Right (Notifications + Profile) */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <h4 className="font-semibold mb-2">Notifications</h4>
              <ul className="space-y-2 text-sm">
                <li className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-150">
                  New project created
                </li>
                <li className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-150">
                  Village added
                </li>
                <li className="p-2 hover:bg-gray-100 rounded-md transition-colors duration-150">
                  Plot updated
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <div
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User size={18} />
            </div>
            <span className="hidden md:inline font-medium">Admin</span>
          </div>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <ul className="text-sm">
                <li className="p-2 hover:bg-gray-100 rounded-md flex items-center gap-2 cursor-pointer transition-colors duration-150">
                  <User size={16} /> Profile
                </li>
                <li className="p-2 hover:bg-gray-100 rounded-md flex items-center gap-2 text-red-600 cursor-pointer transition-colors duration-150">
                  <LogOut size={16} /> Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}