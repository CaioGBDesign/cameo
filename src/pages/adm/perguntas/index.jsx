import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { createPortal } from "react-dom";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import ModalCriarPergunta from "@/components/modais/modal-criar-pergunta";
import TrashIcon from "@/components/icons/TrashIcon";
import VisualizarIcon from "@/components/icons/VisualizarIcon";
import DuplicarIcon from "@/components/icons/DuplicarIcon";
import RascunhoAcaoIcon from "@/components/icons/RascunhoAcaoIcon";
import ArquivarIcon from "@/components/icons/ArquivarIcon";
import DeletarIcon from "@/components/icons/DeletarIcon";
import PublicarIcon from "@/components/icons/PublicarIcon";
import StatusRascunhoIcon from "@/components/icons/StatusRascunhoIcon";
import StatusPublicadoIcon from "@/components/icons/StatusPublicadoIcon";
import StatusArquivadoIcon from "@/components/icons/StatusArquivadoIcon";
import styles from "./index.module.scss";

const STATUS_CONFIG = {
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

const tempoRelativo = (timestamp) => {
  if (!timestamp) return "—";
  const dias = Math.floor(
    (Date.now() - timestamp.toDate().getTime()) / (1000 * 60 * 60 * 24),
  );
  if (dias === 0) return "Hoje";
  if (dias === 1) return "1 dia(s)";
  return `${dias} dia(s)`;
};

const SortIcon = ({ active = false, dir = "asc" }) => (
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

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.rascunho;
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

const ACOES_POR_STATUS = {
  rascunho: ["editar", "visualizar", "duplicar", "---", "deletar"],
  publicado: ["editar", "visualizar", "---", "arquivar", "despublicar"],
  arquivado: ["visualizar", "---", "reativar"],
};

const ACOES_CONFIG = {
  editar: {
    label: "Editar",
    Icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  visualizar: { label: "Visualizar", Icon: VisualizarIcon },
  duplicar: { label: "Duplicar", Icon: DuplicarIcon },
  publicar: { label: "Publicar", Icon: PublicarIcon },
  arquivar: { label: "Arquivar", Icon: ArquivarIcon },
  despublicar: { label: "Retornar para rascunho", Icon: RascunhoAcaoIcon },
  reativar: { label: "Reativar", Icon: RascunhoAcaoIcon },
  deletar: { label: "Deletar", Icon: DeletarIcon },
};

const POR_PAGINA = 10;

const aplicarSort = (lista, col, dir) =>
  [...lista].sort((a, b) => {
    let va, vb;
    switch (col) {
      case "titulo":
        va = (a.id || "").toLowerCase();
        vb = (b.id || "").toLowerCase();
        return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      case "tipo":
        va = a.tipo ?? 0;
        vb = b.tipo ?? 0;
        return dir === "asc" ? va - vb : vb - va;
      case "status":
        va = a.status?.toLowerCase() || "rascunho";
        vb = b.status?.toLowerCase() || "rascunho";
        return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      case "autor":
        va = (a.autorNome || "").toLowerCase();
        vb = (b.autorNome || "").toLowerCase();
        return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      case "criadoEm": {
        const tA = a.dataCadastro?.toMillis() ?? 0;
        const tB = b.dataCadastro?.toMillis() ?? 0;
        return dir === "asc" ? tA - tB : tB - tA;
      }
      case "editadoEm": {
        const tA = (a.dataPublicacao || a.dataCadastro)?.toMillis() ?? 0;
        const tB = (b.dataPublicacao || b.dataCadastro)?.toMillis() ?? 0;
        return dir === "asc" ? tA - tB : tB - tA;
      }
      default:
        return 0;
    }
  });

export default function AdmPerguntas() {
  const router = useRouter();
  const [perguntas, setPerguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [menuAberto, setMenuAberto] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const [confirmarDeletar, setConfirmarDeletar] = useState(null);

  const [sortCol, setSortCol] = useState("criadoEm");
  const [sortDir, setSortDir] = useState("desc");
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [filtroTitulo, setFiltroTitulo] = useState("");
  const [colDropdown, setColDropdown] = useState(null);
  const [colDropdownPos, setColDropdownPos] = useState({ top: 0, left: 0 });
  const colDropdownRef = useRef(null);
  const [modalTipoAberto, setModalTipoAberto] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDocs(collection(db, "perguntas"));
        const dados = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        dados.sort((a, b) => {
          const tA = a.dataCadastro?.toMillis() ?? 0;
          const tB = b.dataCadastro?.toMillis() ?? 0;
          return tB - tA;
        });
        setPerguntas(dados);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuAberto(null);
      if (colDropdownRef.current && !colDropdownRef.current.contains(e.target))
        setColDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const removerLocal = (id) =>
    setPerguntas((prev) => prev.filter((p) => p.id !== id));
  const atualizarLocal = (id, changes) =>
    setPerguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p)),
    );

  const executarDeletar = async () => {
    if (!confirmarDeletar) return;
    await deleteDoc(doc(db, "perguntas", confirmarDeletar.id));
    removerLocal(confirmarDeletar.id);
    setConfirmarDeletar(null);
  };

  const abrirMenu = (id, e) => {
    e.stopPropagation();
    if (menuAberto === id) {
      setMenuAberto(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 6, left: rect.right });
    setMenuAberto(id);
  };

  const handleAcao = async (acao, pergunta) => {
    setMenuAberto(null);
    const ref = doc(db, "perguntas", pergunta.id);
    switch (acao) {
      case "editar":
        router.push(`/adm/perguntas/editar/${pergunta.id}`);
        break;
      case "duplicar": {
        const snap0 = await getDocs(collection(db, "perguntas"));
        const ids = snap0.docs.map((d) => {
          const m = d.id.match(/^PQ(\d+)$/);
          return m ? parseInt(m[1]) : 0;
        });
        const novoId = `PQ${String(Math.max(0, ...ids) + 1).padStart(4, "0")}`;
        const { id: _id, ...resto } = pergunta;
        await setDoc(doc(db, "perguntas", novoId), {
          ...resto,
          status: "rascunho",
          dataCadastro: serverTimestamp(),
          dataPublicacao: null,
        });
        const snap = await getDocs(collection(db, "perguntas"));
        const dados = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        dados.sort(
          (a, b) =>
            (b.dataCadastro?.toMillis() ?? 0) -
            (a.dataCadastro?.toMillis() ?? 0),
        );
        setPerguntas(dados);
        break;
      }
      case "publicar":
        await updateDoc(ref, {
          status: "publicado",
          dataPublicacao: serverTimestamp(),
        });
        atualizarLocal(pergunta.id, { status: "publicado" });
        break;
      case "despublicar":
        await updateDoc(ref, { status: "rascunho" });
        atualizarLocal(pergunta.id, { status: "rascunho" });
        break;
      case "arquivar":
        await updateDoc(ref, { status: "arquivado" });
        atualizarLocal(pergunta.id, { status: "arquivado" });
        break;
      case "reativar":
        await updateDoc(ref, { status: "rascunho" });
        atualizarLocal(pergunta.id, { status: "rascunho" });
        break;
      case "deletar":
        setConfirmarDeletar(pergunta);
        break;
    }
  };

  const abrirColDropdown = (col, e) => {
    e.stopPropagation();
    if (colDropdown === col) {
      setColDropdown(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setColDropdownPos({ top: rect.bottom + 4, left: rect.left });
    setColDropdown(col);
  };

  const setSort = (col, dir) => {
    setSortCol(col);
    setSortDir(dir);
  };

  const temFiltros = filtroStatus !== null || filtroTitulo !== "";
  const limparFiltros = () => {
    setFiltroStatus(null);
    setFiltroTitulo("");
    setColDropdown(null);
    setPagina(1);
  };

  const perguntasFiltradas = perguntas.filter((p) => {
    if (
      filtroStatus &&
      (p.status?.toLowerCase() || "rascunho") !== filtroStatus
    )
      return false;
    if (
      filtroTitulo &&
      !p.id?.toLowerCase().includes(filtroTitulo.toLowerCase())
    )
      return false;
    return true;
  });

  const perguntasOrdenadas = aplicarSort(perguntasFiltradas, sortCol, sortDir);
  const totalPaginas = Math.ceil(perguntasOrdenadas.length / POR_PAGINA);
  const perguntasPagina = perguntasOrdenadas.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA,
  );

  const headerActions = (
    <Button
      variant="ghost"
      label="Criar pergunta"
      type="button"
      onClick={() => setModalTipoAberto(true)}
      border="var(--stroke-base)"
    />
  );

  return (
    <AdmLayout headerActions={headerActions}>
      <Head>
        <title>Cameo ADM — Perguntas</title>
      </Head>

      {modalTipoAberto && (
        <ModalCriarPergunta onClose={() => setModalTipoAberto(false)} />
      )}

      {confirmarDeletar &&
        createPortal(
          <div
            className={styles.popoverOverlay}
            onClick={() => setConfirmarDeletar(null)}
          >
            <div
              className={styles.popover}
              onClick={(e) => e.stopPropagation()}
            >
              <p className={styles.popoverTexto}>
                Tem certeza que deseja deletar permanentemente{" "}
                <strong>"{confirmarDeletar.id}"</strong>? Esta ação não pode ser
                desfeita.
              </p>
              <div className={styles.popoverAcoes}>
                <button
                  type="button"
                  className={styles.popoverCancelar}
                  onClick={() => setConfirmarDeletar(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={styles.popoverConfirmar}
                  onClick={executarDeletar}
                >
                  <TrashIcon size={14} color="currentColor" /> Deletar
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {menuAberto &&
        (() => {
          const pergunta = perguntas.find((p) => p.id === menuAberto);
          if (!pergunta) return null;
          const status = pergunta.status?.toLowerCase() || "rascunho";
          const acoes = ACOES_POR_STATUS[status] ?? ACOES_POR_STATUS.rascunho;
          return createPortal(
            <div
              ref={menuRef}
              className={styles.menuDropdown}
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              {acoes
                .reduce(
                  (grupos, acao) => {
                    if (acao === "---") grupos.push([]);
                    else grupos[grupos.length - 1].push(acao);
                    return grupos;
                  },
                  [[]],
                )
                .filter((g) => g.length > 0)
                .map((grupo, gi) => (
                  <div key={gi} className={styles.menuGrupo}>
                    {grupo.map((acao) => {
                      const cfg = ACOES_CONFIG[acao];
                      if (!cfg) return null;
                      return (
                        <button
                          key={acao}
                          type="button"
                          className={`${styles.menuItem} ${acao === "deletar" ? styles.menuItemDanger : ""}`}
                          onClick={() => handleAcao(acao, pergunta)}
                        >
                          <span className={styles.menuItemIcon}>
                            <cfg.Icon />
                          </span>
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                ))}
            </div>,
            document.body,
          );
        })()}

      {colDropdown &&
        createPortal(
          <div
            ref={colDropdownRef}
            className={styles.colDropdown}
            style={{ top: colDropdownPos.top, left: colDropdownPos.left }}
          >
            {colDropdown === "titulo" && (
              <>
                <div className={styles.colDropdownGrupo}>
                  <input
                    autoFocus
                    type="text"
                    className={styles.colDropdownSearch}
                    placeholder="Buscar por ID..."
                    value={filtroTitulo}
                    onChange={(e) => {
                      setFiltroTitulo(e.target.value);
                      setPagina(1);
                    }}
                  />
                </div>
                <div className={styles.colDropdownGrupo}>
                  <button
                    type="button"
                    className={`${styles.colDropdownItem} ${sortCol === "titulo" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`}
                    onClick={() => setSort("titulo", "asc")}
                  >
                    <SortIcon
                      active={sortCol === "titulo" && sortDir === "asc"}
                      dir="asc"
                    />{" "}
                    Crescente (A→Z)
                  </button>
                  <button
                    type="button"
                    className={`${styles.colDropdownItem} ${sortCol === "titulo" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`}
                    onClick={() => setSort("titulo", "desc")}
                  >
                    <SortIcon
                      active={sortCol === "titulo" && sortDir === "desc"}
                      dir="desc"
                    />{" "}
                    Decrescente (Z→A)
                  </button>
                </div>
              </>
            )}
            {colDropdown === "tipo" && (
              <div className={styles.colDropdownGrupo}>
                <button
                  type="button"
                  className={`${styles.colDropdownItem} ${sortCol === "tipo" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`}
                  onClick={() => setSort("tipo", "asc")}
                >
                  <SortIcon
                    active={sortCol === "tipo" && sortDir === "asc"}
                    dir="asc"
                  />{" "}
                  Crescente
                </button>
                <button
                  type="button"
                  className={`${styles.colDropdownItem} ${sortCol === "tipo" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`}
                  onClick={() => setSort("tipo", "desc")}
                >
                  <SortIcon
                    active={sortCol === "tipo" && sortDir === "desc"}
                    dir="desc"
                  />{" "}
                  Decrescente
                </button>
              </div>
            )}
            {colDropdown === "status" && (
              <>
                <div className={styles.colDropdownGrupo}>
                  <button
                    type="button"
                    className={`${styles.colDropdownItem} ${sortCol === "status" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`}
                    onClick={() => setSort("status", "asc")}
                  >
                    <SortIcon
                      active={sortCol === "status" && sortDir === "asc"}
                      dir="asc"
                    />{" "}
                    Crescente (A→Z)
                  </button>
                  <button
                    type="button"
                    className={`${styles.colDropdownItem} ${sortCol === "status" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`}
                    onClick={() => setSort("status", "desc")}
                  >
                    <SortIcon
                      active={sortCol === "status" && sortDir === "desc"}
                      dir="desc"
                    />{" "}
                    Decrescente (Z→A)
                  </button>
                </div>
                <div className={styles.colDropdownGrupo}>
                  <button
                    type="button"
                    className={`${styles.colDropdownItem} ${filtroStatus === null ? styles.colDropdownItemAtivo : ""}`}
                    onClick={() => {
                      setFiltroStatus(null);
                      setPagina(1);
                    }}
                  >
                    Todos
                  </button>
                  {["publicado", "rascunho", "arquivado"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      className={`${styles.colDropdownItem} ${filtroStatus === s ? styles.colDropdownItemAtivo : ""}`}
                      onClick={() => {
                        setFiltroStatus(s);
                        setPagina(1);
                      }}
                    >
                      <StatusBadge status={s} />
                    </button>
                  ))}
                </div>
              </>
            )}
            {(colDropdown === "autor" ||
              colDropdown === "criadoEm" ||
              colDropdown === "editadoEm") && (
              <div className={styles.colDropdownGrupo}>
                <button
                  type="button"
                  className={`${styles.colDropdownItem} ${sortCol === colDropdown && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`}
                  onClick={() => setSort(colDropdown, "asc")}
                >
                  <SortIcon
                    active={sortCol === colDropdown && sortDir === "asc"}
                    dir="asc"
                  />{" "}
                  Crescente
                </button>
                <button
                  type="button"
                  className={`${styles.colDropdownItem} ${sortCol === colDropdown && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`}
                  onClick={() => setSort(colDropdown, "desc")}
                >
                  <SortIcon
                    active={sortCol === colDropdown && sortDir === "desc"}
                    dir="desc"
                  />{" "}
                  Decrescente
                </button>
              </div>
            )}
          </div>,
          document.body,
        )}

      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitulo}>Todas as perguntas</h1>
          {temFiltros && (
            <button
              type="button"
              className={styles.btnLimparFiltros}
              onClick={limparFiltros}
            >
              Limpar filtros
            </button>
          )}
        </div>

        {loading ? (
          <p className={styles.loading}>Carregando...</p>
        ) : perguntas.length === 0 ? (
          <p className={styles.empty}>Nenhuma pergunta encontrada.</p>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Filme</th>
                    <th className={styles.colTitulo}>
                      <button
                        type="button"
                        className={`${styles.thBtn} ${colDropdown === "titulo" ? styles.thBtnAtivo : ""}`}
                        onClick={(e) => abrirColDropdown("titulo", e)}
                      >
                        ID{" "}
                        <SortIcon active={sortCol === "titulo"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button
                        type="button"
                        className={`${styles.thBtn} ${colDropdown === "tipo" ? styles.thBtnAtivo : ""}`}
                        onClick={(e) => abrirColDropdown("tipo", e)}
                      >
                        Tipo{" "}
                        <SortIcon active={sortCol === "tipo"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button
                        type="button"
                        className={`${styles.thBtn} ${colDropdown === "status" ? styles.thBtnAtivo : ""}`}
                        onClick={(e) => abrirColDropdown("status", e)}
                      >
                        Status{" "}
                        <SortIcon active={sortCol === "status"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button
                        type="button"
                        className={`${styles.thBtn} ${colDropdown === "autor" ? styles.thBtnAtivo : ""}`}
                        onClick={(e) => abrirColDropdown("autor", e)}
                      >
                        Autor{" "}
                        <SortIcon active={sortCol === "autor"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button
                        type="button"
                        className={`${styles.thBtn} ${colDropdown === "criadoEm" ? styles.thBtnAtivo : ""}`}
                        onClick={(e) => abrirColDropdown("criadoEm", e)}
                      >
                        Criado à{" "}
                        <SortIcon
                          active={sortCol === "criadoEm"}
                          dir={sortDir}
                        />
                      </button>
                    </th>
                    <th>
                      <button
                        type="button"
                        className={`${styles.thBtn} ${colDropdown === "editadoEm" ? styles.thBtnAtivo : ""}`}
                        onClick={(e) => abrirColDropdown("editadoEm", e)}
                      >
                        Editado à{" "}
                        <SortIcon
                          active={sortCol === "editadoEm"}
                          dir={sortDir}
                        />
                      </button>
                    </th>
                    <th className={styles.colAcoes}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {perguntasPagina.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        style={{ textAlign: "center" }}
                        className={styles.empty}
                      >
                        Nenhuma pergunta encontrada com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    perguntasPagina.map((pergunta) => (
                      <tr
                        key={pergunta.id}
                        className={styles.trClicavel}
                        onClick={() =>
                          router.push(`/adm/perguntas/editar/${pergunta.id}`)
                        }
                      >
                        <td className={styles.colFilme}>
                          <span className={styles.titulo}>
                            {pergunta.nomeFilme || "—"}
                          </span>
                        </td>
                        <td className={styles.colTitulo}>
                          <span className={styles.titulo}>
                            {pergunta.id || "—"}
                          </span>
                        </td>
                        <td>
                          <span className={styles.tipoBadge}>
                            {String(pergunta.tipo ?? "—").padStart(2, "0")}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={pergunta.status} />
                        </td>
                        <td>
                          {pergunta.autorNome ? (
                            <span
                              className={styles.avatarFallback}
                              title={pergunta.autorNome}
                            >
                              {pergunta.autorNome[0]}
                            </span>
                          ) : (
                            <span className={styles.avatarFallback}>?</span>
                          )}
                        </td>
                        <td className={styles.tempo}>
                          {tempoRelativo(pergunta.dataCadastro)}
                        </td>
                        <td className={styles.tempo}>
                          {tempoRelativo(
                            pergunta.dataPublicacao || pergunta.dataCadastro,
                          )}
                        </td>
                        <td
                          className={styles.colAcoes}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className={styles.btnAcoes}
                            onClick={(e) => abrirMenu(pergunta.id, e)}
                          >
                            •••
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPaginas > 1 && (
              <div className={styles.paginacao}>
                <span className={styles.paginacaoInfo}>
                  {(pagina - 1) * POR_PAGINA + 1}–
                  {Math.min(pagina * POR_PAGINA, perguntasOrdenadas.length)} de{" "}
                  {perguntasOrdenadas.length}
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
                        p === 1 ||
                        p === totalPaginas ||
                        Math.abs(p - pagina) <= 1,
                    )
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span
                          key={`dots-${idx}`}
                          className={styles.paginacaoDots}
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          className={`${styles.btnPagina} ${item === pagina ? styles.btnPaginaAtivo : ""}`}
                          onClick={() => setPagina(item)}
                        >
                          {item}
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
          </>
        )}
      </div>
    </AdmLayout>
  );
}
