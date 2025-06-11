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
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/logo%2Fcameo-logo-miniatura.svg?alt=media&token=bb482344-e73f-4cee-ac6f-97a1c003b6e7"
            alt="Cameo logo"
          />
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
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Ftiktok.svg?alt=media&token=438263b9-26ef-4628-bdbe-635b26e41122"
                alt="TikTok"
              />
              TikTok
            </div>
          </Link>

          <Link href="https://www.instagram.com/cameo.fun/" target="blank">
            <div className={styles.item}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Finstagram.svg?alt=media&token=f7cec9d2-fcc7-4fc1-971d-f3b3235ec12f"
                alt="Instagram"
              />
              Instagram
            </div>
          </Link>

          <Link href="https://www.youtube.com/@cameo_fun" target="blank">
            <div className={styles.item}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fyoutube.svg?alt=media&token=f18edca3-ab54-4387-a388-d13fe22f87fc"
                alt="YouTube"
              />
              YouTube
            </div>
          </Link>
        </div>

        <div className={styles.imgfundo}>
          {isMobile ? (
            <img
              src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fcameo-background-bio-mobile.png?alt=media&token=adf8f4fb-0775-4d80-ba3c-4cfa7fdbe7d8"
              alt="Cameo bio background"
            />
          ) : (
            <img
              src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fcameo-background-bio.png?alt=media&token=5a905a68-a42f-4fe1-a1f5-99aaaaab87dd"
              alt="Cameo bio background"
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Bio;
