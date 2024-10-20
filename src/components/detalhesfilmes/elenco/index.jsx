import React from "react";
import styles from "./index.module.scss";
import Atores from "../atores";

const Elenco = ({ elenco }) => {
  return (
    <div className={styles.elencoCameo}>
      <div className={styles.contElenco}>
        <h3>Elenco</h3>

        <div className={styles.elenco}>
          {Array.isArray(elenco) && elenco.length > 0 ? (
            elenco.map((ator, index) => (
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
            ))
          ) : (
            <p>Elenco não disponível</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Elenco;
