import styles from "./index.module.scss";

const Avaliacao = ({ avaliador }) => {
  return (
    <div className={styles.avaliacao}>
      <div className={styles.tituloAvaliacao}>
        <h3>Avaliação •</h3>
        <p>{avaliador}</p>
      </div>

      <div className={styles.avaliacaoCompleta}>
        <p>
          Super Mario Bros o filme é brilhante para quem é fã, por ser repleto
          de referências aos games clássicos. O filme é extremamente lindo, cada
          detalhe é uma nova pizza visual, mas infelizmente não passa disso.
          Para quem não é fã, essa é somente mais uma animação, cheia de eventos
          com pouca explicação. Mesmo para quem conhece os games é difícil
          absorver todas as referências, pois são exibidas com intervalos
          curtíssimos de tempo e sem preocupação com o impacto que terá sobre o
          filme. Super Mario Bros é um filme divertido e irá entreter as
          crianças, mas não espere por nada tão grandioso quanto a série de
          jogos.
        </p>
      </div>
    </div>
  );
};

export default Avaliacao;
