import React from "react";
import CardMateria from "@/components/card-materia";
import styles from "./index.module.scss";

function ListaResenhas({ criticas }) {
  if (!criticas || criticas.length === 0) {
    return <div className={styles.vazio}>Nenhuma resenha encontrada.</div>;
  }

  return (
    <ul className={styles.listaCriticas}>
      <li className={styles.icone}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fcameo-resenhas.svg?alt=media&token=033e5f31-7519-4c59-ae62-7ba6eedcc6d4"
          alt="Ícone resenhas"
        />
        <h2>Resenhas</h2>
      </li>

      {criticas.map((critica) => (
        <li key={critica.id}>
          <CardMateria materia={critica} tipo="resenha" />
        </li>
      ))}
    </ul>
  );
}

export default ListaResenhas;
