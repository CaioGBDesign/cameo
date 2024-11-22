import React from "react";
import styles from "./index.module.scss";

const DeletarMetasMobile = ({ meta, onClose, onConfirmar }) => {
  return (
    <div className={styles.modalContainer}>
      <p>Tem certeza que deseja excluir a meta {meta?.periodo}?</p>
      <button onClick={onClose}>Cancelar</button>
      <button onClick={() => onConfirmar(meta.id)}>Confirmar</button>
    </div>
  );
};

export default DeletarMetasMobile;
