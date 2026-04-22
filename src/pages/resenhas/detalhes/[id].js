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
import StarRatingIcon from "@/components/icons/StarRatingIcon";
import ListaMateriaIcon from "@/components/icons/ListaMateriaIcon";

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
    const [criticaSnap, noticiasSnap] = await Promise.all([
      getDoc(doc(db, "criticas", id)),
      getDocs(
        query(
          collection(db, "noticias"),
          orderBy("dataPublicacao", "desc"),
          limit(4),
        ),
      ),
    ]);

    if (!criticaSnap.exists()) {
      return { notFound: true };
    }

    const critica = serializarFirestore({ ...criticaSnap.data(), id });

    const status = critica.status?.toLowerCase();
    if (status === "arquivado" && !isPreview) {
      return { notFound: true };
    }

    const noticias = noticiasSnap.docs.map((d) =>
      serializarFirestore({ ...d.data(), id: d.id }),
    );

    return { props: { critica, id, isPreview, noticias } };
  } catch (error) {
    console.error("Erro ao buscar resenha:", error);
    return { notFound: true };
  }
}

const STATUS_LABEL = {
  rascunho: "Rascunho",
  agendado: "Agendado",
  arquivado: "Arquivado",
};

const textoClassificacao = {
  1: "Zuado",
  2: "Ok",
  3: "Gostei",
  4: "Sinistro",
  5: "Cabuloso",
};

export default function ResenhaDetalhe({
  critica,
  id,
  isPreview,
  noticias = [],
}) {
  const imagemSrc =
    critica.imagem ||
    critica.elementos?.find((el) => el.tipo === "imagem")?.conteudo;

  const imagemUrl = typeof imagemSrc === "object" ? imagemSrc?.src : imagemSrc;

  const dataPublicacao = critica.dataPublicacao
    ? new Date(critica.dataPublicacao)
    : null;

  const temInstagram = critica.elementos?.some((el) => el.tipo === "instagram");

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

  const canonicalUrl = `https://cameo.fun/resenhas/detalhes/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    itemReviewed: {
      "@type": "CreativeWork",
      name: critica.titulo,
    },
    headline: critica.titulo,
    description: critica.subtitulo || "",
    ...(imagemUrl && { image: [imagemUrl] }),
    author: {
      "@type": "Person",
      name: critica.autor?.nome || "",
    },
    ...(critica.classificacao !== undefined && {
      reviewRating: {
        "@type": "Rating",
        ratingValue: critica.classificacao,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    publisher: {
      "@type": "Organization",
      name: "Cameo",
      url: "https://cameo.fun",
      logo: {
        "@type": "ImageObject",
        url: "https://cameo.fun/logo.png",
      },
    },
    datePublished: critica.dataPublicacao || "",
    dateModified: critica.dataAtualizacao || critica.dataPublicacao || "",
    url: canonicalUrl,
  };

  const statusLabel = STATUS_LABEL[critica.status?.toLowerCase()];

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
        <title>{critica.titulo} — Resenha | Cameo</title>
        <meta
          name="description"
          content={critica.subtitulo || critica.titulo}
        />
        {critica.generos?.length > 0 && (
          <meta
            name="keywords"
            content={[
              ...(critica.generos || []),
              ...(critica.empresas || []),
            ].join(", ")}
          />
        )}
        <meta name="robots" content="index,follow" />

        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Cameo" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={`${critica.titulo} — Resenha`} />
        <meta
          property="og:description"
          content={critica.subtitulo || critica.titulo}
        />
        {imagemUrl && <meta property="og:image" content={imagemUrl} />}
        {imagemUrl && <meta property="og:image:alt" content={critica.titulo} />}
        {dataPublicacao && (
          <meta
            property="article:published_time"
            content={dataPublicacao.toISOString()}
          />
        )}
        <meta property="article:author" content={critica.autor?.nome || ""} />
        {critica.generos?.map((g) => (
          <meta key={g} property="article:tag" content={g} />
        ))}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${critica.titulo} — Resenha`} />
        <meta
          name="twitter:description"
          content={critica.subtitulo || critica.titulo}
        />
        {imagemUrl && <meta name="twitter:image" content={imagemUrl} />}
        {imagemUrl && (
          <meta name="twitter:image:alt" content={critica.titulo} />
        )}

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
              { href: "/resenhas", label: "Resenhas" },
              { href: null, label: critica.titulo },
            ]}
          />

          <div className={styles.bannerInfo}>
            {imagemSrc && (
              <BannerMateria
                src={imagemSrc}
                tipo="resenha"
                alt={critica.titulo}
              />
            )}

            <div className={styles.paddingBloco}>
              <div className={styles.bloco}>
                <div className={styles.contTags}>
                  <div className={styles.tags}>
                    {critica.generos?.map((g) => (
                      <Badge key={g} label={g} variant="soft" bg="--bg-base" />
                    ))}
                    {critica.empresas?.map((e) => (
                      <Badge key={e} label={e} variant="soft" bg="--bg-base" />
                    ))}
                  </div>
                </div>

                <h1 className={styles.titulo}>{critica.titulo}</h1>
                {critica.subtitulo && (
                  <h2 className={styles.subtitulo}>{critica.subtitulo}</h2>
                )}
              </div>
            </div>
          </div>

          <div className={styles.cabecalhoInfo}>
            {critica.autor && (
              <div className={styles.autorInfo}>
                {critica.autor.avatarUrl && (
                  <div className={styles.autorFoto}>
                    <Image
                      src={critica.autor.avatarUrl}
                      alt={`Avatar de ${critica.autor.nome}`}
                      className={styles.avatar}
                      width={40}
                      height={40}
                    />
                  </div>
                )}
                <div className={styles.autorNomeData}>
                  <div className={styles.autorNome}>{critica.autor.nome}</div>
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
                <span>{critica.numero} min de leitura</span>
              </div>
            </div>
          </div>

          <div className={styles.conteudoLayout}>
            <div className={styles.conteudoTexto}>
              {critica.conteudo ? (
                <div
                  className={styles.paragrafo}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(critica.conteudo, {
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
                      ALLOWED_ATTR: [
                        "href",
                        "target",
                        "rel",
                        "data-type",
                        "src",
                        "alt",
                      ],
                    }),
                  }}
                />
              ) : (
                critica.elementos?.map((elemento, index) => {
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

              {critica.classificacao !== undefined && (
                <div className={styles.avaliacaoCameo}>
                  <h3>
                    Avaliação de <strong>{critica.autor?.nome}</strong>
                  </h3>
                  <div className={styles.avaliacaoDoAutor}>
                    <div className={styles.classificacaoEstrelas}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <StarRatingIcon
                          key={index}
                          size={24}
                          filled={index < critica.classificacao}
                        />
                      ))}
                    </div>
                    <div className={styles.textoAvaliacao}>
                      {textoClassificacao[critica.classificacao] ||
                        "Avaliação indisponível"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.separadorVertical} />

            <aside className={styles.sidebar}>
              <div className={styles.sidebarTopo}>
                <span className={styles.sidebarTitulo}>
                  <ListaMateriaIcon
                    size={24}
                    color="var(--primitive-azul-01)"
                  />
                  últimas notícias
                </span>
                <a href="/noticias" className={styles.sidebarVerTodas}>
                  Ver todas
                </a>
              </div>

              <div className={styles.sidebarCards}>
                {noticias.map((n) => (
                  <CardMateria key={n.id} materia={n} tipo="noticia" />
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
