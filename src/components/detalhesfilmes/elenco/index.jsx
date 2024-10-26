import React, { useRef } from "react";
import styles from "./index.module.scss";
import Atores from "../atores";
import { useIsMobile } from "@/components/DeviceProvider";

const Elenco = ({ elenco }) => {
  const isMobile = useIsMobile();
  const elencoRef = useRef(null); // Referência à div do elenco

  if (!Array.isArray(elenco) || elenco.length === 0) {
    return null;
  }

  const scrollToNext = () => {
    if (elencoRef.current) {
      const { scrollLeft, clientWidth } = elencoRef.current;
      const nextScrollLeft = scrollLeft + clientWidth;
      if (nextScrollLeft < elencoRef.current.scrollWidth) {
        elencoRef.current.scrollTo({
          left: nextScrollLeft,
          behavior: "smooth",
        });
      } else {
        elencoRef.current.scrollTo({ left: 0, behavior: "smooth" }); // Volta ao início
      }
    }
  };

  const scrollToPrevious = () => {
    if (elencoRef.current) {
      const { scrollLeft, clientWidth } = elencoRef.current;
      const previousScrollLeft = scrollLeft - clientWidth;
      if (previousScrollLeft >= 0) {
        elencoRef.current.scrollTo({
          left: previousScrollLeft,
          behavior: "smooth",
        });
      } else {
        elencoRef.current.scrollTo({
          left: elencoRef.current.scrollWidth,
          behavior: "smooth",
        }); // Vai para o final
      }
    }
  };

  return (
    <div className={styles.elencoCameo}>
      <div className={styles.contElenco}>
        {isMobile ? (
          <h3>Elenco</h3>
        ) : (
          <div className={styles.headerElenco}>
            <h3>Elenco</h3>
            <div className={styles.botoes}>
              <button onClick={scrollToPrevious}>
                <img src="/icones/anterior.svg" />
              </button>
              <button onClick={scrollToNext}>
                <img src="/icones/proximo.svg" />
              </button>
            </div>
          </div>
        )}

        <div className={styles.elenco} ref={elencoRef}>
          {elenco.map((ator, index) => (
            <Atores
              key={index}
              NomeAtor={ator.name}
              fotoAtor={
                ator.profile_path
                  ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${ator.profile_path}`
                  : "https://via.placeholder.com/150"
              }
              Personagem={ator.character}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Elenco;
