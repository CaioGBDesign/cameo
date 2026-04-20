import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Private from "@/components/Private";
import FilmeHero from "@/components/filme-hero";
import SectionCard from "@/components/section-card";
import CardFilme from "@/components/card-filme";
import FilterIcon from "@/components/icons/FilterIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import TextInput from "@/components/inputs/text-input";
import Breadcrumb from "@/components/breadcrumb";
import ArrowButton from "@/components/arrow-button";
import RadioButton from "@/components/inputs/radio-button";
import Button from "@/components/button";
import ModalDetalhesFilme from "@/components/modais/modal-detalhes-filme";
import ListaQueroVer from "@/components/modais/lista-quero-ver";
import TodasListas from "@/components/modais/todas-listas";
import ListaFilmesBlankslate from "@/components/lista-filmes-blankslate";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const ITEMS_PER_PAGE = 24;

export default function FilmesParaVer() {
  const { user, removerAssistir, toggleFilmeNaLista } = useAuth();
  const isMobile = useIsMobile();
  const pillsRef = useRef(null);
  const router = useRouter();

  const [filmes, setFilmes] = useState([]);
  const [filmeHero, setFilmeHero] = useState(null);
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [listaSelecionada, setListaSelecionada] = useState(null); // null = "Quero assistir"
  const [modalLista, setModalLista] = useState(null); // null | "criar" | { lista }
  const [modalTodasListas, setModalTodasListas] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState({
    aberto: false,
    index: 0,
  });

  const listas = user?.listasQueroVer || [];

  useEffect(() => {
    if (!router.isReady || !listas.length) return;
    const { lista: listaId } = router.query;
    if (!listaId) return;
    const encontrada = listas.find((l) => l.id === listaId);
    if (encontrada) setListaSelecionada(encontrada);
  }, [router.isReady, router.query.lista, listas.length]);

  useEffect(() => {
    if (!listaSelecionada) return;
    const atualizada = listas.find((l) => l.id === listaSelecionada.id);
    if (atualizada) setListaSelecionada(atualizada);
  }, [user?.listasQueroVer]);

  useEffect(() => {
    const assistir = Array.isArray(user?.assistir) ? user.assistir : [];
    const customIds = (user?.listasQueroVer || []).flatMap(
      (l) => l.filmes ?? [],
    );
    const ids = [...new Set([...assistir, ...customIds])];

    if (!ids.length) {
      setLoading(false);
      return;
    }

    Promise.all(
      ids.map((id) =>
        fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=pt-BR&append_to_response=videos,release_dates`,
        )
          .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
          })
          .then((data) => ({
            id: data.id,
            title: data.title,
            genres: data.genres || [],
            poster_path: data.poster_path,
            backdrop_path: data.backdrop_path,
            overview: data.overview,
            runtime: data.runtime,
            vote_average: data.vote_average,
            release_date: data.release_date,
            production_countries: data.production_countries || [],
            videos: data.videos?.results || [],
            release_dates: data.release_dates?.results || [],
          })),
      ),
    )
      .then((lista) => {
        setFilmes(lista);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.assistir, user?.listasQueroVer]);

  useEffect(() => {
    const base = listaSelecionada
      ? filmes.filter((f) => listaSelecionada.filmes.includes(String(f.id)))
      : filmes;

    if (!base.length) {
      setFilmeHero(null);
      setTrailerLink(null);
      setReleaseDates([]);
      return;
    }

    const rnd = base[Math.floor(Math.random() * base.length)];
    setFilmeHero(rnd);
    const trailer = rnd.videos.find(
      (v) => v.type === "Trailer" && v.site === "YouTube",
    );
    setTrailerLink(
      trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
    );
    setReleaseDates(rnd.release_dates);
  }, [filmes, listaSelecionada]);

  const normalizar = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filmesBase = listaSelecionada
    ? filmes.filter((f) => listaSelecionada.filmes.includes(String(f.id)))
    : filmes;

  const filmesFiltrados = busca.trim()
    ? filmesBase.filter((f) =>
        normalizar(f.title).includes(normalizar(busca.trim())),
      )
    : filmesBase;

  const totalPages = Math.ceil(filmesFiltrados.length / ITEMS_PER_PAGE);
  const filmesPaginados = filmesFiltrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const selecionarLista = (lista) => {
    setListaSelecionada(lista);
    setCurrentPage(1);
    setBusca("");
  };

  const countLista = listaSelecionada
    ? filmes.filter((f) => listaSelecionada.filmes.includes(String(f.id)))
        .length
    : filmes.length;

  return (
    <Private>
      <Head>
        <title>Cameo - Quero ver</title>
        <meta
          name="description"
          content="Explore a sua lista de filmes para assistir."
        />
      </Head>

      <Header />

      <main className={styles.page}>
        <div className={styles.topBar}>
          <Breadcrumb items={[{ label: "Quero ver" }]} />
          {!isMobile && (
            <Button
              variant="outline"
              label="Criar lista"
              border="var(--stroke-solid)"
              onClick={() => setModalLista("criar")}
              width="220px"
            />
          )}
        </div>

        {isMobile && (
          <SectionCard
            title="Listas"
            verTodos={{
              label: "Ver todas",
              onClick: () => setModalTodasListas(true),
            }}
          >
            <div className={styles.mobilePills}>
              <RadioButton
                id="mobile-lista-quero-assistir"
                name="mobile-lista-quero-ver"
                label="Quero assistir"
                checked={!listaSelecionada}
                onChange={() => selecionarLista(null)}
                iconVariant="none"
              />
              {listas.map((lista) => {
                const selecionada = listaSelecionada?.id === lista.id;
                return (
                  <RadioButton
                    key={lista.id}
                    id={`mobile-lista-${lista.id}`}
                    name="mobile-lista-quero-ver"
                    label={lista.nome}
                    checked={selecionada}
                    onChange={() => selecionarLista(lista)}
                    iconVariant={selecionada ? "edit" : "none"}
                    onClick={
                      selecionada
                        ? (e) => {
                            e.preventDefault();
                            setModalLista({ lista });
                          }
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </SectionCard>
        )}

        <div className={styles.pillsWrapper}>
          <div className={styles.pills} ref={pillsRef}>
            <RadioButton
              id="lista-quero-assistir"
              name="lista-quero-ver"
              label="Quero assistir"
              checked={!listaSelecionada}
              onChange={() => selecionarLista(null)}
              iconVariant="none"
            />
            {listas.map((lista) => {
              const selecionada = listaSelecionada?.id === lista.id;
              return (
                <RadioButton
                  key={lista.id}
                  id={`lista-${lista.id}`}
                  name="lista-quero-ver"
                  label={lista.nome}
                  checked={selecionada}
                  onChange={() => selecionarLista(lista)}
                  iconVariant={selecionada ? "edit" : "none"}
                  onClick={
                    selecionada
                      ? (e) => {
                          e.preventDefault();
                          setModalLista({ lista });
                        }
                      : undefined
                  }
                />
              );
            })}
          </div>
          <ArrowButton scrollRef={pillsRef} scrollAmount={200} />
        </div>

        {filmeHero && (
          <FilmeHero
            filme={filmeHero}
            trailerLink={trailerLink}
            releaseDates={releaseDates}
            showMetas={false}
            showNotas={false}
          />
        )}

        <SectionCard
          title={listaSelecionada ? listaSelecionada.nome : "Quero assistir"}
          count={countLista}
          search={
            <TextInput
              placeholder="Buscar filme..."
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value);
                setCurrentPage(1);
              }}
              prefix={<SearchIcon size={20} color="var(--text-sub)" />}
            />
          }
          actions={[
            {
              label: isMobile ? undefined : "Filtros",
              icon: <FilterIcon size={20} color="currentColor" />,
              border: "var(--stroke-solid)",
            },
          ]}
          pagination={{
            page: currentPage,
            totalPages,
            onChange: setCurrentPage,
          }}
        >
          <div className={styles.listaFilmes}>
            {!loading && filmesBase.length === 0 && <ListaFilmesBlankslate />}
            {!loading &&
              filmesPaginados.map((f, idx) => (
                <CardFilme
                  key={f.id}
                  movie={f}
                  variant={isMobile ? "mini" : "nota"}
                  onClick={() => setModalDetalhes({ aberto: true, index: idx })}
                />
              ))}
          </div>
        </SectionCard>

        {modalDetalhes.aberto && (
          <ModalDetalhesFilme
            filmes={filmesPaginados}
            indexInicial={modalDetalhes.index}
            onClose={() => setModalDetalhes({ aberto: false, index: 0 })}
            lista={listaSelecionada ? "custom" : "assistir"}
            listaNomeCustom={listaSelecionada?.nome}
            onRemover={(id) => {
              if (listaSelecionada) {
                toggleFilmeNaLista(listaSelecionada.id, String(id));
              } else {
                removerAssistir(String(id));
                setFilmes((prev) => prev.filter((f) => f.id !== id));
              }
            }}
          />
        )}

        {modalLista && (
          <ListaQueroVer
            lista={modalLista === "criar" ? null : modalLista.lista}
            onClose={() => setModalLista(null)}
          />
        )}

        {modalTodasListas && (
          <TodasListas
            onClose={() => setModalTodasListas(false)}
            onCriar={() => {
              setModalTodasListas(false);
              setModalLista("criar");
            }}
            listaSelecionada={listaSelecionada}
            onSelecionarLista={selecionarLista}
          />
        )}
      </main>

      <Footer />
    </Private>
  );
}
