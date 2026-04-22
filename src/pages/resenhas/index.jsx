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
    if (config.resenhasHabilitado === false) return { notFound: true };

    const [criticasSnap, noticiasSnap] = await Promise.all([
      getDocs(query(collection(db, "criticas"), orderBy("dataPublicacao", "desc"))),
      getDocs(query(collection(db, "noticias"), orderBy("dataPublicacao", "desc"))),
    ]);

    const criticas = criticasSnap.docs.map((docSnap) => {
      const data = docSnap.data();
      return serializarFirestore({
        id: docSnap.id,
        ...data,
        empresas: converterCampo(data, "empresas"),
        generos: converterCampo(data, "generos"),
      });
    });

    const noticias = noticiasSnap.docs
      .map((docSnap) => serializarFirestore({ id: docSnap.id, ...docSnap.data() }))
      .filter((n) => !n.status || n.status === "publicado");

    return { props: { criticas, noticias } };
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return { props: { criticas: [], noticias: [] } };
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

const Resenhas = ({ criticas, noticias }) => {
  const [, setFiltroSelecionado] = useState(null);
  const [recomendacoes, setRecomendacoes] = useState([]);
  const recomendacoesRef = useRef(null);
  const criticasDestaque = criticas.slice(0, 5);
  const criticaDestaque = criticas[0];

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
        <title>Cameo – Resenhas de Cinema</title>
        <meta
          name="description"
          content={
            criticaDestaque?.resumo ??
            "As últimas resenhas de filmes: opiniões, avaliações e análises detalhadas."
          }
        />
        <link rel="canonical" href="https://cameo.fun/resenhas" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cameo.fun/resenhas" />
        <meta property="og:title" content="Cameo – Resenhas de Cinema" />
        <meta
          property="og:description"
          content="As últimas resenhas de filmes: opiniões, avaliações e análises detalhadas para ajudá-lo a escolher o que assistir."
        />
        <meta property="og:image" content="https://cameo.fun/imagens/og-resenhas.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://cameo.fun/resenhas" />
        <meta name="twitter:title" content="Cameo – Resenhas de Cinema" />
        <meta
          name="twitter:description"
          content="As últimas resenhas de filmes: opiniões, avaliações e análises detalhadas para ajudá-lo a escolher o que assistir."
        />
        <meta name="twitter:image" content="https://cameo.fun/imagens/og-resenhas.jpg" />
      </Head>

      <main className={styles.pageMateria}>
        <section className={styles.bannerResenhas}>
          <BannerNoticias noticias={criticasDestaque} tagLabel="Resenha" tagCor="var(--primitive-rosa-01)" basePath="/resenhas/detalhes" />
        </section>

        <article className={styles.page}>
          <BotoesCarrossel
            opcoesBotoes={opcoesBotoes}
            onFilterChange={setFiltroSelecionado}
          />

          <ListaNoticiasGrid
            noticias={criticas}
            basePath="/resenhas/detalhes"
            titulo="Todas as resenhas"
          />

          <ListaNoticiasResumo
            noticias={noticias.slice(0, 6)}
            titulo="últimas notícias"
            verTodas="/noticias"
            basePath="/noticias/detalhes"
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

export default Resenhas;
