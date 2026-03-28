import styles from "./index.module.scss";
import { useState, useMemo } from "react";
import { db } from "@/services/firebaseConection";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { useIsMobile } from "@/components/DeviceProvider";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BannerNoticias from "@/components/banner-noticias";
import CarrosselNticias from "@/components/carrossel-noticias";
import empresas from "@/components/listas/tags/empresas.json";
import generos from "@/components/listas/tags/generos.json";
import BotoesCarrossel from "@/components/botoes-carrossel";
import ListaNoticias from "@/components/ListaNoticias";
import ListaResenhas from "@/components/ListaResenhas-resumo";
import BannerInformacao from "@/components/banner-informacao";
import Image from "next/image";

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
    const [noticiasSnap, criticasSnap] = await Promise.all([
      getDocs(
        query(
          collection(db, "noticias"),
          orderBy("dataPublicacao", "desc"),
        ),
      ),
      getDocs(
        query(collection(db, "criticas"), orderBy("dataPublicacao", "desc")),
      ),
    ]);

    console.log("[SSR] noticias docs encontrados:", noticiasSnap.docs.length);
    console.log("[SSR] criticas docs encontrados:", criticasSnap.docs.length);

    const noticias = noticiasSnap.docs.map((docSnap) => {
      const data = docSnap.data();
      console.log("[SSR] noticia:", docSnap.id, "status:", data.status, "imagem:", data.imagem, "elementos:", data.elementos?.length ?? 0);
      return serializarFirestore({
        id: docSnap.id,
        ...data,
        empresas: converterCampo(data, "empresas"),
        generos: converterCampo(data, "generos"),
      });
    });

    const criticas = criticasSnap.docs.map((docSnap) =>
      serializarFirestore({ id: docSnap.id, ...docSnap.data() }),
    );

    console.log("[SSR] props enviados → noticias:", noticias.length, "criticas:", criticas.length);
    return { props: { noticias, criticas } };
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return { props: { noticias: [], criticas: [] } };
  }
}

const opcoesBotoes = [
  {
    label: "Empresas",
    options: empresas
      .filter((empresa) => empresa.Exibir === "Sim")
      .map((empresa) => ({
        value: `empresa:${empresa.name}`,
        label: empresa.name,
      })),
  },
  {
    label: "Gêneros",
    options: generos
      .filter((genero) => genero.Exibir === "Sim")
      .map((genero) => ({
        value: `genero:${genero.name}`,
        label: genero.name,
      })),
  },
];

const Noticias = ({ noticias, criticas }) => {
  const isMobile = useIsMobile();
  const [filtroSelecionado, setFiltroSelecionado] = useState(null);

  const ultimasNoticias = noticias.slice(0, 4);
  const ultimasCriticas = criticas.slice(0, 4);
  const noticiaDestaque = ultimasNoticias[0];

  const filteredNoticias = useMemo(() => {
    if (!filtroSelecionado) return noticias;
    const [tipo, valor] = filtroSelecionado.value.split(":");
    return noticias.filter((noticia) => {
      if (tipo === "empresa") {
        return noticia.empresas?.some(
          (empresa) =>
            empresa.trim().toLowerCase() === valor.trim().toLowerCase(),
        );
      }
      if (tipo === "genero") {
        return noticia.generos?.some(
          (genero) =>
            genero.trim().toLowerCase() === valor.trim().toLowerCase(),
        );
      }
      return false;
    });
  }, [filtroSelecionado, noticias]);

  const renderElemento = (elemento, index, noticia = {}) => {
    if (!elemento || elemento.tipo !== "imagem") return null;
    const src = elemento.conteudo || noticia.imagem;
    if (!src) return null;
    return (
      <div key={index} className={styles.imagemContainer}>
        <Image
          src={src}
          alt={noticia.titulo || "Imagem da notícia"}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    );
  };

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

      <main className={styles.ContNoticias}>
        {!isMobile && (
          <section className={styles.bannerNoticias}>
            <BannerNoticias
              noticias={ultimasNoticias}
              tipo="noticias"
              className={styles.customWidth}
            />
          </section>
        )}

        {isMobile && (
          <section className={styles.ultimasNoticiasECriticas}>
            <div className={styles.ultimasNoticias}>
              <CarrosselNticias
                noticias={ultimasNoticias}
                tipo="noticias"
                className={styles.customWidth}
              />
            </div>
          </section>
        )}

        {!isMobile && (
          <div className={styles.tituloPagina}>
            <BotoesCarrossel
              opcoesBotoes={opcoesBotoes}
              onFilterChange={setFiltroSelecionado}
            />
          </div>
        )}

        {!isMobile && <div className={styles.divisor} />}

        <div className={styles.criticasNoticias}>
          <div className={styles.colunaNoticias}>
            <ListaNoticias
              noticias={filteredNoticias}
              renderElemento={renderElemento}
              BannerComponent={BannerInformacao}
            />
          </div>

          {isMobile && <div className={styles.divisor} />}

          <div className={styles.colunaCriticas}>
            <ListaResenhas criticas={ultimasCriticas} />
          </div>

          <div className={styles.containerGoogle} />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Noticias;
