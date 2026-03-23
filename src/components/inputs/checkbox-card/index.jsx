import Checkbox from "@/components/inputs/checkbox";
import styles from "./index.module.scss";

const CheckboxCard = ({
  variant = "card",
  label,
  sublabel,
  checked = false,
  onChange,
  id,
  icon,
}) => {
  const cardClass = [
    styles.wrapper,
    styles[variant],
    checked ? styles.checked : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={cardClass} htmlFor={id}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        {sublabel && <span className={styles.sublabel}>{sublabel}</span>}
      </div>
      <Checkbox id={id} checked={checked} onChange={onChange} />
    </label>
  );
};

export default CheckboxCard;
