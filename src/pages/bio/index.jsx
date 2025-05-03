import styles from "./index.module.scss";
import Head from "next/head";
import { useIsMobile } from "@/components/DeviceProvider";
import Link from "next/link";

const Bio = () => {
  const isMobile = useIsMobile();

  return (
    <main>
      <div className={styles.ContBio}>
        <Head>
          <title>Cameo - Bio</title>
          <meta
            name="description"
            content="Descubra o filme perfeito com o Cameo! Oferecemos sugestões aleatórias e personalizadas, filtradas por gênero, classificação indicativa, serviços de streaming e muito mais. Crie listas de filmes, avalie suas escolhas e compartilhe com amigos. Mergulhe no mundo do cinema e nunca fique sem o que assistir. Cadastre-se agora e transforme sua experiência cinematográfica!"
          />
        </Head>

        <div className={styles.BioHeader}>
          <img src="/logo/cameo-logo-miniatura.svg" alt="Cameo logo" />
        </div>

        <div className={styles.BioLista}>
          <Link href="https://www.cameo.fun/filme-aleatorio" target="blank">
            <div className={styles.item}>Filme Aleatório</div>
          </Link>

          <Link href="https://www.cameo.fun/noticias" target="blank">
            <div className={styles.item}>Notícias</div>
          </Link>

          <Link href="https://www.cameo.fun/resenhas" target="blank">
            <div className={styles.item}>Resenhas</div>
          </Link>

          <div className={styles.separador}></div>

          <Link href="https://www.tiktok.com/@cameo.fun" target="blank">
            <div className={styles.item}>
              <img src="/icones/tiktok.svg" alt="TikTok" />
              TikTok
            </div>
          </Link>

          <Link href="https://www.instagram.com/cameo.fun/" target="blank">
            <div className={styles.item}>
              <img src="/icones/instagram.svg" alt="Instagram" />
              Instagram
            </div>
          </Link>

          <Link href="https://www.youtube.com/@cameo_fun" target="blank">
            <div className={styles.item}>
              <img src="/icones/youtube.svg" alt="YouTube" />
              YouTube
            </div>
          </Link>
        </div>

        <div className={styles.imgfundo}>
          {isMobile ? (
            <img
              src="/background/cameo-background-bio-mobile.png"
              alt="Cameo bio background"
            />
          ) : (
            <img
              src="/background/cameo-background-bio.png"
              alt="Cameo bio background"
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Bio;
