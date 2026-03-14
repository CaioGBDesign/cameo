import StarRatingIcon from "@/components/icons/StarRatingIcon";
import styles from "./index.module.scss";

const Estrelas = ({ estrelas, starWidth = "16px" }) => {
  const totalStars = 5;
  const filledStars = parseInt(estrelas) || 0;
  const size = parseInt(starWidth) || 16;

  return (
    <div className={styles.notasFilmes}>
      {Array.from({ length: totalStars }, (_, i) => (
        <StarRatingIcon key={i} size={size} filled={i < filledStars} />
      ))}
    </div>
  );
};

export default Estrelas;
