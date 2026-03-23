import { useState, useEffect } from "react";
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
import CardMeta from "@/components/card-meta";
import CriarMeta from "@/components/modais/criar-meta";
import ModalDetalhesFilme from "@/components/modais/modal-detalhes-filme";
import Button from "@/components/button";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import { contarFilmesPorPeriodo } from "@/utils/metas";
import GraficoGeneros from "@/components/grafico-generos";
import GraficoPeriodo from "@/components/grafico-periodo";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function FilmesAssisti() {
  const { user, removerNota } = useAuth();
  const isMobile = useIsMobile();

  const [filmeHero, setFilmeHero] = useState(null);
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);
  const [filmesVistos, setFilmesVistos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMetaAberto, setModalMetaAberto] = useState(false);
  const [modalDetalhes, setModalDetalhes] = useState({ aberto: false, index: 0 });
  const ITEMS_PER_PAGE = 24;

  const metas = (Array.isArray(user?.metas) ? user.metas : [])
    .map((meta) => ({
      ...meta,
      filmesVistosPeriodo: contarFilmesPorPeriodo(
        user?.visto || {},
        meta.periodo,
      ),
    }))
    .sort(
      (a, b) =>
        b.filmesVistosPeriodo / b.quantidade -
        a.filmesVistosPeriodo / a.quantidade,
    );

  const totalPages = Math.ceil(filmesVistos.length / ITEMS_PER_PAGE);
  const filmesPaginados = filmesVistos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
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
        setFilmesVistos(lista);

        const rnd = lista[Math.floor(Math.random() * lista.length)];
        setFilmeHero(rnd);

        const trailer = rnd.videos.find(
          (v) => v.type === "Trailer" && v.site === "YouTube",
        );
        setTrailerLink(
          trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
        );
        setReleaseDates(rnd.release_dates);

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user?.visto]);

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

        {filmeHero && (
          <FilmeHero
            filme={filmeHero}
            trailerLink={trailerLink}
            releaseDates={releaseDates}
          />
        )}

        {isMobile && (
          <SectionCard
            title="Metas"
            count={`${(Array.isArray(user?.metas) ? user.metas : []).length} criadas`}
          >
            <div className={styles.conteudoMetas}>
              <div className={styles.scrollMetas}>
                <div className={`${styles.metasMobile} ${metas.length === 1 ? styles.metaUnica : ""}`}>
                  {metas.map((meta) => (
                    <CardMeta
                      key={meta.id}
                      meta={meta}
                      filmesVistos={meta.filmesVistosPeriodo}
                    />
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                label="Criar meta"
                border="var(--stroke-solid)"
                arrowColor="var(--stroke-solid)"
                width="100%"
                onClick={() => setModalMetaAberto(true)}
              />
            </div>
          </SectionCard>
        )}

        {modalMetaAberto && (
          <CriarMeta onClose={() => setModalMetaAberto(false)} />
        )}

        {!loading && filmesVistos.length > 0 && (
          <div className={styles.graficos}>
            <GraficoGeneros filmesVistos={filmesVistos} />
            <GraficoPeriodo visto={user?.visto || {}} />
          </div>
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
            lista="vistos"
            onRemover={(id) => {
              removerNota(String(id));
              setFilmesVistos((prev) => prev.filter((f) => f.id !== id));
            }}
          />
        )}
      </main>

      <Footer />
    </Private>
  );
}
