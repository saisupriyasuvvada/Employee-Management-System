import {
  BriefcaseBusiness,
  Building2,
  Mail,
  Pencil,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  const formatRole = (role: string) =>
    role
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

  const profileDetails = [
    {
      label: "Email Address",
      value: user.email,
      icon: Mail,
    },
    {
      label: "Employee ID",
      value:
        user.employeeId || "Not available",
      icon: UserCircle,
    },
    {
      label: "Department",
      value:
        user.department || "Not available",
      icon: Building2,
    },
    {
      label: "Designation",
      value:
        user.designation || "Not available",
      icon: BriefcaseBusiness,
    },
    {
      label: "Role",
      value: formatRole(user.role),
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            View your account and employment
            information.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/profile/edit")
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Pencil size={18} />
          Edit Profile
        </button>
      </div>

      {/* Profile header */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-violet-600" />

        <div className="px-6 pb-7 sm:px-8">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end">
            {/* Profile image */}
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="h-24 w-24 shrink-0 rounded-2xl border-4 border-white object-cover shadow-sm dark:border-slate-800"
              />
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-indigo-100 text-4xl font-bold text-indigo-700 shadow-sm dark:border-slate-800 dark:bg-indigo-500/15 dark:text-indigo-400">
                {user.name
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )} 

            <div className="pb-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {user.name}
              </h2>

              <p className="mt-4 text-slate-500 dark:text-slate-400 ">
                {user.designation ||
                  formatRole(user.role)}
              </p>

              <span className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Active Account
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Profile Information
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Your personal and organizational
            account details.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2 ">
          {profileDetails.map(
            (detail) => {
              const Icon = detail.icon;

              return (
                <div
                  key={detail.label}
                  className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400">
                    <Icon size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                      {detail.label}
                    </p>

                    <p className="mt-1 break-words font-semibold text-slate-800 dark:text-white">
                      {detail.value}
                    </p>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Security information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Secure Account
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your session is protected using
              secure authentication. Access to
              application features is controlled
              according to your assigned role.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;