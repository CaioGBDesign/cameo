import { forwardRef } from "react";
import Image from "next/image";
import styles from "./index.module.scss";

const placeholder =
  "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fcameo-placeholder-cast.jpg?alt=media&token=f0331d80-cf03-4240-b33c-f90c773c8520";

const Elenco = forwardRef(({ items = [], showCharacter = true }, ref) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.elencoContainer}>
      <div ref={ref} className={styles.scrollWrapper}>
      <ul className={styles.carrosselElenco}>
        {items.map((pessoa) => (
          <li
            key={pessoa.credit_id || pessoa.id}
            className={styles.atorContent}
          >
            <div className={styles.ator}>
              <div className={styles.imagemArtista}>
                <Image
                  src={
                    pessoa.profile_path
                      ? `https://image.tmdb.org/t/p/w185${pessoa.profile_path}`
                      : placeholder
                  }
                  alt={pessoa.name}
                  width={50}
                  height={50}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.nomePersonagem}>
                <p>{pessoa.name}</p>
                {showCharacter && pessoa.character && (
                  <span>{pessoa.character}</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
});

export default Elenco;
