import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import NotasFilmes from "@/components/botoes/notas";
import Image from "next/image";

const FilmesCarousel = ({ filmes, selectedFilm, onClose }) => {
  const [imagemFoco, setImagemFoco] = useState(0);
  const carouselRef = useRef(null);
  const router = useRouter();

  // Monitora mudanças em imagemFoco e loga o filme correspondente
  useEffect(() => {
    if (filmes[imagemFoco]) {
      console.log("Filme em foco mudou:", filmes[imagemFoco]);
    }
  }, [imagemFoco, filmes]);

  // Atualiza imagemFoco com base no selectedFilm
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

  // Atualiza a posição de rolagem do carrossel para a imagem em foco
  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.scrollWidth / filmes.length;
      carouselRef.current.scrollLeft = imagemFoco * itemWidth; // Ajusta a rolagem para a imagem em foco
    }
    console.log("Filme em foco:", filmes[imagemFoco]?.title);
  }, [imagemFoco, filmes]);

  // Função para redirecionar ao clicar em uma imagem
  const handleImageClick = (index) => {
    const selectedFilmeId = filmes[index].id; // Obtenha o ID do filme
    router.push(`/?filmeId=${selectedFilmeId}`); // Redireciona para a home com o ID do filme
  };

  // Função para limitar a frequência com que a função de rolagem é chamada
  const debounceScroll = (func, delay) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  // Calcula o índice da imagem em foco com base na posição de rolagem
  const handleScroll = () => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.scrollWidth / filmes.length;
      const scrollPosition = carouselRef.current.scrollLeft;
      const newIndex = Math.round(scrollPosition / itemWidth);

      console.log("Scroll Position:", scrollPosition);
      console.log("Item Width:", itemWidth);
      console.log("New Index:", newIndex);

      // Atualiza imagemFoco se newIndex for diferente de 0
      if (newIndex === 0 || newIndex !== imagemFoco) {
        setImagemFoco(newIndex);
        console.log("Imagem em foco atualizada para:", newIndex);
      } else {
        console.log("Retornando ao mesmo filme:", filmes[imagemFoco]);
      }
    }
  };

  // Configura o listener de rolagem e garante que seja removido quando o componente for desmontado
  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (carouselElement) {
      const debouncedScroll = debounceScroll(handleScroll, 100); // 100ms de debounce
      carouselElement.addEventListener("scroll", debouncedScroll);

      return () => {
        carouselElement.removeEventListener("scroll", debouncedScroll);
      };
    }
  }, [filmes]);

  // Verificações de renderização
  console.log("Renderizando filme em foco:", filmes[imagemFoco]);

  return (
    <div className={styles.modalListagem}>
      <div className={styles.fecharModalFilmes} onClick={onClose}>
        <img src="/icones/close.svg" alt="Fechar" />
      </div>
      <div className={styles.tituloGeneroDuracao}>
        <div className={styles.tituloFilme}>
          <span>{filmes[imagemFoco]?.title || "Título não disponível"}</span>
        </div>
        <div className={styles.filmeGeneros}>
          {filmes[imagemFoco]?.genres?.map((item, index) => (
            <div className={styles.genero} key={index}>
              <span>{item.name}</span>
            </div>
          )) || <span>Gêneros não disponíveis</span>}
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
                onClick={() => handleImageClick(index)}
              >
                <div className={styles.capaFilme}>
                  <Image
                    src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                    alt={`Capa do filme ${filme.title}`}
                    layout="fill"
                    objectFit="cover"
                    quality={50}
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
        {filmes[imagemFoco] && (
          <img
            src={`https://image.tmdb.org/t/p/original/${filmes[imagemFoco]?.poster_path}`}
            alt={`Fundo do filme ${filmes[imagemFoco]?.title}`}
          />
        )}
      </div>
    </div>
  );
};

export default FilmesCarousel;
