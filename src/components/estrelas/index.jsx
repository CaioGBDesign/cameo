import styles from "./index.module.scss";

const Estrelas = ({ estrelas, starWidth }) => {
  const totalStars = 5;
  const filledStars = parseInt(estrelas); // Converte para número inteiro
  const emptyStars = totalStars - filledStars;

  // Função para renderizar as estrelas preenchidas
  const renderFilledStars = () => {
    const stars = [];
    for (let i = 0; i < filledStars; i++) {
      stars.push(
        <img
          key={i}
          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrela-preenchida.svg?alt=media&token=d59fbabb-c1bf-498f-adad-8a9dc4a88062"
          style={{ width: starWidth }}
          alt="nota"
        />
      );
    }
    return stars;
  };

  // Função para renderizar as estrelas vazias
  const renderEmptyStars = () => {
    const stars = [];
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <img
          key={i}
          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrela-vazia.svg?alt=media&token=a3d23b07-dd81-4729-bb4f-d73efb72feed"
          style={{ width: starWidth }}
          alt="nota"
        />
      );
    }
    return stars;
  };

  return (
    <div className={styles.notasFilmes}>
      {renderFilledStars()}
      {renderEmptyStars()}
    </div>
  );
};

export default Estrelas;
