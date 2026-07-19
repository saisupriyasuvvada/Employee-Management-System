import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  employeeName: string;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal = ({
  isOpen,
  employeeName,
  deleting,
  onConfirm,
  onCancel,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 ">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm "
        onClick={() => {
          if (!deleting) {
            onCancel();
          }
        }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={onCancel}
          disabled={deleting}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          <X size={20} />
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
          <AlertTriangle size={24} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          Delete Employee?
        </h2>

        <p className="mt-3 leading-6 text-slate-500 dark:text-slate-400">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-800 dark:text-white">
            {employeeName}
          </span>
          ? This employee will be removed from the active employee
          directory.
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting && (
              <Loader2
                size={18} 
                className="animate-spin"
              />
            )}

            {deleting
              ? "Deleting..."
              : "Delete Employee"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;