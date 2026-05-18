import styles from "./index.module.scss";

export default function DesafioButton({
  variant = "solid",
  label,
  icon,
  width,
  onClick,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]}`}
      style={width ? { width } : undefined}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {label && <span className={styles.label}>{label}</span>}
    </button>
  );
}
