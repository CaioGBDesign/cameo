import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "@/services/firebaseConection";
import { doc, getDoc } from "firebase/firestore";
import Loading from "@/components/loading";
import styles from "./index.module.scss";
import FooterB from "@/components/FooterB";
import Head from "next/head";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import { useIsMobile } from "@/components/DeviceProvider";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";

const CriticaDetalhe = () => {
  const router = useRouter();
  const { id } = router.query;
  const [critica, setCritica] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  const textoClassificacao = {
    1: "Zuado",
    2: "Ok",
    3: "Gostei",
    4: "Sinistro",
    5: "Cabuloso",
  };

  useEffect(() => {
    const fetchCritica = async () => {
      try {
        const docRef = doc(db, "criticas", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCritica({
            ...data,
            dataPublicacao: data.dataPublicacao?.toDate(),
          });
        } else {
          router.push("/resenhas");
        }
      } catch (error) {
        console.error("Erro ao buscar crítica:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCritica();
  }, [id]);

  const processarConteudo = (html) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      doc
        .querySelectorAll("strong")
        .forEach((el) => el.classList.add("boldtext"));
      doc
        .querySelectorAll("em")
        .forEach((el) => el.classList.add("italictext"));
      return doc.body.innerHTML;
    } catch {
      return html;
    }
  };

  if (loading) return <Loading />;

  const imagemDestaque = critica.elementos.find(
    (el) => el.tipo === "imagem"
  )?.conteudo;
  const urlPage = `https://cameo.fun/criticas/${id}`;

  return (
    <>
      {isMobile ? <Header /> : <HeaderDesktop />}
      <Head>
        {/* Primary Meta Tags */}
        <title>{critica.titulo} — Resenha | Cameo</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={critica.subtitulo || critica.titulo}
        />
        <meta name="author" content={critica.autor.nome} />
        <meta name="robots" content="index, follow" />

        {/* Canonical */}
        <link rel="canonical" href={urlPage} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={urlPage} />
        <meta property="og:title" content={`${critica.titulo} — Resenha`} />
        <meta property="og:description" content={critica.subtitulo || ""} />
        {imagemDestaque && (
          <meta property="og:image" content={imagemDestaque} />
        )}
        <meta
          property="article:published_time"
          content={critica.dataPublicacao.toISOString()}
        />
        <meta property="article:author" content={critica.autor.nome} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cameo_fun" />
        <meta name="twitter:title" content={`${critica.titulo} — Resenha`} />
        <meta name="twitter:description" content={critica.subtitulo || ""} />
        {imagemDestaque && (
          <meta name="twitter:image" content={imagemDestaque} />
        )}

        {/* Preload featured image */}
        {imagemDestaque && (
          <link rel="preload" as="image" href={imagemDestaque} />
        )}

        {/* JSON-LD: Review */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Review",
              itemReviewed: {
                "@type": "CreativeWork",
                name: critica.titulo,
              },
              author: { "@type": "Person", name: critica.autor.nome },
              reviewRating: {
                "@type": "Rating",
                ratingValue: critica.classificacao,
                bestRating: 5,
                worstRating: 1,
              },
              publisher: { "@type": "Organization", name: "Cameo.fun" },
              reviewBody: critica.subtitulo || "",
              datePublished: critica.dataPublicacao.toISOString(),
            }),
          }}
        />
      </Head>
      <div className={styles.container}>
        <article className={styles.criticaCompleta}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
            <Link href="/">Home</Link>
            <span className={styles.setaSeparacao}>•</span>
            <Link href="/resenhas">Resenhas</Link>
            <span className={styles.setaSeparacao}>•</span>
            <span className={styles.tituloMateria}>{critica.titulo}</span>
          </nav>

          {/* Imagem principal */}
          {critica.elementos?.find((el) => el.tipo === "imagem") && (
            <div className={styles.imagemCritica}>
              <div className={styles.tagCritica}>
                <span>Resenha</span>
              </div>
              <img
                src={
                  critica.elementos.find((el) => el.tipo === "imagem").conteudo
                }
                alt="Imagem da notícia"
                className={styles.imagemDestaque}
              />
            </div>
          )}

          {/* Tags de gêneros e empresas */}
          <div className={styles.contTags}>
            <div className={styles.tags}>
              {critica.generos.map((g) => (
                <span key={`gen-${g}`} className={styles.tag}>
                  {g}
                </span>
              ))}

              {critica.empresas &&
                critica.empresas.map((e) => (
                  <span key={`emp-${e}`} className={styles.tag}>
                    {e}
                  </span>
                ))}
            </div>
          </div>

          {/* Título e subtítulo */}
          <h1 className={styles.titulo}>{critica.titulo}</h1>
          {critica.subtitulo && (
            <h2 className={styles.subtitulo}>{critica.subtitulo}</h2>
          )}

          {/* Informações do autor e metadados */}
          <div className={styles.cabecalhoInfo}>
            {critica.autor && (
              <div className={styles.autorInfo}>
                <div className={styles.autorFoto}>
                  <img
                    src={critica.autor.avatarUrl}
                    alt={`Avatar de ${critica.autor.nome}`}
                    className={styles.avatar}
                  />
                </div>
                <div className={styles.autorNomeData}>
                  <div className={styles.autorNome}>{critica.autor.nome}</div>
                  <time className={styles.dataPublicacao}>
                    {new Date(critica.dataPublicacao).toLocaleDateString(
                      "pt-BR",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </time>
                </div>
              </div>
            )}

            <div className={styles.metaInfo}>
              <div className={styles.tempoLeitura}>
                <img src="/icones/relogio.svg" alt="Tempo de leitura" />
                <span>{critica.numero} min de leitura</span>
              </div>
            </div>
          </div>

          {/* Conteúdo textual */}
          <div className={styles.conteudoTexto}>
            {critica.elementos?.map((elemento, index) => {
              if (elemento.tipo === "paragrafo") {
                return (
                  <p
                    key={index}
                    className={styles.paragrafo}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        processarConteudo(elemento.conteudo),
                        {
                          ALLOWED_TAGS: ["strong", "em", "p"],
                          ALLOWED_ATTR: ["class"],
                          ADD_ATTR: ["class"],
                        }
                      ),
                    }}
                  />
                );
              }
              return null;
            })}
          </div>

          <div className={styles.avaliacaoCameo}>
            <h3>
              Avaliação de <strong>{critica.autor.nome}</strong>
            </h3>

            {critica.classificacao !== undefined && (
              <div className={styles.avaliacaoDoAutor}>
                <div className={styles.classificacaoEstrelas}>
                  {Array.from({ length: 5 }, (_, index) => {
                    const isFilled = index < critica.classificacao;
                    return (
                      <img
                        key={index}
                        src={`/icones/estrela-${
                          isFilled ? "preenchida" : "vazia"
                        }.svg`}
                        alt={isFilled ? "Estrela preenchida" : "Estrela vazia"}
                        className={styles.estrela}
                      />
                    );
                  })}
                </div>

                <div className={styles.textoAvaliacao}>
                  {textoClassificacao[critica.classificacao] ||
                    "Avaliação indisponível"}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
      <FooterB></FooterB>
    </>
  );
};

export default CriticaDetalhe;
