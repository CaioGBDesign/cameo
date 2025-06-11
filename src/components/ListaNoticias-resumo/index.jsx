import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./index.module.scss";

function ListaNoticias({ noticias, renderElemento }) {
  const router = useRouter();

  if (!noticias || noticias.length === 0) {
    return <div className={styles.vazio}>Nenhuma notícia encontrada.</div>;
  }

  return (
    <ul className={styles.listaNoticiasResumo}>
      {/* Ícone e título */}
      <li className={styles.icone}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fcameo-noticias.svg?alt=media&token=a9ca0ad7-d684-4e12-a826-5225c7c196d1"
          alt="Ícone notícias"
        />
        <h2>Notícias</h2>
      </li>

      {noticias.map((noticia) => {
        const data = noticia.dataPublicacao;
        const date = data?.seconds
          ? new Date(data.seconds * 1000)
          : new Date(data);
        const isDataValida = !isNaN(date.getTime());

        return (
          <li key={noticia.id} className={styles.noticiaItemResumo}>
            <Link href={`/noticias/detalhes/${noticia.id}`} passHref>
              <article className={styles.noticiaResumo} title={noticia.titulo}>
                <div className={styles.boxConteudo}>
                  <div className={styles.conteudo}>
                    {noticia.elementos.map((el, i) => renderElemento(el, i))}
                  </div>
                  <div className={styles.informacoes}>
                    <div className={styles.tagNoticia}>
                      <span>Notícia</span>
                    </div>
                    <div className={styles.cabecalho}>
                      {noticia.titulo && (
                        <h4 className={styles.tituloPrincipal}>
                          {noticia.titulo}
                        </h4>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default ListaNoticias;
