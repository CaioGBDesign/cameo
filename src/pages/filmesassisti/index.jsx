import React, { useState, useEffect, useCallback, Suspense } from "react";
import styles from "./index.module.scss";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/components/DeviceProvider";
import Head from "next/head";
import Private from "@/components/Private";
import TitulosFilmesDesktop from "@/components/titulosFilmesDesktop";
import Titulolistagem from "@/components/titulolistagem";
import GraficoVistos from "@/components/detalhesfilmes/grafico-vistos";
import GraficoMetas from "@/components/detalhesfilmes/grafico-metas";
import GraficoMetasMobile from "@/components/detalhesfilmes/grafico-metas-mobile";
import BlankSlate from "@/components/blank-slate";
import ListaPageFilmes from "@/components/detalhesfilmes/listaPageFilmes";
import FilmesCarousel from "@/components/modais/filmes-carousel";
import { useAuth } from "@/contexts/auth";

const Header = dynamic(() => import("@/components/Header"));
const HeaderDesktop = dynamic(() => import("@/components/HeaderDesktop"));
const Footer = dynamic(() => import("@/components/Footer"));
const FundoTitulosDesktop = dynamic(() =>
  import("@/components/fotoPrincipalDesktop")
);

export default function FilmesAssisti() {
  const isMobile = useIsMobile();
  const { user, removerFilme } = useAuth();
  const apiKey = "c95de8d6070dbf1b821185d759532f05";

  // Lista completa de filmes para gráfico e miniaturas
  const [filmesVistos, setFilmesVistos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Detalhes do filme aleatório no topo
  const [filme, setFilme] = useState(null);
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);

  // Estado para modal e filme selecionado
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

  // Carrega todos os filmes vistos com dados necessários
  useEffect(() => {
    if (!user?.visto) return;
    const idsVistos = Object.keys(user.visto);
    if (!idsVistos.length) {
      setLoading(false);
      return;
    }

    Promise.all(
      idsVistos.map((id) =>
        fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR&append_to_response=videos,release_dates`
        )
          .then((res) => res.json())
          .then((data) => ({
            id: data.id,
            title: data.title,
            genres: data.genres || [],
            poster_path: data.poster_path,
            avaliacao: user.visto[id] || 0,
            backdrop_path: data.backdrop_path,
            videos: data.videos?.results || [],
            release_dates: data.release_dates?.results || [],
          }))
      )
    )
      .then((lista) => {
        setFilmesVistos(lista);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user?.visto, apiKey]);

  const totalFilmesVistos = filmesVistos.length;

  // Busca aleatório do topo
  const fetchMovie = useCallback(
    async (movieId) => {
      try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR&append_to_response=videos,release_dates`;
        const res = await fetch(url);
        const data = await res.json();
        setFilme(data);
        const trailer = data.videos?.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailerLink(
          trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
        );
        setReleaseDates(data.release_dates?.results || []);
      } catch (err) {
        console.error("Erro ao buscar filme de topo:", err);
      }
    },
    [apiKey]
  );

  // Ao ter a lista completa, escolhe um filme aleatório para o topo
  useEffect(() => {
    if (!loading && filmesVistos.length) {
      const random =
        filmesVistos[Math.floor(Math.random() * filmesVistos.length)];
      fetchMovie(random.id);
    }
  }, [loading, filmesVistos, fetchMovie]);

  // Funções de miniatura
  const mostrarBotaoFechar = true;
  const handleExcluirFilme = (id) => {
    removerFilme(id);
    setFilmesVistos((prev) => prev.filter((f) => String(f.id) !== id));
  };
  const openModal = (film) => {
    setSelectedFilm(film);
    setModalOpen(true);
  };

  return (
    <Private>
      <Head>
        <title>Cameo - Filmes que já assisti</title>
        <meta
          name="description"
          content="Reviva suas experiências cinematográficas! Veja todos os filmes que você já assistiu, avalie suas escolhas e compartilhe suas opiniões com a comunidade."
        />
      </Head>

      {isMobile ? <Header /> : <HeaderDesktop />}

      {filme ? (
        <main className={styles.filmesAssisti}>
          <div className={styles.assistiPage}>
            <div className={styles.contAssisti}>
              <div className={styles.tituloEListas}>
                {isMobile ? null : (
                  <TitulosFilmesDesktop
                    filme={filme}
                    trailerLink={trailerLink}
                    releaseDates={releaseDates}
                  />
                )}

                <Titulolistagem
                  quantidadeFilmes={filmesVistos.length}
                  titulolistagem={"Filmes que já assisti"}
                />

                <ListaPageFilmes
                  listagemDeFilmes={filmesVistos}
                  loading={loading}
                  mostrarBotaoFechar={mostrarBotaoFechar}
                  handleExcluirFilme={handleExcluirFilme}
                  openModal={openModal}
                />
              </div>

              <div className={styles.graficosGeneroMes}>
                <GraficoVistos
                  filmesVistos={filmesVistos}
                  totalFilmesVistos={totalFilmesVistos}
                />
                {isMobile ? (
                  <GraficoMetasMobile
                    filmesVistos={filmesVistos}
                    totalFilmesVistos={totalFilmesVistos}
                    user={user}
                  />
                ) : (
                  <GraficoMetas
                    filmesVistos={filmesVistos}
                    totalFilmesVistos={totalFilmesVistos}
                    user={user}
                  />
                )}
              </div>
            </div>

            <Footer />

            {modalOpen && (
              <FilmesCarousel
                filmes={filmesVistos}
                selectedFilm={selectedFilm} // Mantenha esta linha
                onClose={() => setModalOpen(false)}
                excluirFilme={() => {
                  removerNota(String(selectedFilm.id)); // Chama a função de remoção passando o ID do filme em foco
                  setModalOpen(false); // Fecha o modal após a exclusão
                }}
              />
            )}

            <div className={styles.fundoTitulos}>
              <FundoTitulosDesktop
                capaAssistidos={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`}
                capaAssistidosMobile={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                tituloAssistidos={filme.title}
                opacidade={0.2}
              />
            </div>
          </div>
        </main>
      ) : (
        <BlankSlate />
      )}
    </Private>
  );
}
