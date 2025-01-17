import styles from "./index.module.scss";

const Resenha = ({ filmeId, onClickModal }) => {
  return (
    <div className={styles.botaoResenha}>
      <button onClick={() => onClickModal(filmeId)}>
        <img src="icones/resenha.svg" alt="Escrever Resenha" />
      </button>
    </div>
  );
};

export default Resenha;
