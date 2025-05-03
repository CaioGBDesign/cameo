import styles from "./index.module.scss";
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderDesktop from "@/components/HeaderDesktop";
import FotoPrincipal from "@/components/perfil/fotoPrincipal";
import NomeUsuario from "@/components/perfil/nomeUsuario";
import Handle from "@/components/perfil/handle";
import CardsPerfil from "@/components/perfil/cards";
import FundoTitulos from "@/components/fundotitulos";
import SalvarFoto from "@/components/modais/salvarfoto";
import Private from "@/components/Private";
import NoticiasCard from "@/components/Noticias-Card";

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
      <Head>
        <title>Cameo - Perfil</title>
        <meta
          name="description"
          content="Gerencie suas informações pessoais e preferências de filmes no seu perfil. Atualize seus dados, ajuste configurações de conta e descubra recomendações personalizadas para você."
        />
      </Head>
      <div className={styles.perfilUsuario}>
        {/* Header */}
        {isMobile ? <Header /> : <HeaderDesktop />}

        <div className={styles.apresentacao}>
          <FotoPrincipal onClickModal={abrirModal}></FotoPrincipal>

          <div className={styles.contPerfil}>
            <NomeUsuario></NomeUsuario>

            <div className={styles.compartilhar}>
              <Handle></Handle>
            </div>
          </div>

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

                  <CardsPerfil
                    linkDadosPerfil={"/favoritos"}
                    DadosdoPerfil={"Meus favoritos"}
                    imagemPerfil={"/icones/favoritos.svg"}
                  />
                </div>

                <div className={styles.cardsPerfil}>
                  <NoticiasCard
                    linkDadosPerfil={"/noticias"}
                    DadosdoPerfil={"Notícias"}
                    imagemPerfil={"/icones/cameo-noticias.svg"}
                  />

                  <NoticiasCard
                    linkDadosPerfil={"/resenhas"}
                    DadosdoPerfil={"Resenhas"}
                    imagemPerfil={"/icones/cameo-resenhas.svg"}
                  />
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>

        <FundoTitulos
          exibirPlay={false}
          capaAssistidos={"/background/background-cameo-perfil.png"}
          tituloAssistidos={"background"}
          style={{
            height: "600px",
          }}
        ></FundoTitulos>

        {modalAberto && <SalvarFoto onClose={() => setModalAberto(false)} />}
      </div>
    </Private>
  );
};

export default PerfilUsuario;
