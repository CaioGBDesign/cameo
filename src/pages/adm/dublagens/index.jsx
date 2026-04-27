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
  serverTimestamp,
} from "firebase/firestore";
import { createPortal } from "react-dom";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import EditIcon from "@/components/icons/EditIcon";
import DeletarIcon from "@/components/icons/DeletarIcon";
import DuplicarIcon from "@/components/icons/DuplicarIcon";
import TrashIcon from "@/components/icons/TrashIcon";
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

const POR_PAGINA = 10;

export default function AdmDublagens() {
  const router = useRouter();

  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortCol, setSortCol] = useState("nomeFilme");
  const [sortDir, setSortDir] = useState("asc");
  const [pagina, setPagina] = useState(1);

  const [menuAberto, setMenuAberto] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  const [deletandoId, setDeletandoId] = useState(null);
  const [deletandoNome, setDeletandoNome] = useState("");

  const [busca, setBusca] = useState("");
  const [colDropdown, setColDropdown] = useState(null);
  const [colDropdownPos, setColDropdownPos] = useState({ top: 0, left: 0 });
  const colDropdownRef = useRef(null);

  useEffect(() => {
    const fetchFilmes = async () => {
      try {
        const snap = await getDocs(collection(db, "filmes"));
        const dados = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setFilmes(dados);
      } finally {
        setLoading(false);
      }
    };
    fetchFilmes();
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

  const abrirColDropdown = (col, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setColDropdownPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
    setColDropdown((prev) => (prev === col ? null : col));
  };

  const tempoRelativo = (timestamp) => {
    if (!timestamp) return "—";
    const dias = Math.floor(
      (Date.now() - timestamp.toDate().getTime()) / (1000 * 60 * 60 * 24),
    );
    if (dias === 0) return "Hoje";
    if (dias === 1) return "1 dia";
    return `${dias} dias`;
  };

  const filmesFiltrados = busca.trim()
    ? filmes.filter((f) => (f.nomeFilme ?? "").toLowerCase().includes(busca.toLowerCase()))
    : filmes;

  const filmesOrdenados = [...filmesFiltrados].sort((a, b) => {
    let va, vb;
    if (sortCol === "nomeFilme") {
      va = a.nomeFilme ?? "";
      vb = b.nomeFilme ?? "";
    } else if (sortCol === "idFilme") {
      va = a.idFilme ?? 0;
      vb = b.idFilme ?? 0;
    } else if (sortCol === "criadoEm") {
      va = a.dataCadastro?.toMillis() ?? 0;
      vb = b.dataCadastro?.toMillis() ?? 0;
    } else if (sortCol === "editadoEm") {
      va = a.dataEdicao?.toMillis() ?? 0;
      vb = b.dataEdicao?.toMillis() ?? 0;
    } else {
      va = "";
      vb = "";
    }
    const cmp =
      typeof va === "string" ? va.localeCompare(vb, "pt-BR") : va - vb;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPaginas = Math.ceil(filmesOrdenados.length / POR_PAGINA);
  const filmesPagina = filmesOrdenados.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA,
  );

  const abrirMenu = (id, e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.right + window.scrollX,
    });
    setMenuAberto(id);
  };

  const handleAcao = (acao, filme) => {
    setMenuAberto(null);
    if (acao === "editar") router.push(`/adm/dublagens/editar/${filme.id}`);
    if (acao === "deletar") {
      setDeletandoId(filme.id);
      setDeletandoNome(filme.nomeFilme || filme.id);
    }
  };

  const handleDuplicar = async (filme) => {
    setMenuAberto(null);
    const snap = await getDocs(collection(db, "filmes"));
    const ids = snap.docs.map((d) => {
      const m = d.id.match(/^DU(\d+)$/);
      return m ? parseInt(m[1]) : 0;
    });
    const novoId = `DU${String(Math.max(0, ...ids) + 1).padStart(4, "0")}`;
    const { id: _, dataCadastro: __, dataEdicao: ___, ...dados } = filme;
    await setDoc(doc(db, "filmes", novoId), {
      ...dados,
      nomeFilme: `${filme.nomeFilme} (cópia)`,
      dataCadastro: serverTimestamp(),
      dataEdicao: serverTimestamp(),
    });
    setFilmes((prev) => [
      ...prev,
      { id: novoId, ...dados, nomeFilme: `${filme.nomeFilme} (cópia)` },
    ]);
  };

  const confirmarDelete = async () => {
    if (!deletandoId) return;
    await deleteDoc(doc(db, "filmes", deletandoId));
    setFilmes((prev) => prev.filter((f) => f.id !== deletandoId));
    setDeletandoId(null);
  };

  const headerActions = (
    <Button
      variant="ghost"
      label="Criar dublagem"
      type="button"
      onClick={() => router.push("/adm/dublagens/criar")}
      border="var(--stroke-base)"
    />
  );

  return (
    <AdmLayout headerActions={headerActions}>
      <Head>
        <title>Dublagens — Cameo ADM</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitulo}>Todas as dublagens</h1>
        </div>

        <div className={styles.tableWrapper}>
          {loading ? (
            <p className={styles.loading}>Carregando...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.colNome}>
                    <button
                      type="button"
                      className={`${styles.thBtn} ${colDropdown === "nomeFilme" ? styles.thBtnAtivo : ""}`}
                      onClick={(e) => abrirColDropdown("nomeFilme", e)}
                    >
                      Nome do filme{" "}
                      <SortIcon active={sortCol === "nomeFilme"} dir={sortDir} />
                    </button>
                  </th>
                  <th style={{ width: 120 }}>
                    <button
                      type="button"
                      className={`${styles.thBtn} ${sortCol === "idFilme" ? styles.thBtnAtivo : ""}`}
                      onClick={() => toggleSort("idFilme")}
                    >
                      ID do filme{" "}
                      <SortIcon active={sortCol === "idFilme"} dir={sortDir} />
                    </button>
                  </th>
                  <th style={{ width: 120 }}>Dubladores</th>
                  <th style={{ width: 80 }}>Autor</th>
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
                {filmesPagina.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ textAlign: "center" }}
                      className={styles.empty}
                    >
                      Nenhuma dublagem cadastrada.
                    </td>
                  </tr>
                ) : (
                  filmesPagina.map((filme) => (
                    <tr
                      key={filme.id}
                      className={styles.trClicavel}
                      onClick={() =>
                        router.push(`/adm/dublagens/editar/${filme.id}`)
                      }
                    >
                      <td className={styles.colNome}>
                        <span className={styles.titulo}>
                          {filme.nomeFilme || "—"}
                        </span>
                      </td>
                      <td className={styles.tempo}>
                        {filme.idFilme ?? filme.id}
                      </td>
                      <td className={styles.tempo}>
                        {filme.dubladores?.length ?? 0} dublador(es)
                      </td>
                      <td>
                        <span className={styles.avatarFallback}>
                          {filme.autorNome?.[0] ?? "?"}
                        </span>
                      </td>
                      <td className={styles.tempo}>
                        {tempoRelativo(filme.dataCadastro)}
                      </td>
                      <td className={styles.tempo}>
                        {tempoRelativo(filme.dataEdicao)}
                      </td>
                      <td
                        className={styles.colAcoes}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className={styles.btnAcoes}
                          onClick={(e) => abrirMenu(filme.id, e)}
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
              {Math.min(pagina * POR_PAGINA, filmesOrdenados.length)} de{" "}
              {filmesOrdenados.length}
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

      {/* ─── Col dropdown nome do filme ─────────────────────── */}
      {colDropdown === "nomeFilme" &&
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
                placeholder="Buscar filme..."
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
                className={`${styles.colDropdownItem} ${sortCol === "nomeFilme" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`}
                onClick={() => setSort("nomeFilme", "asc")}
              >
                <SortIcon active={sortCol === "nomeFilme" && sortDir === "asc"} dir="asc" /> Crescente
              </button>
              <button
                type="button"
                className={`${styles.colDropdownItem} ${sortCol === "nomeFilme" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`}
                onClick={() => setSort("nomeFilme", "desc")}
              >
                <SortIcon active={sortCol === "nomeFilme" && sortDir === "desc"} dir="desc" /> Decrescente
              </button>
            </div>
          </div>,
          document.body,
        )}

      {/* ─── Menu dropdown ações ─────────────────────────────── */}
      {menuAberto &&
        createPortal(
          <div
            ref={menuRef}
            className={styles.menuDropdown}
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            <div className={styles.menuGrupo}>
              <button
                type="button"
                className={styles.menuItem}
                onClick={() =>
                  handleAcao(
                    "editar",
                    filmes.find((f) => f.id === menuAberto),
                  )
                }
              >
                <span className={styles.menuItemIcon}>
                  <EditIcon size={24} color="currentColor" />
                </span>
                Editar
              </button>
              <button
                type="button"
                className={styles.menuItem}
                onClick={() =>
                  handleDuplicar(filmes.find((f) => f.id === menuAberto))
                }
              >
                <span className={styles.menuItemIcon}>
                  <DuplicarIcon size={24} color="currentColor" />
                </span>
                Duplicar
              </button>
            </div>
            <div className={styles.menuGrupo}>
              <button
                type="button"
                className={`${styles.menuItem} ${styles.menuItemDanger}`}
                onClick={() =>
                  handleAcao(
                    "deletar",
                    filmes.find((f) => f.id === menuAberto),
                  )
                }
              >
                <span className={styles.menuItemIcon}>
                  <DeletarIcon size={24} />
                </span>
                Deletar
              </button>
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
