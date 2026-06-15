import { useCallback, useMemo, useState } from "react";
import { CheckCircle2, Info, TriangleAlert, X, XCircle } from "lucide-react";
import ToastContext from "./toastContext";

const toastStyles = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800/40 dark:bg-emerald-900/20 dark:text-emerald-200",
    iconClassName: "text-emerald-600",
  },
  error: {
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-900 dark:border-red-800/40 dark:bg-red-900/20 dark:text-red-200",
    iconClassName: "text-red-600",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-[#e7d3a2] bg-[#fff6df] text-[#5d4521] dark:border-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200",
    iconClassName: "text-[#a77a22]",
  },
  info: {
    icon: Info,
    className: "border-[#eadfca] bg-[#fffaf0] text-stone-800 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200",
    iconClassName: "text-stone-500",
  },
};

function Toast({ toast, onDismiss }) {
  const style = toastStyles[toast.type] || toastStyles.info;
  const Icon = style.icon;

  return (
    <div
      className={`flex w-full max-w-sm items-start gap-3 rounded-lg border px-4 py-3 shadow-lg shadow-[#d7c6a8]/30 dark:shadow-black/40 ${style.className}`}
    >
      <Icon className={`mt-0.5 shrink-0 ${style.iconClassName}`} size={18} />
      <p className="min-w-0 flex-1 text-sm font-semibold">{toast.message}</p>
      <button
        type="button"
        className="rounded-md p-1 opacity-70 transition hover:bg-black/5 dark:hover:bg-white/10 hover:opacity-100"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((message, type = "info") => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  const value = useMemo(
    () => ({
      success: (message) => show(message, "success"),
      error: (message) => show(message, "error"),
      warning: (message) => show(message, "warning"),
      info: (message) => show(message, "info"),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-24 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export { ToastProvider };
