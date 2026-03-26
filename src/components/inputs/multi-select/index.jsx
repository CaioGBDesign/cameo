import { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import Checkbox from "@/components/inputs/checkbox";

const DROPDOWN_HEIGHT_ESTIMATE = 220;

const MultiSelect = ({
  label,
  options = [],
  selected = [],
  onChange,
  placeholder,
  width,
  forceUpward = false,
}) => {
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
    <div className={styles.wrapper} ref={ref} style={width ? { width } : undefined}>
      {label && <label className={styles.label}>{label}</label>}

      <button
        ref={triggerRef}
        type="button"
        className={`${styles.trigger} ${open ? styles.open : ""}`}
        onClick={handleToggle}
      >
        <span className={`${styles.triggerLabel} ${selected.length === 0 ? styles.placeholder : ""}`}>
          {displayLabel}
        </span>
        <ChevronDownIcon
          size={16}
          color="var(--text-sub)"
          className={`${styles.chevron} ${open && !openUpward ? styles.chevronOpen : ""} ${openUpward && open ? styles.chevronUp : ""}`}
        />
      </button>

      {open && (
        <ul className={`${styles.dropdown} ${openUpward ? styles.dropdownUp : ""}`}>
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value);
            return (
              <li key={opt.value} className={styles.option}>
                <Checkbox
                  id={`multiselect-${opt.value}`}
                  label={opt.label}
                  checked={isSelected}
                  onChange={() => toggleValue(opt.value)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MultiSelect;
