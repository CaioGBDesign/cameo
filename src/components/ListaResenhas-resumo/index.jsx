import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./index.module.scss";

function ListaResenhas({ criticas, renderElemento }) {
  const router = useRouter();

  if (!criticas || criticas.length === 0) {
    return <div className={styles.vazio}>Nenhuma resenha encontrada.</div>;
  }

  return (
    <ul className={styles.listaCriticas}>
      <li className={styles.icone}>
        <img src="/icones/cameo-resenhas.svg" alt="Ícone resenhas" />
        <h2>Resenhas</h2>
      </li>

      {criticas.map((critica) => {
        // Verifica e converte a data para um formato válido (se for timestamp do Firebase)
        const dataPublicacao = critica.dataPublicacao
          ? new Date(critica.dataPublicacao.seconds * 1000) // Para timestamp do Firebase (se for esse o caso)
          : new Date(critica.dataPublicacao); // Caso já seja uma data válida

        const isDataValida = !isNaN(dataPublicacao.getTime());

        return (
          <li key={critica.id} className={styles.criticaItem}>
            <Link href={`/resenhas/detalhes/${critica.id}`} passHref>
              <article className={styles.critica}>
                <div className={styles.boxConteudo}>
                  <div className={styles.conteudo}>
                    {critica.elementos.map((elemento, index) =>
                      renderElemento(elemento, index)
                    )}
                  </div>
                  <div className={styles.informacoes}>
                    <div className={styles.tagResenha}>
                      <span>Resenha</span>
                    </div>
                    <div className={styles.cabecalho}>
                      {/* Título */}
                      {critica.titulo && (
                        <h4 className={styles.tituloPrincipal}>
                          {critica.titulo}
                        </h4>
                      )}
                    </div>

                    {/* Informações do autor 
                    {critica.autor && (
                      <div className={styles.cabecalhoInfo}>
                        <div className={styles.autorInfo}>
                          <div className={styles.autorNome}>
                            {critica.autor.nome}
                          </div>
                        </div>
                      </div>
                    )}*/}
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

export default ListaResenhas;
