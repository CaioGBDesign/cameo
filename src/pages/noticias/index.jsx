import styles from "./index.module.scss";
import { useState, useEffect, useRef } from "react";
import { db } from "@/services/firebaseConection";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BannerNoticias from "@/components/banner-noticias";
import BotoesCarrossel from "@/components/botoes-carrossel";
import ListaNoticiasGrid from "@/components/lista-noticias-grid";
import ListaNoticiasResumo from "@/components/lista-noticias-resumo";
import SectionCard from "@/components/section-card";
import CardFilme from "@/components/card-filme";

function serializarFirestore(valor) {
  if (valor === null || valor === undefined) return valor ?? null;
  if (typeof valor.toDate === "function") return valor.toDate().toISOString();
  if (Array.isArray(valor)) return valor.map(serializarFirestore);
  if (typeof valor === "object")
    return Object.fromEntries(
      Object.entries(valor).map(([k, v]) => [k, serializarFirestore(v)]),
    );
  return valor;
}

const converterCampo = (data, campo) => {
  if (!data[campo]) return [];
  if (typeof data[campo] === "string") return data[campo].split(/\s*,\s*/);
  if (typeof data[campo] === "object" && !Array.isArray(data[campo]))
    return Object.values(data[campo]);
  return data[campo] || [];
};

export async function getServerSideProps() {
  try {
    const configSnap = await getDoc(doc(db, "configuracoes", "site"));
    const config = configSnap.exists() ? configSnap.data() : {};
    if (config.noticiasHabilitado === false) return { notFound: true };

    const [noticiasSnap, criticasSnap] = await Promise.all([
      getDocs(
        query(collection(db, "noticias"), orderBy("dataPublicacao", "desc")),
      ),
      getDocs(
        query(collection(db, "criticas"), orderBy("dataPublicacao", "desc")),
      ),
    ]);

    const noticias = noticiasSnap.docs
      .map((docSnap) => {
        const data = docSnap.data();
        return serializarFirestore({
          id: docSnap.id,
          ...data,
          empresas: converterCampo(data, "empresas"),
          generos: converterCampo(data, "generos"),
        });
      })
      .filter((n) => !n.status || n.status === "publicado");

    const criticas = criticasSnap.docs.map((docSnap) =>
      serializarFirestore({ id: docSnap.id, ...docSnap.data() }),
    );

    return { props: { noticias, criticas } };
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return { props: { noticias: [], criticas: [] } };
  }
}

const opcoesBotoes = [
  "Marvel",
  "DC Comics",
  "HBO Max",
  "Disney",
  "Netflix",
  "Prime Vídeo",
  "Paramount",
  "Universal",
  "A24",
  "Lionsgate",
].map((nome) => ({ value: nome, label: nome }));

const Noticias = ({ noticias, criticas }) => {
  const [filtroSelecionado, setFiltroSelecionado] = useState(null);
  const [recomendacoes, setRecomendacoes] = useState([]);
  const recomendacoesRef = useRef(null);
  const noticiasDestaque = noticias.slice(0, 5);
  const noticiaDestaque = noticias[0];

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=pt-BR&page=1`)
      .then((r) => r.json())
      .then((data) => setRecomendacoes(data.results || []))
      .catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <Head>
        <title>Cameo - Notícias</title>
        <meta
          name="description"
          content={
            noticiaDestaque?.resumo ??
            "Fique por dentro das últimas notícias de cinema."
          }
        />
        <link rel="canonical" href="https://cameo.fun/noticias" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cameo.fun/noticias" />
        <meta property="og:title" content="Cameo – Notícias de Cinema" />
        <meta
          property="og:description"
          content="Fique por dentro das últimas notícias de filmes, estreias e bastidores. Descubra, discuta e compartilhe com outros cinéfilos!"
        />
        <meta
          property="og:image"
          content="https://cameo.fun/imagens/og-noticias.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://cameo.fun/noticias" />
        <meta name="twitter:title" content="Cameo – Notícias de Cinema" />
        <meta
          name="twitter:description"
          content="Notícias atualizadas sobre filmes, trailers, críticas e muito mais no Cameo.fun."
        />
        <meta
          name="twitter:image"
          content="https://cameo.fun/imagens/og-noticias.jpg"
        />
      </Head>

      <main className={styles.pageMateria}>
        <section className={styles.bannerNoticias}>
          <BannerNoticias noticias={noticiasDestaque} />
        </section>

        <article className={styles.page}>
          <BotoesCarrossel
            opcoesBotoes={opcoesBotoes}
            onFilterChange={setFiltroSelecionado}
          />

          <ListaNoticiasGrid noticias={noticias} />

          <ListaNoticiasResumo
            noticias={criticas.slice(0, 6)}
            titulo="últimas resenhas"
            verTodas="/resenhas"
            basePath="/resenhas/detalhes"
          />

          {recomendacoes.length > 0 && (
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
                {recomendacoes.map((movie) => (
                  <CardFilme key={movie.id} movie={movie} variant="titulo" />
                ))}
              </div>
            </SectionCard>
          )}
        </article>
      </main>

      <Footer />
    </>
  );
};

export default Noticias;
