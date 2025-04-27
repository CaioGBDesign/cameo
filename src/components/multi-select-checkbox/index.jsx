import { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";

export default function MultiSelectCheckbox({
  options, // [{ value: string, label: string }]
  selected, // array de valores selecionados
  onChange, // fn(newSelected: string[])
  placeholder, // texto quando nada selecionado
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef();

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleValue = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const displayLabel =
    selected.length > 0
      ? options
          .filter((o) => selected.includes(o.value))
          .map((o) => o.label)
          .join(", ")
      : placeholder;

  return (
    <div className={styles.multiSelect} ref={containerRef}>
      <div
        className={styles.control}
        onClick={() => setOpen((o) => !o)}
        role="button"
      >
        <p>{displayLabel}</p>
        <span className={styles.caret}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div className={styles.options}>
          {options.map((opt) => (
            <label key={opt.value} className={styles.optionInput}>
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggleValue(opt.value)}
              />
              <p>{opt.label}</p>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
