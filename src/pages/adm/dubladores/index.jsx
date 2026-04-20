import { useState, useEffect, useRef } from "react";
import { toSlug } from "@/utils/slug";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { createPortal } from "react-dom";
import { useToast } from "@/contexts/toast";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import TrashIcon from "@/components/icons/TrashIcon";
import EditIcon from "@/components/icons/EditIcon";
import VisualizarIcon from "@/components/icons/VisualizarIcon";
import DeletarIcon from "@/components/icons/DeletarIcon";
import StatusPublicadoIcon from "@/components/icons/StatusPublicadoIcon";
import StatusRascunhoIcon from "@/components/icons/StatusRascunhoIcon";
import StatusAgendadoIcon from "@/components/icons/StatusAgendadoIcon";
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

// ─── Status de publicação ─────────────────────────────────────────────────────

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

const POR_PAGINA = 10;

export default function AdmDubladores() {
  const router = useRouter();
  const { toast } = useToast();

  const [dubladores, setDubladores] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Ordenação ────────────────────────────────────────────
  const [sortCol, setSortCol] = useState("nomeArtistico");
  const [sortDir, setSortDir] = useState("asc");

  // ─── Filtros ──────────────────────────────────────────────
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [busca, setBusca] = useState("");

  // ─── Paginação ────────────────────────────────────────────
  const [pagina, setPagina] = useState(1);

  // ─── Menu ações ───────────────────────────────────────────
  const [menuAberto, setMenuAberto] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  // ─── Toast de redirect ────────────────────────────────────
  useEffect(() => {
    if (router.query.toast === "salvo") {
      toast.success("Alterações salvas com sucesso", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-verde-01)",
      });
      router.replace("/adm/dubladores", undefined, { shallow: true });
    }
  }, [router.query.toast]);

  // ─── Popover deletar ──────────────────────────────────────
  const [deletandoId, setDeletandoId] = useState(null);
  const [deletandoNome, setDeletandoNome] = useState("");

  // ─── Col Dropdown ─────────────────────────────────────────
  const [colDropdown, setColDropdown] = useState(null);
  const [colDropdownPos, setColDropdownPos] = useState({ top: 0, left: 0 });
  const colDropdownRef = useRef(null);

  // ─── Fetch ────────────────────────────────────────────────
  useEffect(() => {
    const fetchDubladores = async () => {
      try {
        const snap = await getDocs(collection(db, "dubladores"));
        const dados = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setDubladores(dados);
      } finally {
        setLoading(false);
      }
    };
    fetchDubladores();
  }, []);

  // ─── Click fora fecha menus ────────────────────────────────
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

  // ─── Ordenação ────────────────────────────────────────────
  const setSort = (col, dir) => {
    setSortCol(col);
    setSortDir(dir);
    setColDropdown(null);
  };
  const toggleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  // ─── Filtro ───────────────────────────────────────────────
  const dubladoresFiltrados = dubladores.filter((d) => {
    if (
      filtroStatus !== null &&
      (d.statusPublicacao?.toLowerCase() ?? "publicado") !== filtroStatus
    )
      return false;
    if (busca.trim()) {
      const termo = busca.trim().toLowerCase();
      const nome = (d.nomeArtistico ?? d.nomeCompleto ?? "").toLowerCase();
      if (!nome.includes(termo)) return false;
    }
    return true;
  });

  // ─── Tempo relativo ───────────────────────────────────────
  const tempoRelativo = (timestamp) => {
    if (!timestamp) return "—";
    const dias = Math.floor(
      (Date.now() - timestamp.toDate().getTime()) / (1000 * 60 * 60 * 24),
    );
    if (dias === 0) return "Hoje";
    if (dias === 1) return "1 dia(s)";
    return `${dias} dia(s)`;
  };

  // ─── Ordenação ────────────────────────────────────────────
  const dubladoresOrdenados = [...dubladoresFiltrados].sort((a, b) => {
    let va, vb;
    if (sortCol === "nomeArtistico") {
      va = a.nomeArtistico ?? "";
      vb = b.nomeArtistico ?? "";
    } else if (sortCol === "statusPublicacao") {
      va = a.statusPublicacao ?? "";
      vb = b.statusPublicacao ?? "";
    } else if (sortCol === "criadoEm") {
      va = a.dataCadastro?.toMillis() ?? 0;
      vb = b.dataCadastro?.toMillis() ?? 0;
    } else if (sortCol === "editadoEm") {
      va =
        (a.dataPublicacao || a.dataRascunho || a.dataCadastro)?.toMillis() ?? 0;
      vb =
        (b.dataPublicacao || b.dataRascunho || b.dataCadastro)?.toMillis() ?? 0;
    } else {
      va = "";
      vb = "";
    }
    const cmp =
      typeof va === "string" ? va.localeCompare(vb, "pt-BR") : va - vb;
    return sortDir === "asc" ? cmp : -cmp;
  });

  // ─── Paginação ────────────────────────────────────────────
  const totalPaginas = Math.ceil(dubladoresOrdenados.length / POR_PAGINA);
  const dubladoresPagina = dubladoresOrdenados.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA,
  );

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

  const handleAcao = (acao, dublador) => {
    setMenuAberto(null);
    if (acao === "editar") router.push(`/adm/dubladores/editar/${dublador.id}`);
    if (acao === "visualizar")
      window.open(`/dubladores/${toSlug(dublador.nomeArtistico || dublador.id)}`, "_blank");
    if (acao === "deletar") {
      setDeletandoId(dublador.id);
      setDeletandoNome(dublador.nomeArtistico);
    }
  };

  const confirmarDelete = async () => {
    if (!deletandoId) return;
    await deleteDoc(doc(db, "dubladores", deletandoId));
    setDubladores((prev) => prev.filter((d) => d.id !== deletandoId));
    setDeletandoId(null);
  };

  // ─── Col Dropdown ─────────────────────────────────────────
  const abrirColDropdown = (col, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setColDropdownPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
    });
    setColDropdown((prev) => (prev === col ? null : col));
  };

  const headerActions = (
    <Button
      variant="ghost"
      label="Criar dublador"
      type="button"
      onClick={() => router.push("/adm/dubladores/criar")}
      border="var(--stroke-base)"
    />
  );

  return (
    <AdmLayout headerActions={headerActions}>
      <Head>
        <title>Dubladores — Cameo ADM</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitulo}>Todos os dubladores</h1>
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
                      className={`${styles.thBtn} ${colDropdown === "nomeArtistico" ? styles.thBtnAtivo : ""}`}
                      onClick={(e) => abrirColDropdown("nomeArtistico", e)}
                    >
                      Nome artístico{" "}
                      <SortIcon
                        active={sortCol === "nomeArtistico"}
                        dir={sortDir}
                      />
                    </button>
                  </th>
                  <th style={{ width: 110 }}>Código</th>
                  <th style={{ width: 150 }}>
                    <button
                      type="button"
                      className={`${styles.thBtn} ${colDropdown === "statusPublicacao" ? styles.thBtnAtivo : ""}`}
                      onClick={(e) => abrirColDropdown("statusPublicacao", e)}
                    >
                      Status{" "}
                      <SortIcon
                        active={sortCol === "statusPublicacao"}
                        dir={sortDir}
                      />
                    </button>
                  </th>
                  <th style={{ width: 60 }}>Autor</th>
                  <th style={{ width: 120 }}>
                    <button
                      type="button"
                      className={`${styles.thBtn} ${sortCol === "criadoEm" ? styles.thBtnAtivo : ""}`}
                      onClick={() => toggleSort("criadoEm")}
                    >
                      Criado à{" "}
                      <SortIcon active={sortCol === "criadoEm"} dir={sortDir} />
                    </button>
                  </th>
                  <th style={{ width: 120 }}>
                    <button
                      type="button"
                      className={`${styles.thBtn} ${sortCol === "editadoEm" ? styles.thBtnAtivo : ""}`}
                      onClick={() => toggleSort("editadoEm")}
                    >
                      Editado à{" "}
                      <SortIcon
                        active={sortCol === "editadoEm"}
                        dir={sortDir}
                      />
                    </button>
                  </th>
                  <th style={{ width: 80 }}>Verificar</th>
                  <th className={styles.colAcoes}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {dubladoresPagina.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{ textAlign: "center" }}
                      className={styles.empty}
                    >
                      Nenhum dublador encontrado.
                    </td>
                  </tr>
                ) : (
                  dubladoresPagina.map((dublador) => {
                    const criadoEm = dublador.dataCadastro;
                    const editadoEm =
                      dublador.dataPublicacao ||
                      dublador.dataRascunho ||
                      dublador.dataCadastro;
                    return (
                      <tr
                        key={dublador.id}
                        className={styles.trClicavel}
                        onClick={() =>
                          router.push(`/adm/dubladores/editar/${dublador.id}`)
                        }
                      >
                        <td>
                          {dublador.imagemUrl ? (
                            <img
                              src={dublador.imagemUrl}
                              alt={dublador.nomeArtistico}
                              className={styles.fotoDublador}
                              unoptimized
                            />
                          ) : (
                            <span className={styles.fotoDubladorFallback}>
                              {dublador.nomeArtistico?.[0] ?? "?"}
                            </span>
                          )}
                        </td>
                        <td className={styles.colNome}>
                          <span className={styles.titulo}>
                            {dublador.nomeArtistico}
                          </span>
                        </td>
                        <td className={styles.tempo}>{dublador.id}</td>
                        <td>
                          <StatusBadge status={dublador.statusPublicacao} />
                        </td>
                        <td>
                          {dublador.autor?.avatarUrl ? (
                            <img
                              src={dublador.autor.avatarUrl}
                              alt={dublador.autor.nome}
                              className={styles.avatar}
                              title={dublador.autor.nome}
                            />
                          ) : (
                            <span className={styles.avatarFallback}>
                              {dublador.autor?.nome?.[0] ?? "?"}
                            </span>
                          )}
                        </td>
                        <td className={styles.tempo}>
                          {tempoRelativo(criadoEm)}
                        </td>
                        <td className={styles.tempo}>
                          {tempoRelativo(editadoEm)}
                        </td>
                        <td className={styles.tempo}>
                          {dublador.verificarFamiliares ? "Sim" : "—"}
                        </td>
                        <td
                          className={styles.colAcoes}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className={styles.btnAcoes}
                            onClick={(e) => abrirMenu(dublador.id, e)}
                          >
                            •••
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {totalPaginas > 1 && (
          <div className={styles.paginacao}>
            <span className={styles.paginacaoInfo}>
              {(pagina - 1) * POR_PAGINA + 1}–
              {Math.min(pagina * POR_PAGINA, dubladoresOrdenados.length)} de{" "}
              {dubladoresOrdenados.length}
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
              const d = dubladores.find((x) => x.id === menuAberto);
              if (!d) return null;
              return (
                <>
                  <div className={styles.menuGrupo}>
                    <button
                      type="button"
                      className={styles.menuItem}
                      onClick={() => handleAcao("editar", d)}
                    >
                      <span className={styles.menuItemIcon}>
                        <EditIcon size={16} color="currentColor" />
                      </span>{" "}
                      Editar
                    </button>
                    <button
                      type="button"
                      className={styles.menuItem}
                      onClick={() => handleAcao("visualizar", d)}
                    >
                      <span className={styles.menuItemIcon}>
                        <VisualizarIcon />
                      </span>{" "}
                      Visualizar
                    </button>
                  </div>
                  <div className={styles.menuGrupo}>
                    <button
                      type="button"
                      className={`${styles.menuItem} ${styles.menuItemDanger}`}
                      onClick={() => handleAcao("deletar", d)}
                    >
                      <span className={styles.menuItemIcon}>
                        <DeletarIcon />
                      </span>{" "}
                      Deletar
                    </button>
                  </div>
                </>
              );
            })()}
          </div>,
          document.body,
        )}

      {/* ─── Col dropdown nome artístico ────────────────────── */}
      {colDropdown === "nomeArtistico" &&
        createPortal(
          <div
            ref={colDropdownRef}
            className={styles.colDropdown}
            style={{ top: colDropdownPos.top, left: colDropdownPos.left }}
          >
            <div className={styles.colDropdownGrupo}>
              <input
                autoFocus
                type="text"
                className={styles.colDropdownBusca}
                placeholder="Buscar dublador..."
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPagina(1);
                }}
              />
            </div>
            <div className={styles.colDropdownGrupo}>
              <button
                type="button"
                className={`${styles.colDropdownItem} ${sortCol === "nomeArtistico" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`}
                onClick={() => setSort("nomeArtistico", "asc")}
              >
                <SortIcon
                  active={sortCol === "nomeArtistico" && sortDir === "asc"}
                  dir="asc"
                />{" "}
                Crescente
              </button>
              <button
                type="button"
                className={`${styles.colDropdownItem} ${sortCol === "nomeArtistico" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`}
                onClick={() => setSort("nomeArtistico", "desc")}
              >
                <SortIcon
                  active={sortCol === "nomeArtistico" && sortDir === "desc"}
                  dir="desc"
                />{" "}
                Decrescente
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* ─── Col dropdown status ─────────────────────────────── */}
      {colDropdown === "statusPublicacao" &&
        createPortal(
          <div
            ref={colDropdownRef}
            className={styles.colDropdown}
            style={{ top: colDropdownPos.top, left: colDropdownPos.left }}
          >
            <div className={styles.colDropdownGrupo}>
              <button
                type="button"
                className={`${styles.colDropdownItem} ${sortCol === "statusPublicacao" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`}
                onClick={() => setSort("statusPublicacao", "asc")}
              >
                <SortIcon
                  active={sortCol === "statusPublicacao" && sortDir === "asc"}
                  dir="asc"
                />{" "}
                Crescente
              </button>
              <button
                type="button"
                className={`${styles.colDropdownItem} ${sortCol === "statusPublicacao" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`}
                onClick={() => setSort("statusPublicacao", "desc")}
              >
                <SortIcon
                  active={sortCol === "statusPublicacao" && sortDir === "desc"}
                  dir="desc"
                />{" "}
                Decrescente
              </button>
            </div>
            <div className={styles.colDropdownGrupo}>
              {[
                { label: "Publicado", valor: "publicado" },
                { label: "Rascunho", valor: "rascunho" },
                { label: "Agendado", valor: "agendado" },
                { label: "Arquivado", valor: "arquivado" },
              ].map(({ valor }) => (
                <button
                  key={valor}
                  type="button"
                  className={`${styles.colDropdownItem} ${filtroStatus === valor ? styles.colDropdownItemAtivo : ""}`}
                  onClick={() => {
                    setFiltroStatus(filtroStatus === valor ? null : valor);
                    setPagina(1);
                    setColDropdown(null);
                  }}
                >
                  <StatusBadge status={valor} />
                </button>
              ))}
            </div>
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
