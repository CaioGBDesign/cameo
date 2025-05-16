// src/components/listaFilmes/index.jsx
import React, { useState, Suspense, useCallback } from "react";
import styles from "./index.module.scss";
import Loading from "@/components/loading";
import Miniaturafilmes from "@/components/miniaturafilmes";

const ListaPageFilmes = ({
  listagemDeFilmes,
  loading,
  mostrarBotaoFechar,
  handleExcluirFilme,
  openModal,
}) => {
  // quantidade inicial de filmes exibidos
  const INITIAL_COUNT = 20;
  const STEP = 20;

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  // Memoiza slice de filmes visíveis
  const visibleFilmes = React.useMemo(
    () => listagemDeFilmes.slice(0, visibleCount),
    [listagemDeFilmes, visibleCount]
  );

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + STEP, listagemDeFilmes.length));
  }, [listagemDeFilmes.length]);

  return (
    <div className={styles.contListaFilmes}>
      <div className={styles.listaFilmes}>
        {loading ? (
          <div className={styles.loading}>
            <p>Carregando...</p>
          </div>
        ) : (
          visibleFilmes.map((filme) => (
            <Suspense key={filme.id} fallback={<Loading />}>
              <Miniaturafilmes
                capaminiatura={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                titulofilme={filme.title}
                mostrarEstrelas={true}
                mostrarBotaoFechar={mostrarBotaoFechar}
                excluirFilme={() => handleExcluirFilme(String(filme.id))}
                avaliacao={filme.avaliacao.nota}
                onClick={() => openModal(filme)}
              />
            </Suspense>
          ))
        )}
      </div>

      {/* botão Ver mais */}
      {!loading && visibleCount < listagemDeFilmes.length && (
        <div className={styles.loadMoreWrapper}>
          <button className={styles.loadMoreButton} onClick={handleLoadMore}>
            <img src="icones/add.svg" alt="Ver mais filmes" />
            Ver mais filmes
          </button>
        </div>
      )}
    </div>
  );
};

export default ListaPageFilmes;
