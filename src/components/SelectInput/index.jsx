import React, { useState } from "react";
import styles from "./index.module.scss";

export default function SelectInput({
  name,
  label,
  options,
  onValue, // callback para retornar valor ao pai
  required = false,
  disabled = false,
}) {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const newVal = e.target.value;
    setValue(newVal);
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
