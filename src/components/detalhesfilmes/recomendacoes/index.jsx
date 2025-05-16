// components/detalhesfilmes/recomendacoes.jsx
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "./index.module.scss";

const Recomendacoes = ({ movies }) => {
  const router = useRouter();
  if (!Array.isArray(movies) || movies.length === 0) return null;

  return (
    <section className={styles.relatedSection}>
      <h2 className={styles.heading}>Filmes Relacionados</h2>
      <div className={styles.carrossel}>
        <ul className={styles.list}>
          {movies.map((movie) => (
            <li key={movie.id} className={styles.card}>
              <div
                className={styles.linkWrapper}
                onClick={() =>
                  router.push({
                    pathname: router.pathname,
                    query: { id: movie.id },
                  })
                }
                role="button"
                tabIndex={0}
                onKeyPress={() =>
                  router.push({
                    pathname: router.pathname,
                    query: { id: movie.id },
                  })
                }
              >
                {movie.poster_path ? (
                  <div className={styles.imagemRecomendacao}>
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                      alt={movie.title}
                      width={185}
                      height={278}
                      className={styles.image}
                    />
                  </div>
                ) : (
                  <div className={styles.placeholder}>Sem poster</div>
                )}
                <p className={styles.title}>{movie.title}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Recomendacoes;
