import styles from "./index.module.scss";
import Link from "next/link";

const BannerInformacao = () => {
  return (
    <Link
      href="https://www.instagram.com/cameo.fun/"
      className={styles.miniatura}
      target="_blank"
    >
      <div className={styles.bannerInformacao}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fcameo-siga-no-instagram.png?alt=media&token=fe9aa147-a2b3-41e0-a417-4217fc3bbdc8"
          alt="Siga a Cameo no instagram"
        />
      </div>
    </Link>
  );
};

export default BannerInformacao;
