import { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";

const DROPDOWN_HEIGHT_ESTIMATE = 220;

const Select = ({ label, options = [], value, onChange, placeholder, variant = "default", width, forceUpward = false, error = false }) => {
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const ref = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((opt) => opt.value === value);

  const handleToggle = () => {
    if (!open && triggerRef.current) {
      if (forceUpward) {
        setOpenUpward(true);
      } else {
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setOpenUpward(spaceBelow < DROPDOWN_HEIGHT_ESTIMATE);
      }
    }
    setOpen((prev) => !prev);
  };

  const handleSelect = (opt) => {
    onChange({ target: { value: opt.value } });
    setOpen(false);
  };

  return (
    <div className={styles.wrapper} ref={ref} style={width ? { width, flexShrink: 0 } : undefined}>
      {label && <label className={styles.label}>{label}</label>}

      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${styles[variant]} ${open ? styles.open : ""} ${error ? styles.triggerError : ""}`}
        onClick={handleToggle}
      >
        <span>{selected?.label ?? placeholder}</span>
        <ChevronDownIcon
          size={16}
          color="var(--text-sub)"
          className={`${styles.chevron} ${openUpward && open ? styles.chevronUp : ""}`}
        />
      </button>

      {open && (
        <ul className={`${styles.dropdown} ${openUpward ? styles.dropdownUp : ""}`}>
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
