import styles from "./index.module.scss";

const Search = () => {
    return (
        <div className={styles.search}>
            <input type="text" placeholder="Buscar filmes" name="search" />
        </div>
    );
}

export default Search;