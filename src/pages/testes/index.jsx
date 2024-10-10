import React, { useEffect, useState, useRef } from "react";
import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";

const Teste = () => {
  const [imagemFoco, setImagemFoco] = useState(0);
  const simulacaoBack = [
    {
      url: "/background/duna.jpg",
      nota: 5,
      titulo: "Duna",
      generos: [{ genero: "Infantil" }, { genero: "Aventura" }],
    },
    {
      url: "/background/lightyear.jpg",
      nota: 3,
      titulo: "Lightyear",
      generos: [{ genero: "Infantil" }, { genero: "Aventura" }],
    },
    {
      url: "/background/dois-irmaos.jpg",
      nota: 4,
      titulo: "Dois Irmãos",
      generos: [{ genero: "Infantil" }, { genero: "Aventura" }],
    },
  ];

  const carouselRef = useRef(null);

  const handleScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current;
      const itemWidth = carouselRef.current.scrollWidth / simulacaoBack.length;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setImagemFoco(newIndex);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className={styles.modalListagem}>
      <div className={styles.tituloGeneroDuracao}>
        <div className={styles.tituloFilme}>
          <span>{simulacaoBack[imagemFoco]?.titulo}</span>
        </div>
        <div className={styles.filmeGeneros}>
          {simulacaoBack[imagemFoco]?.generos.map((item, index) => (
            <div className={styles.genero} key={index}>
              <span>{item.genero}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.contCarousel}>
        <div className={styles.carousel} ref={carouselRef}>
          <div className={styles.slider}>
            {simulacaoBack.map((capaFilme, index) => (
              <div
                className={`${styles.imagens} ${
                  imagemFoco === index ? styles.destaque : ""
                }`}
                key={index}
                style={{ scrollSnapAlign: "center" }} // Alinhamento para scroll snap
              >
                <div className={styles.capaFilme}>
                  <img
                    src={capaFilme.url}
                    alt={`Capa do filme ${capaFilme.titulo}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.avaliacaoFilme}>
        <div className={styles.escalaAvaliacao}>
          <span>Não Gostei</span>
          <span>Adorei</span>
        </div>
        <Estrelas
          estrelas={simulacaoBack[imagemFoco]?.nota}
          starWidth={"40px"}
        />
      </div>
    </div>
  );
};

export default Teste;
