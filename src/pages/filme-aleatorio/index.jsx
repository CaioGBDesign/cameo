import React, { useEffect, useState, useCallback, useRef } from "react";

const LISTA_CORES = [
  "--primitive-roxo-02",
  "--primitive-azul-01",
  "--primitive-rosa-01",
  "--primitive-verde-01",
  "--primitive-amarelo-01",
  "--primitive-azul-02",
  "--primitive-rosa-02",
  "--primitive-amarelo-02",
  "--primitive-verde-02",
  "--primitive-azul-03",
];
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useIsMobile } from "@/components/DeviceProvider";
import TitulosFilmesDesktop from "@/components/titulosFilmesDesktop";
import FilmeBg from "@/components/filme-bg";
import BannerFilme from "@/components/banner-filme";
import Sinopse from "@/components/detalhesfilmes/sinopse";
import FilterIcon from "@/components/icons/FilterIcon";
import AddToListIcon from "@/components/icons/AddToListIcon";
import Button from "@/components/button";
import SectionCard from "@/components/section-card";
import Modal from "@/components/modal";
import CheckboxCard from "@/components/inputs/checkbox-card";
import BookmarkIcon from "@/components/icons/BookmarkIcon";
import ListIcon from "@/components/icons/ListIcon";
import { useAuth } from "@/contexts/auth";
import { db } from "@/services/firebaseConection";
import {
  collection,
  getDocs,
  query as fsQuery,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import ElencoDobragem from "@/components/detalhesfilmes/elenco-dublagem";
import styles from "./index.module.scss";

const Header = dynamic(() => import("@/components/Header"));
const Footer = dynamic(() => import("@/components/Footer"));
const ModalAvaliar = dynamic(
  () => import("@/components/modais/avaliar-filmes"),
);
const InfoFilme = dynamic(() => import("@/components/infoFilme"));
const Servicos = dynamic(() => import("@/components/detalhesfilmes/servicos"));
import Cast from "@/components/detalhesfilmes/cast";
import CardFilme from "@/components/card-filme";
import ModalDetalhesFilme from "@/components/modais/modal-detalhes-filme";
import ModalFiltros from "@/components/modais/filtros";

export default function FilmeAleatorio() {
  const router = useRouter();
  const { pathname, query } = router;
  const { id: queryId } = router.query;
  const isReady = router.isReady;
  const isMobile = useIsMobile();
  const {
    user,
    assistirFilme,
    removerAssistir,
    salvarFilme,
    removerFilme,
    toggleFilmeNaLista,
  } = useAuth();

  const [filme, setFilme] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [related, setRelated] = useState([]);
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);
  const [servicosDisponiveis, setServicosDisponiveis] = useState([]);

  const [elencoDublagem, setElencoDublagem] = useState([]);
  const elencoDoblagemRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [assistList, setAssistList] = useState(user?.assistir || []);
  const [favoritosList, setFavoritosList] = useState(user?.favoritos || []);

  const [modalListaAberto, setModalListaAberto] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState({
    aberto: false,
    index: 0,
  });
  const [selecionarFavorito, setSelecionarFavorito] = useState(false);
  const [selecionarParaVer, setSelecionarParaVer] = useState(false);
  const [selecaoListas, setSelecaoListas] = useState({});

  const listasCustom = user?.listasQueroVer || [];

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
    const selecao = {};
    listasCustom.forEach((l) => {
      selecao[l.id] = l.filmes?.includes(sid) ?? false;
    });
    setSelecaoListas(selecao);
    setModalListaAberto(true);
  };

  const confirmarLista = async () => {
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

    for (const lista of listasCustom) {
      const estavaNA = lista.filmes?.includes(sid) ?? false;
      const deveEstar = selecaoListas[lista.id] ?? false;
      if (estavaNA !== deveEstar) await toggleFilmeNaLista(lista.id, sid);
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
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/movie/${idToFetch}?api_key=${apiKey}&language=pt-BR&append_to_response=videos,release_dates,watch/providers,credits,similar`;
      const res = await fetch(url);
      const data = await res.json();
      setFilme(data);
      setElencoDublagem([]);

      // Busca elenco de dublagem no Firestore
      const fetchDublagem = async (tmdbId) => {
        const tmdbIdNum = parseInt(tmdbId);
        try {
          const q = fsQuery(
            collection(db, "filmes"),
            where("idFilme", "==", tmdbIdNum),
          );
          const snap = await getDocs(q);

          let dubladores = [];
          if (!snap.empty) {
            dubladores = snap.docs[0].data().dubladores || [];
          } else {
            const oldSnap = await getDoc(doc(db, "filmes", String(tmdbId)));
            if (oldSnap.exists()) dubladores = oldSnap.data().dubladores || [];
          }

          if (!dubladores.length) return;

          const comInfo = await Promise.all(
            dubladores.map(async (e) => {
              if (!e.idDublador) return e;
              const dSnap = await getDoc(doc(db, "dubladores", e.idDublador));
              return {
                ...e,
                nomeArtistico: dSnap.exists()
                  ? (dSnap.data().nomeArtistico ?? "")
                  : e.idDublador,
                imagemUrl: dSnap.exists()
                  ? (dSnap.data().imagemUrl ?? null)
                  : null,
              };
            }),
          );

          setElencoDublagem(comInfo);
        } catch {}
      };

      await fetchDublagem(idToFetch);
      setCast(data.credits?.cast || []);
      setCrew(data.credits?.crew || []);
      const tr = data.videos?.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube",
      );
      setTrailerLink(tr ? `https://www.youtube.com/watch?v=${tr.key}` : null);
      setReleaseDates(data.release_dates?.results || []);
      setServicosDisponiveis(
        data["watch/providers"]?.results?.BR?.flatrate || [],
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
            {!isMobile && filme.backdrop_path && (
              <FilmeBg
                src={`https://image.tmdb.org/t/p/w1280/${filme.backdrop_path}`}
                alt={filme.title}
              />
            )}
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
                {servicosDisponiveis.length > 0 && (
                  <div className={styles.servicosStreaming}>
                    <SectionCard title="Serviços">
                      <Servicos servicos={servicosDisponiveis} />
                    </SectionCard>
                  </div>
                )}
                <SectionCard title="Detalhes">
                  <InfoFilme
                    release_date={filme.release_date}
                    budget={filme.budget}
                    revenue={filme.revenue}
                    production_countries={filme.production_countries}
                  />
                </SectionCard>
              </div>
              {elencoDublagem.length > 0 && (
                <SectionCard
                  title="Elenco de dublagem"
                  scrollRef={elencoDoblagemRef}
                >
                  <ElencoDobragem
                    ref={elencoDoblagemRef}
                    items={elencoDublagem}
                  />
                </SectionCard>
              )}
              <SectionCard title="Elenco" scrollRef={elencoRef}>
                <Cast ref={elencoRef} items={cast} />
              </SectionCard>
              <SectionCard title="Direção">
                <Cast
                  items={crew.filter((m) => m.job === "Director")}
                  showCharacter={false}
                />
              </SectionCard>
              {filme.production_companies?.length > 0 && (
                <SectionCard title="Produção">
                  <div className={styles.producoes}>
                    {filme.production_companies.map((c) => (
                      <div key={c.id} className={styles.producaoItem}>
                        {c.name}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}
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
                  {related.map((movie, idx) => (
                    <CardFilme
                      key={movie.id}
                      movie={movie}
                      variant="titulo"
                      onClick={() =>
                        setModalDetalhes({ aberto: true, index: idx })
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

      {modalType === "filters" && (
        <ModalFiltros
          user={user}
          onClose={closeModal}
          onSelectMovie={(id) => fetchMovie(id)}
        />
      )}

      {modalDetalhes.aberto && related.length > 0 && (
        <ModalDetalhesFilme
          filmes={related}
          indexInicial={modalDetalhes.index}
          onClose={() => setModalDetalhes({ aberto: false, index: 0 })}
        />
      )}

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
              icon={<BookmarkIcon size={18} color="currentColor" />}
            />
            <CheckboxCard
              id="modal-para-ver"
              variant="card"
              label="Quero assistir"
              checked={selecionarParaVer}
              icon={<ListIcon size={18} color="currentColor" />}
              onChange={(e) => setSelecionarParaVer(e.target.checked)}
            />
            {listasCustom.map((lista, idx) => (
              <CheckboxCard
                key={lista.id}
                id={`modal-lista-${lista.id}`}
                variant="card"
                label={lista.nome}
                checked={selecaoListas[lista.id] ?? false}
                onChange={(e) =>
                  setSelecaoListas((prev) => ({
                    ...prev,
                    [lista.id]: e.target.checked,
                  }))
                }
                icon={
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 10,
                        background: `var(${LISTA_CORES[idx % LISTA_CORES.length]})`,
                      }}
                    />
                  </div>
                }
              />
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}
