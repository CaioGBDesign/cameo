import styles from "./index.module.scss";

const Loading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.video}>
        <video
          src="/background/gif-cameo-filmes-desktop.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      </div>
    </div>
  );
};

export default Loading;
