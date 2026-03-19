import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import ToastDisplay from "@/components/toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target || target.exiting) return prev;
      return prev.map((t) => (t.id === id ? { ...t, exiting: true } : t));
    });
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback(
    ({ message, type = "info", duration = 3000, bg, buttons }) => {
      const id = uuidv4();
      setToasts((prev) => [
        ...prev,
        { id, message, type, duration, bg, buttons, exiting: false },
      ]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
      return id;
    },
    [removeToast],
  );

  const toast = useMemo(
    () => ({
      show: addToast,
      success: (message, opts) => addToast({ message, type: "success", ...opts }),
      warn: (message, opts) => addToast({ message, type: "warn", ...opts }),
      error: (message, opts) => addToast({ message, type: "error", ...opts }),
      info: (message, opts) => addToast({ message, type: "info", ...opts }),
    }),
    [addToast],
  );

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastDisplay toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
