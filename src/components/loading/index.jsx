import styles from "./index.module.scss";

const Loading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingCont}>
        <div className={styles.loadBola}></div>
        <div className={styles.loadBola}></div>
        <div className={styles.loadBola}></div>
        <div className={styles.loadBola}></div>
        <div className={styles.loadBola}></div>
      </div>
    </div>
  );
};

export default Loading;
