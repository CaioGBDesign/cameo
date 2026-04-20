import styles from "./index.module.scss";

export default function DubladorBg({ backdrop, poster, alt }) {
  if (!backdrop && !poster) return null;

  return (
    <>
      {backdrop && (
        <div className={styles.wrapperDesktop}>
          <div className={styles.gradienteEsquerda} />
          <div className={styles.gradienteTopo} />
          <div className={styles.gradienteBase} />
          <img src={`https://image.tmdb.org/t/p/w1280/${backdrop}`} alt={alt || ""} className={styles.imagem} />
        </div>
      )}
      {poster && (
        <div className={styles.wrapperMobile}>
          <div className={styles.gradienteTopo} />
          <div className={styles.gradienteBase} />
          <img src={`https://image.tmdb.org/t/p/w342/${poster}`} alt={alt || ""} className={styles.imagem} />
        </div>
      )}
    </>
  );
}