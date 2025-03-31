import styles from "./index.module.scss";

const FilmesLista = ({ filmes, titulo, limiteExibicao }) => {
  return (
    <div className={styles.listaFilmes}>
      <h4>{titulo}</h4>
      <div className={styles.listaContainer}>
        {filmes.slice(0, limiteExibicao).map((filme) => (
          <div key={filme.id} className={styles.itemFilme}>
            <span>{filme.title}</span>
            <span>{new Date(filme.timestamp).toLocaleDateString()}</span>
          </div>
        ))}
        {filmes.length > limiteExibicao && (
          <div className={styles.maisFilmes}>
            + {filmes.length - limiteExibicao} filmes...
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmesLista;
