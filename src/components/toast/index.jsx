import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./index.module.scss";

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="7.99998" r="6.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 10.6667V7.66666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 5.34113V5.33446" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3.33334 9.33334L5.66667 11.6667L12.6667 4.33334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M9.28322 14H6.71679C3.62984 14 2.08637 14 1.51758 12.996C0.948785 11.9919 1.73825 10.6609 3.31717 7.99898L4.60038 5.83555C6.11707 3.27852 6.87541 2 8 2C9.1246 2 9.88294 3.27852 11.3996 5.83555L12.6828 7.99898C14.2618 10.6609 15.0512 11.9919 14.4824 12.996C13.9136 14 12.3702 14 9.28322 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 6V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11.3281V11.3348" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M12 4L4.00054 11.9994M11.9995 12L4 4.00057" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TYPE_CONFIG = {
  success: { Icon: SuccessIcon, color: "var(--icon-primary)" },
  warn:    { Icon: WarnIcon,    color: "var(--icon-primary)" },
  error:   { Icon: ErrorIcon,   color: "var(--icon-primary)" },
  info:    { Icon: InfoIcon,    color: "var(--icon-primary)" },
};

function ToastItem({ toast, onRemove }) {
  const { Icon, color } = TYPE_CONFIG[toast.type] ?? TYPE_CONFIG.info;

  return (
    <div
      className={`${styles.toast} ${toast.exiting ? styles.exiting : ""}`}
      style={toast.bg ? { background: toast.bg } : undefined}
    >
      <div className={styles.corpo}>
        <span className={styles.icon} style={{ color }}>
          <Icon />
        </span>
        <span className={styles.message}>{toast.message}</span>
      </div>

      {toast.buttons && toast.buttons.length > 0 && (
        <div className={styles.buttons}>
          {toast.buttons.map((btn, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.btn} ${btn.variant === "primary" ? styles.btnPrimary : styles.btnSecondary}`}
              onClick={() => {
                btn.onClick?.(toast.id);
                if (btn.closeOnClick !== false) onRemove(toast.id);
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ToastDisplay({ toasts, onRemove }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body,
  );
}
