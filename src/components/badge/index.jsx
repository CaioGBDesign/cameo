import styles from "./index.module.scss";

export default function Badge({ variant = "soft", label, bg, borda, color, width }) {
  const style = {};
  if (bg) style.background = `var(${bg})`;
  if (borda) style.borderColor = `var(${borda})`;
  if (color) style.color = `var(${color})`;
  if (width) style.width = width;

  return (
    <span
      className={`${styles.badge} ${styles[variant]}`}
      style={Object.keys(style).length ? style : undefined}
    >
      {label}
    </span>
  );
}
