import styles from "./index.module.scss";
import Link from "next/link";

const Logo = () => {
  return (
    <div className={styles.logo}>
      <Link href="/">
        <img src="/logo/cameo-logo.svg" alt="Cameo logo" />
      </Link>
    </div>
  );
};

export default Logo;
