import styles from "./index.module.scss";

export default function Badge({ variant = "soft", label }) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {label}
    </span>
  );
}
