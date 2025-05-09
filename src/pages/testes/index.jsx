import React, { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";

// Lazy-load components to reduce initial JS bundle
const Header = dynamic(() => import("@/components/Header"));
const HeaderDesktop = dynamic(() => import("@/components/HeaderDesktop"));
const Footer = dynamic(() => import("@/components/Footer"));
const FundoTitulosDesktop = dynamic(() =>
  import("@/components/fotoPrincipalDesktop")
);
const BotaoPlay = dynamic(() => import("@/components/botoes/play"), {
  ssr: false,
});
const Classificacao = dynamic(
  () => import("@/components/detalhesfilmes/classificacao"),
  { ssr: false }
);

export default function FilmeAleatorio() {
  const isMobile = useIsMobile();
  const [filme, setFilme] = useState(null);
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilme = async () => {
      try {
        // Import JSON only on client when needed
        const { default: listafilmes } = await import(
          "@/components/listafilmes/listafilmes.json"
        );
        const ids = Array.isArray(listafilmes.filmes) ? listafilmes.filmes : [];
        const randomId = ids[Math.floor(Math.random() * ids.length)];
        if (!randomId) {
          console.error("Nenhum ID válido em listafilmes.json");
          setLoading(false);
          return;
        }

        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

        // Fetch movie details including release dates
        const resFilme = await fetch(
          `https://api.themoviedb.org/3/movie/${randomId}?api_key=${apiKey}&language=pt-BR&append_to_response=videos,release_dates`
        );
        const filmeData = await resFilme.json();
        setFilme(filmeData);

        // Extract trailer link
        const trailer = filmeData.videos.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer)
          setTrailerLink(`https://www.youtube.com/watch?v=${trailer.key}`);

        // Set release dates array for classification component
        const dates = filmeData.release_dates.results || [];
        setReleaseDates(dates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilme();
  }, []);

  const description = filme
    ? `Assista a ${filme.title}, um filme de ${(filme.genres || [])
        .map((g) => g.name)
        .join(", ")}.`
    : "Carregando filme aleatório...";

  return (
    <>
      {isMobile ? <Header /> : <HeaderDesktop />}
      <Head>
        <title>Cameo – Filme Aleatório</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://cameo.fun/testes" />
      </Head>

      <main className={styles.container}>
        {loading && <p>Carregando filme...</p>}

        {!loading && filme && (
          <>
            <div className={styles.detalhesFilmes}>
              <div className={styles.topoFilmes}>
                <div className={styles.posterTrailer}>
                  {trailerLink && (
                    <div className={styles.botaoTrailer}>
                      <BotaoPlay linkTrailer={trailerLink} />
                    </div>
                  )}

                  {filme.backdrop_path && (
                    <div className={styles.posterFilme}>
                      <Image
                        src={`https://image.tmdb.org/t/p/w780/${filme.backdrop_path}`}
                        alt={filme.title}
                        width={780}
                        height={440}
                        className={styles.imagem}
                        priority
                      />
                    </div>
                  )}
                </div>

                <div className={styles.detalhesTopo}>
                  <div className={styles.tituloFilmes}>
                    <h1>{filme.title}</h1>
                  </div>

                  <div className={styles.classificacao}>
                    <Classificacao releaseDates={releaseDates} />
                  </div>
                </div>
              </div>
            </div>

            <FundoTitulosDesktop
              capaAssistidos={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`}
              tituloAssistidos={filme.title}
              opacidade={1}
            />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
