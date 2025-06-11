import styles from "./index.module.scss";

const Resenha = ({ filmeId, onClickModal }) => {
  return (
    <div className={styles.botaoResenha}>
      <button onClick={() => onClickModal(filmeId)}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fresenha.svg?alt=media&token=5ca2c32b-49c7-4f82-ad4b-a73810e7e7bd"
          alt="Escrever Resenha"
        />
      </button>
    </div>
  );
};

export default Resenha;
