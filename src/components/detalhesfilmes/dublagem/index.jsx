import React from "react";
import styles from "./index.module.scss";
import Dubladores from "@/components/detalhesfilmes/dubladores";
import Link from "next/link";
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
  return (
    <div className={styles.dublagemCameo}>
      <div className={styles.contDublagem}>
        <h3>Dublagem</h3>

        <div className={styles.dublagem}>
          {simulacaoBack.map((dobladores, index) => (
            <Link
              key={index}
              href={`/dublador/${encodeURIComponent(dobladores.nome)}`}
            >
              <div className={styles.dubladorLink}>
                <Dubladores
                  fotoDublador={dobladores.url}
                  NomeDublador={dobladores.nome}
                  Personagem={dobladores.personagem}
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
