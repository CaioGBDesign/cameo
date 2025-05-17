// pages/filme-aleatorio.js
import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useIsMobile } from "@/components/DeviceProvider";
import TitulosFilmesDesktop from "@/components/titulosFilmesDesktop";
import Sinopse from "@/components/detalhesfilmes/sinopse";
import NotasFilmes from "@/components/botoes/notas";
import FavoritarFilme from "@/components/detalhesfilmes/favoritarfilme";
import AssistirFilme from "@/components/detalhesfilmes/paraver";
import ModalAvaliar from "@/components/modais/avaliar-filmes";
import Servicos from "@/components/detalhesfilmes/servicos";
import InfoFilme from "@/components/infoFilme";
import Cast from "@/components/detalhesfilmes/cast";
import Direcao from "@/components/detalhesfilmes/direcao";
import ProducaoFilmes from "@/components/detalhesfilmes/producaoFilme";
import Recomendacoes from "@/components/detalhesfilmes/recomendacoes";
import BotaoPrimario from "@/components/botoes/primarios";
import BotaoSecundario from "@/components/botoes/secundarios";
import ModalFiltros from "@/components/modais/filtros";
import { useAuth } from "@/contexts/auth";
import styles from "./index.module.scss";

const Header = dynamic(() => import("@/components/Header"));
const HeaderDesktop = dynamic(() => import("@/components/HeaderDesktop"));
const Footer = dynamic(() => import("@/components/Footer"));
const FundoTitulosDesktop = dynamic(() =>
  import("@/components/fotoPrincipalDesktop")
);

export default function FilmeAleatorio() {
  const router = useRouter();
  const { pathname, query } = router;

  const { id: queryId } = router.query;
  const isReady = router.isReady;
  const isMobile = useIsMobile();
  const {
    user,
    avaliarFilme,
    assistirFilme,
    removerAssistir,
    salvarFilme,
    removerFilme,
  } = useAuth();

  const [filme, setFilme] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [related, setRelated] = useState([]);
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [assistList, setAssistList] = useState(user?.assistir || []);
  const [favoritosList, setFavoritosList] = useState(user?.favoritos || []);

  useEffect(() => {
    setAssistList(user?.assistir || []);
    setFavoritosList(user?.favoritos || []);
  }, [user?.assistir, user?.favoritos]);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  const handleWatchClick = useCallback(
    (id) => {
      const sid = String(id);
      if (assistList.includes(sid)) {
        removerAssistir(sid);
        setAssistList((prev) => prev.filter((f) => f !== sid));
      } else {
        assistirFilme(sid);
        setAssistList((prev) => [...prev, sid]);
      }
    },
    [assistList, assistirFilme, removerAssistir]
  );

  const fetchMovie = useCallback(async (movieId) => {
    setLoading(true);
    try {
      let idToFetch = movieId;
      if (!idToFetch) {
        const module = await import(
          "@/components/listafilmes/listafilmes.json"
        );
        const ids = module.default.filmes;
        idToFetch = ids[Math.floor(Math.random() * ids.length)];
      }
      const apiKey = "c95de8d6070dbf1b821185d759532f05";
      const url = `https://api.themoviedb.org/3/movie/${idToFetch}?api_key=${apiKey}&language=pt-BR&append_to_response=videos,release_dates,watch/providers,credits,similar`;
      const res = await fetch(url);
      const data = await res.json();
      setFilme(data);
      setCast(data.credits?.cast || []);
      setCrew(data.credits?.crew || []);
      const tr = data.videos?.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      setTrailerLink(tr ? `https://www.youtube.com/watch?v=${tr.key}` : null);
      setReleaseDates(data.release_dates?.results || []);
      setServicosDisponiveis(
        data["watch/providers"]?.results?.BR?.flatrate || []
      );
      setRelated(data.similar?.results || []);
    } catch (err) {
      console.error("Erro ao buscar filme:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    fetchMovie(queryId);
  }, [isReady, queryId, fetchMovie]);

  const handleRandomClick = () => {
    if (query.id) {
      router.replace({ pathname }, undefined, { shallow: true });
    }
    fetchMovie();
  };

  const description = filme
    ? `Assista a ${filme.title}, um filme de ${
        Array.isArray(filme.genres)
          ? filme.genres.map((g) => g.name).join(", ")
          : ""
      }`
    : "Carregando filme aleatório...";

  return (
    <>
      {isMobile ? <Header /> : <HeaderDesktop />}
      <Head>
        <title>Cameo – Filme Aleatório</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://cameo.fun/testes" />
      </Head>

      <main className={styles.container}>
        <div className={styles.homePage}>
          <div className={styles.contBotoes}>
            <div className={styles.baseBotoes}>
              <BotaoPrimario
                textoBotaoPrimario="Filme aleatório"
                onClick={handleRandomClick}
              />

              <div className={styles.BotaoSecundario}>
                <BotaoSecundario
                  textoBotaoSecundario="Filtros"
                  onClick={() => openModal("filters")}
                />
              </div>
            </div>
          </div>

          {!loading && filme && (
            <>
              <div className={styles.contHome}>
                <TitulosFilmesDesktop
                  filme={filme}
                  trailerLink={trailerLink}
                  releaseDates={releaseDates}
                />
                <Sinopse sinopse={filme.overview} />

                <div className={styles.NotasFavoritos}>
                  <NotasFilmes
                    filmeId={filme.id}
                    avaliarFilme={avaliarFilme}
                    usuarioFilmeVisto={user?.visto?.hasOwnProperty(filme.id)}
                    onClickModal={() => openModal("rating")}
                  />
                  {!assistList.includes(String(filme.id)) && (
                    <div className={styles.assistirContainer}>
                      <AssistirFilme
                        filmeId={filme.id}
                        assistirFilme={() => handleWatchClick(filme.id)}
                        removerAssistir={removerAssistir}
                        usuarioParaVer={assistList}
                      />
                    </div>
                  )}
                  <FavoritarFilme
                    filmeId={String(filme.id)}
                    salvarFilme={salvarFilme}
                    removerFilme={removerFilme}
                    usuarioFavoritos={favoritosList}
                  />
                </div>

                {servicosDisponiveis.length > 0 && (
                  <Servicos servicos={servicosDisponiveis} />
                )}

                <InfoFilme
                  budget={filme.budget}
                  revenue={filme.revenue}
                  production_countries={filme.production_countries}
                />
                <Cast cast={cast} />
                <Direcao crew={crew} />
                <ProducaoFilmes companies={filme.production_companies} />
                <Recomendacoes movies={related} />
                <Footer />
              </div>

              <div className={styles.fundoTitulos}>
                <FundoTitulosDesktop
                  capaAssistidos={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`}
                  capaAssistidosMobile={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                  tituloAssistidos={filme.title}
                  trailerLink={trailerLink}
                  opacidade={1}
                />
              </div>

              {modalType === "rating" && (
                <ModalAvaliar
                  filmeId={filme.id}
                  nota={user?.visto?.[filme.id]}
                  onClose={closeModal}
                />
              )}

              {modalType === "filters" && (
                <ModalFiltros
                  onClose={closeModal}
                  user={user}
                  onSelectMovie={(id) => fetchMovie(id)}
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
