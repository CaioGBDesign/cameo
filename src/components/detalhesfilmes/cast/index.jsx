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
                    : "/background/cameo-placeholder-cast.jpg"
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
