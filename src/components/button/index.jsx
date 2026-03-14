import Link from "next/link";
import CornerArrowIcon from "@/components/icons/CornerArrowIcon";
import StarRatingIcon from "@/components/icons/StarRatingIcon";
import styles from "./index.module.scss";

const PADRAO_VARIANTS = ["gradiente", "solid", "submit", "outline"];

const Arrows = ({ color }) => (
  <>
    <span
      className={`${styles.arrow} ${styles.arrowBottomLeft}`}
      style={color ? { color } : undefined}
    >
      <CornerArrowIcon size={13} color="currentColor" />
    </span>
    <span
      className={`${styles.arrow} ${styles.arrowTopRight}`}
      style={color ? { color } : undefined}
    >
      <CornerArrowIcon size={13} color="currentColor" />
    </span>
  </>
);

export default function Button({
  variant = "default",
  label,
  icon,
  stars,
  fullWidth = false,
  href,
  onClick,
  type = "button",
  bg,
  color,
  border,
  arrowColor,
  width,
  disabled = false,
}) {
  const className = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : "",
  ]
    .filter(Boolean)
    .join(" ");

  const isPadrao = PADRAO_VARIANTS.includes(variant);

  const inlineStyle = {};
  if (bg) inlineStyle.background = bg;
  if (color) inlineStyle.color = color;
  if (border) inlineStyle.border = `1px solid ${border}`;
  if (width) inlineStyle.width = width;

  const content = (
    <>
      {isPadrao && <Arrows color={arrowColor} />}
      {icon && <span className={styles.icon}>{icon}</span>}
      {label && <span>{label}</span>}
      {stars !== undefined && (
        <span className={styles.stars}>
          {[1, 2, 3, 4, 5].map((v) => (
            <StarRatingIcon key={v} size={16} filled={Math.round(stars) >= v} />
          ))}
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className} style={inlineStyle}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      style={inlineStyle}
      className={className}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
