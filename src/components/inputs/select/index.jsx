import { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";

const Select = ({ label, options = [], value, onChange, placeholder, variant = "default" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  const handleSelect = (opt) => {
    onChange({ target: { value: opt.value } });
    setOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={ref}>
      {label && <label className={styles.label}>{label}</label>}

      <button
        type="button"
        className={`${styles.trigger} ${styles[variant]} ${open ? styles.open : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selected?.label ?? placeholder}</span>
        <ChevronDownIcon
          size={16}
          color="var(--text-sub)"
          className={styles.chevron}
        />
      </button>

      {open && (
        <ul className={styles.dropdown}>
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`${styles.option} ${opt.value === value ? styles.selected : ""}`}
              onClick={() => handleSelect(opt)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Select;
