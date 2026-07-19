import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import EmployeeForm, {
  type EmployeeFormData,
} from "../components/EmployeeForm";
import { useAuth } from "../context/AuthContext";
import type { Employee } from "../types";

const EditEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [initialData, setInitialData] =
    useState<EmployeeFormData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/employees/${id}`
        );

        const employee: Employee =
          response.data.employee ?? response.data;

        setInitialData({
          employeeId: employee.employeeId,
          name: employee.name,
          email: employee.email,
          password: "",
          phone: employee.phone,
          department: employee.department,
          designation: employee.designation,
          salary: String(employee.salary),
          joiningDate: employee.joiningDate
            ? employee.joiningDate.split("T")[0]
            : "",
          status: employee.status,
          role: employee.role,
          profileImage:
            employee.profileImage ?? "",
        });
      } catch {
        setError(
          "Unable to load employee information."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  const handleSubmit = async (
    formData: EmployeeFormData
  ) => {
    try {
      setError("");

      const {
        password: _password,
        ...updateData
      } = formData;

      await api.put(`/employees/${id}`, {
        ...updateData,
        salary: Number(updateData.salary),
      });

      navigate(`/employees/${id}`, {
        replace: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to update employee."
        );
      } else {
        setError(
          "Unable to update employee."
        );
      }

      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2
            size={38}
            className="mx-auto animate-spin text-indigo-600 dark:text-indigo-400"
          />

          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Loading employee information...
          </p>
        </div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="space-y-5">
        <button
          onClick={() =>
            navigate("/employees")
          }
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={18} />
          Back to Employees
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error || "Employee not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <button
          onClick={() =>
            navigate(`/employees/${id}`)
          }
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
        >
          <ArrowLeft size={18} />
          Back to Employee Details
        </button>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white sm:text-3xl">
          Edit Employee
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Update employee information and employment
          details.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">
        <EmployeeForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate(`/employees/${id}`)
          }
          submitLabel="Update Employee"
          showPassword={false}
          currentUserRole={user?.role}
        />
      </div>
    </div>
  );
};

export default EditEmployee;