import styles from "./index.module.scss";

const Loading = () => {
  return (
    <div className={styles.loading}>
      <div className={styles.video}>
        <video
          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fgif-cameo-filmes-desktop.mp4?alt=media&token=2b56dd6f-360d-44fb-9062-27ea9b38a5f4"
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
