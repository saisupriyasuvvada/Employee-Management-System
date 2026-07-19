import type {
  Dispatch,
  SetStateAction,
} from "react";

import {
  Building2,
  LayoutDashboard,
  Network,
  UserCircle,
  Users,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<
    SetStateAction<boolean>
  >;
}

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) => {
  const { user } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Employees",
      path: "/employees",
      icon: Users,
      roles: [
        "SUPER_ADMIN",
        "HR_MANAGER",
      ],
    },
    {
      name: "Organization",
      path: "/organization",
      icon: Network,
      roles: [
        "SUPER_ADMIN",
        "HR_MANAGER",
      ],
    },
    {
      name: "My Profile",
      path: "/profile",
      icon: UserCircle,
    },
  ];

  const visibleMenuItems =
    menuItems.filter(
      (item) =>
        !item.roles ||
        (user &&
          item.roles.includes(user.role))
    );

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-white shadow-xl transition-transform duration-300 ease-in-out ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0 lg:shadow-none`}
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
              <Building2 size={21} />
            </div>

            <div className="min-w-0">
              <h1 className="font-bold">
                EMS
              </h1>

              <p className="truncate text-xs text-slate-400">
                Management System
              </p>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {visibleMenuItems.map(
            (item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({
                    isActive,
                  }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  <Icon
                    size={20}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {item.name}
                  </span>
                </NavLink>
              );
            }
          )}
        </nav>

        {/* Logged-in user */}
        <div className="shrink-0 border-t border-slate-800 p-4">
          <div className="flex items-center gap-3">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
                {user?.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "?"}
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.name}
              </p>

              <p className="mt-0.5 truncate text-xs text-slate-500">
                {user?.role
                  ? user.role.replaceAll(
                      "_",
                      " "
                    )
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;