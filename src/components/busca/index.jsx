import styles from "./index.module.scss";

const Search = ({ placeholder }) => {
  return (
    <div className={styles.search}>
      <input type="text" placeholder={placeholder} name="search" />
    </div>
  );
};

export default Search;
