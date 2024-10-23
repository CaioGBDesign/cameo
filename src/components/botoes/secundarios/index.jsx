// BotaoSecundario.jsx
import React from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";

const BotaoSecundario = ({
  fonteSecundaria,
  idBsecundario,
  typeBsecundario,
  textoBotaoSecundario,
  onClick,
}) => {
  const isMobile = useIsMobile();

  return isMobile ? (
    <button
      type={typeBsecundario}
      id={idBsecundario}
      className={styles["botao-secundario"]}
      style={{ fontSize: fonteSecundaria }}
      onClick={onClick}
    >
      {textoBotaoSecundario}
    </button>
  ) : (
    <button
      type={typeBsecundario}
      id={idBsecundario}
      className={styles["botao-secundario"]}
      style={{ fontSize: fonteSecundaria }}
      onClick={onClick}
    >
      <img src="/icones/filtros.svg" />
    </button>
  );
};

export default BotaoSecundario;
