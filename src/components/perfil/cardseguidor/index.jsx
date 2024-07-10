import React, { useState } from "react";
import styles from "./index.module.scss";

const CardSeguidor = ({
  IMGSeguidor,
  NomeSeguidor,
  HandleSeguidor,
  seguindo,
}) => {
  const [estaSeguindo, setEstaSeguindo] = useState(seguindo);

  const alternarSeguir = () => {
    setEstaSeguindo(!estaSeguindo);
    // Aqui você pode implementar a lógica para seguir/não seguir no backend, se necessário
  };

  return (
    <div className={styles.cardSeguidor}>
      <div className={styles.perfilSeguidor}>
        <img src={IMGSeguidor} alt={NomeSeguidor} />
        <div className={styles.nomeHandle}>
          <p>{NomeSeguidor}</p>
          <span>{HandleSeguidor}</span>
        </div>
      </div>
      <div className={styles.botao}>
        <button
          className={estaSeguindo ? styles.naoSeguir : styles.seguir}
          onClick={alternarSeguir}
        >
          {estaSeguindo ? "Não seguir" : "Seguir"}
        </button>
      </div>
    </div>
  );
};

export default CardSeguidor;
