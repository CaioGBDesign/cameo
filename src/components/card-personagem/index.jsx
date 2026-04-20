import styles from "./index.module.scss";

export default function CardPersonagem({ posterPath, nomeFilme, personagem, onClick }) {
  return (
    <div className={styles.card} onClick={onClick} role="button" tabIndex={0} onKeyDown={onClick}>
      {posterPath ? (
        <img
          src={`https://image.tmdb.org/t/p/w342${posterPath}`}
          alt={nomeFilme}
          className={styles.poster}
        />
      ) : (
        <div className={styles.placeholder} />
      )}

      <div className={styles.overlay}>
        <span className={styles.detalhes}>Detalhes</span>
        <div className={styles.bottom}>
          {personagem && <p className={styles.personagem}>{personagem}</p>}
          {nomeFilme && <p className={styles.filme}>{nomeFilme}</p>}
        </div>
      </div>
    </div>
  );
}