import { useState, useCallback } from "react";
import Button from "@/components/button";
import CloseIcon from "@/components/icons/CloseIcon";
import WandIcon from "@/components/icons/WandIcon";
import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";

const ANIMATION_DURATION = 300;

export default function Modal({
  title,
  onClose,
  children,
  primaryAction,
  secondaryAction,
}) {
  const isMobile = useIsMobile();
  const hasFooter = !!primaryAction;
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (!isMobile) {
      onClose();
      return;
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, ANIMATION_DURATION);
  }, [isMobile, onClose]);

  const modalClass = [
    styles.modal,
    isMobile && styles.modalMobile,
    isMobile && isClosing ? styles.slideDown : isMobile ? styles.slideUp : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={modalClass} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
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

        <div className={styles.content}>{children}</div>

        {hasFooter && (
          <div className={styles.footer}>
            {secondaryAction && (
              <Button
                variant={
                  isMobile
                    ? (secondaryAction.mobileVariant ?? secondaryAction.variant)
                    : secondaryAction.variant
                }
                label={isMobile ? undefined : secondaryAction.label}
                icon={
                  isMobile ? (
                    <WandIcon size={16} color="currentColor" />
                  ) : undefined
                }
                stars={secondaryAction.stars}
                onClick={secondaryAction.onClick}
              />
            )}
            <Button
              variant="solid"
              label={primaryAction.label}
              onClick={primaryAction.onClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}
