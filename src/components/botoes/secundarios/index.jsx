import styles from "./index.module.scss";

const BotaoSecundario = ({
  fonteSecundaria,
  idBsecundario,
  typeBsecundario,
  textoBotaoSecundario,
}) => {
  return (
    <button
      type={typeBsecundario}
      id={idBsecundario}
      className={styles["botao-secundario"]}
      style={{ fontSize: fonteSecundaria }} // Corrigindo a sintaxe para camelCase
    >
      {textoBotaoSecundario}
    </button>
  );
};

export default BotaoSecundario;
