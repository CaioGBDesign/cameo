import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import {
  collection, getDocs, doc, updateDoc, deleteDoc, setDoc, serverTimestamp,
} from "firebase/firestore";
import { createPortal } from "react-dom";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import TrashIcon from "@/components/icons/TrashIcon";
import EditIcon from "@/components/icons/EditIcon";
import VisualizarIcon from "@/components/icons/VisualizarIcon";
import DuplicarIcon from "@/components/icons/DuplicarIcon";
import RascunhoAcaoIcon from "@/components/icons/RascunhoAcaoIcon";
import CancelarAgendamentoIcon from "@/components/icons/CancelarAgendamentoIcon";
import ArquivarIcon from "@/components/icons/ArquivarIcon";
import DeletarIcon from "@/components/icons/DeletarIcon";
import PublicarIcon from "@/components/icons/PublicarIcon";
import StatusRascunhoIcon from "@/components/icons/StatusRascunhoIcon";
import StatusAgendadoIcon from "@/components/icons/StatusAgendadoIcon";
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
  agendado: {
    label: "Agendado",
    className: styles.statusAgendado,
    Icon: StatusAgendadoIcon,
  },
  arquivado: {
    label: "Arquivado",
    className: styles.statusArquivado,
    Icon: StatusArquivadoIcon,
  },
};

const calcularPrioridade = (noticia) => {
  if (!noticia.status || noticia.status.toLowerCase() === "publicado") return { label: "S/P", nivel: 0 };
  const ref = noticia.dataRascunho || noticia.dataPublicacao;
  if (!ref) return { label: "S/P", nivel: 0 };
  const dias = Math.floor(
    (Date.now() - ref.toDate().getTime()) / (1000 * 60 * 60 * 24),
  );
  if (dias >= 4) return { label: "Alta", nivel: 3 };
  if (dias >= 3) return { label: "Média", nivel: 2 };
  if (dias >= 2) return { label: "Baixa", nivel: 1 };
  return { label: "S/P", nivel: 0 };
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
  const config =
    STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.publicado;
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
  rascunho:  ["editar", "visualizar", "duplicar", "---", "deletar"],
  agendado:  ["editar", "visualizar", "publicar", "---", "cancelar_agendamento"],
  publicado: ["editar", "visualizar", "---", "arquivar", "despublicar"],
  arquivado: ["visualizar", "---", "reativar"],
};

const ACOES_CONFIG = {
  editar:               { label: "Editar",                  Icon: () => <EditIcon size={16} color="currentColor" /> },
  visualizar:           { label: "Visualizar",               Icon: VisualizarIcon },
  duplicar:             { label: "Duplicar",                 Icon: DuplicarIcon },
  publicar:             { label: "Publicar",                 Icon: PublicarIcon },
  cancelar_agendamento: { label: "Cancelar agendamento",     Icon: CancelarAgendamentoIcon },
  arquivar:             { label: "Arquivar",                 Icon: ArquivarIcon },
  despublicar:          { label: "Retornar para rascunho",   Icon: RascunhoAcaoIcon },
  reativar:             { label: "Reativar",                 Icon: RascunhoAcaoIcon },
  deletar:              { label: "Deletar",                  Icon: DeletarIcon },
};

const POR_PAGINA = 10;

const aplicarSort = (lista, col, dir) =>
  [...lista].sort((a, b) => {
    let va, vb;
    switch (col) {
      case "titulo":
        va = (a.titulo || "").toLowerCase();
        vb = (b.titulo || "").toLowerCase();
        return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      case "status":
        va = a.status?.toLowerCase() || "publicado";
        vb = b.status?.toLowerCase() || "publicado";
        return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      case "autor":
        va = (a.autor?.nome || "").toLowerCase();
        vb = (b.autor?.nome || "").toLowerCase();
        return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      case "criadoEm": {
        const tA = (a.dataRascunho || a.dataPublicacao)?.toMillis() ?? 0;
        const tB = (b.dataRascunho || b.dataPublicacao)?.toMillis() ?? 0;
        return dir === "asc" ? tA - tB : tB - tA;
      }
      case "editadoEm": {
        const tA = (a.dataPublicacao || a.dataRascunho)?.toMillis() ?? 0;
        const tB = (b.dataPublicacao || b.dataRascunho)?.toMillis() ?? 0;
        return dir === "asc" ? tA - tB : tB - tA;
      }
      case "prioridade":
        va = calcularPrioridade(a).nivel;
        vb = calcularPrioridade(b).nivel;
        return dir === "asc" ? va - vb : vb - va;
      default:
        return 0;
    }
  });

export default function AdmNoticias() {
  const router = useRouter();
  const [noticias, setNoticias] = useState([]);
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
  const [filtroPrioridade, setFiltroPrioridade] = useState(null);
  const [colDropdown, setColDropdown] = useState(null);
  const [colDropdownPos, setColDropdownPos] = useState({ top: 0, left: 0 });
  const colDropdownRef = useRef(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const snap = await getDocs(collection(db, "noticias"));
        const dados = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        dados.sort((a, b) => {
          const tA = (a.dataPublicacao || a.dataRascunho)?.toMillis() ?? 0;
          const tB = (b.dataPublicacao || b.dataRascunho)?.toMillis() ?? 0;
          return tB - tA;
        });
        setNoticias(dados);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(null);
      }
      if (colDropdownRef.current && !colDropdownRef.current.contains(e.target)) {
        setColDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const executarDeletar = async () => {
    if (!confirmarDeletar) return;
    await deleteDoc(doc(db, "noticias", confirmarDeletar.id));
    removerLocal(confirmarDeletar.id);
    setConfirmarDeletar(null);
  };

  const abrirMenu = (id, e) => {
    e.stopPropagation();
    if (menuAberto === id) { setMenuAberto(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 6, left: rect.right });
    setMenuAberto(id);
  };

  const atualizarLocal = (id, changes) =>
    setNoticias((prev) => prev.map((n) => n.id === id ? { ...n, ...changes } : n));

  const removerLocal = (id) =>
    setNoticias((prev) => prev.filter((n) => n.id !== id));

  const handleAcao = async (acao, noticia) => {
    setMenuAberto(null);
    const ref = doc(db, "noticias", noticia.id);

    switch (acao) {
      case "editar":
        router.push(`/adm/noticias/editar/${noticia.id}`);
        break;

      case "visualizar": {
        const status = noticia.status?.toLowerCase() || "publicado";
        const url = status === "publicado"
          ? `/noticias/detalhes/${noticia.id}`
          : `/noticias/detalhes/${noticia.id}?preview=true`;
        window.open(url, "_blank");
        break;
      }

      case "duplicar": {
        const novoId = `${noticia.id}-copia-${Date.now()}`;
        const { id: _id, ...resto } = noticia;
        await setDoc(doc(db, "noticias", novoId), {
          ...resto,
          titulo: `${noticia.titulo} (cópia)`,
          status: "rascunho",
          dataRascunho: serverTimestamp(),
          dataPublicacao: null,
        });
        const snap = await getDocs(collection(db, "noticias"));
        const dados = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        dados.sort((a, b) => {
          const tA = (a.dataPublicacao || a.dataRascunho)?.toMillis() ?? 0;
          const tB = (b.dataPublicacao || b.dataRascunho)?.toMillis() ?? 0;
          return tB - tA;
        });
        setNoticias(dados);
        break;
      }

      case "publicar":
        await updateDoc(ref, { status: "publicado", dataPublicacao: serverTimestamp() });
        atualizarLocal(noticia.id, { status: "publicado" });
        break;

      case "cancelar_agendamento":
        await updateDoc(ref, { status: "rascunho" });
        atualizarLocal(noticia.id, { status: "rascunho" });
        break;

      case "despublicar":
        await updateDoc(ref, { status: "rascunho" });
        atualizarLocal(noticia.id, { status: "rascunho" });
        break;

      case "arquivar":
        await updateDoc(ref, { status: "arquivado" });
        atualizarLocal(noticia.id, { status: "arquivado" });
        break;

      case "reativar":
        await updateDoc(ref, { status: "rascunho" });
        atualizarLocal(noticia.id, { status: "rascunho" });
        break;

      case "deletar":
        setConfirmarDeletar(noticia);
        break;
    }
  };

  const abrirColDropdown = (col, e) => {
    e.stopPropagation();
    if (colDropdown === col) { setColDropdown(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setColDropdownPos({ top: rect.bottom + 4, left: rect.left });
    setColDropdown(col);
  };

  const setSort = (col, dir) => { setSortCol(col); setSortDir(dir); };

  const temFiltros = filtroStatus !== null || filtroTitulo !== "" || filtroPrioridade !== null;

  const limparFiltros = () => {
    setFiltroStatus(null);
    setFiltroTitulo("");
    setFiltroPrioridade(null);
    setColDropdown(null);
    setPagina(1);
  };

  const noticiasFiltered = noticias.filter((n) => {
    if (filtroStatus && (n.status?.toLowerCase() || "publicado") !== filtroStatus) return false;
    if (filtroTitulo && !n.titulo?.toLowerCase().includes(filtroTitulo.toLowerCase())) return false;
    if (filtroPrioridade !== null && calcularPrioridade(n).nivel !== filtroPrioridade) return false;
    return true;
  });

  const noticiasOrdenadas = aplicarSort(noticiasFiltered, sortCol, sortDir);

  const totalPaginas = Math.ceil(noticiasOrdenadas.length / POR_PAGINA);
  const noticiasPagina = noticiasOrdenadas.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA,
  );

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

      {confirmarDeletar && createPortal(
        <div
          className={styles.popoverOverlay}
          onClick={() => setConfirmarDeletar(null)}
        >
          <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
            <p className={styles.popoverTexto}>
              Tem certeza que deseja deletar permanentemente <strong>"{confirmarDeletar.titulo}"</strong>? Esta ação não pode ser desfeita.
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
                <TrashIcon size={14} color="currentColor" />
                Deletar
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {menuAberto && (() => {
        const noticia = noticias.find((n) => n.id === menuAberto);
        if (!noticia) return null;
        const status = noticia.status?.toLowerCase() || "publicado";
        const acoes = ACOES_POR_STATUS[status] ?? ACOES_POR_STATUS.rascunho;
        return createPortal(
          <div
            ref={menuRef}
            className={styles.menuDropdown}
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            {acoes
              .reduce((grupos, acao) => {
                if (acao === "---") grupos.push([]);
                else grupos[grupos.length - 1].push(acao);
                return grupos;
              }, [[]])
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
                        onClick={() => handleAcao(acao, noticia)}
                      >
                        <span className={styles.menuItemIcon}><cfg.Icon /></span>
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

      {colDropdown && createPortal(
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
                  placeholder="Buscar por título..."
                  value={filtroTitulo}
                  onChange={(e) => { setFiltroTitulo(e.target.value); setPagina(1); }}
                />
              </div>
              <div className={styles.colDropdownGrupo}>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "titulo" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("titulo", "asc")}>
                  <SortIcon active={sortCol === "titulo" && sortDir === "asc"} dir="asc" /> Crescente (A→Z)
                </button>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "titulo" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("titulo", "desc")}>
                  <SortIcon active={sortCol === "titulo" && sortDir === "desc"} dir="desc" /> Decrescente (Z→A)
                </button>
              </div>
            </>
          )}

          {colDropdown === "status" && (
            <>
              <div className={styles.colDropdownGrupo}>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "status" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("status", "asc")}>
                  <SortIcon active={sortCol === "status" && sortDir === "asc"} dir="asc" /> Crescente (A→Z)
                </button>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "status" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("status", "desc")}>
                  <SortIcon active={sortCol === "status" && sortDir === "desc"} dir="desc" /> Decrescente (Z→A)
                </button>
              </div>
              <div className={styles.colDropdownGrupo}>
                <button type="button" className={`${styles.colDropdownItem} ${filtroStatus === null ? styles.colDropdownItemAtivo : ""}`} onClick={() => { setFiltroStatus(null); setPagina(1); }}>
                  Todos
                </button>
                {["publicado", "rascunho", "agendado", "arquivado"].map((s) => (
                  <button key={s} type="button" className={`${styles.colDropdownItem} ${filtroStatus === s ? styles.colDropdownItemAtivo : ""}`} onClick={() => { setFiltroStatus(s); setPagina(1); }}>
                    <StatusBadge status={s} />
                  </button>
                ))}
              </div>
            </>
          )}

          {(colDropdown === "autor" || colDropdown === "criadoEm" || colDropdown === "editadoEm") && (
            <div className={styles.colDropdownGrupo}>
              <button type="button" className={`${styles.colDropdownItem} ${sortCol === colDropdown && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort(colDropdown, "asc")}>
                <SortIcon active={sortCol === colDropdown && sortDir === "asc"} dir="asc" /> Crescente
              </button>
              <button type="button" className={`${styles.colDropdownItem} ${sortCol === colDropdown && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort(colDropdown, "desc")}>
                <SortIcon active={sortCol === colDropdown && sortDir === "desc"} dir="desc" /> Decrescente
              </button>
            </div>
          )}

          {colDropdown === "prioridade" && (
            <>
              <div className={styles.colDropdownGrupo}>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "prioridade" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("prioridade", "asc")}>
                  <SortIcon active={sortCol === "prioridade" && sortDir === "asc"} dir="asc" /> Crescente
                </button>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "prioridade" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("prioridade", "desc")}>
                  <SortIcon active={sortCol === "prioridade" && sortDir === "desc"} dir="desc" /> Decrescente
                </button>
              </div>
              <div className={styles.colDropdownGrupo}>
                <button type="button" className={`${styles.colDropdownItem} ${filtroPrioridade === null ? styles.colDropdownItemAtivo : ""}`} onClick={() => { setFiltroPrioridade(null); setPagina(1); }}>
                  Todos
                </button>
                {[{ label: "S/P", nivel: 0 }, { label: "Baixa", nivel: 1 }, { label: "Média", nivel: 2 }, { label: "Alta", nivel: 3 }].map(({ label, nivel }) => (
                  <button key={nivel} type="button" className={`${styles.colDropdownItem} ${filtroPrioridade === nivel ? styles.colDropdownItemAtivo : ""}`} onClick={() => { setFiltroPrioridade(nivel); setPagina(1); }}>
                    <PrioridadeBars nivel={nivel} />
                    <span className={styles.prioridadeLabel}>{label}</span>
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
          <h1 className={styles.pageTitulo}>Todas as notícias</h1>
          {temFiltros && (
            <button type="button" className={styles.btnLimparFiltros} onClick={limparFiltros}>
              Limpar filtros
            </button>
          )}
        </div>

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
                    <th>
                      <button type="button" className={`${styles.thBtn} ${colDropdown === "prioridade" ? styles.thBtnAtivo : ""}`} onClick={(e) => abrirColDropdown("prioridade", e)}>
                        Prioridade <SortIcon active={sortCol === "prioridade"} dir={sortDir} />
                      </button>
                    </th>
                    <th className={styles.colAcoes}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {noticiasPagina.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center" }} className={styles.empty}>
                        Nenhuma notícia encontrada com os filtros aplicados.
                      </td>
                    </tr>
                  ) : noticiasPagina.map((noticia) => {
                    const prioridade = calcularPrioridade(noticia);
                    const criadoEm = noticia.dataRascunho || noticia.dataPublicacao;
                    const editadoEm = noticia.dataPublicacao || noticia.dataRascunho;
                    return (
                      <tr
                        key={noticia.id}
                        className={styles.trClicavel}
                        onClick={() => router.push(`/adm/noticias/editar/${noticia.id}`)}
                      >
                        <td className={styles.colTitulo}>
                          <span className={styles.titulo}>
                            {noticia.titulo}
                          </span>
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
                        <td className={styles.tempo}>
                          {tempoRelativo(criadoEm)}
                        </td>
                        <td className={styles.tempo}>
                          {tempoRelativo(editadoEm)}
                        </td>
                        <td>
                          <span className={styles.prioridade}>
                            <PrioridadeBars nivel={prioridade.nivel} />
                            <span className={styles.prioridadeLabel}>
                              {prioridade.label}
                            </span>
                          </span>
                        </td>
                        <td className={styles.colAcoes} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className={styles.btnAcoes}
                            onClick={(e) => abrirMenu(noticia.id, e)}
                          >
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
                  {(pagina - 1) * POR_PAGINA + 1}–
                  {Math.min(pagina * POR_PAGINA, noticiasOrdenadas.length)} de{" "}
                  {noticiasOrdenadas.length}
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
