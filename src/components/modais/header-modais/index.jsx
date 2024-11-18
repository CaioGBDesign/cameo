import styles from "./index.module.scss";

const HeaderModal = ({
  onClose,
  titulo,
  icone,
  altIcone,
  showBotaoFechar = true,
}) => {
  return (
    <div className={styles.headerModal}>
      {showBotaoFechar && (
        <button onClick={onClose}>
          <img src="/icones/close.svg" />
        </button>
      )}

      <div className={styles.tituloModal}>
        <h2>{titulo}</h2>
        <div className={styles.imagemCapa}>
          <img src={icone} alt={altIcone} />
        </div>
      </div>
    </div>
  );
};

export default HeaderModal;
