import styles from "./index.module.scss";

const Dubladores = ({ NomeDublador, fotoDublador, Personagem }) => {
  return (
    <div className={styles.cardsDubladores}>
      <div className={styles.contDubladores}>
        <div className={styles.dublador}>
          <img src={fotoDublador} alt="Nome do usuario" />
        </div>

        <div className={styles.nomePersonagem}>
          <p>{NomeDublador}</p>
          <span>{Personagem}</span>
        </div>
      </div>
    </div>
  );
};

export default Dubladores;
