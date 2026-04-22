import { useEffect } from "react";
import { db } from "@/services/firebaseConection";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
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
import ClockIcon from "@/components/icons/ClockIcon";
import ListaMateriaIcon from "@/components/icons/ListaMateriaIcon";

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
      getDocs(
        query(
          collection(db, "criticas"),
          orderBy("dataPublicacao", "desc"),
          limit(4),
        ),
      ),
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
      serializarFirestore({ ...d.data(), id: d.id }),
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

export default function NoticiaDetalhe({
  noticia,
  id,
  isPreview,
  resenhas = [],
}) {
  const imagemSrc =
    noticia.imagem ||
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

  const canonicalUrl = `https://cameo.fun/noticias/detalhes/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: noticia.titulo,
    description: noticia.subtitulo || "",
    ...(imagemUrl && { image: [imagemUrl] }),
    author: {
      "@type": "Person",
      name: noticia.autor?.nome || "",
    },
    publisher: {
      "@type": "Organization",
      name: "Cameo",
      url: "https://cameo.fun",
      logo: {
        "@type": "ImageObject",
        url: "https://cameo.fun/logo.png",
      },
    },
    datePublished: noticia.dataPublicacao || "",
    dateModified: noticia.dataAtualizacao || noticia.dataPublicacao || "",
    url: canonicalUrl,
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
        <meta name="description" content={noticia.subtitulo || noticia.titulo} />
        {noticia.generos?.length > 0 && (
          <meta
            name="keywords"
            content={[...(noticia.generos || []), ...(noticia.empresas || [])].join(", ")}
          />
        )}
        <meta name="robots" content="index,follow" />

        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Cameo News Feed" />
        <link rel="alternate" href={canonicalUrl} hrefLang="pt-BR" />

        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Cameo" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={noticia.titulo} />
        <meta property="og:description" content={noticia.subtitulo || noticia.titulo} />
        {imagemUrl && <meta property="og:image" content={imagemUrl} />}
        {imagemUrl && <meta property="og:image:alt" content={noticia.titulo} />}
        {dataPublicacao && (
          <meta property="article:published_time" content={dataPublicacao.toISOString()} />
        )}
        <meta property="article:author" content={noticia.autor?.nome || ""} />
        {noticia.generos?.map((g) => (
          <meta key={g} property="article:tag" content={g} />
        ))}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={noticia.titulo} />
        <meta name="twitter:description" content={noticia.subtitulo || noticia.titulo} />
        {imagemUrl && <meta name="twitter:image" content={imagemUrl} />}
        {imagemUrl && <meta name="twitter:image:alt" content={noticia.titulo} />}

        {imagemUrl && <link rel="preload" as="image" href={imagemUrl} />}

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

          <div className={styles.bannerInfo}>
            {imagemSrc && (
              <BannerMateria
                src={imagemSrc}
                tipo="noticia"
                alt={noticia.titulo}
              />
            )}

            <div className={styles.paddingBloco}>
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
            </div>
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
                <ClockIcon size={18} color="var(--primitive-roxo-02)" />
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
                      ALLOWED_TAGS: [
                        "p",
                        "strong",
                        "em",
                        "u",
                        "a",
                        "ul",
                        "ol",
                        "li",
                        "blockquote",
                        "br",
                        "h1",
                        "h2",
                        "h3",
                        "h4",
                        "mark",
                        "div",
                        "img",
                      ],
                      ALLOWED_ATTR: ["href", "target", "rel", "data-type", "src", "alt"],
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
                          <a href={elemento.conteudo}>
                            Ver publicação no Instagram
                          </a>
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
                  <ListaMateriaIcon size={24} color="var(--primitive-azul-01)" />
                  últimas resenhas
                </span>
                <a href="/resenhas" className={styles.sidebarVerTodas}>
                  Ver todas
                </a>
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
