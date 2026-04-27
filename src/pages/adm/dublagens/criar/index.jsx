import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import CloseIcon from "@/components/icons/CloseIcon";
import * as XLSX from "xlsx";
import { FamiliarNomeInput } from "@/pages/adm/dubladores/criar";

function FuncaoSearchInput({ opcoes = [], onSelecionar }) {
  const [busca, setBusca] = useState("");
  const [aberto, setAberto] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setAberto(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtradas = opcoes.filter(
    (o) => !busca.trim() || o.label.toLowerCase().includes(busca.toLowerCase()),
  );

  const selecionar = (valor) => {
    onSelecionar(valor);
    setBusca("");
    setAberto(false);
  };

  return (
    <div ref={wrapperRef} className={styles.searchWrapper}>
      <TextInput
        placeholder="Selecionar função..."
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setAberto(true);
        }}
        onFocus={() => setAberto(true)}
      />
      {aberto && filtradas.length > 0 && (
        <div className={styles.searchDropdown}>
          {filtradas.map((o) => (
            <button
              key={o.value}
              type="button"
              className={styles.searchDropdownItem}
              onMouseDown={() => selecionar(o.value)}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EstudioSearchInput({
  value,
  onChange,
  estudios = [],
  estudioId = null,
}) {
  const [aberto, setAberto] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target))
        setAberto(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtrados = estudios
    .filter(
      (e) =>
        !value.trim() || e.nome?.toLowerCase().includes(value.toLowerCase()),
    )
    .sort((a, b) => (a.nome ?? "").localeCompare(b.nome ?? "", "pt"))
    .slice(0, 20);

  const selecionar = (e) => {
    onChange(e.nome, e.id);
    setAberto(false);
  };

  return (
    <div ref={wrapperRef} className={styles.searchWrapper}>
      <TextInput
        label="Estúdio de dublagem"
        placeholder="Buscar estúdio..."
        value={value}
        onChange={(e) => {
          onChange(e.target.value, null);
          setAberto(true);
        }}
        onFocus={() => setAberto(true)}
        prefix={estudioId ? estudioId : undefined}
        success={!!estudioId}
      />
      {aberto && filtrados.length > 0 && (
        <div className={styles.searchDropdown}>
          {filtrados.map((e) => (
            <button
              key={e.id}
              type="button"
              className={styles.searchDropdownItem}
              onMouseDown={() => selecionar(e)}
            >
              {e.nome}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
import { useAuth } from "@/contexts/auth";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import TextInput from "@/components/inputs/text-input";
import Select from "@/components/inputs/select";
import Switch from "@/components/inputs/switch";
import UploadImagem from "@/components/upload-imagem";
import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import styles from "./index.module.scss";

const ENTRADA_VAZIA = {
  idDublador: "",
  nomeDublador: "",
  dubladorValido: null,
  personagem: "",
  atorOriginal: "",
};

const FUNCOES_TECNICAS_OPTIONS = [
  "Adaptação Musical",
  "Assistência de Produção",
  "Audiodescrição",
  "Data de Gravação",
  "Direção de Audiodescrição",
  "Direção Musical",
  "Dublagem",
  "Edição",
  "Gerenciamento de Projeto",
  "Gravação",
  "Gravação de Audiodescrição",
  "Leitura de Placas",
  "Locução",
  "Mixagem",
  "Produção",
  "Revisão de Tradução",
  "Supervisão de Produção",
  "Tradução",
  "Tradução de Audiodescrição",
  "Tradução e Adaptação",
].map((f) => ({ value: f, label: f }));

export default function CriarDublagem({ id = null, initialData = null }) {
  const router = useRouter();
  const { user } = useAuth();
  const isEdit = !!id;

  // ── Filme ──────────────────────────────────────────────────────────────────
  const [idFilme, setIdFilme] = useState(
    initialData?.idFilme ? String(initialData.idFilme) : "",
  );
  const [nomeFilme, setNomeFilme] = useState(initialData?.nomeFilme ?? "");

  // ── Elenco ─────────────────────────────────────────────────────────────────
  const [entradas, setEntradas] = useState(
    initialData?.dubladores?.length
      ? initialData.dubladores.map((e) => ({
          ...ENTRADA_VAZIA,
          ...e,
          nomeDublador: e.nomeDublador ?? "",
          dubladorValido: e.idDublador != null,
        }))
      : [{ ...ENTRADA_VAZIA }],
  );

  const [sidebarView, setSidebarView] = useState(0);
  const [equipeTecnica, setEquipeTecnica] = useState(
    Array.isArray(initialData?.equipeTecnica) ? initialData.equipeTecnica : [],
  );
  const [loading, setLoading] = useState(false);
  const [importDropdownAberto, setImportDropdownAberto] = useState(false);
  const importDropdownRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (
        importDropdownRef.current &&
        !importDropdownRef.current.contains(e.target)
      )
        setImportDropdownAberto(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const [erros, setErros] = useState({});
  const [dubladores, setDubladores] = useState([]);
  const [estudios, setEstudios] = useState([]);
  const [estudioNome, setEstudioNome] = useState(
    initialData?.estudioNome ?? "",
  );
  const [estudioId, setEstudioId] = useState(initialData?.estudioId ?? null);
  const [direcaoNome, setDirecaoNome] = useState(
    initialData?.direcaoDublagem?.nome ?? "",
  );
  const [direcaoId, setDirecaoId] = useState(
    initialData?.direcaoDublagem?.id ?? null,
  );
  const [traducaoNome, setTraducaoNome] = useState(
    initialData?.traducao?.nome ?? "",
  );
  const [traducaoId, setTraducaoId] = useState(
    initialData?.traducao?.id ?? null,
  );
  const [producao, setProducao] = useState(
    Array.isArray(initialData?.producao) ? initialData.producao : [],
  );

  // ── Carrega dubladores e estúdios; popula nomes em modo edição ────────────
  useEffect(() => {
    Promise.all([
      getDocs(collection(db, "dubladores")),
      getDocs(collection(db, "estudios")),
    ]).then(([dubSnap, estSnap]) => {
      const listaDub = dubSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setDubladores(listaDub);
      setEstudios(estSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      if (isEdit) {
        setEntradas((prev) =>
          prev.map((e) => {
            const found = listaDub.find((d) => d.id === e.idDublador);
            return found
              ? {
                  ...e,
                  nomeDublador: found.nomeArtistico || found.nomeCompleto || "",
                  dubladorValido: true,
                }
              : e;
          }),
        );
      }
    });
  }, []);

  // ── Auto-fetch dados do filme via TMDB ────────────────────────────────────
  useEffect(() => {
    if (!idFilme) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${idFilme}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.title && !nomeFilme) setNomeFilme(data.title);
        if (Array.isArray(data.production_companies))
          setProducao(data.production_companies.map((c) => c.name));
      } catch {}
    }, 600);
    return () => clearTimeout(timer);
  }, [idFilme]);

  // ── Entradas ───────────────────────────────────────────────────────────────
  const atualizarEntrada = (index, campo, valor) => {
    setEntradas((prev) => {
      const nova = [...prev];
      nova[index] = { ...nova[index], [campo]: valor };
      return nova;
    });
  };

  const adicionarEntrada = () =>
    setEntradas((prev) => [...prev, { ...ENTRADA_VAZIA }]);

  const removerEntrada = (index) =>
    setEntradas((prev) => prev.filter((_, i) => i !== index));

  // ── Equipe técnica ─────────────────────────────────────────────────────────
  const selecionarFuncao = (funcao) => {
    if (!funcao) return;
    if (!equipeTecnica.find((e) => e.funcao === funcao)) {
      setEquipeTecnica((prev) => [
        ...prev,
        {
          funcao,
          profissionais:
            funcao === "Data de Gravação"
              ? [{ data: "", exibirDataCompleta: false }]
              : [{ tipo: "", nome: "", idPessoa: null, imagem: null }],
        },
      ]);
    }
  };

  const adicionarProfissional = (funcao) =>
    setEquipeTecnica((prev) =>
      prev.map((e) =>
        e.funcao === funcao
          ? {
              ...e,
              profissionais: [
                ...e.profissionais,
                { tipo: "", nome: "", idPessoa: null, imagem: null },
              ],
            }
          : e,
      ),
    );

  const atualizarCampoProfissional = (funcao, index, updates) =>
    setEquipeTecnica((prev) =>
      prev.map((e) =>
        e.funcao === funcao
          ? {
              ...e,
              profissionais: e.profissionais.map((p, i) =>
                i === index ? { ...p, ...updates } : p,
              ),
            }
          : e,
      ),
    );

  const removerProfissional = (funcao, index) =>
    setEquipeTecnica((prev) =>
      prev
        .map((e) =>
          e.funcao === funcao
            ? {
                ...e,
                profissionais: e.profissionais.filter((_, i) => i !== index),
              }
            : e,
        )
        .filter((e) => e.profissionais.length > 0),
    );

  // ── Gerar ID ───────────────────────────────────────────────────────────────
  const gerarId = async () => {
    const snap = await getDocs(collection(db, "filmes"));
    const ids = snap.docs.map((d) => {
      const m = d.id.match(/^DU(\d+)$/);
      return m ? parseInt(m[1]) : 0;
    });
    return `DU${String(Math.max(0, ...ids) + 1).padStart(4, "0")}`;
  };

  // ── Salvar ─────────────────────────────────────────────────────────────────
  // ── Importar planilha ─────────────────────────────────────────────────────
  const fileInputElencoRef = useRef(null);
  const fileInputEquipeRef = useRef(null);

  const handleImportarElenco = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const novasEntradas = [];
      rows.forEach((row) => {
        const nome = (row["Nome"] || row["nome"] || "").toString().trim();
        const personagem = (row["Personagem"] || row["personagem"] || "")
          .toString()
          .trim();
        const atorOriginal = (
          row["Ator Original"] ||
          row["ator original"] ||
          row["Ator original"] ||
          ""
        )
          .toString()
          .trim();
        if (!nome) return;
        const found = dubladores.find(
          (d) =>
            (d.nomeArtistico || d.nomeCompleto || "").toLowerCase() ===
            nome.toLowerCase(),
        );
        novasEntradas.push({
          idDublador: found ? found.id : "",
          nomeDublador: found
            ? found.nomeArtistico || found.nomeCompleto
            : nome,
          dubladorValido: !!found,
          personagem,
          atorOriginal,
        });
      });

      setEntradas((prev) => {
        const existentes = prev.filter((e) => e.nomeDublador.trim());
        const novos = novasEntradas.filter(
          (n) =>
            !existentes.some(
              (e) =>
                e.nomeDublador.toLowerCase() === n.nomeDublador.toLowerCase(),
            ),
        );
        const merged = [...existentes, ...novos];
        return merged.length > 0 ? merged : [{ ...ENTRADA_VAZIA }];
      });
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
    setImportDropdownAberto(false);
  };

  const handleImportarEquipe = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const novaEquipe = {};
      let novaDirecaoNome = null,
        novaDirecaoId = null;
      let novaTraducaoNome = null,
        novaTraducaoId = null;

      rows.forEach((row) => {
        const funcao = (row["Função"] || row["funcao"] || row["Funcao"] || "")
          .toString()
          .trim();
        const nome = (row["Nome"] || row["nome"] || "").toString().trim();
        if (!funcao || !nome) return;
        const funcaoLower = funcao.toLowerCase();
        const found = dubladores.find(
          (d) =>
            (d.nomeArtistico || d.nomeCompleto || "").toLowerCase() ===
            nome.toLowerCase(),
        );
        const nomeResolvido = found
          ? found.nomeArtistico || found.nomeCompleto
          : nome;
        const idResolvido = found ? found.id : null;

        if (funcaoLower.includes("dire")) {
          novaDirecaoNome = nomeResolvido;
          novaDirecaoId = idResolvido;
        } else if (funcaoLower.includes("tradu")) {
          novaTraducaoNome = nomeResolvido;
          novaTraducaoId = idResolvido;
        } else {
          if (!novaEquipe[funcao]) novaEquipe[funcao] = [];
          novaEquipe[funcao].push({
            tipo: "Pessoa",
            nome: nomeResolvido,
            idPessoa: idResolvido,
          });
        }
      });

      if (novaDirecaoNome) {
        setDirecaoNome(novaDirecaoNome);
        setDirecaoId(novaDirecaoId);
      }
      if (novaTraducaoNome) {
        setTraducaoNome(novaTraducaoNome);
        setTraducaoId(novaTraducaoId);
      }

      setEquipeTecnica((prev) => {
        const updated = [...prev];
        Object.entries(novaEquipe).forEach(([funcao, profissionais]) => {
          const idx = updated.findIndex(
            (e) => e.funcao.toLowerCase() === funcao.toLowerCase(),
          );
          if (idx >= 0) {
            const existentesNomes = updated[idx].profissionais.map((p) =>
              p.nome?.toLowerCase(),
            );
            const novos = profissionais.filter(
              (p) => !existentesNomes.includes(p.nome?.toLowerCase()),
            );
            updated[idx] = {
              ...updated[idx],
              profissionais: [...updated[idx].profissionais, ...novos],
            };
          } else {
            updated.push({ funcao, profissionais });
          }
        });
        return updated;
      });
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
    setImportDropdownAberto(false);
  };

  const handleBaixarModelos = () => {
    const wsElenco = XLSX.utils.aoa_to_sheet([
      ["Nome", "Personagem", "Ator Original"],
      ["", "", ""],
    ]);
    wsElenco["!cols"] = [{ wch: 30 }, { wch: 25 }, { wch: 25 }];
    const wbElenco = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbElenco, wsElenco, "Elenco");
    XLSX.writeFile(wbElenco, "modelo-elenco.xlsx");

    const wsEquipe = XLSX.utils.aoa_to_sheet([
      ["Função", "Nome"],
      ["Locução", ""],
      ["Direção Musical", ""],
    ]);
    wsEquipe["!cols"] = [{ wch: 25 }, { wch: 30 }];
    const wbEquipe = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wbEquipe, wsEquipe, "Equipe Técnica");
    XLSX.writeFile(wbEquipe, "modelo-equipe-tecnica.xlsx");

    setImportDropdownAberto(false);
  };

  // ── Salvar ─────────────────────────────────────────────────────────────────
  // ── Importar planilha ─────────────────────────────────────────────────────
  const handleImportarPlanilha = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const novasEntradas = [];
      const novaEquipe = {};

      rows.forEach((row) => {
        const tipo = (row["Tipo"] || row["tipo"] || "")
          .toString()
          .trim()
          .toLowerCase();
        const personagem = (row["Personagem"] || row["personagem"] || "")
          .toString()
          .trim();
        const atorOriginal = (
          row["Ator Original"] ||
          row["ator original"] ||
          row["Ator original"] ||
          ""
        )
          .toString()
          .trim();
        const nome = (row["Nome"] || row["nome"] || "").toString().trim();
        if (!nome) return;

        if (tipo === "dublador") {
          const found = dubladores.find(
            (d) =>
              (d.nomeArtistico || d.nomeCompleto || "").toLowerCase() ===
              nome.toLowerCase(),
          );
          novasEntradas.push({
            idDublador: found ? found.id : "",
            nomeDublador: found
              ? found.nomeArtistico || found.nomeCompleto
              : nome,
            dubladorValido: !!found,
            personagem,
            atorOriginal,
          });
        } else if (tipo) {
          const funcao = tipo.charAt(0).toUpperCase() + tipo.slice(1);
          if (!novaEquipe[funcao]) novaEquipe[funcao] = [];
          const found = dubladores.find(
            (d) =>
              (d.nomeArtistico || d.nomeCompleto || "").toLowerCase() ===
              nome.toLowerCase(),
          );
          novaEquipe[funcao].push({
            tipo: "Pessoa",
            nome: found ? found.nomeArtistico || found.nomeCompleto : nome,
            idPessoa: found ? found.id : null,
          });
        }
      });

      setEntradas((prev) => {
        const existentes = prev.filter((e) => e.nomeDublador.trim());
        const novos = novasEntradas.filter(
          (n) =>
            !existentes.some(
              (e) =>
                e.nomeDublador.toLowerCase() === n.nomeDublador.toLowerCase(),
            ),
        );
        const merged = [...existentes, ...novos];
        return merged.length > 0 ? merged : [{ ...ENTRADA_VAZIA }];
      });

      setEquipeTecnica((prev) => {
        const updated = [...prev];
        Object.entries(novaEquipe).forEach(([funcao, profissionais]) => {
          const idx = updated.findIndex(
            (e) => e.funcao.toLowerCase() === funcao.toLowerCase(),
          );
          if (idx >= 0) {
            const existentesNomes = updated[idx].profissionais.map((p) =>
              p.nome?.toLowerCase(),
            );
            const novos = profissionais.filter(
              (p) => !existentesNomes.includes(p.nome?.toLowerCase()),
            );
            updated[idx] = {
              ...updated[idx],
              profissionais: [...updated[idx].profissionais, ...novos],
            };
          } else {
            updated.push({ funcao, profissionais });
          }
        });
        return updated;
      });
    };
    reader.readAsArrayBuffer(file);
    e.target.value = "";
    setImportDropdownAberto(false);
  };

  const handleBaixarModelo = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Tipo", "Personagem", "Ator Original", "Nome"],
      ["dublador", "", "", ""],
      ["Locução", "", "", ""],
      ["Direção Musical", "", "", ""],
    ]);
    ws["!cols"] = [{ wch: 15 }, { wch: 30 }, { wch: 25 }, { wch: 25 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Elenco");
    XLSX.writeFile(wb, "modelo-elenco.xlsx");
    setImportDropdownAberto(false);
  };

  const handleSalvar = async () => {
    setLoading(true);
    try {
      const e = {};
      if (!idFilme.trim()) e.idFilme = true;
      if (!nomeFilme.trim()) e.nomeFilme = true;
      entradas.forEach((entrada, i) => {
        if (!entrada.personagem.trim()) e[`personagem_${i}`] = true;
        if (!entrada.atorOriginal.trim()) e[`atorOriginal_${i}`] = true;
      });
      setErros(e);
      if (Object.keys(e).length > 0) return;

      const dados = {
        idFilme: parseInt(idFilme) || idFilme.trim(),
        nomeFilme: nomeFilme.trim(),
        estudioId: estudioId ?? null,
        estudioNome: estudioNome.trim() || null,
        direcaoDublagem: direcaoId
          ? { id: direcaoId, nome: direcaoNome }
          : null,
        traducao: traducaoId
          ? { id: traducaoId, nome: traducaoNome }
          : traducaoNome.trim()
            ? { id: null, nome: traducaoNome.trim() }
            : null,
        producao,
        equipeTecnica: equipeTecnica
          .map((e) => ({
            funcao: e.funcao,
            profissionais:
              e.funcao === "Data de Gravação"
                ? e.profissionais.filter((p) => p.data)
                : e.profissionais.filter((p) => p.nome?.trim()),
          }))
          .filter((e) => e.profissionais.length > 0),
        dubladores: entradas.map((e) => ({
          idDublador: e.dubladorValido ? e.idDublador.trim().toUpperCase() : null,
          nomeDublador: e.nomeDublador.trim(),
          personagem: e.personagem.trim(),
          atorOriginal: e.atorOriginal.trim(),
        })),
        dataEdicao: serverTimestamp(),
      };

      if (isEdit) {
        await updateDoc(doc(db, "filmes", id), dados);
      } else {
        const newId = await gerarId();
        dados.autorId = user?.uid ?? null;
        dados.autorNome = user?.nome ?? null;
        dados.dataCadastro = serverTimestamp();
        await setDoc(doc(db, "filmes", newId), dados);
      }
      router.push("/adm/dublagens");
    } finally {
      setLoading(false);
    }
  };

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const sidebar = (
    <div className={styles.sidebarContent}>
      <div
        className={styles.slidingViews}
        style={{
          transform: sidebarView === 0 ? "translateX(0)" : "translateX(-50%)",
        }}
      >
        {/* ── View 0 ── */}
        <div className={styles.slideView}>
          <div className={styles.dadosTecnicos}>
            <h2>Dados técnicos</h2>
          </div>

          <div className={styles.formElenco}>
            <TextInput
              label="ID do filme (TMDB)"
              placeholder="Ex: 550"
              type="number"
              min="1"
              value={idFilme}
              onChange={(e) => {
                setIdFilme(e.target.value);
                setErros((p) => ({ ...p, idFilme: false }));
              }}
              error={!!erros.idFilme}
            />

            <TextInput
              label="Nome do filme"
              placeholder='Ex: "Fight Club"'
              value={nomeFilme}
              onChange={(e) => {
                setNomeFilme(e.target.value);
                setErros((p) => ({ ...p, nomeFilme: false }));
              }}
              error={!!erros.nomeFilme}
            />

            <EstudioSearchInput
              value={estudioNome}
              estudios={estudios}
              estudioId={estudioId}
              onChange={(nome, id) => {
                setEstudioNome(nome);
                setEstudioId(id);
              }}
            />

            {producao.length > 0 && (
              <div className={styles.searchField}>
                <span className={styles.searchLabel}>Produção</span>
                <div className={styles.pillsField}>
                  {producao.map((nome) => (
                    <span key={nome} className={styles.pill}>
                      {nome}
                      <button
                        type="button"
                        className={styles.pillRemove}
                        onClick={() =>
                          setProducao((p) => p.filter((n) => n !== nome))
                        }
                      >
                        <CloseIcon size={15} color="currentColor" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.searchField}>
              <span className={styles.searchLabel}>Direção de dublagem</span>
              <FamiliarNomeInput
                value={direcaoNome}
                dubladores={dubladores}
                idDublador={direcaoId ?? ""}
                dubladorValido={!!direcaoId}
                onChange={(nome, id) => {
                  setDirecaoNome(nome);
                  setDirecaoId(id ?? null);
                }}
              />
            </div>

            <div className={styles.searchField}>
              <span className={styles.searchLabel}>Tradução</span>
              <FamiliarNomeInput
                value={traducaoNome}
                dubladores={dubladores}
                idDublador={traducaoId ?? ""}
                dubladorValido={!!traducaoId}
                onChange={(nome, id) => {
                  setTraducaoNome(nome);
                  setTraducaoId(id ?? null);
                }}
              />
            </div>
          </div>

          <div className={styles.separador}></div>

          <button
            type="button"
            className={styles.viewNavBtn}
            onClick={() => setSidebarView(1)}
          >
            <span className={styles.viewNavLabel}>Equipe técnica</span>
            <ChevronDownIcon
              size={18}
              color="var(--text-sub)"
              style={{ transform: "rotate(-90deg)" }}
            />
          </button>
        </div>

        {/* ── View 1 ── */}
        <div className={styles.slideView}>
          <div className={styles.viewNavBack}>
            <button
              type="button"
              className={styles.viewNavBackBtn}
              onClick={() => setSidebarView(0)}
            >
              <ChevronDownIcon
                size={18}
                color="var(--text-sub)"
                style={{ transform: "rotate(90deg)" }}
              />
            </button>
            <span className={styles.viewNavLabel}>Equipe técnica</span>
          </div>

          <FuncaoSearchInput
            opcoes={FUNCOES_TECNICAS_OPTIONS.filter(
              (o) => !equipeTecnica.find((e) => e.funcao === o.value),
            )}
            onSelecionar={selecionarFuncao}
          />

          <div className={styles.contentEquipeTecnica}>
            {equipeTecnica.map(({ funcao, profissionais }) => (
              <div key={funcao} className={styles.equipeFuncaoBloco}>
                <span className={styles.searchLabel}>{funcao}</span>
                {funcao === "Data de Gravação" ? (
                  <>
                    <div className={styles.profissionalCampos}>
                      <TextInput
                        type="date"
                        value={profissionais[0]?.data ?? ""}
                        onChange={(e) =>
                          atualizarCampoProfissional(funcao, 0, {
                            data: e.target.value,
                          })
                        }
                      />
                      <button
                        type="button"
                        className={styles.btnRemover}
                        onClick={() => removerProfissional(funcao, 0)}
                        title="Remover"
                      >
                        <TrashIcon size={14} color="currentColor" />
                      </button>
                    </div>
                    <div className={styles.toggleRow}>
                      <label
                        className={styles.toggleLabel}
                        htmlFor="exibir-data-gravacao"
                      >
                        Exibir data completa?
                      </label>
                      <Switch
                        id="exibir-data-gravacao"
                        checked={profissionais[0]?.exibirDataCompleta ?? false}
                        onChange={(e) =>
                          atualizarCampoProfissional(funcao, 0, {
                            exibirDataCompleta: e.target.checked,
                          })
                        }
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {profissionais.map((p, i) => (
                      <div key={i} className={styles.profissionalRow}>
                        <Select
                          placeholder="Tipo"
                          options={[
                            { value: "Pessoa", label: "Pessoa" },
                            { value: "Empresa", label: "Empresa" },
                          ]}
                          value={p.tipo}
                          onChange={(e) =>
                            atualizarCampoProfissional(funcao, i, {
                              tipo: e.target.value,
                              nome: "",
                              idPessoa: null,
                              imagem: null,
                            })
                          }
                        />
                        {p.tipo === "Empresa" && (
                          <div className={styles.uploadCompact}>
                            <UploadImagem
                              imagem={p.imagem}
                              onImagemChange={(file) =>
                                atualizarCampoProfissional(funcao, i, {
                                  imagem: file
                                    ? {
                                        file,
                                        preview: URL.createObjectURL(file),
                                      }
                                    : null,
                                })
                              }
                              dimensoes={false}
                            />
                          </div>
                        )}
                        {p.tipo === "Empresa" && (
                          <div className={styles.profissionalCampos}>
                            <EstudioSearchInput
                              value={p.nome}
                              estudios={estudios}
                              onChange={(nome, id) =>
                                atualizarCampoProfissional(funcao, i, {
                                  nome,
                                  idPessoa: id ?? null,
                                })
                              }
                            />
                            <button
                              type="button"
                              className={styles.btnRemover}
                              onClick={() => removerProfissional(funcao, i)}
                              title="Remover"
                            >
                              <TrashIcon size={14} color="currentColor" />
                            </button>
                          </div>
                        )}
                        {p.tipo === "Pessoa" && (
                          <div className={styles.profissionalCampos}>
                            <FamiliarNomeInput
                              value={p.nome}
                              dubladores={dubladores}
                              idDublador={p.idPessoa ?? ""}
                              dubladorValido={!!p.idPessoa}
                              onChange={(nome, id) =>
                                atualizarCampoProfissional(funcao, i, {
                                  nome,
                                  idPessoa: id ?? null,
                                })
                              }
                            />
                            <button
                              type="button"
                              className={styles.btnRemover}
                              onClick={() => removerProfissional(funcao, i)}
                              title="Remover"
                            >
                              <TrashIcon size={14} color="currentColor" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      label={`Adicionar ${funcao.toLowerCase()}`}
                      icon={<PlusIcon size={16} color="currentColor" />}
                      onClick={() => adicionarProfissional(funcao)}
                      width="300px"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // ── Header ─────────────────────────────────────────────────────────────────
  const headerActions = (
    <>
      <input
        ref={fileInputElencoRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: "none" }}
        onChange={handleImportarElenco}
      />
      <input
        ref={fileInputEquipeRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        style={{ display: "none" }}
        onChange={handleImportarEquipe}
      />
      <div className={styles.importarWrapper} ref={importDropdownRef}>
        <div className={styles.importarBtn}>
          <button
            type="button"
            className={styles.importarBtnMain}
            onClick={() => setImportDropdownAberto((p) => !p)}
          >
            Importar planilha
          </button>
          <button
            type="button"
            className={styles.importarBtnChevron}
            onClick={() => setImportDropdownAberto((p) => !p)}
          >
            <ChevronDownIcon size={16} color="currentColor" />
          </button>
        </div>
        {importDropdownAberto && (
          <div className={styles.importarDropdown}>
            <button
              type="button"
              className={styles.importarDropdownItem}
              onClick={() => fileInputElencoRef.current?.click()}
            >
              Importar elenco
            </button>
            <button
              type="button"
              className={styles.importarDropdownItem}
              onClick={() => fileInputEquipeRef.current?.click()}
            >
              Importar equipe técnica
            </button>
            <button
              type="button"
              className={styles.importarDropdownItem}
              onClick={handleBaixarModelos}
            >
              Baixar modelos
            </button>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        label={loading ? "Salvando..." : "Salvar"}
        onClick={handleSalvar}
        disabled={loading}
        border="var(--stroke-base)"
      />
    </>
  );

  const breadcrumb = isEdit
    ? [
        { href: "/adm/dublagens", label: "Dublagens" },
        { href: null, label: nomeFilme || id },
      ]
    : [
        { href: "/adm/dublagens", label: "Dublagens" },
        { href: null, label: "Criar" },
      ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>{isEdit ? "Editar" : "Criar"} dublagem — Cameo ADM</title>
      </Head>
      <AdmLayout
        headerActions={headerActions}
        breadcrumb={breadcrumb}
        rightSidebar={sidebar}
      >
        <div className={styles.central}>
          <div className={styles.card}>
            <div className={styles.elencoHeader}>
              <span className={styles.colLabel}>Dublador</span>
              <span className={styles.colLabel}>Personagem</span>
              <span className={styles.colLabel}>Ator original</span>
              <span style={{ width: 36 }} />
            </div>

            {entradas.map((entrada, i) => (
              <div key={i} className={styles.elencoRow}>
                <div className={styles.elencoField}>
                  <FamiliarNomeInput
                    value={entrada.nomeDublador}
                    dubladores={dubladores}
                    idDublador={entrada.idDublador}
                    dubladorValido={entrada.dubladorValido}
                    onChange={(nome, id) => {
                      setEntradas((prev) => {
                        const nova = [...prev];
                        nova[i] = {
                          ...nova[i],
                          nomeDublador: nome,
                          idDublador: id ?? "",
                          dubladorValido: !!id,
                        };
                        return nova;
                      });
                      setErros((p) => ({ ...p, [`idDublador_${i}`]: false }));
                    }}
                  />
                </div>

                <TextInput
                  placeholder="Ex: Tyler Durden"
                  value={entrada.personagem}
                  onChange={(e) => {
                    atualizarEntrada(i, "personagem", e.target.value);
                    setErros((p) => ({ ...p, [`personagem_${i}`]: false }));
                  }}
                  error={!!erros[`personagem_${i}`]}
                />

                <TextInput
                  placeholder="Ex: Brad Pitt"
                  value={entrada.atorOriginal}
                  onChange={(e) => {
                    atualizarEntrada(i, "atorOriginal", e.target.value);
                    setErros((p) => ({ ...p, [`atorOriginal_${i}`]: false }));
                  }}
                  error={!!erros[`atorOriginal_${i}`]}
                />

                <button
                  type="button"
                  className={styles.btnRemover}
                  onClick={() => removerEntrada(i)}
                  disabled={entradas.length === 1}
                  title="Remover"
                >
                  <TrashIcon size={14} color="currentColor" />
                </button>
              </div>
            ))}

            <div className={styles.btnAdicionarWrapper}>
              <Button
                variant="ghost"
                label="Adicionar dublador"
                icon={<PlusIcon size={16} color="currentColor" />}
                border="var(--stroke-base)"
                onClick={adicionarEntrada}
              />
            </div>
          </div>
        </div>
      </AdmLayout>
    </>
  );
}
