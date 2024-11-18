import { useEffect, useRef } from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";
import HeaderModal from "@/components/modais/header-modais";

const DeletarMetas = ({ meta, onClose, onConfirmar }) => {
  if (!meta) return null;

  // define se desktop ou mobile
  const isMobile = useIsMobile();

  // Ref para monitorar o clique fora do modal
  const modalRef = useRef();

  useEffect(() => {
    // Função para detectar clique fora do modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Fecha o modal
      }
    };

    // Adiciona o event listener para cliques
    document.addEventListener("mousedown", handleClickOutside);

    // Limpeza do event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className={styles.modal} ref={modalRef}>
      <HeaderModal onClose={onClose} />
      <div className={styles.modalContainer}>
        <div className={styles.botoesModal}>
          <div className={styles.tituloModal}>
            <div className={styles.tituloFilme}>
              <h2>Deseja deletar a meta de</h2>

              <span>
                {meta.quantidade} filmes por {meta.periodo}?
              </span>
            </div>
          </div>

          <div className={styles.contBotoes}>
            <div className={styles.cancelar} onClick={onClose}>
              <span>Cancelar</span>
            </div>
            <div className={styles.confirmar} onClick={onConfirmar}>
              <span>Sim, deletar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletarMetas;
