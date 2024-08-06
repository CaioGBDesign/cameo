import React from "react";
import styles from "./index.module.scss";

const TitulosFilmes = ({
  titulofilme,
  generofilme,
  duracaofilme,
  paisOrigem,
}) => {
  // Dividir os gêneros por vírgula para obter um array de gêneros
  const generos = generofilme ? generofilme.split(", ") : [];
  const isBrasileiro = paisOrigem && paisOrigem.includes("BR");

  return (
    <div className={styles.titulosFilmes}>
      <h1>
        {titulofilme} &nbsp;
        {isBrasileiro && (
          <img
            src="/icones/flag-brasil.png"
            alt="Filme Brasileiro"
            className={styles.bandeiraBrasil}
          />
        )}
      </h1>
      <div className={styles.generoDuracao}>
        <div className={styles.todosOsGeneros}>
          {generos.length > 0 &&
            generos.map((genero, index) => (
              <div className={styles.genero} key={index}>
                <span>{genero}</span>
              </div>
            ))}
        </div>
        {duracaofilme && <span>{duracaofilme}</span>}
      </div>
    </div>
  );
};

export default TitulosFilmes;
