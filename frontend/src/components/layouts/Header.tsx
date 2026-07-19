import {
  LogOut,
  Menu,
  Moon,
  Sun,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({
  onMenuClick,
}: HeaderProps) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-3 transition-colors dark:border-slate-800 dark:bg-slate-900 sm:px-6">
      {/* Left section */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-4">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="shrink-0 rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        {/* Application title */}
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-slate-900 sm:text-base dark:text-slate-100">
            Employee Management
          </h2>

          <p className="hidden text-xs text-slate-500 sm:block">
            Manage your organization efficiently
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        {/* Theme toggle button */}
        <button
          type="button"
          onClick={toggleTheme}
          title={
            theme === "light"
            ? "Switch to dark mode"
            : "Switch to light mode"
          }
          aria-label="Toggle theme"
          className="rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Profile button */}
        <button
          type="button"
          onClick={() => navigate("/profile")}
          title="My Profile"
          aria-label="Open my profile"
          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-100 sm:px-3"
        >
          {/* Profile image */}
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <UserCircle size={21} />
            </div>
          )}

          {/* User information - hidden on mobile */}
          <div className="hidden text-left sm:block">
            <p className="max-w-32 truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
              {user?.name}
            </p>

            <p className="max-w-32 truncate text-xs text-slate-500 dark:text-slate-400">
              {user?.role
                ? user.role.replaceAll("_", " ")
                : ""}
            </p>
          </div>
        </button>

        {/* Logout button */}
        <button
          type="button"
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
          className="rounded-lg p-2.5 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;