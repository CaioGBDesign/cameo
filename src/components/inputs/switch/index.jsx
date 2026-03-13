import styles from "./index.module.scss";

export default function Switch({ id, checked = false, onChange }) {
  return (
    <label className={styles.wrapper} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className={styles.input}
      />
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
    </label>
  );
}
