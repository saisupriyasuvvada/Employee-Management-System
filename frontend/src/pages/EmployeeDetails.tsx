import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Loader2,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { Employee } from "../types";

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [employee, setEmployee] =
    useState<Employee | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // Super Admin and HR Manager can edit employees
  const canEdit =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "HR_MANAGER";

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/employees/${id}`
        );

        setEmployee(
          response.data.employee ??
            response.data
        );
      } catch {
        setError(
          "Unable to load employee details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const formatRole = (role: string) =>
    role
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

  const formatDate = (date: string) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatSalary = (salary: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(salary);

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={38}
            className="mx-auto animate-spin text-indigo-600 dark:text-indigo-400"
          />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Loading employee details...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !employee) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() =>
            navigate("/employees")
          }
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={18} />
          Back to Employees
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/5 dark:bg-red-900/5 dark:text-red-400">
          {error ||
            "Employee not found."}
        </div>
      </div>
    );
  }

  const information = [
    {
      label: "Email",
      value: employee.email,
      icon: Mail,
    },
    {
      label: "Phone",
      value:
        employee.phone ||
        "Not available",
      icon: Phone,
    },
    {
      label: "Department",
      value: employee.department,
      icon: Users,
    },
    {
      label: "Designation",
      value: employee.designation,
      icon: BriefcaseBusiness,
    },
    {
      label: "Role",
      value: formatRole(employee.role),
      icon: ShieldCheck,
    },
    {
      label: "Salary",
      value: formatSalary(
        employee.salary
      ),
      icon: Wallet,
    },
    {
      label: "Joining Date",
      value: formatDate(
        employee.joiningDate
      ),
      icon: CalendarDays,
    },
    {
      label: "Reporting Manager",
      value:
        employee.reportingManager?.name ||
        "Not assigned",
      icon: UserRound,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Back navigation */}
      <button
        type="button"
        onClick={() =>
          navigate("/employees")
        }
        className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft size={18} />
        Back to Employees
      </button>

      {/* Employee header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            {/* Profile image */}
            {employee.profileImage ? (
              <img
                src={employee.profileImage}
                alt={employee.name}
                className="h-20 w-20 shrink-0 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-3xl font-bold text-indigo-700 ">
                {employee.name
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            {/* Employee basic information */}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
                  {employee.name}
                </h1>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    employee.status ===
                    "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                  }`}
                >
                  {employee.status}
                </span>
              </div>

              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {employee.designation}
              </p>

              <p className="mt-1 text-sm font-medium text-slate-400 dark:text-slate-500">
                {employee.employeeId}
              </p>
            </div>
          </div>

          {/* Edit button - Super Admin and HR Manager only */}
          {canEdit && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/employees/${employee._id}/edit`
                )
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Pencil size={18} />
              Edit Employee
            </button>
          )}
        </div>
      </div>

      {/* Employee information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Employee Information
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Personal and employment details.
          </p>
        </div>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {information.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700/70 dark:bg-slate-800/70"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400 dark:shadow-none">
                  <Icon size={19} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {item.label}
                  </p>

                  <p className="mt-1 break-words font-medium text-slate-800 dark:text-slate-200">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reporting Manager */}
      {employee.reportingManager && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <h2 className="font-bold text-slate-900 dark:text-white">
            Reporting Manager
          </h2>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-400">
              {employee.reportingManager.name
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {
                  employee.reportingManager
                    .name
                }
              </p>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {
                  employee.reportingManager
                    .designation
                }
              </p>

              <p className="text-xs text-slate-400 dark:text-slate-500">
                { 
                  employee.reportingManager
                    .employeeId
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;