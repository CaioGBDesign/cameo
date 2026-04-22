import { useState, useEffect, useRef } from "react";
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
import ModalDetalhesFilme from "@/components/modais/modal-detalhes-filme";
import RadioButton from "@/components/inputs/radio-button";
import ArrowButton from "@/components/arrow-button";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const ITEMS_PER_PAGE = 24;

export default function Favoritos() {
  const { user, removerFilme } = useAuth();
  const isMobile = useIsMobile();

  const [filmes, setFilmes] = useState([]);
  const [filmeHero, setFilmeHero] = useState(null);
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [busca, setBusca] = useState("");
  const [generoSelecionado, setGeneroSelecionado] = useState("");
  const generosRef = useRef(null);
  const [modalDetalhes, setModalDetalhes] = useState({
    aberto: false,
    index: 0,
  });

  const generos = Array.from(
    new Map(filmes.flatMap((f) => f.genres).map((g) => [g.id, g])).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));

  const normalizar = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const filmesFiltrados = filmes
    .filter(
      (f) =>
        !generoSelecionado ||
        f.genres.some((g) => String(g.id) === generoSelecionado),
    )
    .filter(
      (f) =>
        !busca.trim() || normalizar(f.title).includes(normalizar(busca.trim())),
    );

  const totalPages = Math.ceil(filmesFiltrados.length / ITEMS_PER_PAGE);
  const filmesPaginados = filmesFiltrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  useEffect(() => {
    const ids = Array.isArray(user?.favoritos)
      ? user.favoritos
      : user?.favoritos && typeof user.favoritos === "object"
        ? Object.keys(user.favoritos)
        : [];

    if (!ids.length) return;

    Promise.all(
      ids.map((id) =>
        fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_KEY}&language=pt-BR&append_to_response=videos,release_dates`,
        )
          .then((res) => {
            if (!res.ok) throw new Error(`TMDB retornou status ${res.status}`);
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
            avaliacao: { nota: null },
          })),
      ),
    )
      .then((lista) => {
        setFilmes(lista);

        const rnd = lista[Math.floor(Math.random() * lista.length)];
        setFilmeHero(rnd);

        const trailer = rnd.videos.find(
          (v) => v.type === "Trailer" && v.site === "YouTube",
        );
        setTrailerLink(
          trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
        );
        setReleaseDates(rnd.release_dates);
      })
      .catch(() => {});
  }, [user?.favoritos]);

  return (
    <Private>
      <Head>
        <title>Cameo - Favoritos</title>
        <meta
          name="description"
          content="Encontre seus filmes favoritos em um só lugar! Salve os títulos que você mais ama e tenha sempre à mão suas melhores recomendações."
        />
      </Head>

      <Header />

      <main className={styles.page}>
        <Breadcrumb items={[{ label: "Favoritos" }]} />

        {filmeHero && (
          <FilmeHero
            filme={filmeHero}
            trailerLink={trailerLink}
            releaseDates={releaseDates}
            showMetas={false}
          />
        )}

        {generos.length > 0 && (
          <SectionCard title="Gêneros">
            <div className={styles.generosWrapper}>
              <div className={styles.generos} ref={generosRef}>
                <RadioButton
                  id="genero-todos"
                  name="genero"
                  label="Todos"
                  checked={generoSelecionado === ""}
                  onChange={() => {
                    setGeneroSelecionado("");
                    setCurrentPage(1);
                  }}
                  iconVariant="none"
                />
                {generos.map((g) => (
                  <RadioButton
                    key={g.id}
                    id={`genero-${g.id}`}
                    name="genero"
                    label={g.name}
                    checked={generoSelecionado === String(g.id)}
                    onChange={() => {
                      setGeneroSelecionado(String(g.id));
                      setCurrentPage(1);
                    }}
                    iconVariant="none"
                  />
                ))}
              </div>
              <ArrowButton scrollRef={generosRef} scrollAmount={200} />
            </div>
          </SectionCard>
        )}

        <SectionCard
          title="Favoritos"
          count={filmes.length}
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
            {filmesPaginados.map((f, idx) => (
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
            lista="favoritos"
            onRemover={(id) => {
              removerFilme(String(id));
              setFilmes((prev) => prev.filter((f) => f.id !== id));
            }}
          />
        )}
      </main>

      <Footer />
    </Private>
  );
}
