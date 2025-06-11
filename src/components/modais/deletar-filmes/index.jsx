import React, { useRef, useEffect, useState } from "react";
import styles from "./index.module.scss";

const DeletarFilme = ({ TituloFilme, onClose, onConfirm }) => {
  const modalRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    console.log("Fechando o modal...");
    setIsClosing(true);
    setTimeout(() => {
      console.log("Chamando onClose após animação...");
      onClose();
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      console.log("Modal aberto, adicionando listener.");
    } else {
      console.log("Modal fechado.");
    }
  }, [isOpen]);

  const handleOpen = () => {
    console.log("Abrindo o modal...");
    setIsOpen(true);
  };

  const handleClose = () => {
    console.log("Botão de fechar clicado.");
    closeModal();
  };

  const handleConfirm = () => {
    console.log("Confirmando deleção do filme...");
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
      console.log("Chamando onClose após confirmação...");
      onClose();
    }, 300);
  };

  return (
    <div
      className={`${styles.modal} ${isOpen ? styles.open : ""}`}
      onClick={closeModal}
    >
      <div
        className={`${styles.modalContainer} ${isClosing ? styles.close : ""}`}
        ref={modalRef}
        onClick={(e) => e.stopPropagation()} // Evita que cliques no modal fechem ele
      >
        <div className={styles.botoesModal}>
          <div className={styles.tituloModal}>
            <div className={styles.tituloFilme}>
              <h2>Deseja deletar o filme</h2>
              <span>{TituloFilme}?</span>
            </div>
            <button onClick={handleClose}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fclose.svg?alt=media&token=c9af99dc-797e-4364-9df2-5ed76897cc92"
                alt="Fechar"
              />
            </button>
          </div>

          <div className={styles.contBotoes}>
            <div className={styles.confirmar} onClick={handleConfirm}>
              <span>Sim, deletar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletarFilme;
