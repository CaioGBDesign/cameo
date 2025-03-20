import { useState } from "react"; // Importando useState
import styles from "./index.module.scss";
import Head from "next/head";
import { useIsMobile } from "@/components/DeviceProvider";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderDesktop from "@/components/HeaderDesktop";

const Sobre = () => {
  const isMobile = useIsMobile();

  return (
    <main>
      <div className={styles.ContApresentacao}>
        <Head>
          <title>Cameo - Apresentação</title>
          <meta
            name="description"
            content="Descubra o filme perfeito com a Cameo! Oferecemos sugestões aleatórias e personalizadas, filtradas por gênero, classificação indicativa, serviços de streaming e muito mais. Crie listas de filmes, avalie suas escolhas e compartilhe com amigos. Mergulhe no mundo do cinema e nunca fique sem o que assistir. Cadastre-se agora e transforme sua experiência cinematográfica!"
          />
        </Head>

        {isMobile ? <Header /> : <HeaderDesktop />}
      </div>
    </main>
  );
};

export default Sobre;
