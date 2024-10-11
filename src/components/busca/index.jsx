import styles from "./index.module.scss";
import { useState } from "react";

const Search = ({ placeholder, onSearch }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    onSearch(value); // Chama a função de busca
  };

  return (
    <div className={styles.search}>
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange} // Atualiza o valor do input
        name="search"
      />
    </div>
  );
};

export default Search;
