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
                    imagemPerfil={
                      "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fperfil.svg?alt=media&token=d84914ca-d29d-440c-a300-b1d61b8e1d56"
                    }
                  />

                  <CardsPerfil
                    linkDadosPerfil={"/filmesassisti"}
                    DadosdoPerfil={"Filmes que assisti"}
                    imagemPerfil={
                      "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fclaquete-azul.svg?alt=media&token=d8abc08b-9dfd-4097-9363-613096f59d4c"
                    }
                  />

                  <CardsPerfil
                    linkDadosPerfil={"/filmesparaver"}
                    DadosdoPerfil={"Filmes para ver"}
                    imagemPerfil={
                      "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fclaquete-amarela.svg?alt=media&token=45c08b4f-5558-4b71-aeb5-0154fe698ebb"
                    }
                  />

                  <CardsPerfil
                    linkDadosPerfil={"/favoritos"}
                    DadosdoPerfil={"Meus favoritos"}
                    imagemPerfil={
                      "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Ffavoritos.svg?alt=media&token=0791783b-b986-4023-9149-81880a518395"
                    }
                  />
                </div>

                <div className={styles.cardsPerfil}>
                  <NoticiasCard
                    linkDadosPerfil={"/noticias"}
                    DadosdoPerfil={"Notícias"}
                    imagemPerfil={
                      "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fcameo-noticias.svg?alt=media&token=a9ca0ad7-d684-4e12-a826-5225c7c196d1"
                    }
                  />

                  <NoticiasCard
                    linkDadosPerfil={"/resenhas"}
                    DadosdoPerfil={"Resenhas"}
                    imagemPerfil={
                      "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fcameo-resenhas.svg?alt=media&token=033e5f31-7519-4c59-ae62-7ba6eedcc6d4"
                    }
                  />
                </div>
              </div>
            </div>

            <Footer />
          </div>
        </div>

        <FundoTitulos
          exibirPlay={false}
          capaAssistidos={
            "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fbackground-cameo-perfil.png?alt=media&token=5f65af7f-6231-4e49-80c9-a49f0c31a9bd"
          }
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
