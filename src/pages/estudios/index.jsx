import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { db } from "@/services/firebaseConection";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Loading from "@/components/loading";
import AvatarDublador from "@/components/avatar-dublador";
import SectionCard from "@/components/section-card";
import FilmeHero from "@/components/filme-hero";
import styles from "./index.module.scss";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const PLACEHOLDER =
  "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fcameo-placeholder-cast.jpg?alt=media&token=f0331d80-cf03-4240-b33c-f90c773c8520";

export async function getServerSideProps() {
  const configSnap = await getDoc(doc(db, "configuracoes", "site"));
  const config = configSnap.exists() ? configSnap.data() : {};
  if (config.estudiosHabilitado === false) return { notFound: true };
  return { props: {} };
}

export default function EstudiosPage() {
  const [estudios, setEstudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  const [filmeHero, setFilmeHero] = useState(null);
  const [trailerLink, setTrailerLink] = useState(null);
  const [releaseDates, setReleaseDates] = useState([]);
  const [elencoImagens, setElencoImagens] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "estudios")).then((snap) => {
      const lista = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.nome ?? "").localeCompare(b.nome ?? "", "pt"));
      setEstudios(lista);
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

  const normalizar = (str) =>
    (str ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const filtrados = busca.trim()
    ? estudios.filter(
        (e) =>
          normalizar(e.nome).includes(normalizar(busca)) ||
          normalizar(e.nomePopular).includes(normalizar(busca)),
      )
    : estudios;

  return (
    <>
      <Head>
        <title>Estúdios de dublagem — Cameo</title>
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
          title="Estúdios de dublagem"
          count={loading ? undefined : filtrados.length}
          search={
            <input
              className={styles.busca}
              type="text"
              placeholder="Buscar estúdio..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          }
        >
          {loading ? (
            <Loading />
          ) : (
            <div className={styles.grid}>
              {filtrados.map((estudio) => (
                <div key={estudio.id} className={styles.contentCard}>
                  <Link
                    href={`/estudios/${estudio.id}`}
                    className={styles.card}
                  >
                    <AvatarDublador
                      src={estudio.imagemUrl || PLACEHOLDER}
                      alt={estudio.nome}
                      size={72}
                    />
                    <div className={styles.cardInfo}>
                      {estudio.nomePopular && (
                        <span className={styles.nomePopular}>
                          {estudio.nomePopular}
                        </span>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </main>

      <Footer />
    </>
  );
}
