import styles from "./index.module.scss";

export default function BoxPatente({ imagemSrc, nome, tema }) {
  return (
    <div className={styles.box}>
      <div className={styles.imagem}>
        <img src={imagemSrc} alt={nome ?? "Patente"} />
      </div>

      <div className={styles.patenteTema}>
        {nome && <p className={styles.nome}>{nome}</p>}
        {tema && <span className={styles.tema}>{tema}</span>}
      </div>
    </div>
  );
}
