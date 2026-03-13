import styles from "./index.module.scss";
import TicketIcon from "@/components/icons/TicketIcon";
import GlobeIcon from "@/components/icons/GlobeIcon";
import MoneyBagIcon from "@/components/icons/MoneyBagIcon";

const regionNames = new Intl.DisplayNames(["pt"], { type: "region" });

const DetalheItem = ({ icon, label, value }) => (
  <div className={styles.item}>
    <div className={styles.icon}>{icon}</div>
    <div className={styles.texts}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  </div>
);

const InfoFilme = ({ release_date, budget, revenue, production_countries }) => {
  const formatCurrency = (amount) =>
    amount
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "USD" }).format(amount)
      : "Desconhecido";

  const formatDate = (date) =>
    date
      ? new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(date + "T00:00:00"))
      : "Desconhecido";

  const countriesList =
    production_countries?.length > 0
      ? production_countries.map((c) => regionNames.of(c.iso_3166_1)).join(", ")
      : "Desconhecido";

  return (
    <div className={styles.container}>
      <DetalheItem
        icon={<TicketIcon size={24} color="var(--text-base)" />}
        label="Lançamento"
        value={formatDate(release_date)}
      />
      <DetalheItem
        icon={<GlobeIcon size={24} color="var(--text-base)" />}
        label="País de origem"
        value={countriesList}
      />
      <DetalheItem
        icon={<MoneyBagIcon size={24} color="var(--text-base)" />}
        label="Bilheteria"
        value={formatCurrency(revenue)}
      />
      <DetalheItem
        icon={<MoneyBagIcon size={24} color="var(--text-base)" />}
        label="Orçamento"
        value={formatCurrency(budget)}
      />
    </div>
  );
};

export default InfoFilme;
