import styles from "./index.module.scss";

const HeaderModal = ({ onClose, titulo }) => {
  return (
    <div className={styles.headerModal}>
      <div className={styles.tituloModal}>
        <h2>{titulo}</h2>
        <button onClick={onClose}>
          <img src="/icones/close.svg" />
        </button>
      </div>
    </div>
  );
};

export default HeaderModal;
