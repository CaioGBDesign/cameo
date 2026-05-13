import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import CloseIcon from "@/components/icons/CloseIcon";
import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";

const ANIMATION_DURATION = 300;

export default function ModalDetalhes({ title, onClose, itens = [] }) {
  const isMobile = useIsMobile();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleClose = useCallback(() => {
    if (!isMobile) { onClose(); return; }
    setIsClosing(true);
    setTimeout(() => { setIsClosing(false); onClose(); }, ANIMATION_DURATION);
  }, [isMobile, onClose]);

  const modalClass = [
    styles.modal,
    isMobile && styles.modalMobile,
    isMobile && isClosing ? styles.slideDown : isMobile ? styles.slideUp : "",
  ].filter(Boolean).join(" ");

  return createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <button className={styles.closeBtn} onClick={handleClose} type="button">
            <CloseIcon size={isMobile ? 15 : 20} color="currentColor" />
          </button>
        </div>

        <div className={styles.content}>
          {itens.map((item, i) => {
            const valores = Array.isArray(item.valor) ? item.valor : [item.valor];
            return (
              <div key={i} className={styles.item}>
                <span className={styles.label}>{item.label}</span>
                <span className={styles.valor}>
                  {valores.filter(Boolean).map((v, j) => {
                    const nome = typeof v === "object" ? v.nome : v;
                    const href = typeof v === "object" ? v.href : null;
                    return href
                      ? <Link key={j} href={href} className={styles.valorLink}>{nome}</Link>
                      : <span key={j}>{nome}</span>;
                  })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
}