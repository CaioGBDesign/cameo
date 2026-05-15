import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { createPortal } from "react-dom";
import { db } from "@/services/firebaseConection";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import ModalCriarPatente from "@/components/modais/modal-criar-patente";
import StatusPublicadoIcon from "@/components/icons/StatusPublicadoIcon";
import StatusRascunhoIcon from "@/components/icons/StatusRascunhoIcon";
import styles from "./index.module.scss";

const POR_PAGINA = 10;

const STATUS_CONFIG = {
  publicado: { label: "Publicado", className: styles.statusPublicado, Icon: StatusPublicadoIcon },
  rascunho:  { label: "Rascunho",  className: styles.statusRascunho,  Icon: StatusRascunhoIcon  },
};

const tempoRelativo = (ts) => {
  if (!ts) return "—";
  const dias = Math.floor((Date.now() - ts.toDate().getTime()) / 86400000);
  if (dias === 0) return "Hoje";
  return `${dias} dia(s)`;
};

const SortIcon = ({ active = false, dir = "asc" }) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
    style={{ opacity: active ? 1 : 0.4, transform: active && dir === "desc" ? "scaleY(-1)" : undefined, flexShrink: 0 }}>
    <path d="M6 2L9 5H3L6 2Z" fill="currentColor" />
    <path d="M6 10L3 7H9L6 10Z" fill="currentColor" />
  </svg>
);

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status?.toLowerCase()] ?? STATUS_CONFIG.rascunho;
  const { Icon } = cfg;
  return (
    <span className={`${styles.statusBadge} ${cfg.className}`}>
      <span className={styles.badgeIcon}><Icon /></span>
      <span className={styles.badgeText}>{cfg.label}</span>
    </span>
  );
};

const aplicarSort = (lista, col, dir) => [...lista].sort((a, b) => {
  let va, vb;
  switch (col) {
    case "titulo":
      va = (a.tipo || "").toLowerCase(); vb = (b.tipo || "").toLowerCase();
      return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    case "status":
      va = a.status?.toLowerCase() || "rascunho"; vb = b.status?.toLowerCase() || "rascunho";
      return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    case "autor":
      va = (a.autorNome || "").toLowerCase(); vb = (b.autorNome || "").toLowerCase();
      return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    case "criadoEm":
      va = a.dataCadastro?.toMillis() ?? 0; vb = b.dataCadastro?.toMillis() ?? 0;
      return dir === "asc" ? va - vb : vb - va;
    case "editadoEm":
      va = (a.dataPublicacao || a.dataCadastro)?.toMillis() ?? 0;
      vb = (b.dataPublicacao || b.dataCadastro)?.toMillis() ?? 0;
      return dir === "asc" ? va - vb : vb - va;
    default: return 0;
  }
});

export default function AdmPatentes() {
  const [patentes, setPatentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [menuAberto, setMenuAberto] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [confirmarDeletar, setConfirmarDeletar] = useState(null);
  const [sortCol, setSortCol] = useState("criadoEm");
  const [sortDir, setSortDir] = useState("desc");
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [colDropdown, setColDropdown] = useState(null);
  const [colDropdownPos, setColDropdownPos] = useState({ top: 0, left: 0 });
  const [modalCriarAberto, setModalCriarAberto] = useState(false);
  const menuRef = useRef(null);
  const colDropdownRef = useRef(null);

  useEffect(() => {
    getDocs(collection(db, "patentes")).then((snap) => {
      const dados = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      dados.sort((a, b) => (b.dataCadastro?.toMillis() ?? 0) - (a.dataCadastro?.toMillis() ?? 0));
      setPatentes(dados);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAberto(null);
      if (colDropdownRef.current && !colDropdownRef.current.contains(e.target)) setColDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const atualizarLocal = (id, changes) =>
    setPatentes((prev) => prev.map((p) => (p.id === id ? { ...p, ...changes } : p)));

  const abrirMenu = (id, e) => {
    e.stopPropagation();
    if (menuAberto === id) { setMenuAberto(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 6, left: rect.right });
    setMenuAberto(id);
  };

  const handleAcao = async (acao, patente) => {
    setMenuAberto(null);
    const ref = doc(db, "patentes", patente.id);
    switch (acao) {
      case "publicar":
        await updateDoc(ref, { status: "publicado", dataPublicacao: serverTimestamp() });
        atualizarLocal(patente.id, { status: "publicado" });
        break;
      case "despublicar":
        await updateDoc(ref, { status: "rascunho" });
        atualizarLocal(patente.id, { status: "rascunho" });
        break;
      case "deletar":
        setConfirmarDeletar(patente);
        break;
    }
  };

  const executarDeletar = async () => {
    if (!confirmarDeletar) return;
    await deleteDoc(doc(db, "patentes", confirmarDeletar.id));
    setPatentes((prev) => prev.filter((p) => p.id !== confirmarDeletar.id));
    setConfirmarDeletar(null);
  };

  const abrirColDropdown = (col, e) => {
    e.stopPropagation();
    if (colDropdown === col) { setColDropdown(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setColDropdownPos({ top: rect.bottom + 4, left: rect.left });
    setColDropdown(col);
  };

  const setSort = (col, dir) => { setSortCol(col); setSortDir(dir); };

  const patentesFiltradas = patentes.filter((p) => {
    if (filtroStatus && (p.status?.toLowerCase() || "rascunho") !== filtroStatus) return false;
    return true;
  });

  const patentesOrdenadas = aplicarSort(patentesFiltradas, sortCol, sortDir);
  const totalPaginas = Math.ceil(patentesOrdenadas.length / POR_PAGINA);
  const patentesPagina = patentesOrdenadas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  const headerActions = (
    <Button variant="ghost" label="Criar patente" type="button"
      onClick={() => setModalCriarAberto(true)} border="var(--stroke-base)" />
  );

  return (
    <AdmLayout headerActions={headerActions}>
      <Head><title>Cameo ADM — Patentes</title></Head>

      {modalCriarAberto && <ModalCriarPatente onClose={() => setModalCriarAberto(false)} />}

      {confirmarDeletar && createPortal(
        <div className={styles.popoverOverlay} onClick={() => setConfirmarDeletar(null)}>
          <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
            <p className={styles.popoverTexto}>
              Tem certeza que deseja deletar <strong>"{confirmarDeletar.id}"</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className={styles.popoverAcoes}>
              <button type="button" className={styles.popoverCancelar} onClick={() => setConfirmarDeletar(null)}>Cancelar</button>
              <button type="button" className={styles.popoverConfirmar} onClick={executarDeletar}>Deletar</button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {menuAberto && (() => {
        const patente = patentes.find((p) => p.id === menuAberto);
        if (!patente) return null;
        const isPublicado = patente.status?.toLowerCase() === "publicado";
        return createPortal(
          <div ref={menuRef} className={styles.menuDropdown} style={{ top: menuPos.top, left: menuPos.left }}>
            <div className={styles.menuGrupo}>
              {isPublicado ? (
                <button type="button" className={styles.menuItem} onClick={() => handleAcao("despublicar", patente)}>Despublicar</button>
              ) : (
                <button type="button" className={styles.menuItem} onClick={() => handleAcao("publicar", patente)}>Publicar</button>
              )}
            </div>
            <div className={styles.menuGrupo}>
              <button type="button" className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={() => handleAcao("deletar", patente)}>Deletar</button>
            </div>
          </div>,
          document.body,
        );
      })()}

      {colDropdown && createPortal(
        <div ref={colDropdownRef} className={styles.colDropdown} style={{ top: colDropdownPos.top, left: colDropdownPos.left }}>
          {(colDropdown === "titulo" || colDropdown === "autor" || colDropdown === "criadoEm" || colDropdown === "editadoEm") && (
            <div className={styles.colDropdownGrupo}>
              <button type="button" className={`${styles.colDropdownItem} ${sortCol === colDropdown && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort(colDropdown, "asc")}>
                <SortIcon active={sortCol === colDropdown && sortDir === "asc"} dir="asc" /> Crescente
              </button>
              <button type="button" className={`${styles.colDropdownItem} ${sortCol === colDropdown && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort(colDropdown, "desc")}>
                <SortIcon active={sortCol === colDropdown && sortDir === "desc"} dir="desc" /> Decrescente
              </button>
            </div>
          )}
          {colDropdown === "status" && (
            <>
              <div className={styles.colDropdownGrupo}>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "status" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("status", "asc")}>
                  <SortIcon active={sortCol === "status" && sortDir === "asc"} dir="asc" /> Crescente
                </button>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "status" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("status", "desc")}>
                  <SortIcon active={sortCol === "status" && sortDir === "desc"} dir="desc" /> Decrescente
                </button>
              </div>
              <div className={styles.colDropdownGrupo}>
                <button type="button" className={`${styles.colDropdownItem} ${filtroStatus === null ? styles.colDropdownItemAtivo : ""}`} onClick={() => { setFiltroStatus(null); setPagina(1); }}>Todos</button>
                {["publicado", "rascunho"].map((s) => (
                  <button key={s} type="button" className={`${styles.colDropdownItem} ${filtroStatus === s ? styles.colDropdownItemAtivo : ""}`} onClick={() => { setFiltroStatus(s); setPagina(1); }}>
                    <StatusBadge status={s} />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>,
        document.body,
      )}

      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitulo}>Todas as patentes</h1>
        </div>

        {loading ? (
          <p className={styles.loading}>Carregando...</p>
        ) : patentes.length === 0 ? (
          <p className={styles.empty}>Nenhuma patente encontrada.</p>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.colTitulo}>
                      <button type="button" className={`${styles.thBtn} ${colDropdown === "titulo" ? styles.thBtnAtivo : ""}`} onClick={(e) => abrirColDropdown("titulo", e)}>
                        Título <SortIcon active={sortCol === "titulo"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button type="button" className={`${styles.thBtn} ${colDropdown === "status" ? styles.thBtnAtivo : ""}`} onClick={(e) => abrirColDropdown("status", e)}>
                        Status <SortIcon active={sortCol === "status"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button type="button" className={`${styles.thBtn} ${colDropdown === "autor" ? styles.thBtnAtivo : ""}`} onClick={(e) => abrirColDropdown("autor", e)}>
                        Autor <SortIcon active={sortCol === "autor"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button type="button" className={`${styles.thBtn} ${colDropdown === "criadoEm" ? styles.thBtnAtivo : ""}`} onClick={(e) => abrirColDropdown("criadoEm", e)}>
                        Criado à <SortIcon active={sortCol === "criadoEm"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button type="button" className={`${styles.thBtn} ${colDropdown === "editadoEm" ? styles.thBtnAtivo : ""}`} onClick={(e) => abrirColDropdown("editadoEm", e)}>
                        Editado à <SortIcon active={sortCol === "editadoEm"} dir={sortDir} />
                      </button>
                    </th>
                    <th className={styles.colAcoes}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {patentesPagina.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center" }} className={styles.empty}>
                        Nenhuma patente encontrada com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    patentesPagina.map((patente) => {
                      const primeiraImagem = patente.slots?.find((s) => s.imagemUrl)?.imagemUrl ?? null;
                      return (
                        <tr key={patente.id} className={styles.trClicavel}>
                          <td className={styles.colTitulo}>
                            <div className={styles.tituloCell}>
                              <div className={styles.tituloImagem}>
                                {primeiraImagem
                                  ? <img src={primeiraImagem} alt="" className={styles.tituloImg} />
                                  : <div className={styles.tituloImgPlaceholder} />}
                              </div>
                              <span className={styles.tituloTexto}>
                                {patente.tipo ? patente.tipo.charAt(0).toUpperCase() + patente.tipo.slice(1) : "—"}
                              </span>
                            </div>
                          </td>
                          <td><StatusBadge status={patente.status} /></td>
                          <td>
                            <span className={styles.avatarFallback} title={patente.autorNome}>
                              {patente.autorNome?.[0] ?? "?"}
                            </span>
                          </td>
                          <td className={styles.tempo}>{tempoRelativo(patente.dataCadastro)}</td>
                          <td className={styles.tempo}>{tempoRelativo(patente.dataPublicacao || patente.dataCadastro)}</td>
                          <td className={styles.colAcoes} onClick={(e) => e.stopPropagation()}>
                            <button type="button" className={styles.btnAcoes} onClick={(e) => abrirMenu(patente.id, e)}>•••</button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {totalPaginas > 1 && (
              <div className={styles.paginacao}>
                <span className={styles.paginacaoInfo}>
                  {(pagina - 1) * POR_PAGINA + 1}–{Math.min(pagina * POR_PAGINA, patentesOrdenadas.length)} de {patentesOrdenadas.length}
                </span>
                <div className={styles.paginacaoBotoes}>
                  <button type="button" className={styles.btnPagina} onClick={() => setPagina(1)} disabled={pagina === 1}>«</button>
                  <button type="button" className={styles.btnPagina} onClick={() => setPagina((p) => p - 1)} disabled={pagina === 1}>‹</button>
                  {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) => p === "..." ? (
                      <span key={`e${i}`} className={styles.btnPagina} style={{ cursor: "default" }}>…</span>
                    ) : (
                      <button key={p} type="button" className={`${styles.btnPagina} ${p === pagina ? styles.btnPaginaAtivo : ""}`} onClick={() => setPagina(p)}>{p}</button>
                    ))}
                  <button type="button" className={styles.btnPagina} onClick={() => setPagina((p) => p + 1)} disabled={pagina === totalPaginas}>›</button>
                  <button type="button" className={styles.btnPagina} onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}>»</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdmLayout>
  );
}