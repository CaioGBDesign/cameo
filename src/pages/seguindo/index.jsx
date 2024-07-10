import React from "react";
import styles from "./index.module.scss";
import Header from "@/components/Header";
import Rede from "@/components/perfil/rede";
import Search from "@/components/busca";
import CardSeguidor from "@/components/perfil/cardseguidor";
import BotaoSecundario from "@/components/botoes/secundarios";

const Seguidores = () => {
  const simulacaoBack = [
    {
      url: "/usuario/nadia.jpg",
      nome: "Nadia Zarour",
      handle: "@nadia.zarour",
      seguindo: true,
    },
    {
      url: "/usuario/usuario.jpeg",
      nome: "Caio Goulart",
      handle: "@caio.go",
      seguindo: true,
    },
  ];

  return (
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
                linkRede={"#"}
                titulo="Seguindo"
                valor={2}
              />
            </div>
          </div>

          <div className={styles.baseSearchBotao}>
            <div className={styles.contSearch}>
              <div className={styles.search}>
                <Search placeholder={"Buscar"}></Search>
              </div>
              <div className={styles.botaoAdicionar}>
                <BotaoSecundario
                  textoBotaoSecundario={"Adicionar"}
                  idBsecundario={"adicionar"}
                  fonteSecundaria={"14px"}
                />
              </div>
            </div>
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
  );
};

export default Seguidores;
