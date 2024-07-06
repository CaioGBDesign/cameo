import styles from "./index.module.scss";

const FavoritarFilme = () => {
  return (
    <div className={styles.favoritarFilme}>
      <button>
        <img src="icones/favoritos-desmarcados.svg" />
      </button>
    </div>
  );
};

export default FavoritarFilme;
