import styles from "./index.module.scss";

const Elenco = ({ cast }) => {
  if (!cast || cast.length === 0) return null;

  return (
    <div className={styles.elencoContainer}>
      <h2>Elenco</h2>
      <ul className={styles.carrosselElenco}>
        {cast.slice(0, 10).map((ator) => (
          <li key={ator.id} className={styles.ator}>
            <div className={styles.imagemArtista}>
              <img
                src={
                  ator.profile_path
                    ? `https://image.tmdb.org/t/p/w185${ator.profile_path}`
                    : "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fcameo-placeholder-cast.jpg?alt=media&token=f0331d80-cf03-4240-b33c-f90c773c8520"
                }
                alt={ator.name}
              />
            </div>
            <div className={styles.nomePersonagem}>
              <p>{ator.name}</p>
              <span>{ator.character}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Elenco;
