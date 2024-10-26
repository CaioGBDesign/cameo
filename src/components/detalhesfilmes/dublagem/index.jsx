import React, { useRef } from "react";
import styles from "./index.module.scss";
import Dubladores from "@/components/detalhesfilmes/dubladores";
import Link from "next/link";
import { useIsMobile } from "@/components/DeviceProvider";

const simulacaoBack = [
  {
    id: "D-AEB",
    url: "/dubladores/imagens/ana-elena-bittencourt.jpg",
    nome: "Ana Elena",
    personagem: "Personagem",
  },
  {
    id: "D-CCE",
    url: "/dubladores/imagens/carina-eiras.jpg",
    nome: "Carina Caetano",
    personagem: "Personagem",
  },
  {
    id: "D-ELDC",
    url: "/dubladores/imagens/eduardo-drummond.jpg",
    nome: "Eduardo Drummond",
    personagem: "Personagem",
  },
  {
    id: "D-LR",
    url: "/dubladores/imagens/leo-rabelo.jpg",
    nome: "Leonardo Rabelo",
    personagem: "Personagem",
  },
  {
    id: "D-MR",
    url: "/dubladores/imagens/manolo-rey.jpg",
    nome: "Manolo Rey",
    personagem: "Personagem",
  },
  {
    id: "D-MD",
    url: "/dubladores/imagens/marcio-dondi.jpg",
    nome: "Márcio Dondi",
    personagem: "Personagem",
  },
  {
    id: "D-MAR",
    url: "/dubladores/imagens/marco-ribeiro.jpg",
    nome: "Marco Ribeiro",
    personagem: "Personagem",
  },
  {
    id: "D-PA",
    url: "/dubladores/imagens/pedro-azevedo.jpg",
    nome: "Pedro Azevedo",
    personagem: "Personagem",
  },
  {
    id: "D-RR",
    url: "/dubladores/imagens/raphael-rossatto.jpg",
    nome: "Raphael Rossatto",
    personagem: "Personagem",
  },
  {
    id: "D-RJ",
    url: "/dubladores/imagens/ricardo-juarez.jpg",
    nome: "Ricardo Juarez",
    personagem: "Personagem",
  },
];

const Dublagem = () => {
  const isMobile = useIsMobile();
  const dublagemRef = useRef(null); // Referência à div da dublagem

  const scrollToNext = () => {
    if (dublagemRef.current) {
      const { scrollLeft, clientWidth } = dublagemRef.current;
      const nextScrollLeft = scrollLeft + clientWidth;
      if (nextScrollLeft < dublagemRef.current.scrollWidth) {
        dublagemRef.current.scrollTo({
          left: nextScrollLeft,
          behavior: "smooth",
        });
      } else {
        dublagemRef.current.scrollTo({ left: 0, behavior: "smooth" }); // Volta ao início
      }
    }
  };

  const scrollToPrevious = () => {
    if (dublagemRef.current) {
      const { scrollLeft, clientWidth } = dublagemRef.current;
      const previousScrollLeft = scrollLeft - clientWidth;
      if (previousScrollLeft >= 0) {
        dublagemRef.current.scrollTo({
          left: previousScrollLeft,
          behavior: "smooth",
        });
      } else {
        dublagemRef.current.scrollTo({
          left: dublagemRef.current.scrollWidth,
          behavior: "smooth",
        }); // Vai para o final
      }
    }
  };

  return (
    <div className={styles.dublagemCameo}>
      <div className={styles.contDublagem}>
        {isMobile ? (
          <h3>Dublagem</h3>
        ) : (
          <div className={styles.headerDublagem}>
            <h3>Dublagem</h3>
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

        <div className={styles.dublagem} ref={dublagemRef}>
          {simulacaoBack.map((dublador, index) => (
            <Link
              key={index}
              href={`/dublador/${encodeURIComponent(dublador.nome)}`}
            >
              <div className={styles.dubladorLink}>
                <Dubladores
                  fotoDublador={dublador.url}
                  NomeDublador={dublador.nome}
                  Personagem={dublador.personagem}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dublagem;
