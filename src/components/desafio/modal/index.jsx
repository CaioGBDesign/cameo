import { useEffect } from "react";
import CloseIcon from "@/components/icons/CloseIcon";
import styles from "./index.module.scss";

export default function DesafioModal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} type="button" onClick={onClose}>
          <CloseIcon size={16} color="currentColor" />
        </button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
