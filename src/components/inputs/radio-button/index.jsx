import RadioIcon from "@/components/icons/RadioIcon";
import EditIcon from "@/components/icons/EditIcon";
import styles from "./index.module.scss";

// iconVariant: "radio" | "none" | "edit"
export default function RadioButton({
  id,
  name,
  label,
  checked = false,
  onChange,
  iconVariant = "radio",
}) {
  return (
    <label
      htmlFor={id}
      className={[styles.wrapper, checked ? styles.checked : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className={styles.input}
      />
      {iconVariant === "radio" && (
        <RadioIcon size={20} filled={checked} />
      )}
      {iconVariant === "edit" && (
        <EditIcon size={20} color="currentColor" />
      )}
      <span className={styles.label}>{label}</span>
    </label>
  );
}
