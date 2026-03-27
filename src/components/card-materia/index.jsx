import Image from "next/image";
import styles from "./index.module.scss";

const formatarDataHora = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const data = d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const hora = d.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${data} às ${hora}`;
};

const HREF_POR_TIPO = {
  resenha: (id) => `/resenhas/detalhes/${id}`,
  noticia: (id) => `/noticias/detalhes/${id}`,
};

export default function CardMateria({ materia, tipo = "resenha" }) {
  const capa =
    materia.imagem ||
    materia.elementos?.find((el) => el.tipo === "imagem")?.conteudo;
  const href = HREF_POR_TIPO[tipo]?.(materia.id) ?? "#";

  return (
    <a href={href} className={styles.card}>
      {capa && (
        <div className={styles.capa}>
          <Image
            src={capa}
            alt={materia.titulo}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <div className={styles.info}>
        <span className={styles.titulo}>{materia.titulo}</span>
        <div className={styles.separador}></div>
        <div className={styles.meta}>
          <span className={styles.por}>
            Por <strong>{materia.autor?.nome}</strong>
          </span>
          <span className={styles.data}>
            {formatarDataHora(materia.dataPublicacao)}
          </span>
        </div>
      </div>
    </a>
  );
}
