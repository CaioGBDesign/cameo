import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { createPortal } from "react-dom";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import TrashIcon from "@/components/icons/TrashIcon";
import EditIcon from "@/components/icons/EditIcon";
import styles from "./index.module.scss";

// ─── Ícones ───────────────────────────────────────────────────────────────────

const IcoVisualizar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M8 3C4.5 3 1.5 8 1.5 8s3 5 6.5 5 6.5-5 6.5-5-3-5-6.5-5z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

const IcoDeletar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2 4h12M5 4V2.5A.5.5 0 0 1 5.5 2h5a.5.5 0 0 1 .5.5V4M6 7v5M10 7v5M3 4l1 9.5A.5.5 0 0 0 4.5 14h7a.5.5 0 0 0 .5-.5L13 4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPublicado = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M7.49023 3.50781C7.49023 3.50781 7.74023 3.75781 7.99023 4.25781C7.99023 4.25781 8.78433 3.00781 9.49023 2.75781"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.99743 1.0107C3.74819 0.957812 2.78306 1.10172 2.78306 1.10172C2.17364 1.1453 1.00573 1.48696 1.00574 3.4823C1.00575 5.46068 0.99282 7.89968 1.00574 8.87198C1.00574 9.46603 1.37355 10.8517 2.64663 10.9259C4.19405 11.0162 6.98137 11.0354 8.26022 10.9259C8.60257 10.9066 9.74232 10.6379 9.88657 9.39783C10.036 8.11318 10.0063 7.22038 10.0063 7.00788"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 3.50781C11 4.88852 9.87963 6.00783 8.49758 6.00783C7.11553 6.00783 5.99518 4.88852 5.99518 3.50781C5.99518 2.1271 7.11553 1.00781 8.49758 1.00781C9.87963 1.00781 11 2.1271 11 3.50781Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.49023 6.50781H5.49022"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.49023 8.50781H7.49022"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconRascunho = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M4 3.5H8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 5.5H6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 10.75V10.5C6.5 9.0858 6.5 8.3787 6.93935 7.93935C7.3787 7.5 8.0858 7.5 9.5 7.5H9.75M10 6.67155V5C10 3.11438 10 2.17158 9.4142 1.58579C8.82845 1 7.8856 1 6 1C4.11439 1 3.17157 1 2.58578 1.58579C2 2.17157 2 3.11438 2 5V7.2721C2 8.8946 2 9.70585 2.44303 10.2554C2.53254 10.3664 2.63365 10.4674 2.74466 10.5569C3.29415 11 4.10541 11 5.7279 11C6.0807 11 6.25705 11 6.4186 10.943C6.4522 10.9311 6.4851 10.9175 6.51725 10.9022C6.6718 10.8282 6.7965 10.7035 7.04595 10.4541L9.4142 8.0858C9.70325 7.79675 9.84775 7.65225 9.9239 7.46845C10 7.2847 10 7.0803 10 6.67155Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconAgendado = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M10.5 5.75C10.5 3.51083 10.5 2.39124 9.8044 1.69562C9.10875 1 7.98915 1 5.75 1C3.51083 1 2.39124 1 1.69562 1.69562C1 2.39124 1 3.51083 1 5.75C1 7.98915 1 9.10875 1.69562 9.8044C2.36486 10.4736 3.42651 10.499 5.5 10.5"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path d="M1 3.5H10.5" stroke="currentColor" strokeLinecap="round" />
    <path
      d="M5 8H5.75M3 8H3.5M5 6H8M3 6H3.5"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path
      d="M10.6317 7.43586C10.1811 6.93256 9.91076 6.96251 9.61041 7.05241C9.40016 7.08236 8.67926 7.92111 8.37891 8.18826C7.88571 8.67391 7.39031 9.17396 7.35766 9.23921C7.26426 9.39051 7.17741 9.65861 7.13536 9.95816C7.05726 10.4075 6.90206 10.8908 7.08731 10.9567C7.17741 11.0765 7.62796 10.9168 8.07851 10.8509C8.37891 10.7969 8.58916 10.737 8.73936 10.6472C8.94961 10.5213 9.34006 10.078 10.0129 9.41896C10.4349 8.97606 10.8419 8.67001 10.9621 8.37046C11.0822 7.92111 10.902 7.68146 10.6317 7.43586Z"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

const IconArquivado = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M2 6.0002V7.2723C2 8.8948 2 9.70605 2.44303 10.2556C2.53254 10.3666 2.63365 10.4677 2.74466 10.5572C3.29415 11.0002 4.10541 11.0002 5.7279 11.0002C6.0807 11.0002 6.25705 11.0002 6.4186 10.9432C6.4522 10.9314 6.4851 10.9177 6.51725 10.9024C6.6718 10.8285 6.7965 10.7037 7.04595 10.4543L9.4142 8.086C9.70325 7.79695 9.84775 7.65245 9.9239 7.4687C10 7.2849 10 7.08055 10 6.6718V5.0002C10 3.1146 10 2.17179 9.4142 1.586C8.88465 1.05642 8.06325 1.00561 6.51725 1.00073M6.5 10.7502V10.5002C6.5 9.086 6.5 8.3789 6.93935 7.93955C7.3787 7.5002 8.0858 7.5002 9.5 7.5002H9.75"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 4.11514V2.73053C2 1.77465 2.7835 0.999756 3.75 0.999756C4.7165 0.999756 5.5 1.77465 5.5 2.73053V4.63437C5.5 5.1123 5.10825 5.49975 4.625 5.49975C4.14175 5.49975 3.75 5.1123 3.75 4.63437V2.73053"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
    Icon: IconPublicado,
  },
  rascunho: {
    label: "Rascunho",
    className: styles.statusRascunho,
    Icon: IconRascunho,
  },
  agendado: {
    label: "Agendado",
    className: styles.statusAgendado,
    Icon: IconAgendado,
  },
  arquivado: {
    label: "Arquivado",
    className: styles.statusArquivado,
    Icon: IconArquivado,
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

  const [dubladores, setDubladores] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─── Ordenação ────────────────────────────────────────────
  const [sortCol, setSortCol] = useState("nomeArtistico");
  const [sortDir, setSortDir] = useState("asc");

  // ─── Filtros ──────────────────────────────────────────────
  const [filtroStatus, setFiltroStatus] = useState(null);

  // ─── Paginação ────────────────────────────────────────────
  const [pagina, setPagina] = useState(1);

  // ─── Menu ações ───────────────────────────────────────────
  const [menuAberto, setMenuAberto] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

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
      router.push(`/dubladores/detalhes-dubladores/${dublador.id}`);
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
                      className={`${styles.thBtn} ${sortCol === "nomeArtistico" ? styles.thBtnAtivo : ""}`}
                      onClick={() => toggleSort("nomeArtistico")}
                    >
                      Nome artístico{" "}
                      <SortIcon
                        active={sortCol === "nomeArtistico"}
                        dir={sortDir}
                      />
                    </button>
                  </th>
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
                  <th className={styles.colAcoes}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {dubladoresPagina.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
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
                        <IcoVisualizar />
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
                        <IcoDeletar />
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
              ].map(({ label, valor }) => (
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
