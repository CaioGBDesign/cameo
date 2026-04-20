import styles from "./index.module.scss";

export default function AvatarDublador({ src, alt, onClick }) {
  return (
    <div className={`${styles.avatar} ${onClick ? styles.clickable : ""}`} onClick={onClick}>
      <div className={styles.contentAvatar}>
        {src && <img src={src} alt={alt} unoptimized />}
      </div>
    </div>
  );
}
