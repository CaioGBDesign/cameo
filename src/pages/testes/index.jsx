// pages/filme-aleatorio.js
import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useIsMobile } from "@/components/DeviceProvider";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import Footer from "@/components/Footer";
import FundoTitulosDesktop from "@/components/fotoPrincipalDesktop";
import listafilmes from "@/components/listafilmes/listafilmes.json";
import styles from "./index.module.scss";
import BotaoPlay from "@/components/botoes/play";

export default function FilmeAleatorio() {
  const isMobile = useIsMobile();
  const [filme, setFilme] = useState(null);
  const [trailerLink, setTrailerLink] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = "c95de8d6070dbf1b821185d759532f05";
    console.log("TMDB Key:", apiKey);

    const ids = Array.isArray(listafilmes.filmes) ? listafilmes.filmes : [];
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    if (!randomId) {
      console.error("Nenhum ID válido em listafilmes.json");
      setLoading(false);
      return;
    }

    const fetchFilme = async () => {
      try {
        // Detalhes do filme
        const resFilme = await fetch(
          `https://api.themoviedb.org/3/movie/${randomId}?api_key=${apiKey}&language=pt-BR`
        );
        if (!resFilme.ok)
          throw new Error(`Filme fetch error ${resFilme.status}`);
        const filmeData = await resFilme.json();
        setFilme(filmeData);

        // Trailer
        const resVideo = await fetch(
          `https://api.themoviedb.org/3/movie/${randomId}/videos?api_key=${apiKey}&language=pt-BR`
        );
        if (!resVideo.ok)
          throw new Error(`Video fetch error ${resVideo.status}`);
        const videoData = await resVideo.json();
        const trailer = videoData.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer)
          setTrailerLink(`https://www.youtube.com/watch?v=${trailer.key}`);
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
        <link rel="canonical" href="https://cameo.fun/filme-aleatorio" />
      </Head>
      <main className={styles.container}>
        {loading && <p>Carregando filme...</p>}
        {!loading && filme && (
          <>
            <div className={styles.detalhesFilmes}>
              <div className={styles.tituloFilmes}>
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
                        loading="eager"
                      />
                    </div>
                  )}
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
