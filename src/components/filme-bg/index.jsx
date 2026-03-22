import Image from "next/image";
import styles from "./index.module.scss";

export default function FilmeBg({ src, alt }) {
  if (!src) return null;

  return (
    <div className={styles.wrapper}>
      <div className={styles.gradienteEsquerda} />
      <div className={styles.gradienteTopo} />
      <div className={styles.gradienteBase} />
      <Image
        src={src}
        alt={alt || ""}
        width={1280}
        height={720}
        quality={60}
        priority
        className={styles.imagem}
        unoptimized
      />
    </div>
  );
}
