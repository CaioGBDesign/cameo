import Link from "next/link";
import styles from "./index.module.scss";
import HomeIcon from "@/components/icons/HomeIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";

const Breadcrumb = ({ items = [] }) => (
  <nav className={styles.breadcrumb}>
    <Link href="/" className={styles.home}>
      <HomeIcon size={20} color="var(--icon-breadcrumb)" />
    </Link>

    {items.map((item, i) => (
      <span key={i} className={styles.item}>
        <span className={styles.separator}>
          <ChevronDownIcon size={14} color="var(--icon-breadcrumb)" style={{ transform: "rotate(-90deg)" }} />
        </span>
        {item.href ? (
          <Link href={item.href} className={styles.link}>{item.label}</Link>
        ) : (
          <span className={styles.current}>{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
