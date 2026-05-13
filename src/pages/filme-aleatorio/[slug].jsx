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
import ElencoDublagem from "@/components/detalhesfilmes/elenco-dublagem";
import MicIcon from "@/components/icons/MicIcon";
import Cast from "@/components/detalhesfilmes/cast";
import CardFilme from "@/components/card-filme";
import ModalDetalhesFilme from "@/components/modais/modal-detalhes-filme";
import ModalFiltros from "@/components/modais/filtros";
import ModalDetalhes from "@/components/modais/modal-detalhes";
import { toSlug } from "@/utils/slug";
import styles from "./index.module.scss";

const Header = dynamic(() => import("@/components/Header"));
const Footer = dynamic(() => import("@/components/Footer"));
const ModalAvaliar = dynamic(
  () => import("@/components/modais/avaliar-filmes"),
);
const InfoFilme = dynamic(() => import("@/components/infoFilme"));
const Servicos = dynamic(() => import("@/components/detalhesfilmes/servicos"));

function extrairId(slug) {
  if (!slug) return null;
  const partes = slug.split("-");
  const ultimo = partes[partes.length - 1];
  return /^\d+$/.test(ultimo) ? ultimo : null;
}

export async function getServerSideProps({ params }) {
  const { slug } = params;
  const id = extrairId(slug);
  if (!id) return { notFound: true };

  try {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!apiKey) return { props: { seoData: null, initialId: id } };

    const [tmdbRes, filmesSnap] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR`,
      ),
      getDocs(
        fsQuery(collection(db, "filmes"), where("idFilme", "==", parseInt(id))),
      ),
    ]);

    if (!tmdbRes.ok) return { props: { seoData: null, initialId: id } };
    const tmdb = await tmdbRes.json();

    const nomesDubladores = [];
    if (!filmesSnap.empty) {
      const dubladores = filmesSnap.docs[0].data().dubladores || [];
      const vistos = new Set();
      for (const d of dubladores) {
        const nome = d.nomeDublador || d.nomeArtistico || "";
        if (nome && !vistos.has(nome)) {
          vistos.add(nome);
          nomesDubladores.push(nome);
        }
      }
    }

    const generos = (tmdb.genres || []).map((g) => g.name);
    const ano = tmdb.release_date?.split("-")[0] || "";
    const sinopse = (tmdb.overview || "").slice(0, 200);
    const canonicalUrl = `https://cameo.fun/filme-aleatorio/${slug}`;

    const descricaoBase = nomesDubladores.length
      ? `Dublagem de ${tmdb.title}: ${nomesDubladores.slice(0, 5).join(", ")}${nomesDubladores.length > 5 ? " e mais" : ""}. ${sinopse}`
      : sinopse;

    return {
      props: {
        initialId: id,
        seoData: {
          titulo: tmdb.title || "",
          descricao: descricaoBase.slice(0, 300),
          sinopse,
          posterUrl: tmdb.poster_path
            ? `https://image.tmdb.org/t/p/w780${tmdb.poster_path}`
            : null,
          ano,
          generos,
          nomesDubladores,
          canonicalUrl,
        },
      },
    };
  } catch {
    return { props: { seoData: null, initialId: id } };
  }
}

export default function FilmeDetalhe({ seoData, initialId }) {
  const router = useRouter();
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
  const [dublagemDetalhes, setDublagemDetalhes] = useState(null);
  const [modalDublagem, setModalDublagem] = useState(false);

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
      setFavoritosList((p) => [...p, sid]);
    } else if (!selecionarFavorito && jaFavorito) {
      removerFilme(sid);
      setFavoritosList((p) => p.filter((f) => f !== sid));
    }
    const jaParaVer = assistList.includes(sid);
    if (selecionarParaVer && !jaParaVer) {
      assistirFilme(sid);
      setAssistList((p) => [...p, sid]);
    } else if (!selecionarParaVer && jaParaVer) {
      removerAssistir(sid);
      setAssistList((p) => p.filter((f) => f !== sid));
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
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR&append_to_response=videos,release_dates,watch/providers,credits,similar`;
      const res = await fetch(url);
      const data = await res.json();
      setFilme(data);
      setElencoDublagem([]);

      const fetchDublagem = async (tmdbId) => {
        const tmdbIdNum = parseInt(tmdbId);
        try {
          const q = fsQuery(
            collection(db, "filmes"),
            where("idFilme", "==", tmdbIdNum),
          );
          const snap = await getDocs(q);
          let dubladores = [];
          let firestoreFilme = null;
          if (!snap.empty) {
            firestoreFilme = snap.docs[0].data();
            dubladores = firestoreFilme.dubladores || [];
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

          const chave = (e) =>
            e.idDublador || e.nomeDublador || e.nomeArtistico || "";
          const agrupado = [];
          const visto = new Map();
          for (const e of comInfo) {
            const k = chave(e);
            if (visto.has(k)) {
              const idx = visto.get(k);
              agrupado[idx] = {
                ...agrupado[idx],
                personagem: agrupado[idx].personagem
                  ? `${agrupado[idx].personagem}, ${e.personagem}`
                  : e.personagem,
              };
            } else {
              visto.set(k, agrupado.length);
              agrupado.push({ ...e });
            }
          }
          setElencoDublagem(agrupado);

          if (firestoreFilme) {
            const {
              direcaoDublagem,
              traducao,
              equipeTecnica = [],
              estudioId,
              estudioNome,
            } = firestoreFilme;
            let estudio = null;
            if (estudioId) {
              try {
                const estSnap = await getDoc(doc(db, "estudios", estudioId));
                if (estSnap.exists()) {
                  const d = estSnap.data();
                  estudio = {
                    nome: d.nomePopular || d.nome || estudioNome,
                    imagemUrl: d.imagemUrl || null,
                  };
                } else {
                  estudio = { nome: estudioNome, imagemUrl: null };
                }
              } catch {
                estudio = { nome: estudioNome, imagemUrl: null };
              }
            } else if (estudioNome) {
              estudio = { nome: estudioNome, imagemUrl: null };
            }
            setDublagemDetalhes({
              estudio,
              direcaoDublagem,
              traducao,
              equipeTecnica,
            });
          }
        } catch {}
      };

      await fetchDublagem(movieId);
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
    if (initialId) fetchMovie(initialId);
  }, [initialId, fetchMovie]);

  const handleRandomClick = () => {
    router.push("/filme-aleatorio");
  };

  const pageTitle = seoData
    ? `${seoData.titulo}${seoData.nomesDubladores.length > 0 ? " — Dublagem" : ""} | Cameo`
    : "Cameo – Filme";
  const pageDescription =
    seoData?.descricao || "Veja detalhes e elenco de dublagem no Cameo.";

  const jsonLd = seoData
    ? {
        "@context": "https://schema.org",
        "@type": "Movie",
        name: seoData.titulo,
        description: seoData.sinopse,
        ...(seoData.posterUrl && { image: seoData.posterUrl }),
        ...(seoData.ano && { datePublished: seoData.ano }),
        ...(seoData.generos.length > 0 && { genre: seoData.generos }),
        ...(seoData.nomesDubladores.length > 0 && {
          actor: seoData.nomesDubladores.map((nome) => ({
            "@type": "Person",
            name: nome,
          })),
        }),
        url: seoData.canonicalUrl,
      }
    : null;

  return (
    <>
      <Header />
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {seoData && (
          <meta
            name="keywords"
            content={[
              seoData.titulo,
              "dublagem",
              ...seoData.generos,
              ...seoData.nomesDubladores.slice(0, 5),
            ].join(", ")}
          />
        )}
        <link
          rel="canonical"
          href={seoData?.canonicalUrl ?? "https://cameo.fun/filme-aleatorio"}
        />
        <meta name="robots" content="index,follow" />
        <meta property="og:type" content="video.movie" />
        <meta property="og:site_name" content="Cameo" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta
          property="og:url"
          content={seoData?.canonicalUrl ?? "https://cameo.fun/filme-aleatorio"}
        />
        {seoData?.posterUrl && (
          <meta property="og:image" content={seoData.posterUrl} />
        )}
        {seoData?.posterUrl && (
          <meta property="og:image:alt" content={seoData.titulo} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {seoData?.posterUrl && (
          <meta name="twitter:image" content={seoData.posterUrl} />
        )}
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
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
                  label="Adicionar à lista"
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
                  <ElencoDublagem
                    ref={elencoDoblagemRef}
                    items={elencoDublagem}
                  />
                </SectionCard>
              )}
              {dublagemDetalhes &&
                (() => {
                  const itens = [];
                  if (dublagemDetalhes.estudio)
                    itens.push({
                      label: "Estúdio",
                      valor: dublagemDetalhes.estudio.nome,
                      imagem: dublagemDetalhes.estudio.imagemUrl,
                    });
                  if (dublagemDetalhes.direcaoDublagem?.nome)
                    itens.push({
                      label: "Direção de Dublagem",
                      valor: dublagemDetalhes.direcaoDublagem.nome,
                    });
                  if (dublagemDetalhes.traducao?.nome)
                    itens.push({
                      label: "Tradução",
                      valor: dublagemDetalhes.traducao.nome,
                    });
                  for (const e of dublagemDetalhes.equipeTecnica) {
                    if (itens.length >= 5) break;
                    itens.push({
                      label: e.funcao,
                      valor:
                        e.profissionais
                          ?.map((p) => p.nome)
                          .filter(Boolean)
                          .join(", ") || "—",
                    });
                  }
                  return (
                    <SectionCard title="Dublagem detalhes" verTodos={{ label: "Ver todos", onClick: () => setModalDublagem(true) }}>
                      <div className={styles.dublagemDetalhesGrid}>
                        {itens.map((item, i) => (
                          <div key={i} className={styles.dublagemDetalheItem}>
                            <div className={styles.dublagemDetalheIcone}>
                              {item.imagem ? (
                                <img src={item.imagem} alt={item.valor} />
                              ) : (
                                <MicIcon size={20} color="var(--text-sub)" />
                              )}
                            </div>
                            <div className={styles.dublagemDetalheTexto}>
                              <span className={styles.dublagemDetalheLabel}>
                                {item.label}
                              </span>
                              <span className={styles.dublagemDetalheValor}>
                                {item.valor}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SectionCard>
                  );
                })()}
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
          onSelectMovie={(id) => router.push(`/filme-aleatorio/${id}`)}
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
              <span style={{ color: "var(--text-base)" }}>{filme?.title}</span>{" "}
              à lista
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
      {modalDublagem && dublagemDetalhes && (
        <ModalDetalhes
          title="Dublagem detalhes"
          onClose={() => setModalDublagem(false)}
          itens={[
            ...(dublagemDetalhes.estudio ? [{ label: "Estúdio", valor: dublagemDetalhes.estudio.nome }] : []),
            ...(dublagemDetalhes.direcaoDublagem?.nome ? [{
              label: "Direção",
              valor: dublagemDetalhes.direcaoDublagem.id
                ? { nome: dublagemDetalhes.direcaoDublagem.nome, href: `/dubladores/${toSlug(dublagemDetalhes.direcaoDublagem.nome)}` }
                : dublagemDetalhes.direcaoDublagem.nome,
            }] : []),
            ...(dublagemDetalhes.traducao?.nome ? [{
              label: "Tradução",
              valor: dublagemDetalhes.traducao.id
                ? { nome: dublagemDetalhes.traducao.nome, href: `/dubladores/${toSlug(dublagemDetalhes.traducao.nome)}` }
                : dublagemDetalhes.traducao.nome,
            }] : []),
            ...dublagemDetalhes.equipeTecnica.map((e) => ({
              label: e.funcao,
              valor: e.profissionais?.map((p) => p.nome).filter(Boolean),
            })),
          ]}
        />
      )}
    </>
  );
}
