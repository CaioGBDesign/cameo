import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import styles from "./index.module.scss";

const STATUS_CONFIG = {
  publicado: { label: "Publicado", className: styles.statusPublicado },
  rascunho: { label: "Rascunho", className: styles.statusRascunho },
  agendado: { label: "Agendado", className: styles.statusAgendado },
  em_revisao: { label: "Em revisão", className: styles.statusEmRevisao },
};

const calcularPrioridade = (noticia) => {
  const ref = noticia.dataRascunho || noticia.dataPublicacao;
  if (!ref) return { label: "S/P", nivel: 0 };
  const dias = Math.floor(
    (Date.now() - ref.toDate().getTime()) / (1000 * 60 * 60 * 24)
  );
  if (dias >= 4) return { label: "Alta", nivel: 3 };
  if (dias >= 3) return { label: "Média", nivel: 2 };
  if (dias >= 2) return { label: "Baixa", nivel: 1 };
  return { label: "S/P", nivel: 0 };
};

const tempoRelativo = (timestamp) => {
  if (!timestamp) return "—";
  const dias = Math.floor(
    (Date.now() - timestamp.toDate().getTime()) / (1000 * 60 * 60 * 24)
  );
  if (dias === 0) return "Hoje";
  if (dias === 1) return "1 dia(s)";
  return `${dias} dia(s)`;
};

const PrioridadeBars = ({ nivel }) => (
  <span className={styles.bars} data-nivel={nivel}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <span
        key={i}
        className={`${styles.bar} ${
          nivel === 1 && i <= 2
            ? styles.barAtivo
            : nivel === 2 && i <= 4
            ? styles.barAtivo
            : nivel === 3 && i <= 6
            ? styles.barAtivo
            : ""
        }`}
      />
    ))}
  </span>
);

const SortIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 2L9 5H3L6 2Z" fill="currentColor" />
    <path d="M6 10L3 7H9L6 10Z" fill="currentColor" />
  </svg>
);

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: styles.statusRascunho,
  };
  return (
    <span className={`${styles.statusBadge} ${config.className}`}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M3 4h6M3 6h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {config.label}
    </span>
  );
};

const POR_PAGINA = 10;

export default function AdmNoticias() {
  const router = useRouter();
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, "noticias"), orderBy("dataPublicacao", "desc"));
        const snap = await getDocs(q);
        setNoticias(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch {
        // tenta sem orderBy caso não haja index
        const snap = await getDocs(collection(db, "noticias"));
        setNoticias(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const totalPaginas = Math.ceil(noticias.length / POR_PAGINA);
  const noticiasPagina = noticias.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const headerActions = (
    <Button
      variant="ghost"
      label="Criar notícia"
      type="button"
      onClick={() => router.push("/adm/noticias/criar")}
      border="var(--stroke-base)"
    />
  );

  return (
    <AdmLayout headerActions={headerActions}>
      <Head>
        <title>Cameo ADM — Notícias</title>
      </Head>

      <div className={styles.page}>
        {loading ? (
          <p className={styles.loading}>Carregando...</p>
        ) : noticias.length === 0 ? (
          <p className={styles.empty}>Nenhuma notícia encontrada.</p>
        ) : (
          <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.colTitulo}>
                    Título <SortIcon />
                  </th>
                  <th>
                    Status <SortIcon />
                  </th>
                  <th>
                    Autor <SortIcon />
                  </th>
                  <th>
                    Criado à <SortIcon />
                  </th>
                  <th>
                    Editado à <SortIcon />
                  </th>
                  <th>
                    Prioridade <SortIcon />
                  </th>
                  <th className={styles.colAcoes}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {noticiasPagina.map((noticia) => {
                  const prioridade = calcularPrioridade(noticia);
                  const criadoEm = noticia.dataRascunho || noticia.dataPublicacao;
                  const editadoEm = noticia.dataPublicacao || noticia.dataRascunho;
                  return (
                    <tr key={noticia.id}>
                      <td className={styles.colTitulo}>
                        <span className={styles.titulo}>{noticia.titulo}</span>
                      </td>
                      <td>
                        <StatusBadge status={noticia.status} />
                      </td>
                      <td>
                        {noticia.autor?.avatarUrl ? (
                          <img
                            src={noticia.autor.avatarUrl}
                            alt={noticia.autor.nome}
                            className={styles.avatar}
                            title={noticia.autor.nome}
                          />
                        ) : (
                          <span className={styles.avatarFallback}>
                            {noticia.autor?.nome?.[0] ?? "?"}
                          </span>
                        )}
                      </td>
                      <td className={styles.tempo}>{tempoRelativo(criadoEm)}</td>
                      <td className={styles.tempo}>{tempoRelativo(editadoEm)}</td>
                      <td>
                        <span className={styles.prioridade}>
                          <PrioridadeBars nivel={prioridade.nivel} />
                          <span className={styles.prioridadeLabel}>
                            {prioridade.label}
                          </span>
                        </span>
                      </td>
                      <td className={styles.colAcoes}>
                        <button type="button" className={styles.btnAcoes}>
                          •••
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPaginas > 1 && (
            <div className={styles.paginacao}>
              <span className={styles.paginacaoInfo}>
                {(pagina - 1) * POR_PAGINA + 1}–{Math.min(pagina * POR_PAGINA, noticias.length)} de {noticias.length}
              </span>

              <div className={styles.paginacaoBotoes}>
                <button
                  type="button"
                  className={styles.btnPagina}
                  onClick={() => setPagina(1)}
                  disabled={pagina === 1}
                >
                  «
                </button>
                <button
                  type="button"
                  className={styles.btnPagina}
                  onClick={() => setPagina((p) => p - 1)}
                  disabled={pagina === 1}
                >
                  ‹
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`dots-${idx}`} className={styles.paginacaoDots}>…</span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        className={`${styles.btnPagina} ${item === pagina ? styles.btnPaginaAtivo : ""}`}
                        onClick={() => setPagina(item)}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  type="button"
                  className={styles.btnPagina}
                  onClick={() => setPagina((p) => p + 1)}
                  disabled={pagina === totalPaginas}
                >
                  ›
                </button>
                <button
                  type="button"
                  className={styles.btnPagina}
                  onClick={() => setPagina(totalPaginas)}
                  disabled={pagina === totalPaginas}
                >
                  »
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </div>
    </AdmLayout>
  );
}
