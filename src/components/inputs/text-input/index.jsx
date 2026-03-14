import styles from "./index.module.scss";

const TextInput = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  min,
  max,
  width,
  disabled = false,
}) => {
  return (
    <div className={styles.wrapper} style={width ? { width } : undefined}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        disabled={disabled}
        className={styles.field}
      />
    </div>
  );
};

export default TextInput;
