import styles from "./index.module.scss";

export default function Badge({ variant = "soft", label, bg }) {
  return (
    <span
      className={`${styles.badge} ${styles[variant]}`}
      style={bg ? { background: `var(${bg})` } : undefined}
    >
      {label}
    </span>
  );
}
