import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import EmployeeForm, {
  type EmployeeFormData,
} from "../components/EmployeeForm";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const AddEmployee = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [error, setError] = useState("");

  const handleSubmit = async (
    formData: EmployeeFormData
  ) => {
    try {
      setError("");

      await api.post("/employees", {
        ...formData,
        salary: Number(formData.salary),
      });

      navigate("/employees", {
        replace: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to create employee."
        );
      } else {
        setError(
          "Unable to create employee."
        );
      }

      throw error;
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <button
          onClick={() =>
            navigate("/employees")
          }
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Employees
        </button>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Add Employee
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Create a new employee account and add
          their employment information.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-8">
        <EmployeeForm
          onSubmit={handleSubmit}
          onCancel={() =>
            navigate("/employees")
          }
          submitLabel="Create Employee"
          currentUserRole={user?.role}
        />
      </div>
    </div>
  );
};

export default AddEmployee;