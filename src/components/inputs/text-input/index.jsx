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
  required = false,
  prefix,
  suffix,
}) => {
  return (
    <div className={styles.wrapper} style={width ? { width } : undefined}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputRow}>
        {prefix && <div className={styles.prefix}>{prefix}</div>}
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
          required={required}
          className={styles.field}
        />
        {suffix && <div className={styles.suffix}>{suffix}</div>}
      </div>
    </div>
  );
};

export default TextInput;
