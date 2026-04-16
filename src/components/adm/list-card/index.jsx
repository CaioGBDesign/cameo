import Button from "@/components/button";
import DocumentIcon02 from "@/components/icons/DocumentIcon02";
import InfoIcon from "@/components/icons/InfoIcon";
import styles from "./index.module.scss";

export function ListCardItem({ icon, date, name }) {
  return (
    <div className={styles.cardItem}>
      {icon}
      <span className={styles.cardItemDate}>{date}</span>
      <span className={styles.cardItemName}>{name}</span>
    </div>
  );
}

export default function ListCard({
  icon,
  titulo,
  tooltip = false,
  placeholder,
  children,
  onAdicionar,
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.titleRow}>
        <div className={styles.titleIcon}>{icon}</div>
        <span className={styles.titulo}>{titulo}</span>
        {tooltip && <InfoIcon size={16} color="var(--icon-secondary)" />}
      </div>

      <div className={styles.card} onClick={onAdicionar}>
        <div className={styles.cardTop}>
          {placeholder && (
            <span className={styles.cardPlaceholder}>{placeholder}</span>
          )}
          <DocumentIcon02 size={24} color="var(--icon-secondary)" />
        </div>
        <div className={styles.cardContent}>{children}</div>
        <div className={styles.cardBottom}>
          <Button
            variant="solid"
            label="Adicionar"
            type="button"
            width="140px"
            color="var(--text-base)"
            bg="var(--bg-base)"
            border="var(--stroke-base)"
            arrowColor="var(--bg-base)"
          />
        </div>
      </div>
    </div>
  );
}
