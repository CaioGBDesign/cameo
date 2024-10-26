import React, { useState, useRef, Suspense } from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";
import Image from "next/image";
import Loading from "@/components/loading";

const Recomendacoes = ({ recomendacoes, selecionarFilmeRecomendado }) => {
  const isMobile = useIsMobile();
  const scrollRef = useRef(null); // Referência para a div de scroll

  if (recomendacoes.length === 0) return null;

  const scrollToNext = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const nextScrollLeft = scrollLeft + clientWidth;
      if (nextScrollLeft < scrollRef.current.scrollWidth) {
        scrollRef.current.scrollTo({
          left: nextScrollLeft,
          behavior: "smooth",
        });
      } else {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" }); // Volta ao início
      }
    }
  };

  const scrollToPrevious = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const previousScrollLeft = scrollLeft - clientWidth;
      if (previousScrollLeft >= 0) {
        scrollRef.current.scrollTo({
          left: previousScrollLeft,
          behavior: "smooth",
        });
      } else {
        scrollRef.current.scrollTo({
          left: scrollRef.current.scrollWidth,
          behavior: "smooth",
        }); // Vai para o final
      }
    }
  };

  return (
    <div className={styles.recomendacoes}>
      {isMobile ? (
        <h3>Recomendações</h3>
      ) : (
        <div className={styles.headerRecomendações}>
          <h3>Recomendações</h3>
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

      <div className={styles.contRecomendacoes}>
        <div className={styles.scrollRecomendacoes} ref={scrollRef}>
          {recomendacoes.map((recomendacao) => (
            <div
              className={styles.listaRecomendacoes}
              key={recomendacao.id}
              onClick={() =>
                selecionarFilmeRecomendado(String(recomendacao.id))
              }
            >
              <Suspense fallback={<Loading />}>
                <div className={styles.fotoRecomendacoes}>
                  <Image
                    src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${recomendacao.poster_path}`}
                    alt={recomendacao.title}
                    fill
                    quality={50} // Ajuste a qualidade se necessário
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.objectFit}
                  />
                </div>
              </Suspense>
              <span>{recomendacao.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Recomendacoes;
