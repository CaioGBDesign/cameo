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
                <img key={i} src="/icones/estrela-preenchida.svg" style={{ width: starWidth }} />
            );
        }
        return stars;
    };

    // Função para renderizar as estrelas vazias
    const renderEmptyStars = () => {
        const stars = [];
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <img key={i} src="/icones/estrela-vazia.svg" style={{ width: starWidth }} />
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