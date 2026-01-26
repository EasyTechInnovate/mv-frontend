import { useState, useRef, useEffect } from "react";
import { Bell, Settings, Menu, Sun, Moon, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ onToggleSidebar, onToggleTheme, theme }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const handleToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
    onToggleSidebar?.();
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

useEffect(() => {
  const token = localStorage.getItem("adminAccessToken");

  if (!token && window.location.pathname !== "/admin/login") {
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  }
}, [navigate]);




  return (
    <header
      className={`flex items-center justify-between border-b px-4 h-14 transition-colors duration-300 ${
        isDark
          ? "bg-[#111A22] border-gray-800 text-white"
          : "bg-gray-200 border-gray-300 text-black"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className={`p-2 rounded-lg transition ${
            isDark ? "hover:bg-gray-800" : "hover:bg-gray-300"
          }`}
        >
          <Menu className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-semibold">
            M
          </div>
          <div>
            <p
              className={`text-sm font-medium ${
                isDark ? "text-white" : "text-[#111A22]"
              }`}
            >
              Maheshwari Visuals
            </p>
            <span
              className={`text-xs ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Admin
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-lg transition ${
            isDark ? "hover:bg-gray-800" : "hover:bg-gray-300"
          }`}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>

        <button
          className={`relative p-2 rounded-lg transition ${
            isDark ? "hover:bg-gray-800" : "hover:bg-gray-300"
          }`}
        >
          <Bell className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`p-2 rounded-lg transition ${
              isDark ? "hover:bg-gray-800" : "hover:bg-gray-300"
            }`}
          >
            <Settings className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
          </button>

          {dropdownOpen && (
            <div
              className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg border z-[100] ${
                isDark
                  ? "bg-[#1C252E] border-gray-700 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate("/admin/profile");
                }}
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition ${
                  isDark
                    ? "hover:bg-gray-800 hover:text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <User size={16} />
                Profile
              </button>
              <hr className={isDark ? "border-gray-700" : "border-gray-200"} />
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition  ${
                  isDark
                    ? "hover:bg-gray-800 hover:text-red-400 text-red-300"
                    : "hover:bg-gray-100 text-red-600"
                }`}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
