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
import materiapadrao from "@/components/background/materia-padrao.jpg";
import ClockIcon from "@/components/icons/ClockIcon";
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
    process.env.NODE_ENV === "development"
      ? materiapadrao
      : critica.imagem ||
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "CreativeWork",
      name: critica.titulo,
    },
    headline: critica.titulo,
    description: critica.subtitulo || "",
    image: imagemUrl || "",
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
    },
    datePublished: critica.dataPublicacao || "",
    url: `https://cameo.fun/resenhas/detalhes/${id}`,
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

        <link rel="canonical" href={`https://cameo.fun/resenhas/detalhes/${id}`} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://cameo.fun/resenhas/detalhes/${id}`} />
        <meta property="og:title" content={`${critica.titulo} — Resenha`} />
        <meta property="og:description" content={critica.subtitulo || ""} />
        <meta property="og:image" content={imagemUrl || ""} />
        {dataPublicacao && (
          <meta
            property="article:published_time"
            content={dataPublicacao.toISOString()}
          />
        )}
        <meta property="article:author" content={critica.autor?.nome || ""} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${critica.titulo} — Resenha`} />
        <meta name="twitter:description" content={critica.subtitulo || ""} />
        <meta name="twitter:image" content={imagemUrl || ""} />
        <meta name="robots" content="index,follow" />

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
                        "p", "strong", "em", "u", "a", "ul", "ol", "li",
                        "blockquote", "br", "h1", "h2", "h3", "h4", "mark",
                        "div", "img",
                      ],
                      ALLOWED_ATTR: ["href", "target", "rel", "data-type", "src", "alt"],
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
                      {Array.from({ length: 5 }, (_, index) => {
                        const isFilled = index < critica.classificacao;
                        return (
                          <img
                            key={index}
                            src={`/icones/estrela-${isFilled ? "preenchida" : "vazia"}.svg`}
                            alt={isFilled ? "Estrela preenchida" : "Estrela vazia"}
                            className={styles.estrela}
                          />
                        );
                      })}
                    </div>
                    <div className={styles.textoAvaliacao}>
                      {textoClassificacao[critica.classificacao] || "Avaliação indisponível"}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.separadorVertical} />

            <aside className={styles.sidebar}>
              <div className={styles.sidebarTopo}>
                <span className={styles.sidebarTitulo}>
                  <ListaMateriaIcon size={24} color="var(--primitive-azul-01)" />
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
