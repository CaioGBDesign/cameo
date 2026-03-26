import ListIcon from "@/components/icons/ListIcon";
import styles from "./index.module.scss";

export default function ListaFilmesBlankslate({
  title = "Nenhum filme aqui ainda",
  description = "Adicione filmes a esta lista para começar.",
}) {
  return (
    <div className={styles.wrapper}>
      <ListIcon size={40} color="var(--icon-secondary)" />
      <p className={styles.title}>{title}</p>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
