// pages/noticias/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "@/services/firebaseConection";
import { doc, getDoc } from "firebase/firestore";
import Loading from "@/components/loading";
import styles from "./index.module.scss";
import Footer from "@/components/Footer";
import Head from "next/head";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import { useIsMobile } from "@/components/DeviceProvider";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import Image from "next/image";

const NoticiaDetalhe = () => {
  const router = useRouter();
  const { id } = router.query;
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const docRef = doc(db, "noticias", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Converter timestamp do Firestore para Date
          const noticiaData = {
            ...data,
            dataPublicacao: data.dataPublicacao?.toDate(),
          };
          setNoticia(noticiaData);
        } else {
          console.log("Documento não encontrado!");
          router.push("/noticias");
        }
      } catch (error) {
        console.error("Erro ao buscar notícia:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNoticia();
  }, [id]);

  useEffect(() => {
    // Carregar script do Instagram quando houver embeds
    if (noticia?.elementos?.some((el) => el.tipo === "instagram")) {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [noticia]);

  // Adicione esta função de processamento antes do return
  const processarConteudo = (html) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      // Remove conversão redundante de strong/em para spans
      // Mantém apenas as tags originais e adiciona classes
      doc.querySelectorAll("strong").forEach((el) => {
        el.classList.add("boldtext");
      });

      doc.querySelectorAll("em").forEach((el) => {
        el.classList.add("italictext");
      });

      return doc.body.innerHTML;
    } catch (error) {
      console.error("Erro ao processar conteúdo:", error);
      return html;
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      {isMobile ? <Header /> : <HeaderDesktop />}
      <Head>
        <title>{noticia.titulo} — Cameo</title>
        <meta
          name="description"
          content={noticia.subtitulo || noticia.titulo}
        />

        {/* canonical */}
        <link rel="canonical" href={`https://cameo.fun/noticias/${id}`} />

        {/* Open Graph para artigo */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://cameo.fun/noticias/${id}`} />
        <meta property="og:title" content={noticia.titulo} />
        <meta property="og:description" content={noticia.subtitulo || ""} />
        <meta
          property="og:image"
          content={
            noticia.elementos.find((el) => el.tipo === "imagem")?.conteudo
          }
        />
        <meta
          property="article:published_time"
          content={noticia.dataPublicacao.toISOString()}
        />
        <meta property="article:author" content={noticia.autor.nome} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={noticia.titulo} />
        <meta name="twitter:description" content={noticia.subtitulo || ""} />
        <meta
          name="twitter:image"
          content={
            noticia.elementos.find((el) => el.tipo === "imagem")?.conteudo
          }
        />
        <meta name="robots" content="index,follow" />

        <link
          rel="preload"
          as="image"
          href="https://cameo.fun/_next/image?url=…&w=1200&q=80"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          href="/feed.xml"
          title="Cameo News Feed"
        />
        <link
          rel="alternate"
          href="https://cameo.fun/noticias/123"
          hreflang="pt-BR"
        />
      </Head>

      <div className={styles.container}>
        <article className={styles.noticiaCompleta}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
            <Link href="/">Home</Link>{" "}
            <span className={styles.setaSeparacao}>•</span>{" "}
            <Link href="/noticias">Notícias</Link>{" "}
            <span className={styles.setaSeparacao}>•</span>{" "}
            <span className={styles.tituloMateria}>{noticia.titulo}</span>
          </nav>

          {/* Imagem principal */}
          {noticia.elementos?.find((el) => el.tipo === "imagem") && (
            <div className={styles.imagemNoticia}>
              <div className={styles.tagNoticia}>
                <span>Notícia</span>
              </div>

              <Image
                src={
                  noticia.elementos.find((el) => el.tipo === "imagem").conteudo
                }
                alt={noticia.titulo}
                width={1200}
                height={628}
                layout="responsive"
                priority
              />
            </div>
          )}

          <div className={styles.contTags}>
            <div className={styles.tags}>
              {noticia.generos.map((g) => (
                <span
                  key={g}
                  className={styles.tag} // CSS aplicado direto no Link
                >
                  {g}
                </span>
              ))}

              {noticia.empresas.map((e) => (
                <span key={e} className={styles.tag}>
                  {e}
                </span>
              ))}
            </div>
          </div>

          {/* Título e subtítulo */}
          <h1 className={styles.titulo}>{noticia.titulo}</h1>
          {noticia.subtitulo && (
            <h2 className={styles.subtitulo}>{noticia.subtitulo}</h2>
          )}

          {/* Informações do autor e metadados */}
          <div className={styles.cabecalhoInfo}>
            {noticia.autor && (
              <div className={styles.autorInfo}>
                <div className={styles.autorFoto}>
                  <img
                    src={noticia.autor.avatarUrl}
                    alt={`Avatar de ${noticia.autor.nome}`}
                    className={styles.avatar}
                  />
                </div>
                <div className={styles.autorNomeData}>
                  <div className={styles.autorNome}>{noticia.autor.nome}</div>
                  <time className={styles.dataPublicacao}>
                    {new Date(noticia.dataPublicacao).toLocaleDateString(
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
                <span>{noticia.numero} min de leitura</span>
              </div>
            </div>
          </div>

          {/* Conteúdo textual */}
          <div className={styles.conteudoTexto}>
            {noticia.elementos?.map((elemento, index) => {
              if (elemento.tipo === "paragrafo") {
                return (
                  <p
                    key={index}
                    className={styles.paragrafo}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        processarConteudo(elemento.conteudo),
                        {
                          ALLOWED_TAGS: ["strong", "em", "p", "a"],
                          ALLOWED_ATTR: ["class", "href", "target", "rel"],
                          ADD_ATTR: ["class"],
                        }
                      ),
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
            })}
          </div>
        </article>
      </div>
      <Footer></Footer>
    </>
  );
};

export default NoticiaDetalhe;
