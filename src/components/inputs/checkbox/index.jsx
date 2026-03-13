import CheckIcon from "@/components/icons/CheckIcon";
import styles from "./index.module.scss";

const Checkbox = ({ label, checked = false, onChange, id }) => {
  return (
    <label className={styles.wrapper} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={onChange}
      />
      <span className={styles.box}>
        {checked && <CheckIcon size={12} color="var(--icon-base)" />}
      </span>
      {label && <span className={styles.label} onClick={(e) => e.stopPropagation()}>{label}</span>}
    </label>
  );
};

export default Checkbox;
