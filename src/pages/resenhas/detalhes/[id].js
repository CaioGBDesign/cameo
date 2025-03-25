// pages/criticas/[id].js
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

const CriticaDetalhe = () => {
  const router = useRouter();
  const { id } = router.query;
  const [critica, setCritica] = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchCritica = async () => {
      try {
        const docRef = doc(db, "criticas", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          // Converter timestamp do Firestore para Date
          const criticaData = {
            ...data,
            dataPublicacao: data.dataPublicacao?.toDate(),
          };
          setCritica(criticaData);
        } else {
          console.log("Documento não encontrado!");
          router.push("/criticas");
        }
      } catch (error) {
        console.error("Erro ao buscar notícia:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCritica();
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
        <title>Cameo - Resenha</title>
        <meta
          name="description"
          content="Críticas quentes do cinema, spoilers dos bastidores e lançamentos imperdíveis! Na Cameo.fun, você cria listas personalizadas, debate teorias e celebra filmes com a comunidade cinéfila mais animada."
        />
      </Head>
      <div className={styles.container}>
        <article className={styles.criticaCompleta}>
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
            <h3>Avaliação Cameo</h3>
            {/* Classificação em estrelas */}
            {critica.classificacao !== undefined && (
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
            )}
          </div>
        </article>
      </div>
      <FooterB></FooterB>
    </>
  );
};

export default CriticaDetalhe;
