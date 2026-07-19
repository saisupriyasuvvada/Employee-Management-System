import {
  Loader2,
  Network,
  RefreshCw,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios";
import OrganizationNode from "../components/OrganizationNode";
import { useAuth } from "../context/AuthContext";
import type {
  Employee,
  OrganizationEmployee,
} from "../types";

const Organization = () => {
  const { user } = useAuth();

  const [tree, setTree] = useState<
    OrganizationEmployee[]
  >([]);

  const [employees, setEmployees] = useState<
    Employee[]
  >([]);

  const [selectedEmployee, setSelectedEmployee] =
    useState<OrganizationEmployee | null>(null);

  const [managerId, setManagerId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [managerError, setManagerError] =
    useState("");

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      setError("");

      const [treeResponse, employeeResponse] =
        await Promise.all([
          api.get("/organization/tree"),
          api.get("/employees", {
            params: {
              limit: 100,
              sortBy: "name",
              order: "asc",
            },
          }),
        ]);

      setTree(treeResponse.data.tree);
      setEmployees(
        employeeResponse.data.employees
      );
    } catch {
      setError(
        "Unable to load the organization hierarchy."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, []);

  const handleManage = (
    employee: OrganizationEmployee
  ) => {
    setSelectedEmployee(employee);

    setManagerId(
      employee.reportingManager
        ? String(employee.reportingManager)
        : ""
    );

    setManagerError("");
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setSelectedEmployee(null);
    setManagerId("");
    setManagerError("");
  };

  const handleSaveManager = async () => {
    if (!selectedEmployee) {
      return;
    }

    try {
      setSaving(true);
      setManagerError("");

      await api.patch(
        `/employees/${selectedEmployee._id}/manager`,
        {
          managerId:
            managerId || null,
        }
      );

      closeModal();

      await fetchOrganization();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setManagerError(
          error.response?.data?.message ||
            "Unable to update reporting manager."
        );
      } else {
        setManagerError(
          "Unable to update reporting manager."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const canManage =
    user?.role === "SUPER_ADMIN";

  const availableManagers =
    employees.filter(
      (employee) =>
        employee._id !==
          selectedEmployee?._id &&
        employee.status === "ACTIVE"
    );

  return (
    <div className="min-w-0 space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Organization Hierarchy
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400sm:text-base">
            View reporting relationships and
            manage your organizational structure.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrganization}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <RefreshCw
            size={18}
            className={
              loading ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* Summary */}
      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                <Users size={21} />
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Employees
                </p>

                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {employees.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                <Network size={21} />
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Top-level members
                </p>

                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tree.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tree */}
      {loading ? (
        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="text-center">
            <Loader2
              size={38}
              className="mx-auto animate-spin text-indigo-600 dark:text-indigo-400"
            />

            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Loading organization...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      ) : tree.length === 0 ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <Network
            size={40}
            className="text-slate-300"
          />

          <h2 className="mt-4 font-bold text-slate-900 dark:text-white">
            No organization hierarchy found
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Add employees to begin building
            your organizational structure. 
          </p>
        </div>
      ) : (
        <div className="min-w-0 space-y-5 ">
          {tree.map((employee) => (
            <OrganizationNode
              key={employee._id}
              employee={employee}
              canManage={canManage}
              onManage={handleManage}
            />
          ))}
        </div>
      )}

      {/* Manager modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:p-8">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
              Manage Reporting Manager
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Assign or change the reporting
              manager for{" "}
              <span className="font-semibold text-slate-700 dark:text-white">
                {selectedEmployee.name}
              </span>
              .
            </p>

            {managerError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
                {managerError}
              </div>
            )}

            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-white">
                Reporting Manager
              </label>

              <select
                value={managerId}
                onChange={(event) =>
                  setManagerId(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20"
              >
                <option value="">
                  No Reporting Manager
                </option>

                {availableManagers.map(
                  (employee) => (
                    <option
                      key={employee._id}
                      value={employee._id}
                    >
                      {employee.name} —{" "}
                      {employee.designation}
                    </option>
                  )
                )}
              </select>

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Selecting "No Reporting Manager"
                makes this employee a top-level
                member.
              </p>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end ">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveManager}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                {saving && (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                )}

                {saving
                  ? "Saving..."
                  : "Save Manager"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Organization;