import React from "react";
import styles from "./index.module.scss";
import Header from "@/components/Header";
import Rede from "@/components/perfil/rede";
import Search from "@/components/busca";
import CardSeguidor from "@/components/perfil/cardseguidor";
import Private from "@/components/Private";

const Seguidores = () => {
  const simulacaoBack = [
    {
      url: "/usuario/nadia.jpg",
      nome: "Nadia Zarour",
      handle: "@nadia.zarour",
      seguindo: false,
    },
    {
      url: "/usuario/usuario.jpeg",
      nome: "Caio Goulart",
      handle: "@caio.go",
      seguindo: true,
    },
  ];

  return (
    <Private>
      <div className={styles.seguidores}>
        <Header />
        <div className={styles.contSessao}>
          <div className={styles.topoSessao}>
            <div className={styles.sessao}>
              <div className={styles.seguidores}>
                <Rede
                  iconePerfil={"/icones/seguidores.svg"}
                  linkRede={"/seguidores"}
                  titulo="Seguidores"
                  valor={2}
                />
              </div>

              <div className={styles.seguido}>
                <Rede
                  iconePerfil={"/icones/seguindo.svg"}
                  linkRede={"/seguindo"}
                  titulo="Seguindo"
                  valor={2}
                />
              </div>
            </div>

            <div className={styles.search}>
              <Search placeholder={"Buscar filmes"}></Search>
            </div>
          </div>

          <div className={styles.usuarios}>
            <div className={styles.seguidores}>
              {/* Renderiza cada seguidor com suas informações */}
              {simulacaoBack.map((seguidor, index) => (
                <CardSeguidor
                  key={index}
                  IMGSeguidor={seguidor.url}
                  NomeSeguidor={seguidor.nome}
                  HandleSeguidor={seguidor.handle}
                  seguindo={seguidor.seguindo}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Private>
  );
};

export default Seguidores;
