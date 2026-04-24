import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { createPortal } from "react-dom";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import EditIcon from "@/components/icons/EditIcon";
import DuplicarIcon from "@/components/icons/DuplicarIcon";
import DeletarIcon from "@/components/icons/DeletarIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import StatusPublicadoIcon from "@/components/icons/StatusPublicadoIcon";
import StatusRascunhoIcon from "@/components/icons/StatusRascunhoIcon";
import StatusArquivadoIcon from "@/components/icons/StatusArquivadoIcon";
import styles from "./index.module.scss";

const SortIcon = ({ active, dir }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    style={{
      opacity: active ? 1 : 0.4,
      transform: active && dir === "desc" ? "scaleY(-1)" : undefined,
      flexShrink: 0,
    }}
  >
    <path d="M6 2L9 5H3L6 2Z" fill="currentColor" />
    <path d="M6 10L3 7H9L6 10Z" fill="currentColor" />
  </svg>
);

// ─── Badge de publicação ──────────────────────────────────────────────────────

const STATUS_PUB_CONFIG = {
  publicado: {
    label: "Publicado",
    className: styles.statusPublicado,
    Icon: StatusPublicadoIcon,
  },
  rascunho: {
    label: "Rascunho",
    className: styles.statusRascunho,
    Icon: StatusRascunhoIcon,
  },
  arquivado: {
    label: "Arquivado",
    className: styles.statusArquivado,
    Icon: StatusArquivadoIcon,
  },
};

const StatusBadge = ({ status }) => {
  const config =
    STATUS_PUB_CONFIG[status?.toLowerCase()] ?? STATUS_PUB_CONFIG.rascunho;
  const { Icon } = config;
  return (
    <span className={`${styles.statusBadge} ${config.className}`}>
      <span className={styles.badgeIcon}>
        <Icon />
      </span>
      <span className={styles.badgeText}>{config.label}</span>
    </span>
  );
};

// ─── Badge ativo/inativo ──────────────────────────────────────────────────────

const AtivoBadge = ({ ativo }) => (
  <span
    className={`${styles.ativoBadge} ${ativo ? styles.ativoBadgeAtivo : styles.ativoBadgeInativo}`}
  >
    {ativo ? "Ativo" : "Inativo"}
  </span>
);

const POR_PAGINA = 10;

export default function AdmEstudios() {
  const router = useRouter();

  const [estudios, setEstudios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortCol, setSortCol] = useState("nome");
  const [sortDir, setSortDir] = useState("asc");
  const [pagina, setPagina] = useState(1);

  const [menuAberto, setMenuAberto] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  const [deletandoId, setDeletandoId] = useState(null);
  const [deletandoNome, setDeletandoNome] = useState("");

  const [duplicando, setDuplicando] = useState(false);

  // ─── Fetch ────────────────────────────────────────────────
  useEffect(() => {
    const fetchEstudios = async () => {
      try {
        const snap = await getDocs(collection(db, "estudios"));
        setEstudios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } finally {
        setLoading(false);
      }
    };
    fetchEstudios();
  }, []);

  // ─── Click fora fecha menu ────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuAberto(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ─── Ordenação ────────────────────────────────────────────
  const toggleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const estudiosOrdenados = [...estudios].sort((a, b) => {
    let va, vb;
    if (sortCol === "nome") {
      va = a.nome ?? "";
      vb = b.nome ?? "";
    } else if (sortCol === "statusPublicacao") {
      va = a.statusPublicacao ?? "rascunho";
      vb = b.statusPublicacao ?? "rascunho";
    } else if (sortCol === "ativo") {
      va = a.ativo ? 1 : 0;
      vb = b.ativo ? 1 : 0;
    } else {
      va = "";
      vb = "";
    }
    const cmp =
      typeof va === "string" ? va.localeCompare(vb, "pt-BR") : va - vb;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPaginas = Math.ceil(estudiosOrdenados.length / POR_PAGINA);
  const estudiosPagina = estudiosOrdenados.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA,
  );

  // ─── Gerar novo ID ────────────────────────────────────────
  const gerarId = async () => {
    const snap = await getDocs(collection(db, "estudios"));
    const ids = snap.docs.map((d) => {
      const m = d.id.match(/^EU(\d+)$/);
      return m ? parseInt(m[1]) : 0;
    });
    return `EU${String(Math.max(0, ...ids) + 1).padStart(4, "0")}`;
  };

  // ─── Menu ações ───────────────────────────────────────────
  const abrirMenu = (id, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX,
    });
    setMenuAberto(id);
  };

  const handleAcao = (acao, estudio) => {
    setMenuAberto(null);
    if (acao === "editar") router.push(`/adm/estudios/editar/${estudio.id}`);
    if (acao === "duplicar") handleDuplicar(estudio);
    if (acao === "publicar") handlePublicar(estudio);
    if (acao === "deletar") {
      setDeletandoId(estudio.id);
      setDeletandoNome(estudio.nome || estudio.id);
    }
  };

  // ─── Publicar ────────────────────────────────────────────
  const handlePublicar = async (estudio) => {
    await updateDoc(doc(db, "estudios", estudio.id), {
      statusPublicacao: "publicado",
      dataPublicacao: serverTimestamp(),
    });
    setEstudios((prev) =>
      prev.map((e) =>
        e.id === estudio.id ? { ...e, statusPublicacao: "publicado" } : e,
      ),
    );
  };

  // ─── Duplicar ────────────────────────────────────────────
  const handleDuplicar = async (estudio) => {
    setDuplicando(true);
    try {
      const novoId = await gerarId();
      const { id: _id, dataCadastro: _dc, dataEdicao: _de, ...dados } = estudio;
      await setDoc(doc(db, "estudios", novoId), {
        ...dados,
        nome: `${dados.nome ?? ""} (cópia)`,
        statusPublicacao: "rascunho",
        dataCadastro: serverTimestamp(),
        dataEdicao: serverTimestamp(),
      });
      const snap = await getDocs(collection(db, "estudios"));
      setEstudios(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } finally {
      setDuplicando(false);
    }
  };

  // ─── Deletar ─────────────────────────────────────────────
  const confirmarDelete = async () => {
    if (!deletandoId) return;
    await deleteDoc(doc(db, "estudios", deletandoId));
    setEstudios((prev) => prev.filter((e) => e.id !== deletandoId));
    setDeletandoId(null);
  };

  const headerActions = (
    <Button
      variant="ghost"
      label="Criar estúdio"
      type="button"
      onClick={() => router.push("/adm/estudios/criar")}
      border="var(--stroke-base)"
    />
  );

  return (
    <AdmLayout headerActions={headerActions}>
      <Head>
        <title>Estúdios — Cameo ADM</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitulo}>Todos os estúdios</h1>
        </div>

        <div className={styles.tableWrapper}>
          {loading ? (
            <p className={styles.loading}>Carregando...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 60 }} />
                  <th className={styles.colNome}>
                    <button
                      type="button"
                      className={`${styles.thBtn} ${sortCol === "nome" ? styles.thBtnAtivo : ""}`}
                      onClick={() => toggleSort("nome")}
                    >
                      Nome do estúdio{" "}
                      <SortIcon active={sortCol === "nome"} dir={sortDir} />
                    </button>
                  </th>
                  <th style={{ width: 120 }}>Código</th>
                  <th style={{ width: 120 }}>
                    <button
                      type="button"
                      className={`${styles.thBtn} ${sortCol === "ativo" ? styles.thBtnAtivo : ""}`}
                      onClick={() => toggleSort("ativo")}
                    >
                      Ativo{" "}
                      <SortIcon active={sortCol === "ativo"} dir={sortDir} />
                    </button>
                  </th>
                  <th style={{ width: 150 }}>
                    <button
                      type="button"
                      className={`${styles.thBtn} ${sortCol === "statusPublicacao" ? styles.thBtnAtivo : ""}`}
                      onClick={() => toggleSort("statusPublicacao")}
                    >
                      Status{" "}
                      <SortIcon
                        active={sortCol === "statusPublicacao"}
                        dir={sortDir}
                      />
                    </button>
                  </th>
                  <th className={styles.colAcoes}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {estudiosPagina.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ textAlign: "center" }}
                      className={styles.empty}
                    >
                      Nenhum estúdio cadastrado.
                    </td>
                  </tr>
                ) : (
                  estudiosPagina.map((estudio) => (
                    <tr
                      key={estudio.id}
                      className={styles.trClicavel}
                      onClick={() =>
                        router.push(`/adm/estudios/editar/${estudio.id}`)
                      }
                    >
                      <td>
                        {estudio.imagemUrl ? (
                          <img
                            src={estudio.imagemUrl}
                            alt={estudio.nome}
                            className={styles.fotoEstudio}
                          />
                        ) : (
                          <span className={styles.fotoEstudioFallback}>
                            {estudio.nome?.[0]?.toUpperCase() ?? "E"}
                          </span>
                        )}
                      </td>
                      <td className={styles.colNome}>
                        <span className={styles.titulo}>
                          {estudio.nome || "—"}
                        </span>
                        {estudio.slogan && (
                          <span className={styles.subtitulo}>
                            {estudio.slogan}
                          </span>
                        )}
                      </td>
                      <td className={styles.tempo}>{estudio.id}</td>
                      <td>
                        <AtivoBadge ativo={estudio.ativo ?? true} />
                      </td>
                      <td>
                        <StatusBadge status={estudio.statusPublicacao} />
                      </td>
                      <td
                        className={styles.colAcoes}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className={styles.btnAcoes}
                          onClick={(e) => abrirMenu(estudio.id, e)}
                        >
                          •••
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {totalPaginas > 1 && (
          <div className={styles.paginacao}>
            <span className={styles.paginacaoInfo}>
              {(pagina - 1) * POR_PAGINA + 1}–
              {Math.min(pagina * POR_PAGINA, estudiosOrdenados.length)} de{" "}
              {estudiosOrdenados.length}
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
                .filter(
                  (p) =>
                    p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1,
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className={styles.paginacaoDots}>
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      className={`${styles.btnPagina} ${pagina === p ? styles.btnPaginaAtivo : ""}`}
                      onClick={() => setPagina(p)}
                    >
                      {p}
                    </button>
                  ),
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
      </div>

      {/* ─── Menu dropdown ações ─────────────────────────────── */}
      {menuAberto &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.menuDropdown}
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            {(() => {
              const e = estudios.find((x) => x.id === menuAberto);
              if (!e) return null;
              return (
                <>
                  <div className={styles.menuGrupo}>
                    <button
                      type="button"
                      className={styles.menuItem}
                      onClick={() => handleAcao("editar", e)}
                    >
                      <span className={styles.menuItemIcon}>
                        <EditIcon size={16} color="currentColor" />
                      </span>
                      Editar
                    </button>
                    {(e.statusPublicacao ?? "rascunho") === "rascunho" && (
                      <button
                        type="button"
                        className={styles.menuItem}
                        onClick={() => handleAcao("publicar", e)}
                      >
                        <span className={styles.menuItemIcon}>
                          <StatusPublicadoIcon size={16} color="currentColor" />
                        </span>
                        Publicar
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.menuItem}
                      onClick={() => handleAcao("duplicar", e)}
                      disabled={duplicando}
                    >
                      <span className={styles.menuItemIcon}>
                        <DuplicarIcon size={16} color="currentColor" />
                      </span>
                      Duplicar
                    </button>
                  </div>
                  <div className={styles.menuGrupo}>
                    <button
                      type="button"
                      className={`${styles.menuItem} ${styles.menuItemDanger}`}
                      onClick={() => handleAcao("deletar", e)}
                    >
                      <span className={styles.menuItemIcon}>
                        <DeletarIcon />
                      </span>
                      Deletar
                    </button>
                  </div>
                </>
              );
            })()}
          </div>,
          document.body,
        )}

      {/* ─── Popover deletar ─────────────────────────────────── */}
      {deletandoId &&
        createPortal(
          <div className={styles.popoverOverlay}>
            <div className={styles.popover}>
              <p className={styles.popoverTexto}>
                Deletar <strong>{deletandoNome}</strong>? Esta ação não pode ser
                desfeita.
              </p>
              <div className={styles.popoverAcoes}>
                <button
                  type="button"
                  className={styles.popoverCancelar}
                  onClick={() => setDeletandoId(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={styles.popoverConfirmar}
                  onClick={confirmarDelete}
                >
                  <TrashIcon size={14} color="white" /> Deletar
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </AdmLayout>
  );
}
