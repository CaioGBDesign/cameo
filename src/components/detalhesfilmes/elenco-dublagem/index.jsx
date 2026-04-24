import { forwardRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { toSlug } from "@/utils/slug";
import styles from "./index.module.scss";

const placeholder =
  "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fcameo-placeholder-cast.jpg?alt=media&token=f0331d80-cf03-4240-b33c-f90c773c8520";

const ElencoDublagem = forwardRef(({ items = [], wrap = false }, ref) => {
  if (!items || items.length === 0) return null;

  return (
    <div className={styles.elencoContainer}>
      <div ref={ref} className={wrap ? undefined : styles.scrollWrapper}>
        <ul
          className={`${styles.carrosselElenco} ${wrap ? styles.carrosselWrap : ""}`}
        >
          {items.map((pessoa, i) => (
            <li
              key={`${pessoa.idDublador || "unk"}_${i}`}
              className={styles.atorContent}
            >
              <Link
                href={`/dubladores/${toSlug(pessoa.nomeArtistico || pessoa.idDublador || "")}`}
                className={styles.ator}
              >
                <div className={styles.imagemArtista}>
                  <span className={styles.detalhes}>Detalhes</span>
                  <Image
                    unoptimized
                    src={pessoa.imagemUrl || placeholder}
                    alt={
                      pessoa.nomeArtistico || pessoa.idDublador || "Dublador"
                    }
                    width={50}
                    height={50}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.nomePersonagem}>
                  <p>{pessoa.nomeArtistico || pessoa.idDublador}</p>
                  {pessoa.personagem && <span>{pessoa.personagem}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
});

export default ElencoDublagem;
