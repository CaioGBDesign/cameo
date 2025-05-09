import React from "react";
import styles from "./index.module.scss";

// Componente para exibir empresas de produção do filme
const ProducaoFilmes = ({ companies }) => {
  if (!Array.isArray(companies) || companies.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Produção</h2>
      <ul className={styles.list}>
        {companies.map((company) => (
          <li key={company.id} className={styles.item}>
            <span className={styles.name}>{company.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ProducaoFilmes;
