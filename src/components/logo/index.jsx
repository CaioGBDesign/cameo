import styles from "./index.module.scss";

const Logo = () => {
  return (
    <div className={styles.logo}>
      <img src="/logo/cameo-logo.svg" alt="Cameo logo" />
    </div>
  );
};

export default Logo;
