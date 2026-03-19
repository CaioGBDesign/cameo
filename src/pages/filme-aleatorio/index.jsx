import React, { useEffect, useState, useCallback, useRef } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useIsMobile } from "@/components/DeviceProvider";
import TitulosFilmesDesktop from "@/components/titulosFilmesDesktop";
import BannerFilme from "@/components/banner-filme";
import Sinopse from "@/components/detalhesfilmes/sinopse";
import FilterIcon from "@/components/icons/FilterIcon";
import AddToListIcon from "@/components/icons/AddToListIcon";
import Button from "@/components/button";
import SectionCard from "@/components/section-card";
import Modal from "@/components/modal";
import CheckboxCard from "@/components/inputs/checkbox-card";
import NewsIcon from "@/components/icons/NewsIcon";
import { useAuth } from "@/contexts/auth";
import styles from "./index.module.scss";

const Header = dynamic(() => import("@/components/Header"));
const Footer = dynamic(() => import("@/components/Footer"));
const ModalAvaliar = dynamic(
  () => import("@/components/modais/avaliar-filmes"),
);
const InfoFilme = dynamic(() => import("@/components/infoFilme"));
import Cast from "@/components/detalhesfilmes/cast";
import CardFilme from "@/components/card-filme";

export default function FilmeAleatorio() {
  const router = useRouter();
  const { pathname, query } = router;
  const { id: queryId } = router.query;
  const isReady = router.isReady;
  const isMobile = useIsMobile();
  const { user, assistirFilme, removerAssistir, salvarFilme, removerFilme } =
    useAuth();

  const [filme, setFilme] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [related, setRelated] = useState([]);
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [assistList, setAssistList] = useState(user?.assistir || []);
  const [favoritosList, setFavoritosList] = useState(user?.favoritos || []);

  const [modalListaAberto, setModalListaAberto] = useState(false);
  const [selecionarFavorito, setSelecionarFavorito] = useState(false);
  const [selecionarParaVer, setSelecionarParaVer] = useState(false);

  const elencoRef = useRef(null);
  const recomendacoesRef = useRef(null);

  useEffect(() => {
    setAssistList(user?.assistir || []);
    setFavoritosList(user?.favoritos || []);
  }, [user?.assistir, user?.favoritos]);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  const abrirModalLista = () => {
    if (!user) {
      if (isMobile) {
        router.push("/login");
        return;
      }
      openModal("login");
      return;
    }
    const sid = String(filme.id);
    setSelecionarFavorito(favoritosList.includes(sid));
    setSelecionarParaVer(assistList.includes(sid));
    setModalListaAberto(true);
  };

  const confirmarLista = () => {
    if (!filme) return;
    const sid = String(filme.id);

    const jaFavorito = favoritosList.includes(sid);
    if (selecionarFavorito && !jaFavorito) {
      salvarFilme(sid);
      setFavoritosList((prev) => [...prev, sid]);
    } else if (!selecionarFavorito && jaFavorito) {
      removerFilme(sid);
      setFavoritosList((prev) => prev.filter((f) => f !== sid));
    }

    const jaParaVer = assistList.includes(sid);
    if (selecionarParaVer && !jaParaVer) {
      assistirFilme(sid);
      setAssistList((prev) => [...prev, sid]);
    } else if (!selecionarParaVer && jaParaVer) {
      removerAssistir(sid);
      setAssistList((prev) => prev.filter((f) => f !== sid));
    }

    setModalListaAberto(false);
  };

  const fetchMovie = useCallback(async (movieId) => {
    setLoading(true);
    try {
      let idToFetch = movieId;
      if (!idToFetch) {
        const module =
          await import("@/components/listafilmes/listafilmes.json");
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
        (v) => v.type === "Trailer" && v.site === "YouTube",
      );
      setTrailerLink(tr ? `https://www.youtube.com/watch?v=${tr.key}` : null);
      setReleaseDates(data.release_dates?.results || []);
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
      <Header />
      <Head>
        <title>Cameo – Filme Aleatório</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://cameo.fun/testes" />
      </Head>

      <main className={styles.container}>
        <div className={styles.contBotoes}>
          <Button
            variant="gradiente"
            label="Filme aleatório"
            onClick={handleRandomClick}
            width="100%"
          />
          <Button
            variant="solid"
            icon={<FilterIcon size={20} color="white" />}
            onClick={() => openModal("filters")}
            bg="var(--bg-submit)"
            border="var(--stroke-submit)"
            arrowColor="var(--stroke-submit)"
          />
        </div>

        {!loading && filme && (
          <>
            {isMobile && (
              <BannerFilme
                src={`https://image.tmdb.org/t/p/w780/${filme.poster_path}`}
                alt={filme.title}
                trailerLink={trailerLink}
                showPlay
              />
            )}
            <TitulosFilmesDesktop
              filme={filme}
              trailerLink={trailerLink}
              releaseDates={releaseDates}
            />
            {isMobile ? (
              <SectionCard
                title="Sinopse"
                verTodos={{
                  label: "Ver mais",
                  onClick: () => openModal("sinopse"),
                }}
              >
                <p className={styles.sinopseMobile}>{filme.overview}</p>
              </SectionCard>
            ) : (
              <Sinopse sinopse={filme.overview} />
            )}

            <div className={styles.acoes}>
              <div className={styles.btnResenhas}>
                <Button
                  variant="outline"
                  label={isMobile ? undefined : "Ler resenhas"}
                  icon={<NewsIcon size={16} color="currentColor" />}
                  href={`/resenhas?filmeId=${filme.id}`}
                  border="var(--stroke-base)"
                  arrowColor="var(--stroke-base)"
                  width="100%"
                />
              </div>
              <div className={styles.btnAvaliacao}>
                {!user ? (
                  <Button
                    variant="outline"
                    label="Já assisti"
                    href="/login"
                    border="var(--stroke-base)"
                    arrowColor="var(--stroke-base)"
                    width="100%"
                  />
                ) : user?.visto?.[filme.id] ? (
                  <Button
                    variant="outline"
                    stars={user.visto[filme.id].nota}
                    onClick={() => openModal("rating")}
                    border="var(--stroke-base)"
                    arrowColor="var(--stroke-base)"
                    width="100%"
                  />
                ) : (
                  <Button
                    variant="outline"
                    label="Já assisti"
                    onClick={() => openModal("rating")}
                    border="var(--stroke-base)"
                    arrowColor="var(--stroke-base)"
                    width="100%"
                  />
                )}
              </div>
              <div className={styles.btnListas}>
                <Button
                  variant="submit"
                  label="Adicionar a lista"
                  icon={<AddToListIcon size={20} color="currentColor" />}
                  onClick={abrirModalLista}
                  width="100%"
                />
              </div>
            </div>

            <div className={styles.todasAsInformacoes}>
              <div className={styles.servicosDetalhes}>
                <SectionCard title="Detalhes">
                  <InfoFilme
                    release_date={filme.release_date}
                    budget={filme.budget}
                    revenue={filme.revenue}
                    production_countries={filme.production_countries}
                  />
                </SectionCard>
              </div>
              <SectionCard title="Elenco" scrollRef={elencoRef}>
                <Cast ref={elencoRef} items={cast} />
              </SectionCard>
              <SectionCard title="Direção">
                <Cast
                  items={crew.filter((m) => m.job === "Director")}
                  showCharacter={false}
                />
              </SectionCard>
              <SectionCard title="Recomendações" scrollRef={recomendacoesRef}>
                <div
                  ref={recomendacoesRef}
                  style={{
                    display: "flex",
                    gap: "var(--space-sm)",
                    overflowX: "auto",
                    overflowY: "hidden",
                    scrollbarWidth: "none",
                  }}
                >
                  {related.map((movie) => (
                    <CardFilme
                      key={movie.id}
                      movie={movie}
                      variant="titulo"
                      onClick={() =>
                        router.push({
                          pathname: router.pathname,
                          query: { id: movie.id },
                        })
                      }
                    />
                  ))}
                </div>
              </SectionCard>
            </div>

            {modalType === "sinopse" && (
              <Modal title="Sinópse completa" onClose={closeModal}>
                <div
                  style={{
                    background: "var(--bg-overlay)",
                    padding: "var(--space-lg)",
                    borderRadius: "var(--space-lg)",
                    border: "1px solid var(--stroke-base)",
                  }}
                >
                  <p
                    style={{
                      fontSize: 16,
                      color: "var(--text-base)",
                      lineHeight: "24px",
                    }}
                  >
                    {filme.overview}
                  </p>
                </div>
              </Modal>
            )}
            {modalType === "rating" && (
              <ModalAvaliar
                filmeId={filme.id}
                nota={user?.visto?.[filme.id]}
                onClose={closeModal}
              />
            )}
          </>
        )}
      </main>
      <Footer />

      {modalListaAberto && (
        <Modal
          title={
            <>
              Adicionar{" "}
              <span style={{ color: "var(--text-base)" }}>{filme.title}</span> à
              lista
            </>
          }
          onClose={() => setModalListaAberto(false)}
          primaryAction={{ label: "Confirmar", onClick: confirmarLista }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm)",
            }}
          >
            <CheckboxCard
              id="modal-favorito"
              variant="card"
              label="Adicionar aos favoritos"
              checked={selecionarFavorito}
              onChange={(e) => setSelecionarFavorito(e.target.checked)}
            />
            <CheckboxCard
              id="modal-para-ver"
              variant="card"
              label="Quero assistir"
              checked={selecionarParaVer}
              onChange={(e) => setSelecionarParaVer(e.target.checked)}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
