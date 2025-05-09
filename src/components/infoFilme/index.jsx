// components/InfoFilme/index.jsx
import React from "react";
import styles from "./index.module.scss";

// Utiliza a API Intl.DisplayNames para traduzir códigos de país para português
const regionNames = new Intl.DisplayNames(["pt"], { type: "region" });

const InfoFilmeItem = ({ label, value }) => (
  <div className={styles.item}>
    <dt className={styles.label}>{label}</dt>
    <dd className={styles.value}>{value}</dd>
  </div>
);

const InfoFilme = ({ budget, revenue, production_countries }) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const countriesList =
    production_countries && production_countries.length > 0
      ? production_countries.map((c) => regionNames.of(c.iso_3166_1)).join(", ")
      : "Desconhecido";

  return (
    <dl className={styles.container}>
      <InfoFilmeItem label="Orçamento" value={formatCurrency(budget)} />
      <InfoFilmeItem label="Bilheteria" value={formatCurrency(revenue)} />
      <InfoFilmeItem label="País de origem" value={countriesList} />
    </dl>
  );
};

export default InfoFilme;
