import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] =
    useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);

      await login(email.trim(), password);

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            "Unable to login. Please try again."
        );
      } else {
        setError("Unable to login. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Left section */}
      <div className="hidden w-1/2 flex-col justify-between bg-slate-950 p-12 text-white lg:flex ">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
            <Building2 size={24} />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              EMS
            </h1>

            <p className="text-sm text-slate-400">
              Employee Management System
            </p>
          </div>
        </div>

        <div className="max-w-lg">
          <h2 className="text-4xl font-bold leading-tight">
            Manage your organization from one
            powerful workspace.
          </h2>

          <p className="mt-5 text-lg leading-8 text-slate-400">
            Manage employees, organizational
            hierarchy, roles and workforce insights
            securely and efficiently.
          </p>
        </div>

        <p className="text-sm text-slate-500">
          Secure workforce management platform
        </p>
      </div>

      {/* Login section */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Building2 />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Employee Management System
            </h1>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Welcome back
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sign in to your account
            </h2>

            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Enter your credentials to access the
              management dashboard.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700 dark:bg-red-900 dark:text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="admin@ems.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-12 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-500 dark:focus:ring-indigo-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              {submitting
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4 text-center text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Demo Super Admin
            </p>

            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
              Email: admin@ems.com
            </p>

            <p className="text-sm text-slate-700 dark:text-slate-300">
              Password: Admin@123
            </p> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;