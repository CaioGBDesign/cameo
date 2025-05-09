import React from "react";
import Image from "next/image";
import styles from "./index.module.scss";
import Link from "next/link";

// Recebe array de filmes relacionados
const Recomendacoes = ({ movies }) => {
  if (!Array.isArray(movies) || movies.length === 0) return null;

  return (
    <section className={styles.relatedSection}>
      <h2 className={styles.heading}>Filmes Relacionados</h2>
      <div className={styles.carrossel}>
        <ul className={styles.list}>
          {movies.map((movie) => (
            <li key={movie.id} className={styles.card}>
              <Link href={`/filme/${movie.id}`}>
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
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Recomendacoes;
