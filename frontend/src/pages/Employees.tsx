import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { Employee } from "../types";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

interface EmployeesResponse {
  employees: Employee[];
  totalEmployees: number;
  currentPage: number;
  totalPages: number;
}

const Employees = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");

  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [employeeToDelete, setEmployeeToDelete] =
    useState<Employee | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const limit = 10;

  const canEdit =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "HR_MANAGER";

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchEmployees();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    search,
    department,
    status,
    role,
    sortBy,
    order,
    page,
  ]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<EmployeesResponse>(
          "/employees",
          {
            params: {
              search: search || undefined,
              department:
                department || undefined,
              status: status || undefined,
              role: role || undefined,
              sortBy,
              order,
              page,
              limit,
            },
          }
        );

      setEmployees(response.data.employees);
      setTotalEmployees(
        response.data.totalEmployees
      );
      setTotalPages(
        response.data.totalPages
      );
    } catch {
      setError(
        "Unable to load employees."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!employeeToDelete) {
      return;
    }

    try {
      setDeleting(true);
      setDeleteError("");

      await api.delete(
        `/employees/${employeeToDelete._id}`
      );

      setEmployeeToDelete(null);

      await fetchEmployees();
    } catch {
      setDeleteError(
        "Unable to delete employee. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  const getRoleLabel = (
    employeeRole: string
  ) =>
    employeeRole
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

  const inputClasses =
    "w-full rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/15";

  const selectClasses =
    "rounded-xl border border-slate-300 bg-white text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/15";

  return (
    <div className="min-w-0 space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Employees
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Manage employees, roles and workforce
            information.
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() =>
              navigate("/employees/add")
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus size={19} />
            Add Employee
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {/* Search */}
          <div className="relative xl:col-span-2">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleSearchChange(
                  event.target.value
                )
              }
              placeholder="Search by name or email..."
              className={`${inputClasses} py-2.5 pl-10 pr-4`}
            />
          </div>

          {/* Department */}
          <input
            type="text"
            value={department}
            onChange={(event) => {
              setDepartment(
                event.target.value
              );
              setPage(1);
            }}
            placeholder="Department"
            className={`${inputClasses} px-4 py-2.5`}
          />

          {/* Status */}
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(1);
            }}
            className={`${selectClasses} px-4 py-2.5`}
          >
            <option value="">
              All statuses
            </option>
            <option value="ACTIVE">
              Active
            </option>
            <option value="INACTIVE">
              Inactive
            </option>
          </select>

          {/* Role */}
          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setPage(1);
            }}
            className={`${selectClasses} px-4 py-2.5`}
          >
            <option value="">
              All roles
            </option>
            <option value="SUPER_ADMIN">
              Super Admin
            </option>
            <option value="HR_MANAGER">
              HR Manager
            </option>
            <option value="EMPLOYEE">
              Employee
            </option>
          </select>
        </div>

        {/* Sorting */}
        <div className="mt-4 flex flex-wrap gap-3">
          <select
            value={sortBy}
            onChange={(event) => {
              setSortBy(event.target.value);
              setPage(1);
            }}
            className={`${selectClasses} px-3 py-2 text-sm`}
          >
            <option value="createdAt">
              Recently added
            </option>
            <option value="name">
              Name
            </option>
            <option value="joiningDate">
              Joining date
            </option>
          </select>

          <select
            value={order}
            onChange={(event) => {
              setOrder(event.target.value);
              setPage(1);
            }}
            className={`${selectClasses} px-3 py-2 text-sm`}
          >
            <option value="asc">
              Ascending
            </option>
            <option value="desc">
              Descending
            </option>
          </select>
        </div>
      </div>

      {/* Delete error */}
      {deleteError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {deleteError}
        </div>
      )}

      {/* Employee directory */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Employee Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {totalEmployees} employee
              {totalEmployees !== 1
                ? "s"
                : ""}
            </p>
          </div>
        </div>

        {error ? (
          <div className="p-8 text-center text-red-600 dark:text-red-400">
            {error}
          </div>
        ) : loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="text-center">
              <Loader2
                size={34}
                className="mx-auto animate-spin text-indigo-600 dark:text-indigo-400"
              />

              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Loading employees...
              </p>
            </div>
          </div>
        ) : employees.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <Users size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
              No employees found
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <>
            {/* Responsive table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/70">
                  <tr className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <th className="px-6 py-4 font-semibold">
                      Employee
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Department
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Designation
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Role
                    </th>
                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {employees.map(
                    (employee) => (
                      <tr
                        key={employee._id}
                        className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {employee.profileImage ? (
                              <img
                                src={
                                  employee.profileImage
                                }
                                alt={
                                  employee.name
                                }
                                className="h-10 w-10 shrink-0 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400">
                                {employee.name
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {employee.name}
                              </p>

                              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                {employee.email}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                                {
                                  employee.employeeId
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {employee.department}
                        </td>

                        <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                          {employee.designation}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-400">
                            {getRoleLabel(
                              employee.role
                            )}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              employee.status ===
                              "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                                : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {employee.status}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-1">
                            {/* View */}
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/employees/${employee._id}`
                                )
                              }
                              title="View employee"
                              className="rounded-lg p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-400"
                            >
                              <Eye size={18} />
                            </button>

                            {/* Edit */}
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/employees/${employee._id}/edit`
                                  )
                                }
                                title="Edit employee"
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-amber-50 hover:text-amber-600 dark:text-slate-400 dark:hover:bg-amber-500/15 dark:hover:text-amber-400"
                              >
                                <Pencil
                                  size={18}
                                />
                              </button>
                            )}

                            {/* Delete */}
                            {user?.role ===
                              "SUPER_ADMIN" &&
                              employee.role !==
                                "SUPER_ADMIN" && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDeleteError(
                                      ""
                                    );

                                    setEmployeeToDelete(
                                      employee
                                    );
                                  }}
                                  title="Delete employee"
                                  className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/15 dark:hover:text-red-400"
                                >
                                  <Trash2
                                    size={18}
                                  />
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) =>
                      Math.max(
                        current - 1,
                        1
                      )
                    )
                  }
                  disabled={page <= 1}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ChevronLeft size={17} />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        current + 1,
                        totalPages
                      )
                    )
                  }
                  disabled={
                    page >= totalPages
                  }
                  className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Next
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete confirmation */}
      <DeleteConfirmationModal
        isOpen={Boolean(employeeToDelete)}
        employeeName={
          employeeToDelete?.name || ""
        }
        deleting={deleting}
        onCancel={() => {
          if (!deleting) {
            setEmployeeToDelete(null);
            setDeleteError("");
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Employees;