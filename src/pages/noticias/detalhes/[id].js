import { useEffect } from "react";
import { db } from "@/services/firebaseConection";
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import styles from "./index.module.scss";
import Footer from "@/components/Footer";
import Head from "next/head";
import Header from "@/components/Header";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";
import Breadcrumb from "@/components/breadcrumb";
import BannerMateria from "@/components/banner-materia";
import Badge from "@/components/badge";
import CardMateria from "@/components/card-materia";
import materiapadrao from "@/components/background/materia-padrao.jpg";

// Converte recursivamente qualquer Timestamp do Firestore para ISO string
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

export async function getServerSideProps({ params, query: qs }) {
  const { id } = params;
  const isPreview = qs.preview === "true";

  try {
    const [noticiaSnap, criticasSnap] = await Promise.all([
      getDoc(doc(db, "noticias", id)),
      getDocs(query(collection(db, "criticas"), orderBy("dataPublicacao", "desc"), limit(4))),
    ]);

    if (!noticiaSnap.exists()) {
      return { notFound: true };
    }

    const noticia = serializarFirestore({ ...noticiaSnap.data(), id });

    const status = noticia.status?.toLowerCase();
    if (status === "arquivado" && !isPreview) {
      return { notFound: true };
    }

    const resenhas = criticasSnap.docs.map((d) =>
      serializarFirestore({ ...d.data(), id: d.id })
    );

    return { props: { noticia, id, isPreview, resenhas } };
  } catch (error) {
    console.error("Erro ao buscar notícia:", error);
    return { notFound: true };
  }
}

const STATUS_LABEL = {
  rascunho: "Rascunho",
  agendado: "Agendado",
  arquivado: "Arquivado",
};

export default function NoticiaDetalhe({ noticia, id, isPreview, resenhas = [] }) {
  const imagemSrc =
    process.env.NODE_ENV === "development"
      ? materiapadrao
      : noticia.imagem ||
        noticia.elementos?.find((el) => el.tipo === "imagem")?.conteudo;

  const imagemUrl = typeof imagemSrc === "object" ? imagemSrc?.src : imagemSrc;

  const dataPublicacao = noticia.dataPublicacao
    ? new Date(noticia.dataPublicacao)
    : null;

  const temInstagram = noticia.elementos?.some((el) => el.tipo === "instagram");

  useEffect(() => {
    if (!temInstagram) return;
    const script = document.createElement("script");
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [temInstagram]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: noticia.titulo,
    description: noticia.subtitulo || "",
    image: imagemUrl || "",
    author: {
      "@type": "Person",
      name: noticia.autor?.nome || "",
    },
    publisher: {
      "@type": "Organization",
      name: "Cameo",
      url: "https://cameo.fun",
    },
    datePublished: noticia.dataPublicacao || "",
    url: `https://cameo.fun/noticias/${id}`,
  };

  const statusLabel = STATUS_LABEL[noticia.status?.toLowerCase()];

  return (
    <>
      {isPreview && (
        <div className={styles.previewBanner}>
          <span className={styles.previewTexto}>
            Pré-visualização
            {statusLabel && (
              <span className={styles.previewBadge}>{statusLabel}</span>
            )}
          </span>
          <span className={styles.previewAviso}>
            Este artigo ainda não está publicado. Apenas você está vendo esta
            página.
          </span>
        </div>
      )}
      <Header />
      <Head>
        <title>{noticia.titulo} — Cameo</title>
        <meta
          name="description"
          content={noticia.subtitulo || noticia.titulo}
        />

        <link rel="canonical" href={`https://cameo.fun/noticias/${id}`} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://cameo.fun/noticias/${id}`} />
        <meta property="og:title" content={noticia.titulo} />
        <meta property="og:description" content={noticia.subtitulo || ""} />
        <meta property="og:image" content={imagemUrl || ""} />
        {dataPublicacao && (
          <meta
            property="article:published_time"
            content={dataPublicacao.toISOString()}
          />
        )}
        <meta property="article:author" content={noticia.autor?.nome || ""} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={noticia.titulo} />
        <meta name="twitter:description" content={noticia.subtitulo || ""} />
        <meta name="twitter:image" content={imagemUrl || ""} />
        <meta name="robots" content="index,follow" />

        {imagemUrl && <link rel="preload" as="image" href={imagemUrl} />}
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/feed.xml"
          title="Cameo News Feed"
        />
        <link
          rel="alternate"
          href={`https://cameo.fun/noticias/${id}`}
          hrefLang="pt-BR"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <div
        className={`${styles.container} ${isPreview ? styles.containerComBanner : ""}`}
      >
        <article className={styles.noticiaCompleta}>
          <Breadcrumb
            items={[
              { href: "/noticias", label: "Notícias" },
              { href: null, label: noticia.titulo },
            ]}
          />

          {imagemSrc && (
            <BannerMateria
              src={imagemSrc}
              tipo="noticia"
              alt={noticia.titulo}
            />
          )}

          <div className={styles.bloco}>
            <div className={styles.contTags}>
              <div className={styles.tags}>
                {noticia.generos?.map((g) => (
                  <Badge key={g} label={g} variant="soft" bg="--bg-base" />
                ))}
                {noticia.empresas?.map((e) => (
                  <Badge key={e} label={e} variant="soft" bg="--bg-base" />
                ))}
              </div>
            </div>

            <h1 className={styles.titulo}>{noticia.titulo}</h1>
            {noticia.subtitulo && (
              <h2 className={styles.subtitulo}>{noticia.subtitulo}</h2>
            )}
          </div>

          <div className={styles.cabecalhoInfo}>
            {noticia.autor && (
              <div className={styles.autorInfo}>
                {noticia.autor.avatarUrl && (
                  <div className={styles.autorFoto}>
                    <Image
                      src={noticia.autor.avatarUrl}
                      alt={`Avatar de ${noticia.autor.nome}`}
                      className={styles.avatar}
                      width={40}
                      height={40}
                    />
                  </div>
                )}
                <div className={styles.autorNomeData}>
                  <div className={styles.autorNome}>{noticia.autor.nome}</div>
                  {dataPublicacao && (
                    <time
                      className={styles.dataPublicacao}
                      dateTime={dataPublicacao.toISOString()}
                    >
                      {dataPublicacao.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  )}
                </div>
              </div>
            )}

            <div className={styles.metaInfo}>
              <div className={styles.tempoLeitura}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6.28172 2.25C6.12129 2.30995 5.96351 2.37534 5.80861 2.44595M15.5382 12.2258C15.6148 12.0599 15.6855 11.8907 15.7499 11.7184M13.874 14.5235C14.0028 14.4033 14.1273 14.2786 14.2471 14.1495M11.4516 16.0292C11.5972 15.9743 11.7405 15.915 11.8815 15.8513M9.11692 16.4954C8.94374 16.5014 8.76937 16.5014 8.59612 16.4954M5.8404 15.8553C5.976 15.9163 6.11379 15.9733 6.25361 16.0262M3.50433 14.1906C3.60685 14.2993 3.71263 14.4048 3.82154 14.5071M1.97444 11.7484C2.0306 11.8967 2.09142 12.0427 2.15671 12.1862M1.50365 9.37897C1.49878 9.2229 1.49879 9.06585 1.50365 8.90955M1.969 6.55285C2.02417 6.40624 2.0839 6.26185 2.14799 6.11985M3.49193 4.10942C3.60043 3.99385 3.7126 3.8818 3.82829 3.77343"
                    stroke="var(--primitive-roxo-02)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.125 9C10.125 9.6213 9.6213 10.125 9 10.125C8.3787 10.125 7.875 9.6213 7.875 9C7.875 8.3787 8.3787 7.875 9 7.875M10.125 9C10.125 8.3787 9.6213 7.875 9 7.875M10.125 9H12M9 7.875V4.5"
                    stroke="var(--primitive-roxo-02)"
                    strokeLinecap="round"
                  />
                  <path
                    d="M16.5 9C16.5 4.85786 13.1421 1.5 9 1.5"
                    stroke="var(--primitive-roxo-02)"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{noticia.numero} min de leitura</span>
              </div>
            </div>
          </div>

          <div className={styles.conteudoLayout}>
            <div className={styles.conteudoTexto}>
              {noticia.conteudo ? (
                <div
                  className={styles.paragrafo}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(noticia.conteudo, {
                      ALLOWED_TAGS: ["p", "strong", "em", "u", "a", "ul", "ol", "li", "blockquote", "br", "h1", "h2", "h3"],
                      ALLOWED_ATTR: ["href", "target", "rel"],
                    }),
                  }}
                />
              ) : (
                noticia.elementos?.map((elemento, index) => {
                  if (elemento.tipo === "paragrafo") {
                    return (
                      <p
                        key={index}
                        className={styles.paragrafo}
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(elemento.conteudo, {
                            ALLOWED_TAGS: ["strong", "em", "p", "a"],
                            ALLOWED_ATTR: ["href", "target", "rel"],
                          }),
                        }}
                      />
                    );
                  }
                  if (elemento.tipo === "instagram") {
                    return (
                      <div key={index} className={styles.instagramEmbed}>
                        <blockquote
                          className="instagram-media"
                          data-instgrm-captioned
                          data-instgrm-permalink={elemento.conteudo}
                          data-instgrm-version="14"
                        >
                          <a href={elemento.conteudo}>Ver publicação no Instagram</a>
                        </blockquote>
                      </div>
                    );
                  }
                  return null;
                })
              )}
            </div>

            <div className={styles.separadorVertical} />

            <aside className={styles.sidebar}>
              <div className={styles.sidebarTopo}>
                <span className={styles.sidebarTitulo}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M10 5L20 5" stroke="#1AF5EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 12L20 12" stroke="#1AF5EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 19L14 19" stroke="#1AF5EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  últimas resenhas
                </span>
                <a href="/resenhas" className={styles.sidebarVerTodas}>Ver todas</a>
              </div>

              <div className={styles.sidebarCards}>
                {resenhas.map((r) => (
                  <CardMateria key={r.id} materia={r} tipo="resenha" />
                ))}
              </div>
            </aside>
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
}
