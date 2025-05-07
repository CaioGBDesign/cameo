// pages/filme-aleatorio.js
import { useEffect, useState, useCallback } from "react";
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
  const [trailerLink, setTrailerLink] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchRandomMovie = useCallback(async () => {
    const ids = listafilmes.filmes;
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    try {
      // fetch movie details and videos in parallel
      const [movieRes, videoRes] = await Promise.all([
        fetch(
          `https://api.themoviedb.org/3/movie/${randomId}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`
        ),
        fetch(
          `https://api.themoviedb.org/3/movie/${randomId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`
        ),
      ]);
      const movieData = await movieRes.json();
      const { results = [] } = await videoRes.json();
      setFilme(movieData);

      const trailer = results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      if (trailer) setTrailerLink(`https://youtu.be/${trailer.key}`);
    } catch (err) {
      console.error("Erro ao carregar filme ou trailer:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomMovie();
  }, [fetchRandomMovie]);

  const description = filme
    ? `Assista a ${filme.title}, um filme de ${
        filme.genres?.map((g) => g.name).join(", ") || "gênero desconhecido"
      }.`
    : "Carregando filme aleatório…";

  return (
    <>
      {isMobile ? <Header /> : <HeaderDesktop />}
      <Head>
        <title>Cameo – Filme Aleatório</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://cameo.fun/filme-aleatorio" />
      </Head>

      <main className={styles.container}>
        <div className={styles.detalhesFilmes}>
          <div className={styles.tituloFilmes}>
            <div className={styles.posterTrailer}>
              {trailerLink && (
                <div className={styles.botaoTrailer}>
                  <BotaoPlay linkTrailer={trailerLink} />
                </div>
              )}
              {filme?.backdrop_path && (
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

        {loading ? (
          <p>Carregando filme…</p>
        ) : (
          <FundoTitulosDesktop
            capaAssistidos={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`}
            tituloAssistidos={filme.title}
            opacidade={1}
          />
        )}
      </main>

      <Footer />
    </>
  );
}
