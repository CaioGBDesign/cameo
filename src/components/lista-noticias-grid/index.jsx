import { useState } from "react";
import Link from "next/link";
import ListaMateriaIcon from "@/components/icons/ListaMateriaIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import Badge from "@/components/badge";
import Pagination from "@/components/pagination";
import materiaPadrao from "@/components/background/materia-padrao.jpg";
import styles from "./index.module.scss";

const POR_PAGINA = 8;

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

export default function ListaNoticiasGrid({ noticias, basePath = "/noticias/detalhes", titulo = "Todas as notícias" }) {
  const [pagina, setPagina] = useState(1);

  const totalPaginas = Math.ceil(noticias.length / POR_PAGINA);
  const inicio = (pagina - 1) * POR_PAGINA;
  const visiveis = noticias.slice(inicio, inicio + POR_PAGINA);

  const handlePagina = (p) => {
    setPagina(p);
  };

  return (
    <section className={styles.container}>
      <div className={styles.titulo}>
        <ListaMateriaIcon size={20} color="var(--primitive-roxo-02)" />
        <h2>{titulo}</h2>
      </div>

      <div className={styles.grid}>
        {visiveis.map((noticia) => (
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
              <div className={styles.topo}>
                <h3 className={styles.cardTitulo}>{noticia.titulo}</h3>

                {noticia.numero && (
                  <p className={styles.leitura}>
                    <ClockIcon size={14} color="var(--primitive-roxo-02)" />
                    {noticia.numero} minutos de leitura
                  </p>
                )}

                {noticia.empresas?.length > 0 && (
                  <div className={styles.tags}>
                    {noticia.empresas.slice(0, 3).map((empresa) => (
                      <Badge
                        key={empresa}
                        label={empresa}
                        variant="soft"
                        bg="--bg-base"
                        borda="--stroke-quaternary"
                      />
                    ))}
                    {noticia.empresas.length > 3 && (
                      <Badge
                        label="..."
                        variant="soft"
                        bg="--bg-base"
                        borda="--stroke-quaternary"
                      />
                    )}
                  </div>
                )}
              </div>

              <div className={styles.separador}></div>

              <div className={styles.rodape}>
                <div className={styles.por}>
                  <div className={styles.dotRodape}></div>
                  {noticia.autor?.nome && (
                    <span className={styles.autor}>
                      Por <strong>{noticia.autor.nome}</strong>
                    </span>
                  )}
                </div>
                <span className={styles.data}>
                  {formatarData(noticia.dataPublicacao)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        page={pagina}
        totalPages={totalPaginas}
        onChange={handlePagina}
      />
    </section>
  );
}
