import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import FiltroNoticias from "@/components/filtros-noticias-resenhas";
import styles from "./index.module.scss";

function ListaNoticias({ noticias, renderElemento, BannerComponent }) {
  const router = useRouter();
  const filtroInicial = Array.isArray(router.query.filtro)
    ? router.query.filtro[0]
    : router.query.filtro || "";

  const [noticiasFiltradas, setNoticiasFiltradas] = useState(noticias || []);

  // sempre que a lista original mudar, reinicia o filtro
  useEffect(() => {
    setNoticiasFiltradas(noticias || []);
  }, [noticias]);

  if (!noticias || noticias.length === 0) {
    return <div className={styles.vazio}>Nenhuma notícia encontrada.</div>;
  }

  return (
    <ul className={styles.listaNoticias}>
      <div className={styles.tituloFiltros}>
        <li className={styles.icone}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fcameo-noticias.svg?alt=media&token=a9ca0ad7-d684-4e12-a826-5225c7c196d1"
            alt="Ícone notícias"
          />
          <h2>Últimas notícias</h2>
        </li>

        <li className={styles.filtroSelect}>
          <FiltroNoticias
            noticias={noticias}
            onFilter={setNoticiasFiltradas}
            filtroInicial={filtroInicial}
          />
        </li>
      </div>

      {noticiasFiltradas.map((noticia, idx) => {
        const data = noticia.dataPublicacao;
        const date = data?.seconds
          ? new Date(data.seconds * 1000)
          : new Date(data);
        const isDataValida = !isNaN(date.getTime());

        return (
          <React.Fragment key={noticia.id}>
            <li className={styles.noticiaItem}>
              <Link href={`/noticias/detalhes/${noticia.id}`} passHref>
                <article className={styles.noticia} title={noticia.titulo}>
                  <div className={styles.boxConteudo}>
                    <div className={styles.conteudo}>
                      {noticia.elementos.map((el, i) =>
                        renderElemento(el, i, noticia)
                      )}
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
                              src="/https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Frelogio.svg?alt=media&token=5ca19f7c-5421-408d-ae41-15b351db2c38"
                              alt="Tempo de leitura"
                            />
                            {noticia.numero} min de leitura
                          </div>
                        )}
                      </div>

                      <div className={styles.divisor}></div>

                      {noticia.autor && (
                        <div className={styles.cabecalhoInfo}>
                          <div className={styles.autorInfo}>
                            <div className={styles.autorNomeData}>
                              <div className={styles.autorNome}>
                                <div className={styles.ponto}></div>
                                Por {noticia.autor.nome}
                              </div>

                              {isDataValida && (
                                <time
                                  className={styles.dataPublicacao}
                                  dateTime={date.toISOString()}
                                >
                                  {date.toLocaleDateString("pt-BR", {
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
            </li>

            {idx === 3 && BannerComponent && (
              <li className={styles.bannerContainer}>
                <BannerComponent />
              </li>
            )}
          </React.Fragment>
        );
      })}
    </ul>
  );
}

export default ListaNoticias;
