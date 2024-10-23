import React, { useState, useEffect } from "react";
import styles from "./index.module.scss";
import Classificacao from "@/components/detalhesfilmes/classificacao";
import BotaoPlay from "@/components/botoes/play";
import { useIsMobile } from "@/components/DeviceProvider";

const TitulosFilmes = ({
  titulofilme,
  generofilme,
  duracaofilme,
  paisOrigem,
  releaseDates,
  trailerLink,
  backdropUrl,
}) => {
  const generos = generofilme ? generofilme.split(", ") : [];
  const isBrasileiro = paisOrigem && paisOrigem.includes("BR");
  const [filme, setFilme] = useState(null);

  // define se desktop ou mobile
  const isMobile = useIsMobile();

  return (
    <div className={styles.titulosFilmes}>
      {isMobile
        ? null
        : releaseDates && (
            <div className={styles.backdrop}>
              <div className={styles.basePlay}>
                <div className={styles.play}>
                  <BotaoPlay linkTrailer={trailerLink}></BotaoPlay>
                </div>
              </div>
              <div className={styles.imagemFundo}>
                <img
                  src={backdropUrl} // Use a prop aqui
                  alt="Backdrop do filme"
                />
              </div>
            </div>
          )}
      <div className={styles.informacoes}>
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
          {isMobile
            ? null
            : releaseDates && <Classificacao releaseDates={releaseDates} />}

          <div className={styles.todosOsGeneros}>
            {generos.length > 0 &&
              generos.map((genero, index) => (
                <div className={styles.genero} key={index}>
                  <span>{genero}</span>
                </div>
              ))}
          </div>
          {isMobile ? null : <span className={styles.divisor}>•</span>}
          {duracaofilme && <span>{duracaofilme}</span>}
        </div>
      </div>
    </div>
  );
};

export default TitulosFilmes;
