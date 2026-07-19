import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Loader2,
  UserMinus,
  Users,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { DashboardStats } from "../types";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/dashboard/stats"
        );

        setStats(response.data.stats);
      } catch {
        setError(
          "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={38}
            className="mx-auto animate-spin text-indigo-600 dark:text-indigo-400"
          />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
        {error ||
          "Dashboard data is unavailable."}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Employees",
      value: stats.totalEmployees,
      icon: Users,
      iconClass:
        "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
    },
    {
      title: "Active Employees",
      value: stats.activeEmployees,
      icon: CheckCircle2,
      iconClass:
        "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    },
    {
      title: "Inactive Employees",
      value: stats.inactiveEmployees,
      icon: UserMinus,
      iconClass:
        "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    },
    {
      title: "Departments",
      value: stats.departmentCount,
      icon: Building2,
      iconClass:
        "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    },
  ];

  const employeeStatusData = [
    {
      name: "Active",
      value: stats.activeEmployees,
    },
    {
      name: "Inactive",
      value: stats.inactiveEmployees,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Welcome back, {user?.name}. Here is an
          overview of your organization.
        </p>
      </div>

      {/* Statistics cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:shadow-none"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                    {card.value}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconClass}`}
                >
                  <Icon size={23} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and overview */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Workforce overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none xl:col-span-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Workforce Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Current employee activity status.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* Active workforce */}
            <div className="rounded-xl bg-slate-50 p-6 dark:bg-slate-800/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Active workforce
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {stats.activeEmployees}
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{
                    width: `${
                      stats.totalEmployees > 0
                        ? (stats.activeEmployees /
                            stats.totalEmployees) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {stats.totalEmployees > 0
                  ? Math.round(
                      (stats.activeEmployees /
                        stats.totalEmployees) *
                        100
                    )
                  : 0}
                % of total employees
              </p>
            </div>

            {/* Inactive workforce */}
            <div className="rounded-xl bg-slate-50 p-6 dark:bg-slate-800/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Inactive workforce
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
                {stats.inactiveEmployees}
              </p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{
                    width: `${
                      stats.totalEmployees > 0
                        ? (stats.inactiveEmployees /
                            stats.totalEmployees) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {stats.totalEmployees > 0
                  ? Math.round(
                      (stats.inactiveEmployees /
                        stats.totalEmployees) *
                        100
                    )
                  : 0}
                % of total employees
              </p>
            </div>
          </div>
        </div>

        {/* Employee status chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Employee Status
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Active and inactive distribution.
          </p>

          <div className="mt-5 h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={employeeStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {employeeStatusData.map(
                    (_, index) => (
                      <Cell
                        key={index}
                        fill={
                          index === 0
                            ? "#10b981"
                            : "#f59e0b"
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Chart legend */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />

              <span className="text-sm text-slate-600 dark:text-slate-300">
                Active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-amber-500" />

              <span className="text-sm text-slate-600 dark:text-slate-300">
                Inactive
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;