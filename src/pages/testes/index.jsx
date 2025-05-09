import React, { useEffect, useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/components/DeviceProvider";
import TitulosFilmes from "@/components/titulosfilmesB";
import styles from "./index.module.scss";

// Lazy-load components to reduce initial JS bundle
const Header = dynamic(() => import("@/components/Header"));
const HeaderDesktop = dynamic(() => import("@/components/HeaderDesktop"));
const Footer = dynamic(() => import("@/components/Footer"));
const FundoTitulosDesktop = dynamic(() =>
  import("@/components/fotoPrincipalDesktop")
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
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${randomId}?api_key=${apiKey}&language=pt-BR&append_to_response=videos,release_dates`
        );
        const data = await res.json();
        setFilme(data);
        const trailer = data.videos.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer)
          setTrailerLink(`https://www.youtube.com/watch?v=${trailer.key}`);
        setReleaseDates(data.release_dates.results || []);
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
            <TitulosFilmes
              filme={filme}
              trailerLink={trailerLink}
              releaseDates={releaseDates}
            />
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
