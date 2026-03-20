import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import styles from "./index.module.scss";

export default function PopoverConfirmar({
  mensagem,
  labelConfirmar = "Confirmar",
  labelCancelar = "Cancelar",
  onConfirmar,
  onCancelar,
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onCancelar}>
      <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
        <p className={styles.mensagem}>{mensagem}</p>
        <div className={styles.acoes}>
          <button className={styles.cancelar} onClick={onCancelar} type="button">
            {labelCancelar}
          </button>
          <button className={styles.confirmar} onClick={onConfirmar} type="button">
            {labelConfirmar}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
