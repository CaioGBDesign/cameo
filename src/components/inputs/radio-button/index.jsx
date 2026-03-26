import RadioIcon from "@/components/icons/RadioIcon";
import EditIcon from "@/components/icons/EditIcon";
import styles from "./index.module.scss";

export default function RadioButton({
  id,
  name,
  label,
  checked = false,
  onChange,
  onClick,
  iconVariant = "radio",
}) {
  return (
    <label
      htmlFor={id}
      className={[styles.wrapper, checked ? styles.checked : ""]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
    >
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className={styles.input}
      />
      {iconVariant === "radio" && <RadioIcon size={20} filled={checked} />}
      {iconVariant === "edit" && <EditIcon size={20} color="currentColor" />}
      {/* iconVariant="none" renders no icon */}
      <span className={styles.label}>{label}</span>
    </label>
  );
}
