import styles from "./index.module.scss";

const Logo = () => {
  return (
    <div className={styles.logo}>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/logo%2Fcameo-logo.svg?alt=media&token=89ce259a-bf11-49b0-bd64-8ef8f857bb1f"
        alt="Cameo logo"
      />
    </div>
  );
};

export default Logo;
