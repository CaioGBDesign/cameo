import Link from "next/link";
import ListaMateriaIcon from "@/components/icons/ListaMateriaIcon";
import materiaPadrao from "@/components/background/materia-padrao.jpg";
import styles from "./index.module.scss";

const encontrarImagem = (noticia) =>
  noticia.imagem ||
  noticia.elementos?.find((el) => el.tipo === "imagem")?.conteudo ||
  materiaPadrao.src;

const formatarData = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
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

export default function ListaNoticiasResumo({
  noticias,
  titulo = "últimas notícias",
  verTodas,
  basePath = "/noticias/detalhes",
}) {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.titulo}>
          <ListaMateriaIcon size={20} color="var(--primitive-roxo-02)" />
          {titulo}
        </h2>
        {verTodas && (
          <Link href={verTodas} className={styles.verTodas}>
            Ver todas
          </Link>
        )}
      </div>

      <div className={styles.grid}>
        {noticias.map((noticia) => (
          <Link
            key={noticia.id}
            href={`${basePath}/${noticia.id}`}
            className={styles.card}
          >
            <div className={styles.imagem}>
              <img
                src={encontrarImagem(noticia)}
                alt={noticia.titulo}
                onError={(e) => {
                  e.target.src = materiaPadrao.src;
                }}
              />
            </div>
            <div className={styles.conteudo}>
              <p>{noticia.titulo}</p>
              <div className={styles.separador}></div>
              <span>{formatarData(noticia.dataPublicacao)}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
