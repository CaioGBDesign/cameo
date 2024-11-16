import styles from "./index.module.scss";
import { useIsMobile } from "@/components/DeviceProvider";

const DeletarMetas = ({ meta, onClose, onConfirmar }) => {
  if (!meta) return null;

  // define se desktop ou mobile
  const isMobile = useIsMobile();

  return (
    <div className={styles.modal}>
      <div className={styles.modalContainer}>
        <div className={styles.botoesModal}>
          <div className={styles.tituloModal}>
            <div className={styles.tituloFilme}>
              <h2>Deseja deletar a meta de</h2>
              <span>
                {meta.quantidade} filmes por {meta.periodo}?
              </span>
            </div>
            {isMobile ? null : (
              <button onClick={onClose}>
                <img src="/icones/close.svg" alt="Fechar" />
              </button>
            )}
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
