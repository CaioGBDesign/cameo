import { useEffect, useState } from "react";
import CloseIcon from "@/components/icons/CloseIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import Button from "@/components/button";
import styles from "./index.module.scss";

const DURATION = 280;

export function AdmModalFooter({
  onCancel,
  onConfirm,
  labelCancel = "Cancelar",
  labelConfirm = "Confirmar",
}) {
  return (
    <div className={styles.footer}>
      <Button variant="ghost" label={labelCancel} onClick={onCancel} />
      <Button
        variant="solid"
        label={labelConfirm}
        icon={<CheckIcon size={16} color="currentColor" />}
        onClick={onConfirm}
        width="150px"
        arrowColor="var(--bg-solid)"
      />
    </div>
  );
}

export function AdmModalHeader({ title, onClose }) {
  return (
    <div className={styles.header}>
      <span className={styles.headerTitle}>{title}</span>
      <button className={styles.headerClose} type="button" onClick={onClose}>
        <CloseIcon size={16} color="currentColor" />
      </button>
    </div>
  );
}

export default function AdmModal({ isOpen, onClose, title, header, children, closeRef }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, DURATION);
  };

  useEffect(() => {
    if (closeRef) closeRef.current = handleClose;
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`${styles.overlay} ${closing ? styles.overlayClosing : ""}`}
        onClick={handleClose}
      />
      <div className={`${styles.modal} ${closing ? styles.modalClosing : ""}`}>
        {header ?? <AdmModalHeader title={title} onClose={handleClose} />}
        <div className={styles.body}>{children}</div>
      </div>
    </>
  );
}
