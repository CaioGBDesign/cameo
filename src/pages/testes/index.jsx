import React, { useEffect, useState, useCallback } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/components/DeviceProvider";
import TitulosFilmes from "@/components/titulosfilmesB";
import Sinopse from "@/components/detalhesfilmes/sinopse";
import NotasFilmes from "@/components/botoes/notas";
import FavoritarFilme from "@/components/detalhesfilmes/favoritarfilme";
import AssistirFilme from "@/components/detalhesfilmes/paraver";
import ModalAvaliar from "@/components/modais/avaliar-filmes";
import Servicos from "@/components/detalhesfilmes/servicos";
import { useAuth } from "@/contexts/auth";
import styles from "./index.module.scss";

// Lazy-load heavy components
const Header = dynamic(() => import("@/components/Header"));
const HeaderDesktop = dynamic(() => import("@/components/HeaderDesktop"));
const Footer = dynamic(() => import("@/components/Footer"));
const FundoTitulosDesktop = dynamic(() =>
  import("@/components/fotoPrincipalDesktop")
);

export default function FilmeAleatorio() {
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
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);

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
      const stringId = String(id);
      if (assistList.includes(stringId)) {
        removerAssistir(stringId);
        setAssistList((prev) => prev.filter((fid) => fid !== stringId));
      } else {
        assistirFilme(stringId);
        setAssistList((prev) => [...prev, stringId]);
      }
    },
    [assistList, assistirFilme, removerAssistir]
  );

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
        const apiKey = "c95de8d6070dbf1b821185d759532f05";
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${randomId}?api_key=${apiKey}&language=pt-BR&append_to_response=videos,release_dates,watch/providers`
        );
        const data = await res.json();
        setFilme(data);

        const trailer = data.videos?.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer)
          setTrailerLink(`https://www.youtube.com/watch?v=${trailer.key}`);

        setReleaseDates(data.release_dates?.results || []);

        // move provider logic inside effect
        const providers = data["watch/providers"]?.results?.BR?.flatrate || [];
        setServicosDisponiveis(providers);
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
        .join(", ")}`
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
        <div className={styles.homePage}>
          {!loading && filme && (
            <>
              <TitulosFilmes
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

              <FundoTitulosDesktop
                capaAssistidos={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`}
                tituloAssistidos={filme.title}
                opacidade={1}
              />

              {modalType === "rating" && (
                <ModalAvaliar
                  filmeId={filme.id}
                  nota={user?.visto?.[filme.id]}
                  onClose={closeModal}
                />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
