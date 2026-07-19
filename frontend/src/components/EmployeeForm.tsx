import { useState, type ChangeEvent, type FormEvent } from "react";
import { ImagePlus, Loader2, Save, Trash2, X } from "lucide-react";
import api from "../api/axios";
import type {
  EmployeeStatus,
  UserRole,
} from "../types";

export interface EmployeeFormData {
  employeeId: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  department: string;
  designation: string;
  salary: string;
  joiningDate: string;
  status: EmployeeStatus;
  role: UserRole;
  profileImage: string;
}

interface EmployeeFormProps {
  initialData?: EmployeeFormData;
  onSubmit: (
    data: EmployeeFormData
  ) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  showPassword?: boolean;
  currentUserRole?: UserRole;
}

const defaultData: EmployeeFormData = {
  employeeId: "",
  name: "",
  email: "",
  password: "",
  phone: "",
  department: "",
  designation: "",
  salary: "",
  joiningDate: "",
  status: "ACTIVE",
  role: "EMPLOYEE",
  profileImage: "",
};

const EmployeeForm = ({
  initialData = defaultData,
  onSubmit,
  onCancel,
  submitLabel = "Save Employee",
  showPassword = true,
  currentUserRole,
}: EmployeeFormProps) => {
  const [formData, setFormData] =
    useState<EmployeeFormData>(initialData);

  const [errors, setErrors] = useState<
    Record<string, string>
  >({});

  const [submitting, setSubmitting] =
    useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  const updateField = (
    field: keyof EmployeeFormData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.employeeId.trim()) {
      newErrors.employeeId =
        "Employee ID is required.";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (
      showPassword &&
      !formData.password
    ) {
      newErrors.password =
        "Password is required.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[0-9]{10,15}$/.test(
        formData.phone
      )
    ) {
      newErrors.phone =
        "Phone number must contain 10 to 15 digits.";
    }

    if (!formData.department.trim()) {
      newErrors.department =
        "Department is required.";
    }

    if (!formData.designation.trim()) {
      newErrors.designation =
        "Designation is required.";
    }

    if (formData.salary === "") {
      newErrors.salary =
        "Salary is required.";
    } else if (
      Number.isNaN(Number(formData.salary)) ||
      Number(formData.salary) < 0
    ) {
      newErrors.salary =
        "Enter a valid non-negative salary.";
    }

    if (!formData.joiningDate) {
      newErrors.joiningDate =
        "Joining date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (
  event: ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    setImageError(
      "Only JPG, PNG, and WEBP images are allowed."
    );

    event.target.value = "";
    return;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    setImageError(
      "The image must be smaller than 5 MB."
    );

    event.target.value = "";
    return;
  }

  try {
    setUploadingImage(true);
    setImageError("");

    const uploadData = new FormData();

    uploadData.append("image", file);

    const response = await api.post(
      "/upload/profile-image",
      uploadData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    updateField(
      "profileImage",
      response.data.imageUrl
    );
  } catch {
    setImageError(
      "Unable to upload the image. Please try again."
    );
  } finally {
    setUploadingImage(false);
    event.target.value = "";
  }
};

  const handleRemoveImage = () => {
  updateField("profileImage", "");
  setImageError("");
};

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/15";

  const renderError = (field: string) =>
    errors[field] ? (
      <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
        {errors[field]}
      </p>
    ) : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Basic Information
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Employee ID *
            </label>

            <input
              value={formData.employeeId}
              onChange={(event) =>
                updateField(
                  "employeeId",
                  event.target.value
                )
              }
              placeholder="EMP003"
              className={inputClass}
            />

            {renderError("employeeId")}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Full Name *
            </label>

            <input
              value={formData.name}
              onChange={(event) =>
                updateField(
                  "name",
                  event.target.value
                )
              }
              placeholder="Enter employee name"
              className={inputClass}
            />

            {renderError("name")}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email *
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={(event) =>
                updateField(
                  "email",
                  event.target.value
                )
              }
              placeholder="employee@example.com"
              className={inputClass}
            />

            {renderError("email")}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Phone *
            </label>

            <input
              value={formData.phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 15)
                )
              }
              placeholder="9876543210"
              className={inputClass}
            />

            {renderError("phone")}
          </div>

          {showPassword && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password *
              </label>

              <input
                type="password"
                value={formData.password}
                onChange={(event) =>
                  updateField(
                    "password",
                    event.target.value
                  )
                }
                placeholder="Enter login password"
                className={inputClass}
              />

              {renderError("password")}
            </div>
          )}

          <div>
  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
    Profile Image
  </label>

  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
    {/* Image preview */}
    <div className="relative h-24 w-24 shrink-0">
      {formData.profileImage ? (
        <img
          src={formData.profileImage}
          alt="Profile preview"
          className="h-24 w-24 rounded-2xl border border-slate-200 object-cover dark:border-slate-700"
        />
      ) : (
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-2xl font-bold text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500">
          {formData.name
            ? formData.name
                .charAt(0)
                .toUpperCase()
            : "?"}
        </div>
      )}

      {uploadingImage && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 dark:bg-slate-900/80">
          <Loader2
            size={24}
            className="animate-spin text-indigo-600 dark:text-indigo-400"
          />
        </div>
      )}
    </div>

    {/* Upload controls */}
    <div className="flex-1">
      <div className="flex flex-wrap gap-3">
        <label
          className={`flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 ${
            uploadingImage
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          {uploadingImage ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <ImagePlus size={18} />
          )}

          {uploadingImage
            ? "Uploading..."
            : formData.profileImage
              ? "Change Image"
              : "Choose Image"}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            disabled={uploadingImage}
            className="hidden"
          />
        </label>

        {formData.profileImage && (
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={uploadingImage}
            className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"
          >
            <Trash2 size={17} />
            Remove
          </button>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        JPG, PNG, or WEBP. Maximum size: 5 MB.
      </p>

      {imageError && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {imageError}
        </p>
      )}
    </div>
  </div>
</div>
</div></div>
      <div className="border-t border-slate-200 pt-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Employment Information
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Department *
            </label>

            <input
              value={formData.department}
              onChange={(event) =>
                updateField(
                  "department",
                  event.target.value
                )
              }
              placeholder="Engineering"
              className={inputClass}
            />

            {renderError("department")}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Designation *
            </label>

            <input
              value={formData.designation}
              onChange={(event) =>
                updateField(
                  "designation",
                  event.target.value
                )
              }
              placeholder="Software Engineer"
              className={inputClass}
            />

            {renderError("designation")}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Salary *
            </label>

            <input
              type="number"
              min="0"
              value={formData.salary}
              onChange={(event) =>
                updateField(
                  "salary",
                  event.target.value
                )
              }
              placeholder="50000"
              className={inputClass}
            />

            {renderError("salary")}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Joining Date *
            </label>

            <input
              type="date"
              value={formData.joiningDate}
              onChange={(event) =>
                updateField(
                  "joiningDate",
                  event.target.value
                )
              }
              className={inputClass}
            />

            {renderError("joiningDate")}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Role *
            </label>

            <select
              value={formData.role}
              onChange={(event) =>
                updateField(
                  "role",
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="EMPLOYEE">
                Employee
              </option>

              <option value="HR_MANAGER">
                HR Manager
              </option>

              {currentUserRole ===
                "SUPER_ADMIN" && (
                <option value="SUPER_ADMIN">
                  Super Admin
                </option>
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Status *
            </label>

            <select
              value={formData.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value
                )
              }
              className={inputClass}
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <X size={18} />
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting || uploadingImage}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          {submitting ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Save size={18} />
          )}

          {uploadingImage
            ?" Uploading Image..."
            :submitting
            ? "Saving..."
            : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;