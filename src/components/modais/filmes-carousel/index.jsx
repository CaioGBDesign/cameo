import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import NotasFilmes from "@/components/botoes/notas";

const FilmesCarousel = ({ filmes, selectedFilm, onClose }) => {
  const [imagemFoco, setImagemFoco] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (selectedFilm && filmes.length > 0) {
      const selectedIndex = filmes.findIndex(
        (filme) => filme.id === selectedFilm.id
      );
      if (selectedIndex !== -1) {
        setImagemFoco(selectedIndex);
      }
    }
  }, [selectedFilm, filmes]);

  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.scrollWidth / filmes.length;
      carouselRef.current.scrollLeft = imagemFoco * itemWidth; // Ajusta a rolagem para a imagem em foco
    }
  }, [imagemFoco, filmes]);

  return (
    <div className={styles.modalListagem}>
      <div className={styles.fecharModalFilmes} onClick={onClose}>
        <img src="/icones/close.svg" alt="Fechar" />
      </div>
      <div className={styles.tituloGeneroDuracao}>
        <div className={styles.tituloFilme}>
          <span>{filmes[imagemFoco]?.title}</span>
        </div>
        <div className={styles.filmeGeneros}>
          {filmes[imagemFoco]?.genres?.map((item, index) => (
            <div className={styles.genero} key={index}>
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.contCarousel}>
        <div className={styles.carousel} ref={carouselRef}>
          <div className={styles.slider}>
            {filmes.map((filme, index) => (
              <div
                className={`${styles.imagens} ${
                  imagemFoco === index ? styles.destaque : ""
                }`}
                key={index}
                style={{ scrollSnapAlign: "center" }}
              >
                <div className={styles.capaFilme}>
                  <img
                    src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                    alt={`Capa do filme ${filme.title}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.avaliacaoFilme}>
        <NotasFilmes avaliarFilme={filmes[imagemFoco]?.rating} />
      </div>

      <div className={styles.fundoFilmeFoco}>
        <img
          src={`https://image.tmdb.org/t/p/original/${filmes[imagemFoco]?.poster_path}`}
          alt={`Fundo do filme ${filmes[imagemFoco]?.title}`}
        />
      </div>
    </div>
  );
};

export default FilmesCarousel;
