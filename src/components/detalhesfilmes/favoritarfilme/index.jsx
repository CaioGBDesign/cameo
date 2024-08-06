import { useEffect, useState } from "react";
import styles from "./index.module.scss";

const FavoritarFilme = ({
  filmeId,
  salvarFilme,
  removerFilme,
  usuarioFavoritos,
}) => {
  const [favoritado, setFavoritado] = useState(false);

  useEffect(() => {
    // Verifica se o filme está na lista de favoritos do usuário
    if (usuarioFavoritos.includes(filmeId)) {
      setFavoritado(true);
    } else {
      setFavoritado(false);
    }
  }, [usuarioFavoritos, filmeId]);

  const handleClick = (event) => {
    event.preventDefault(); // Evita comportamento padrão

    // Se o filme já estiver favoritado, remove da lista
    if (favoritado) {
      removerFilme(filmeId);
    } else {
      salvarFilme(filmeId); // Caso contrário, adiciona aos favoritos
    }
  };

  return (
    <div className={styles.favoritarFilme}>
      <button onClick={handleClick}>
        {favoritado ? (
          <img src="icones/favoritos-marcados.svg" alt="Favorito" />
        ) : (
          <img src="icones/favoritos-desmarcados.svg" alt="Não favorito" />
        )}
      </button>
    </div>
  );
};

export default FavoritarFilme;
