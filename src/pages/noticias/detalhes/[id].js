// pages/noticias/[id].js
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
        <title>Cameo - Notícia</title>
        <meta
          name="description"
          content="Notícias quentes do cinema, spoilers dos bastidores e lançamentos imperdíveis! Na Cameo.fun, você cria listas personalizadas, debate teorias e celebra filmes com a comunidade cinéfila mais animada."
        />
      </Head>
      <div className={styles.container}>
        <article className={styles.noticiaCompleta}>
          {/* Imagem principal */}
          {noticia.elementos?.find((el) => el.tipo === "imagem") && (
            <div className={styles.imagemNoticia}>
              <div className={styles.tagNoticia}>
                <span>Notícia</span>
              </div>
              <img
                src={
                  noticia.elementos.find((el) => el.tipo === "imagem").conteudo
                }
                alt="Imagem da notícia"
                className={styles.imagemDestaque}
              />
            </div>
          )}

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
        </article>
      </div>
      <FooterB></FooterB>
    </>
  );
};

export default NoticiaDetalhe;
