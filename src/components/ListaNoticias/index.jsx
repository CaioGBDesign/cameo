import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./index.module.scss";

function ListaNoticias({ noticias, renderElemento, BannerComponent }) {
  const router = useRouter();

  if (!noticias || noticias.length === 0) {
    return <div className={styles.vazio}>Nenhuma notícia encontrada.</div>;
  }

  return (
    <ul className={styles.listaNoticias}>
      <li className={styles.icone}>
        <img src="/icones/cameo-noticias.svg" alt="Ícone notícias" />
        <h2>Últimas notícias</h2>
      </li>

      {noticias.map((noticia, idx) => {
        // Verifica e converte a data para um formato válido (se for timestamp do Firebase)
        const dataPublicacao = noticia.dataPublicacao
          ? new Date(noticia.dataPublicacao.seconds * 1000) // Para timestamp do Firebase (se for esse o caso)
          : new Date(noticia.dataPublicacao); // Caso já seja uma data válida

        const isDataValida = !isNaN(dataPublicacao.getTime());

        return (
          <li key={noticia.id} className={styles.noticiaItem}>
            {/* Usa Link para SEO e acessibilidade */}

            <Link href={`/noticias/detalhes/${noticia.id}`} passHref>
              <article className={styles.noticia}>
                <div className={styles.boxConteudo}>
                  <div className={styles.conteudo}>
                    {noticia.elementos.map((el, i) => renderElemento(el, i))}
                  </div>

                  <div className={styles.informacoes}>
                    <div className={styles.cabecalho}>
                      {noticia.titulo && (
                        <h2 className={styles.tituloPrincipal}>
                          {noticia.titulo}
                        </h2>
                      )}
                      {noticia.numero && (
                        <div className={styles.numeroNoticia}>
                          <img
                            src="/icones/relogio.svg"
                            alt="Tempo de leitura"
                          />
                          {noticia.numero} min de leitura
                        </div>
                      )}
                    </div>

                    <div className={styles.divisor}></div>

                    {/* Informações do autor e metadados */}
                    {noticia.autor && (
                      <div className={styles.cabecalhoInfo}>
                        <div className={styles.autorInfo}>
                          <div className={styles.autorNomeData}>
                            <div className={styles.autorNome}>
                              <div className={styles.ponto}></div>
                              {"Por " + noticia.autor.nome}
                            </div>

                            {isDataValida && (
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
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Link>

            {/* Insere banner após a quarta notícia (índice 3) */}
            {idx === 3 && BannerComponent && (
              <div className={styles.bannerContainer}>
                <BannerComponent />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default ListaNoticias;
