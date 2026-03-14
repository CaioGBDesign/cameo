import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";
import PlayIcon from "@/components/icons/PlayIcon";

const BannerFilme = ({ src, alt, trailerLink, showPlay = false }) => {
  if (!src) return null;

  return (
    <div className={styles.banner}>
      <Image unoptimized
        src={src}
        alt={alt}
        width={780}
        height={1170}
        quality={75}
        priority
        className={styles.imagem}
      />

      {showPlay && trailerLink && (
        <div className={styles.play}>
          <Link href={trailerLink} target="_blank" rel="noopener noreferrer">
            <PlayIcon size={24} color="#fff" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default BannerFilme;
