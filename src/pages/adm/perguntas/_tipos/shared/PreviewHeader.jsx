import styles from "../../criar/index.module.scss";

export default function PreviewHeader({
  titulo,
  subtitulo,
  cronometroVisivel,
  cronometroRegressivoVisivel,
  cronometroTempo,
}) {
  const mostrarTimer = cronometroVisivel || cronometroRegressivoVisivel;
  const tempoDisplay = cronometroRegressivoVisivel ? cronometroTempo : "00:00:00";

  if (!mostrarTimer) {
    return (
      <div className={styles.previewHeader}>
        {titulo ? (
          <h2 className={styles.previewTitle}>{titulo}</h2>
        ) : (
          <h2 className={`${styles.previewTitle} ${styles.previewPlaceholder}`}>
            Título da pergunta
          </h2>
        )}
        {subtitulo && <p className={styles.previewSubtitle}>{subtitulo}</p>}
      </div>
    );
  }

  return (
    <div className={`${styles.previewHeader} ${styles.previewHeaderComTimer}`}>
      <span className={styles.previewTimerDisplay}>{tempoDisplay}</span>
      <div className={styles.previewHeaderTextos}>
        {titulo ? (
          <h2 className={styles.previewTitle}>{titulo}</h2>
        ) : (
          <h2 className={`${styles.previewTitle} ${styles.previewPlaceholder}`}>
            Título da pergunta
          </h2>
        )}
        {subtitulo && <p className={styles.previewSubtitle}>{subtitulo}</p>}
      </div>
    </div>
  );
}
