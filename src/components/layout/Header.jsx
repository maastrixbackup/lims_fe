import { Bell, User, LogOut, LockKeyhole, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/userSlice";
import {
  setSelectedProject,
  clearSelectedProject,
} from "../../utils/selectedProjectSlice";

export default function Header({ heading, sidebarWidth }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const projectRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const { projects } = useSelector((s) => s.list);
  const selectedProject = useSelector((s) => s.selectedProject.project);

  const username = user?.name || "User";
  const userProfilePic = user?.profile_pic || "/default-avatar.png";

  const handleProjectSelect = (project) => {
    dispatch(setSelectedProject(project));
    setProjectDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotificationsOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (projectRef.current && !projectRef.current.contains(e.target))
        setProjectDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(clearSelectedProject());
    dispatch(logout());
    navigate("/");
  };

  return (
    <header
      className="
        fixed top-0 h-16 bg-white shadow-md flex items-center 
        justify-between px-4 sm:px-6 z-40 transition-all duration-300
      "
      style={{
        left: sidebarWidth,
        width: `calc(100% - ${sidebarWidth}px)`,
      }}
    >
      {/* Heading */}
      <h2 className="text-lg sm:text-xl font-semibold text-indigo-600 tracking-wide truncate max-w-[150px] sm:max-w-none">
        {heading}
      </h2>

      {/* Right side menu */}
      <div className="flex items-center gap-3 md:gap-6 ml-auto">

        {/* Project Dropdown */}
        <div className="relative min-w-[140px] sm:min-w-[180px]" ref={projectRef}>
          <button
            onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
            className="
              flex items-center justify-between w-full 
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              text-white font-medium px-3 py-2 rounded-lg sm:rounded-xl
              shadow-md hover:shadow-lg transition-all duration-300
              text-xs sm:text-sm
            "
          >
            <span className="truncate">
              {selectedProject
                ? selectedProject.project_name || selectedProject.name
                : "Select Project"}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${
                projectDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {projectDropdownOpen && (
            <div
              className="
                absolute right-0 mt-2 w-full bg-white shadow-lg 
                rounded-xl border border-gray-100 p-2 z-50 max-h-64 overflow-y-auto
              "
            >
              <ul className="text-sm text-gray-700">
                {projects?.length ? (
                  projects.map((project) => (
                    <li
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className="
                        p-2 bg-gray-50 hover:bg-indigo-500 hover:text-white 
                        rounded-md cursor-pointer transition-all duration-200 mb-1
                      "
                    >
                      {project.project_name || project.name}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 italic">
                    No projects available
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="
              relative p-2 rounded-full hover:bg-gray-100
              transition-colors duration-200
            "
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {notificationsOpen && (
            <div
              className="
                absolute right-0 mt-3 bg-white shadow-lg rounded-xl
                border border-gray-100 p-3 z-50 w-56
              "
            >
              <h4 className="font-semibold text-gray-700 mb-2 text-sm">
                Notifications
              </h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="p-2 hover:bg-indigo-500 hover:text-white rounded-lg cursor-pointer">
                  🔹 New project created
                </li>
                <li className="p-2 hover:bg-indigo-500 hover:text-white rounded-lg cursor-pointer">
                  🏡 Village added
                </li>
                <li className="p-2 hover:bg-indigo-500 hover:text-white rounded-lg cursor-pointer">
                  📋 Plot updated
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <div
            className="
              flex items-center gap-2 cursor-pointer hover:bg-gray-100 
              px-2 py-1.5 rounded-lg transition-colors duration-200
            "
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img
              src={userProfilePic}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
            <span className="hidden md:inline font-medium text-gray-700">
              {username}
            </span>
          </div>

          {profileOpen && (
            <div
              className="
                absolute right-0 mt-3 w-40 bg-white shadow-lg 
                rounded-xl border border-gray-100 p-2 z-50
              "
            >
              <ul className="text-sm text-gray-700">
                <li
                  onClick={() => navigate("/profile")}
                  className="p-2 hover:bg-indigo-500 hover:text-white rounded-md flex items-center gap-2 cursor-pointer"
                >
                  <User size={16} /> Profile
                </li>
                <li
                  onClick={() => navigate("/changepassword")}
                  className="p-2 hover:bg-indigo-500 hover:text-white rounded-md flex items-center gap-2 cursor-pointer"
                >
                  <LockKeyhole size={16} /> Change Password
                </li>
                <li
                  onClick={handleLogout}
                  className="p-2 hover:bg-indigo-500 hover:text-white rounded-md flex items-center gap-2 text-red-600 cursor-pointer"
                >
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
