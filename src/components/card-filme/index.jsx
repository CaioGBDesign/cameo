import Image from "next/image";
import { useAuth } from "@/contexts/auth";
import BookmarkIcon from "@/components/icons/BookmarkIcon";
import Estrelas from "@/components/estrelas";
import styles from "./index.module.scss";

const CardFilme = ({ movie, variant = "nota", onClick, showFavorito = true, showStars = true }) => {
  const { user, salvarFilme, removerFilme } = useAuth();

  if (!movie) return null;

  const movieId = String(movie.id);
  const isFav = (user?.favoritos || []).includes(movieId);
  const userRating = user?.visto?.[movieId]?.nota > 0 ? user.visto[movieId].nota : null;

  const handleFav = (e) => {
    e.stopPropagation();
    isFav ? removerFilme(movieId) : salvarFilme(movieId);
  };

  return (
    <div
      className={`${styles.card} ${styles[variant]}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={onClick}
    >
      {movie.poster_path ? (
        <Image
          unoptimized
          src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
          alt={movie.title}
          fill
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div className={styles.placeholder} />
      )}

      <div className={styles.overlay}>
        {variant !== "mini" && showFavorito && (
          <div className={styles.top}>
            <button className={styles.favoritos} onClick={handleFav}>
              <BookmarkIcon size={18} color={isFav ? "var(--primitive-amarelo-02)" : "white"} filled={isFav} />
            </button>
          </div>
        )}

        <div className={styles.bottom}>
          {variant !== "mini" && (
            <span className={styles.detalhes}>Detalhes</span>
          )}
          {variant === "titulo" && movie.title && (
            <p className={styles.movieTitle}>{movie.title}</p>
          )}
          {variant !== "titulo" && showStars && (
            <div className={styles.stars}>
              <Estrelas estrelas={userRating || 0} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardFilme;
