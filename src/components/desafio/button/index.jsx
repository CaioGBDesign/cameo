import styles from "./index.module.scss";

export default function DesafioButton({
  variant = "solid",
  label,
  icon,
  width,
  onClick,
  type = "button",
  disabled = false,
  duration = 5000,
}) {
  const style = {
    ...(width ? { width } : {}),
    ...(variant === "loading" ? { "--loading-duration": `${duration}ms` } : {}),
  };

  return (
    <button
      type={type}
      className={`${styles.btn} ${styles[variant]}`}
      style={style}
      onClick={variant === "loading" ? undefined : onClick}
      disabled={disabled}
    >
      {variant === "loading" && <span className={styles.fillBar} />}
      {icon && <span className={styles.icon}>{icon}</span>}
      {label && <span className={styles.label}>{label}</span>}
    </button>
  );
}
