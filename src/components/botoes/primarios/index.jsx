import styles from "./index.module.scss";

const BotaoPrimario = ({
  textoBotaoPrimario,
  idBprimario,
  typeBprimario,
  onClick,
}) => {
  return (
    <button
      type={typeBprimario}
      id={idBprimario}
      className={styles["botao-primario"]}
      onClick={onClick}
    >
      {textoBotaoPrimario}
    </button>
  );
};

export default BotaoPrimario;
