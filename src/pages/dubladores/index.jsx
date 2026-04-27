import { useEffect, useState } from "react";
import Head from "next/head";
import { db } from "@/services/firebaseConection";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilmeHero from "@/components/filme-hero";
import SectionCard from "@/components/section-card";
import ElencoDublagem from "@/components/detalhesfilmes/elenco-dublagem";
import styles from "./index.module.scss";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export async function getServerSideProps() {
  const configSnap = await getDoc(doc(db, "configuracoes", "site"));
  const config = configSnap.exists() ? configSnap.data() : {};
  if (config.dubladoresHabilitado === false) return { notFound: true };
  return { props: {} };
}

const CARD_WIDTH = 180;
const CARD_GAP = 8;
const LINHAS_DESKTOP = 7;
const LINHAS_MOBILE = 10;

function calcularItemsPorPagina() {
  if (typeof window === "undefined") return 56;
  const isMobile = window.innerWidth <= 768;
  const containerWidth = window.innerWidth * (isMobile ? 1 : 0.85);
  const cols = Math.max(
    1,
    Math.floor(containerWidth / (CARD_WIDTH + CARD_GAP)),
  );
  return cols * (isMobile ? LINHAS_MOBILE : LINHAS_DESKTOP);
}

export default function DubladoresPage() {
  const [itemsPorPagina, setItemsPorPagina] = useState(calcularItemsPorPagina);
  const [dubladores, setDubladores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filmeHero, setFilmeHero] = useState(null);
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);
  const [elencoImagens, setElencoImagens] = useState([]);

  useEffect(() => {
    const onResize = () => setItemsPorPagina(calcularItemsPorPagina());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    getDocs(collection(db, "dubladores")).then((snap) => {
      const lista = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) =>
          (a.nomeArtistico ?? "").localeCompare(b.nomeArtistico ?? "", "pt"),
        );
      setDubladores(lista);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!TMDB_KEY) return;
    getDocs(collection(db, "filmes")).then(async (snap) => {
      const comElenco = snap.docs
        .map((d) => d.data())
        .filter(
          (f) =>
            Array.isArray(f.dubladores) && f.dubladores.length > 0 && f.idFilme,
        );

      if (!comElenco.length) return;

      const rndFirestore =
        comElenco[Math.floor(Math.random() * comElenco.length)];

      const ids = (rndFirestore.dubladores ?? [])
        .map((e) => e.idDublador)
        .filter(Boolean);

      const imagens = (
        await Promise.all(
          ids.map((id) =>
            getDoc(doc(db, "dubladores", id))
              .then((s) => (s.exists() ? (s.data().imagemUrl ?? null) : null))
              .catch(() => null),
          ),
        )
      )
        .filter(Boolean)
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

      setElencoImagens(imagens);

      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${rndFirestore.idFilme}?api_key=${TMDB_KEY}&language=pt-BR&append_to_response=videos,release_dates`,
        );
        if (!res.ok) return;
        const data = await res.json();

        setFilmeHero({
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
        });

        const trailer = data.videos?.results?.find(
          (v) => v.type === "Trailer" && v.site === "YouTube",
        );
        setTrailerLink(
          trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
        );
        setReleaseDates(data.release_dates?.results || []);
      } catch {}
    });
  }, []);

  const items = dubladores.map((d) => ({
    idDublador: d.id,
    nomeArtistico: d.nomeArtistico ?? d.nomeCompleto ?? d.id,
    imagemUrl: d.imagemUrl ?? null,
  }));

  const totalPages = Math.ceil(items.length / itemsPorPagina);
  const itensPaginados = items.slice(
    (currentPage - 1) * itemsPorPagina,
    currentPage * itemsPorPagina,
  );

  return (
    <>
      <Head>
        <title>Dubladores — Cameo</title>
      </Head>
      <Header />

      <main className={styles.page}>
        {filmeHero && (
          <FilmeHero
            filme={filmeHero}
            trailerLink={trailerLink}
            releaseDates={releaseDates}
            showMetas={false}
            showNotas={false}
            elencoImagens={elencoImagens}
          />
        )}

        <SectionCard
          title="Dubladores"
          count={loading ? undefined : dubladores.length}
          pagination={{
            page: currentPage,
            totalPages,
            onChange: setCurrentPage,
          }}
        >
          {!loading && <ElencoDublagem items={itensPaginados} wrap />}
        </SectionCard>
      </main>

      <Footer />
    </>
  );
}
