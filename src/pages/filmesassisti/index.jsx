import { useState, useEffect, useCallback } from "react";
import styles from "./index.module.scss";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Private from "@/components/Private";
import FilmeHero from "@/components/filme-hero";
import SectionCard from "@/components/section-card";
import CardFilme from "@/components/card-filme";
import FilterIcon from "@/components/icons/FilterIcon";
import Breadcrumb from "@/components/breadcrumb";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";

const TMDB_KEY = "c95de8d6070dbf1b821185d759532f05";

export default function FilmesAssisti() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [filme, setFilme] = useState(null);
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);
  const [filmesVistos, setFilmesVistos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;

  const totalPages = Math.ceil(filmesVistos.length / ITEMS_PER_PAGE);
  const filmesPaginados = filmesVistos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (!user?.visto) return;
    const ids = Object.keys(user.visto);
    if (!ids.length) {
      setLoading(false);
      return;
    }

    Promise.all(
      ids.map((id) =>
        fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=pt-BR&append_to_response=videos,release_dates`,
        )
          .then((res) => res.json())
          .then((data) => ({
            id: data.id,
            title: data.title,
            genres: data.genres || [],
            poster_path: data.poster_path,
            backdrop_path: data.backdrop_path,
            videos: data.videos?.results || [],
            release_dates: data.release_dates?.results || [],
          })),
      ),
    )
      .then((lista) => {
        setFilmesVistos(lista);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.visto]);

  const fetchMovie = useCallback(async (movieId) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_KEY}&language=pt-BR&append_to_response=videos,release_dates`,
      );
      const data = await res.json();
      setFilme(data);
      const trailer = data.videos?.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube",
      );
      setTrailerLink(
        trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
      );
      setReleaseDates(data.release_dates?.results || []);
    } catch (err) {
      console.error("Erro ao buscar filme:", err);
    }
  }, []);

  useEffect(() => {
    if (!loading && filmesVistos.length) {
      const random =
        filmesVistos[Math.floor(Math.random() * filmesVistos.length)];
      fetchMovie(random.id);
    }
  }, [loading, filmesVistos, fetchMovie]);

  return (
    <Private>
      <Head>
        <title>Cameo - Filmes que já assisti</title>
        <meta
          name="description"
          content="Reviva suas experiências cinematográficas! Veja todos os filmes que você já assistiu, avalie suas escolhas e compartilhe suas opiniões com a comunidade."
        />
      </Head>

      <Header />

      <main className={styles.page}>
        <Breadcrumb items={[{ label: "Já assisti" }]} />

        {filme && (
          <FilmeHero
            filme={filme}
            trailerLink={trailerLink}
            releaseDates={releaseDates}
          />
        )}

        <SectionCard
          title="Já assisti"
          count={filmesVistos.length}
          actions={[
            {
              label: isMobile ? undefined : "Filtros",
              icon: <FilterIcon size={20} color="currentColor" />,
              border: "var(--stroke-solid)",
            },
          ]}
          pagination={{ page: currentPage, totalPages, onChange: setCurrentPage }}
        >
          <div className={styles.listaFilmes}>
            {filmesPaginados.map((f) => (
              <CardFilme
                key={f.id}
                movie={f}
                variant={isMobile ? "mini" : "nota"}
              />
            ))}
          </div>
        </SectionCard>
      </main>

      <Footer />
    </Private>
  );
}
