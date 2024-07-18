// BotaoSecundario.jsx
import React from "react";
import styles from "./index.module.scss";

const BotaoSecundario = ({
  fonteSecundaria,
  idBsecundario,
  typeBsecundario,
  textoBotaoSecundario,
  onClick, // Adicione onClick como uma propriedade
}) => {
  return (
    <button
      type={typeBsecundario}
      id={idBsecundario}
      className={styles["botao-secundario"]}
      style={{ fontSize: fonteSecundaria }} // Corrigindo a sintaxe para camelCase
      onClick={onClick} // Adicione o onClick aqui
    >
      {textoBotaoSecundario}
    </button>
  );
};

export default BotaoSecundario;
