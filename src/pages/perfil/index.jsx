import styles from "./index.module.scss";
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import FotoPrincipal from "@/components/perfil/fotoPrincipal";
import NomeUsuario from "@/components/perfil/nomeUsuario";
import Handle from "@/components/perfil/handle";
import Compartilhar from "@/components/botoes/compartilhar";
import Rede from "@/components/perfil/rede";
import CardsPerfil from "@/components/perfil/cards";
import FundoTitulos from "@/components/fundotitulos";
import SalvarFoto from "@/components/modais/salvarfoto";
import Private from "@/components/Private";

const PerfilUsuario = () => {
  // Estado para controlar se o modal está aberto ou fechado
  const [modalAberto, setModalAberto] = useState(false);

  const isMobile = useIsMobile();

  useEffect(() => {
    // Efeito para controlar o overflow do body
    if (modalAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalAberto]);

  // Função para abrir o modal
  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  return (
    <Private>
      <div className={styles.perfilUsuario}>
        {/* Header */}
        {isMobile ? <Header /> : <HeaderDesktop />}

        <div className={styles.apresentacao}>
          <FotoPrincipal onClickModal={abrirModal}></FotoPrincipal>

          <div className={styles.contPerfil}>
            <NomeUsuario></NomeUsuario>

            <div className={styles.compartilhar}>
              <Handle></Handle>
              {/* <Compartilhar></Compartilhar> */}
            </div>
          </div>

          {/* <div className={styles.rede}>
            <Rede
              iconePerfil={"/icones/seguidores.svg"}
              linkRede={"/seguidores"}
              titulo="Seguidores"
              valor={200}
            />
            <Rede
              iconePerfil={"/icones/seguindo.svg"}
              linkRede={"/seguindo"}
              titulo="Seguindo"
              valor={200}
            />
            <Rede
              iconePerfil={"/icones/avaliacoes.svg"}
              linkRede={"/filmesassisti"}
              titulo="Avaliações"
              valor={30}
            />
           <Rede
            iconePerfil={"/icones/potterHead.svg"}
            linkRede={"/dadospessoais"}
            titulo="Estilo"
            valor={"PotterHead"}
          />
          </div> */}

          <div className={styles.contDados}>
            <div className={styles.botoesDados}>
              <div className={styles.contCards}>
                <div className={styles.cardsPerfil}>
                  <CardsPerfil
                    linkDadosPerfil={"/dadospessoais"}
                    DadosdoPerfil={"Dados pessoais"}
                    imagemPerfil={"/icones/perfil.svg"}
                  />

                  <CardsPerfil
                    linkDadosPerfil={"/filmesassisti"}
                    DadosdoPerfil={"Filmes que assisti"}
                    imagemPerfil={"/icones/claquete-azul.svg"}
                  />

                  <CardsPerfil
                    linkDadosPerfil={"/filmesparaver"}
                    DadosdoPerfil={"Filmes para ver"}
                    imagemPerfil={"/icones/claquete-amarela.svg"}
                  />

                  {/* <CardsPerfil
                    linkDadosPerfil={"/listas-compartilhadas"}
                    DadosdoPerfil={"Listas compartilhadas"}
                    imagemPerfil={"/icones/claquete-roxa.svg"}
                  /> */}

                  <CardsPerfil
                    linkDadosPerfil={"/favoritos"}
                    DadosdoPerfil={"Meus favoritos"}
                    imagemPerfil={"/icones/favoritos.svg"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <FundoTitulos
          exibirPlay={false}
          capaAssistidos={"/background/background-cameo-perfil.png"}
          tituloAssistidos={"background"}
        ></FundoTitulos>

        {modalAberto && <SalvarFoto onClose={() => setModalAberto(false)} />}
      </div>
    </Private>
  );
};

export default PerfilUsuario;
