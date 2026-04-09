import InfoIcon from "@/components/icons/InfoIcon";
import styles from "./index.module.scss";

const TextInput = ({
  id,
  name,
  label,
  tooltip,
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
  inputMode,
  error = false,
}) => {
  return (
    <div className={styles.wrapper} style={width ? { width } : undefined}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {tooltip && (
            <span className={styles.tooltipWrapper}>
              <InfoIcon size={13} />
              <span className={styles.tooltip}>{tooltip}</span>
            </span>
          )}
        </label>
      )}
      <div className={`${styles.inputRow} ${error ? styles.inputRowError : ""}`}>
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
          inputMode={inputMode}
          className={styles.field}
        />
        {suffix && <div className={styles.suffix}>{suffix}</div>}
      </div>
    </div>
  );
};

export default TextInput;
