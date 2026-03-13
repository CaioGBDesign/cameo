import Checkbox from "@/components/inputs/checkbox";
import styles from "./index.module.scss";

const CheckboxCard = ({
  variant = "card",
  label,
  sublabel,
  checked = false,
  onChange,
  id,
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
      <Checkbox id={id} checked={checked} onChange={onChange} />
      <div className={styles.text}>
        <span className={styles.label}>{label}</span>
        {sublabel && <span className={styles.sublabel}>{sublabel}</span>}
      </div>
    </label>
  );
};

export default CheckboxCard;
