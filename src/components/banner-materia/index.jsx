import Image from "next/image";
import styles from "./index.module.scss";

const TIPO_CONFIG = {
  noticia: { label: "Notícia", cor: "#2ba8e2" },
  critica: { label: "Resenha", cor: "#f314fb" },
  resenha: { label: "Resenha", cor: "var(--primitive-rosa-01)" },
};

export default function BannerMateria({ src, tipo = "noticia", alt = "" }) {
  const config = TIPO_CONFIG[tipo] ?? TIPO_CONFIG.noticia;

  return (
    <div className={styles.banner}>
      <div className={styles.tag} style={{ background: config.cor }}>
        <span>{config.label}</span>
      </div>
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        priority
      />
    </div>
  );
}
