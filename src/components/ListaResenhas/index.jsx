import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import FiltroNoticias from "@/components/filtros-noticias-resenhas";
import styles from "./index.module.scss";

function ListaResenhas({ criticas, renderElemento, BannerComponent }) {
  const router = useRouter();
  const filtroInicial = Array.isArray(router.query.filtro)
    ? router.query.filtro[0]
    : router.query.filtro || "";

  const [resenhasFiltradas, setResenhasFiltradas] = useState(criticas || []);

  // sempre que a lista original mudar, reinicia o filtro
  useEffect(() => {
    setResenhasFiltradas(criticas || []);
  }, [criticas]);

  if (!criticas || criticas.length === 0) {
    return <div className={styles.vazio}>Nenhuma resenha encontrada.</div>;
  }

  return (
    <ul className={styles.listaNoticias}>
      {/* título + select de filtro */}
      <div className={styles.tituloFiltros}>
        <li className={styles.icone}>
          <img src="/icones/cameo-resenhas.svg" alt="Ícone resenhas" />
          <h2>Últimas resenhas</h2>
        </li>
        <li className={styles.filtroSelect}>
          <FiltroNoticias
            noticias={criticas}
            onFilter={setResenhasFiltradas}
            filtroInicial={filtroInicial}
          />
        </li>
      </div>

      {resenhasFiltradas.map((critica, idx) => {
        const data = critica.dataPublicacao;
        const date = data?.seconds
          ? new Date(data.seconds * 1000)
          : new Date(data);
        const isDataValida = !isNaN(date.getTime());

        return (
          <React.Fragment key={critica.id}>
            <li className={styles.criticaItem}>
              <Link href={`/resenhas/detalhes/${critica.id}`} passHref>
                <article className={styles.critica} title={critica.titulo}>
                  <div className={styles.boxConteudo}>
                    <div className={styles.conteudo}>
                      {critica.elementos.map((el, i) =>
                        renderElemento(el, i, critica)
                      )}
                    </div>

                    <div className={styles.informacoes}>
                      <div className={styles.cabecalho}>
                        {critica.titulo && (
                          <h2 className={styles.tituloPrincipal}>
                            {critica.titulo}
                          </h2>
                        )}
                        {critica.numero && (
                          <div className={styles.numeroNoticia}>
                            <img
                              src="/icones/relogio.svg"
                              alt="Tempo de leitura"
                            />
                            {critica.numero} min de leitura
                          </div>
                        )}
                      </div>

                      <div className={styles.divisor}></div>

                      {critica.autor && (
                        <div className={styles.cabecalhoInfo}>
                          <div className={styles.autorInfo}>
                            <div className={styles.autorNomeData}>
                              <div className={styles.autorNome}>
                                <div className={styles.ponto}></div>
                                Por {critica.autor.nome}
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

export default ListaResenhas;
