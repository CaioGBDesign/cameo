import React, { useState } from "react";
import styles from "./index.module.scss";

const Titulolistagem = ({
  quantidadeFilmes,
  titulolistagem,
  configuracoes = true,
  handleRemoverClick,
}) => {
  const [backgroundColor, setBackgroundColor] = useState("");
  const [hasBorder, setHasBorder] = useState(false);

  const handleClick = () => {
    // Alterna entre a cor de fundo e a borda
    setBackgroundColor((prevColor) =>
      prevColor === "#ffffff20" ? "" : "#ffffff20"
    );
    setHasBorder((prev) => !prev); // Alterna a borda
    handleRemoverClick();
  };

  return (
    <div className={styles.titulolistagem}>
      <div className={styles.quantidade}>
        <span className={styles.contagem}>{quantidadeFilmes}</span>
        <span className={styles.tituloPagina}>{titulolistagem}</span>
      </div>

      <div className={styles.botoes}>
        {configuracoes && (
          <div
            className={styles.remover}
            onClick={handleClick}
            style={{
              backgroundColor,
              border: hasBorder ? "solid 1px #fff" : "none", // Aplica a borda condicionalmente
            }}
          >
            <img src="icones/deletar.svg" alt="" />
          </div>
        )}
        <div className={styles.filtros}>
          <img src="icones/filtros.svg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Titulolistagem;
