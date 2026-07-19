import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [error, setError] = useState("");
  const [imageError, setImageError] =
    useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/employees/${user.id}`
        );

        const employee =
          response.data.employee ??
          response.data;

        setName(employee.name ?? "");
        setPhone(employee.phone ?? "");
        setProfileImage(
          employee.profileImage ?? ""
        );
      } catch {
        setError(
          "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

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

    if (file.size > 5 * 1024 * 1024) {
      setImageError(
        "The image must be smaller than 5 MB."
      );
      event.target.value = "";
      return;
    }

    try {
      setUploadingImage(true);
      setImageError("");

      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post(
        "/upload/profile-image",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setProfileImage(
        response.data.imageUrl
      );
    } catch {
      setImageError(
        "Unable to upload the image."
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    if (!user?.id) {
      return;
    }

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!phone.trim()) {
      setError(
        "Phone number is required."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      await api.put(
        `/employees/${user.id}`,
        {
          name: name.trim(),
          phone: phone.trim(),
          profileImage,
        }
      );

      navigate("/profile");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2
          size={38}
          className="animate-spin text-indigo-600 dark:text-indigo-400"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        onClick={() =>
          navigate("/profile")
        }
        className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft size={18} />
        Back to Profile
      </button>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-slate-100">
          Edit My Profile
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Update your personal profile
          information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900"
      >
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Profile image */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Profile Image
          </label>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
            <div className="relative h-24 w-24 shrink-0 rounded-2xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-950">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="h-24 w-24 rounded-2xl border border-slate-200 object-cover shadow-sm dark:border-slate-800 dark:shadow-none"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-100 text-3xl font-bold text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400">
                  {name
                    ? name
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

            <div>
              <div className="flex flex-wrap gap-3 ">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800">
                  <ImagePlus size={18} />

                  {profileImage
                    ? "Change Image"
                    : "Choose Image"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleImageUpload
                    }
                    disabled={
                      uploadingImage
                    }
                    className="hidden"
                  />
                </label>

                {profileImage && (
                  <button
                    type="button"
                    onClick={() =>
                      setProfileImage("")
                    }
                    disabled={
                      uploadingImage
                    }
                    className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-900/30"
                  >
                    <Trash2 size={17} />
                    Remove
                  </button>
                )}
              </div>

              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                JPG, PNG, or WEBP. Maximum
                size: 5 MB.
              </p>

              {imageError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {imageError}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="my-7 border-t border-slate-200 dark:border-slate-800" />

        {/* Name */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Full Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
          />
        </div>

        {/* Phone */}
        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Phone Number
          </label>

          <input
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
          />
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end ">
          <button
            type="button"
            onClick={() =>
              navigate("/profile")
            }
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={
              saving || uploadingImage
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {saving ? (
              <Loader2
                size={18}
                className="animate-spin text-white dark:text-indigo-200"
              />
            ) : (
              <Save size={18} />
            )}

            {uploadingImage
              ? "Uploading Image..."
              : saving 
                ? "Saving..."
                : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;