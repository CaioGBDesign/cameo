import React, { useState, useEffect, useCallback } from "react";
import styles from "./index.module.scss";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/components/DeviceProvider";
import Head from "next/head";
import Private from "@/components/Private";
import TitulosFilmesDesktop from "@/components/titulosFilmesDesktop";
import Titulolistagem from "@/components/titulolistagem";
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

  const [filmesParaAssistir, setFilmesParaAssistir] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filme, setFilme] = useState(null);
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

  useEffect(() => {
    let ids = [];

    if (Array.isArray(user?.favoritos)) {
      // “para favoritos” salvo como array de strings
      ids = user.favoritos;
    } else if (user?.favoritos && typeof user.favoritos === "object") {
      // caso fosse objeto, pegaria as chaves
      ids = Object.keys(user.favoritos);
    }

    if (!ids.length) {
      setLoading(false);
      return;
    }

    Promise.all(
      ids.map((id) =>
        fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`
        )
          .then((res) => {
            if (!res.ok) throw new Error(`TMDB retornou status ${res.status}`);
            return res.json();
          })
          .then((data) => ({
            id: data.id,
            title: data.title,
            poster_path: data.poster_path,
            avaliacao: {
              nota: Array.isArray(user.favoritos) ? null : user.favoritos[id],
            },
          }))
      )
    )
      .then((lista) => {
        setFilmesParaAssistir(lista);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [user?.favoritos, apiKey]);

  const fetchMovie = useCallback(
    async (movieId) => {
      try {
        const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR&append_to_response=videos,release_dates`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Status ${res.status}`);
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

  useEffect(() => {
    if (!loading && filmesParaAssistir.length) {
      const rnd =
        filmesParaAssistir[
          Math.floor(Math.random() * filmesParaAssistir.length)
        ];
      fetchMovie(rnd.id);
    }
  }, [loading, filmesParaAssistir, fetchMovie]);

  const handleExcluirFilme = (id) => {
    removerFilme(id);
    setFilmesParaAssistir((prev) => prev.filter((f) => f.id !== Number(id)));
  };

  const openModal = (film) => {
    setSelectedFilm(film);
    setModalOpen(true);
  };

  return (
    <Private>
      <Head>
        <title>Cameo - favoritos</title>
        <meta
          name="description"
          content="Encontre seus filmes favoritos em um só lugar! Salve os títulos que você mais ama e tenha sempre à mão suas melhores recomendações."
        />
      </Head>

      {isMobile ? <Header /> : <HeaderDesktop />}

      {filme ? (
        <main className={styles.filmesAssisti}>
          <div className={styles.assistiPage}>
            <div className={styles.contAssisti}>
              <div className={styles.tituloEListas}>
                <TitulosFilmesDesktop
                  filme={filme}
                  trailerLink={trailerLink}
                  releaseDates={releaseDates}
                />

                <Titulolistagem
                  quantidadeFilmes={filmesParaAssistir.length}
                  titulolistagem={"Meus favoritos"}
                />

                <ListaPageFilmes
                  listagemDeFilmes={filmesParaAssistir}
                  loading={loading}
                  mostrarBotaoFechar
                  handleExcluirFilme={handleExcluirFilme}
                  openModal={openModal}
                />
              </div>
            </div>

            <Footer />

            {modalOpen && (
              <FilmesCarousel
                filmes={filmesParaAssistir}
                selectedFilm={selectedFilm} // Mantenha esta linha
                onClose={() => setModalOpen(false)}
                excluirFilme={() => {
                  removerFilme(String(selectedFilm.id));
                  setModalOpen(false);
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
