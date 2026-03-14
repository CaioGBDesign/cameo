import React, { useState } from "react";
import styles from "./index.module.scss";

export default function SelectInput({
  name,
  label,
  options,
  value: controlledValue,
  onValue,
  required = false,
  disabled = false,
}) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e) => {
    const newVal = e.target.value;
    if (!isControlled) setInternalValue(newVal);
    if (onValue) onValue(newVal);
  };

  return (
    <div className={styles.selectWrapper}>
      <select
        id={name}
        name={name}
        className={styles.selectInput}
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
