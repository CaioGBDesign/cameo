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
          src="/background/cameo-siga-no-instagram.png"
          alt="Siga a Cameo no instagram"
        />
      </div>
    </Link>
  );
};

export default BannerInformacao;
