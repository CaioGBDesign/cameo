// components/detalhesfilmes/direcao.jsx
import React from "react";
import Image from "next/image";
import styles from "./index.module.scss";

const Direcao = ({ crew }) => {
  // filtra apenas quem tem job === "Director"
  const directors = Array.isArray(crew)
    ? crew.filter((member) => member.job === "Director")
    : [];

  if (directors.length === 0) return null;

  return (
    <section className={styles.direcaoSection}>
      <h2 className={styles.heading}>Direção</h2>
      <ul className={styles.list}>
        {directors.map((dir) => (
          <li key={dir.credit_id} className={styles.card}>
            <div className={styles.imageWrapper}>
              {dir.profile_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w185${dir.profile_path}`}
                  alt={dir.name}
                  width={185}
                  height={185}
                  className={styles.image}
                  priority={false}
                />
              ) : (
                <div className={styles.placeholder}>
                  <Image
                    src={
                      "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fcameo-placeholder-cast.jpg?alt=media&token=f0331d80-cf03-4240-b33c-f90c773c8520"
                    }
                    alt={dir.name}
                    width={185}
                    height={185}
                    className={styles.image}
                    priority={false}
                  />
                </div>
              )}
            </div>
            <p className={styles.name}>{dir.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Direcao;
