import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useIsMobile } from "@/components/DeviceProvider";
import CloseIcon from "@/components/icons/CloseIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import styles from "./index.module.scss";

const CLOSE_DURATION = 300;

/**
 * ModalViews — shell genérico de modal com múltiplas views em slider.
 *
 * @param {string|ReactNode} title        — título exibido no header
 * @param {() => void}       onClose      — fecha o modal
 * @param {() => void}       [onBack]     — exibe botão voltar quando definido
 * @param {number}           activeView   — índice da view ativa (0-based)
 * @param {{ content: ReactNode, footer?: ReactNode }[]} views — array de views
 */
export default function ModalViews({
  title,
  onClose,
  onBack,
  activeView = 0,
  views = [],
}) {
  const isMobile = useIsMobile();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = useCallback(() => {
    if (!isMobile) {
      onClose();
      return;
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, CLOSE_DURATION);
  }, [isMobile, onClose]);

  const modalClass = [
    styles.modal,
    isMobile && styles.modalMobile,
    isMobile && isClosing ? styles.slideDown : isMobile ? styles.slideUp : "",
  ]
    .filter(Boolean)
    .join(" ");

  const slideWidth = `${100 / views.length}%`;
  const translateX = `-${activeView * (100 / views.length)}%`;

  return createPortal(
    <div className={styles.overlay} onClick={handleClose}>
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              className={`${styles.backBtn} ${onBack ? styles.backBtnVisible : ""}`}
              onClick={onBack}
              type="button"
              aria-label="Voltar"
            >
              <ChevronDownIcon
                size={16}
                color="currentColor"
                className={styles.backBtnIcon}
              />
            </button>
            <span className={styles.title}>{title}</span>
          </div>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            type="button"
          >
            <div className={styles.closeBtnIcon}>
              <CloseIcon size={isMobile ? 15 : 24} color="currentColor" />
            </div>
          </button>
        </div>

        <div
          className={styles.slider}
          style={{
            width: `${views.length * 100}%`,
            transform: `translateX(${translateX})`,
          }}
        >
          {views.map((view, i) => (
            <div key={i} className={styles.slide} style={{ width: slideWidth }}>
              <div className={`${styles.content} ${view.noScroll ? styles.contentNoScroll : ""}`}>{view.content}</div>
              {view.footer && (
                <div className={styles.footer}>{view.footer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  );
}
