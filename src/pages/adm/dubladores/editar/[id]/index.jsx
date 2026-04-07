import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db, storage } from "@/services/firebaseConection";
import { doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/auth";
import AdmLayout from "@/components/adm/layout";
import UploadImagem from "@/components/upload-imagem";
import Select from "@/components/inputs/select";
import MultiSelect from "@/components/inputs/multi-select";
import TextInput from "@/components/inputs/text-input";
import AdmEditor from "@/components/adm/editor";
import Button from "@/components/button";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import styles from "../../criar/index.module.scss";

// ─── Listas ───────────────────────────────────────────────────────────────────

const ESTADOS_BR = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO",
].map((s) => ({ value: s, label: s }));

const PAISES = [
  "Brasil","Estados Unidos","Argentina","Portugal","Japão","França",
  "Espanha","México","Itália","Reino Unido","Alemanha","Canadá","Chile",
  "Colômbia","Austrália","Outro",
].map((p) => ({ value: p, label: p }));

const PARENTESCO_OPTS = [
  "Pai","Mãe","Irmão","Irmã","Filho","Filha","Cônjuge",
  "Primo","Prima","Tio","Tia","Avô","Avó","Outro",
].map((p) => ({ value: p, label: p }));

const REDES_SOCIAIS = [
  "Instagram","YouTube","TikTok","IMDB","Site",
].map((r) => ({ value: r, label: r }));

const STATUS_ATIVIDADE = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Falecido", label: "Falecido" },
];

// ─── Ícones ───────────────────────────────────────────────────────────────────

const IcoVisualizar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M14.3627 7.36325C14.5654 7.64745 14.6667 7.78959 14.6667 7.99992C14.6667 8.21025 14.5654 8.35238 14.3627 8.63658C13.452 9.91365 11.1262 12.6666 8.00004 12.6666C4.87389 12.6666 2.54811 9.91365 1.6374 8.63658C1.43471 8.35238 1.33337 8.21025 1.33337 7.99992C1.33337 7.78959 1.43471 7.64745 1.6374 7.36325C2.54811 6.08621 4.87389 3.33325 8.00004 3.33325C11.1262 3.33325 13.452 6.08621 14.3627 7.36325Z" stroke="currentColor" />
    <path d="M10 8C10 6.8954 9.1046 6 8 6C6.8954 6 6 6.8954 6 8C6 9.1046 6.8954 10 8 10C9.1046 10 10 9.1046 10 8Z" stroke="currentColor" />
  </svg>
);

const IcoDeletar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13 3.66675L12.5869 10.3501C12.4813 12.0577 12.4285 12.9115 12.0005 13.5253C11.7889 13.8288 11.5165 14.0849 11.2005 14.2774C10.5614 14.6667 9.706 14.6667 7.99513 14.6667C6.28208 14.6667 5.42553 14.6667 4.78603 14.2767C4.46987 14.0839 4.19733 13.8273 3.98579 13.5233C3.55792 12.9085 3.5063 12.0535 3.40307 10.3435L3 3.66675" stroke="currentColor" strokeLinecap="round"/>
    <path d="M2 3.66659H14M10.7038 3.66659L10.2487 2.72774C9.9464 2.10409 9.7952 1.79227 9.53447 1.59779C9.47667 1.55465 9.4154 1.51628 9.35133 1.48305C9.0626 1.33325 8.71607 1.33325 8.023 1.33325C7.31253 1.33325 6.95733 1.33325 6.66379 1.48933C6.59873 1.52393 6.53665 1.56385 6.47819 1.6087C6.21443 1.81105 6.06709 2.13429 5.77241 2.78076L5.36861 3.66659" stroke="currentColor" strokeLinecap="round"/>
    <path d="M6.33337 11V7" stroke="currentColor" strokeLinecap="round"/>
    <path d="M9.66663 11V7" stroke="currentColor" strokeLinecap="round"/>
  </svg>
);

// ─── OcupacoesInput ────────────────────────────────────────────────────────────

function OcupacoesInput({ value = [], onChange }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const adicionar = () => {
    const v = input.trim();
    if (!v || value.includes(v)) { setInput(""); return; }
    onChange([...value, v]);
    setInput("");
  };

  const remover = (item) => onChange(value.filter((v) => v !== item));

  return (
    <div className={styles.fieldWrapper}>
      <label className={styles.label}>Ocupações</label>
      <div className={styles.pillsField} onClick={() => inputRef.current?.focus()}>
        {value.map((item) => (
          <span key={item} className={styles.pill}>
            {item}
            <button type="button" className={styles.pillRemove} onClick={(e) => { e.stopPropagation(); remover(item); }}>×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          className={styles.pillInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); adicionar(); }
            if (e.key === "Backspace" && !input && value.length > 0) remover(value[value.length - 1]);
          }}
          placeholder={value.length === 0 ? "Digite e pressione Enter…" : ""}
        />
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AdmEditarDublador() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  // Campos
  const [imagem, setImagem] = useState(null);
  const [imagemAtual, setImagemAtual] = useState(null);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeArtistico, setNomeArtistico] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [anoInicioDublagem, setAnoInicioDublagem] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  const [estadoNatal, setEstadoNatal] = useState("");
  const [ondeAtua, setOndeAtua] = useState([]);
  const [ativoNaDublagem, setAtivoNaDublagem] = useState("");
  const [bio, setBio] = useState("");
  const [ocupacoes, setOcupacoes] = useState([]);
  const [familiares, setFamiliares] = useState([{ nome: "", parentesco: "", link: "" }]);
  const [links, setLinks] = useState([{ tipo: "", url: "" }]);
  const [statusPublicacao, setStatusPublicacao] = useState("rascunho");

  // UI
  const [loading, setLoading] = useState(false);
  const [loadingRascunho, setLoadingRascunho] = useState(false);
  const [loadingPagina, setLoadingPagina] = useState(true);
  const [deletando, setDeletando] = useState(false);
  const [confirmarDeletar, setConfirmarDeletar] = useState(false);
  const [error, setError] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  const isDirty = nomeArtistico !== "";
  useUnsavedChanges(isDirty && !loading && !deletando);

  // ─── Carregar dados ──────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const carregar = async () => {
      try {
        const snap = await getDoc(doc(db, "dubladores", id));
        if (!snap.exists()) { router.push("/adm/dubladores"); return; }
        const d = snap.data();
        setNomeCompleto(d.nomeCompleto || "");
        setNomeArtistico(d.nomeArtistico || "");
        setDataNascimento(d.dataNascimento || "");
        setAnoInicioDublagem(d.anoInicioDublagem || "");
        setNacionalidade(d.nacionalidade || "");
        setEstadoNatal(d.estadoNatal || "");
        setOndeAtua(d.ondeAtua || []);
        setAtivoNaDublagem(d.ativoNaDublagem || "");
        setBio(d.bio || "");
        setOcupacoes(d.ocupacoes || []);
        setFamiliares(d.familiares?.length ? d.familiares : [{ nome: "", parentesco: "", link: "" }]);
        setLinks(d.links?.length ? d.links.map((l) => ({ tipo: l.type || l.tipo || "", url: l.url || "" })) : [{ tipo: "", url: "" }]);
        setStatusPublicacao(d.statusPublicacao || "publicado");
        setImagemAtual(d.imagemUrl || null);
      } finally {
        setLoadingPagina(false);
      }
    };
    carregar();
  }, [id]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAberto(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const abrirMenu = () => {
    if (menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 8, left: rect.left });
    }
    setMenuAberto((prev) => !prev);
  };

  // ─── Upload imagem ───────────────────────────────────────
  const uploadNovaImagem = async () => {
    if (!imagem?.file) return imagemAtual;
    const storageRef = ref(storage, `dubladores/${id}_${imagem.file.name}`);
    await uploadBytes(storageRef, imagem.file);
    return getDownloadURL(storageRef);
  };

  // ─── Montar payload ──────────────────────────────────────
  const montarPayload = async (status) => {
    const imagemUrl = await uploadNovaImagem();
    const familiaresLimpos = familiares.filter((f) => f.nome.trim());
    const linksLimpos = links.filter((l) => l.tipo && l.url.trim());

    return {
      nomeCompleto,
      nomeArtistico,
      dataNascimento,
      anoInicioDublagem,
      nacionalidade,
      estadoNatal,
      ondeAtua,
      ativoNaDublagem,
      bio,
      ocupacoes,
      familiares: familiaresLimpos,
      links: linksLimpos,
      imagemUrl,
      statusPublicacao: status,
      ...(status === "publicado" && statusPublicacao !== "publicado"
        ? { dataPublicacao: serverTimestamp() }
        : {}),
      ...(status === "rascunho"
        ? { dataRascunho: serverTimestamp() }
        : {}),
    };
  };

  // ─── Salvar rascunho ─────────────────────────────────────
  const salvarRascunho = async () => {
    if (!nomeArtistico.trim()) { setError("Nome artístico é obrigatório"); return; }
    setLoadingRascunho(true);
    setError("");
    try {
      const payload = await montarPayload("rascunho");
      await updateDoc(doc(db, "dubladores", id), payload);
      setStatusPublicacao("rascunho");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingRascunho(false);
    }
  };

  // ─── Publicar/Salvar ─────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeArtistico.trim()) { setError("Nome artístico é obrigatório"); return; }
    setLoading(true);
    setError("");
    try {
      const payload = await montarPayload("publicado");
      await updateDoc(doc(db, "dubladores", id), payload);
      router.push("/adm/dubladores");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Deletar ─────────────────────────────────────────────
  const confirmarDelete = async () => {
    setDeletando(true);
    try {
      await deleteDoc(doc(db, "dubladores", id));
      router.push("/adm/dubladores");
    } catch (err) {
      console.error(err);
      setError(err.message);
      setDeletando(false);
    }
  };

  // ─── Familiares ──────────────────────────────────────────
  const setFamiliar = (idx, field, val) =>
    setFamiliares((prev) => prev.map((f, i) => i === idx ? { ...f, [field]: val } : f));
  const adicionarFamiliar = () => setFamiliares((prev) => [...prev, { nome: "", parentesco: "", link: "" }]);
  const removerFamiliar = (idx) => setFamiliares((prev) => prev.filter((_, i) => i !== idx));

  // ─── Links ───────────────────────────────────────────────
  const setLink = (idx, field, val) =>
    setLinks((prev) => prev.map((l, i) => i === idx ? { ...l, [field]: val } : l));
  const adicionarLink = () => setLinks((prev) => [...prev, { tipo: "", url: "" }]);
  const removerLink = (idx) => setLinks((prev) => prev.filter((_, i) => i !== idx));

  // ─── Header actions ──────────────────────────────────────
  const headerActions = (
    <>
      <div className={styles.menuWrapper} ref={menuRef}>
        <div ref={menuBtnRef}>
          <Button variant="ghost" label="•••" type="button" onClick={abrirMenu} border="var(--stroke-base)" />
        </div>
        {menuAberto && (
          <div className={styles.menuDropdown} style={{ top: menuPos.top, left: menuPos.left }}>
            <button type="button" className={styles.menuItem} onClick={() => { window.open(`/dubladores/detalhes-dubladores/${id}`, "_blank"); setMenuAberto(false); }}>
              <span className={styles.menuItemIcon}><IcoVisualizar /></span>
              Visualizar
            </button>
            <button type="button" className={`${styles.menuItem} ${styles.menuItemDanger}`} onClick={() => { setConfirmarDeletar(true); setMenuAberto(false); }}>
              <span className={styles.menuItemIcon}><IcoDeletar /></span>
              Deletar
            </button>
          </div>
        )}
      </div>
      <Button variant="ghost" label={loadingRascunho ? "Salvando..." : "Salvar rascunho"} type="button" disabled={loadingRascunho} onClick={salvarRascunho} border="var(--stroke-base)" />
      <Button variant="ghost" label={loading ? "Salvando..." : "Salvar alterações"} type="submit" form="form-dublador-editar" disabled={loading} border="var(--stroke-base)" />
    </>
  );

  if (loadingPagina) return <AdmLayout><p style={{ padding: "var(--space-2xl)", fontStyle: "italic", color: "var(--text-sub)" }}>Carregando...</p></AdmLayout>;

  return (
    <AdmLayout headerActions={headerActions}>
      <Head>
        <title>{nomeArtistico || "Editar dublador"} — Cameo ADM</title>
      </Head>

      <form id="form-dublador-editar" onSubmit={handleSubmit} className={styles.form}>

        {/* ─── Upload imagem ─────────────────────────────── */}
        <UploadImagem
          imagem={imagem || (imagemAtual ? { preview: imagemAtual } : null)}
          onImagemChange={(file) => setImagem(file ? { file, preview: URL.createObjectURL(file) } : null)}
          dimensoes="Dimensões recomendadas 1500x1500. Arquivos aceitos, JPG e PNG"
        />

        {/* ─── Dados principais ──────────────────────────── */}
        <div className={styles.card}>
          <div className={styles.row}>
            <TextInput label="Nome do(a) dublador(a)" placeholder="Digite o nome completo" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} width="100%" />
            <TextInput label="Nome artístico do(a) dublador(a)" placeholder="Digite o nome artístico" value={nomeArtistico} onChange={(e) => setNomeArtistico(e.target.value)} width="100%" required />
          </div>

          <div className={styles.row}>
            <TextInput label="Data de aniversário" placeholder="00/00/0000" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} type="date" width="100%" />
            <TextInput label="Ano de início na dublagem" placeholder="00/00/0000" value={anoInicioDublagem} onChange={(e) => setAnoInicioDublagem(e.target.value)} type="date" width="100%" />
            <Select label="Nacionalidade" placeholder="Selecione a nacionalidade" options={PAISES} value={nacionalidade} onChange={(e) => setNacionalidade(e.target.value)} width="100%" />
            <Select label="Estado natal" placeholder="Selecione o estado" options={ESTADOS_BR} value={estadoNatal} onChange={(e) => setEstadoNatal(e.target.value)} width="100%" />
          </div>

          <div className={styles.row}>
            <MultiSelect label="Onde atua" placeholder="Selecione os estados" options={ESTADOS_BR} selected={ondeAtua} onChange={setOndeAtua} width="100%" />
            <Select label="Ativo na dublagem?" placeholder="Selecione o status" options={STATUS_ATIVIDADE} value={ativoNaDublagem} onChange={(e) => setAtivoNaDublagem(e.target.value)} width="100%" />
          </div>

          <AdmEditor value={bio} onChange={setBio} />

          <OcupacoesInput value={ocupacoes} onChange={setOcupacoes} />

          {/* ─── Familiares ───────────────────────────── */}
          <div className={styles.listaSection}>
            {familiares.map((f, idx) => (
              <div key={idx} className={styles.listaRow}>
                <TextInput label={idx === 0 ? "Nome do(a) familiar" : undefined} placeholder="Digite o nome completo" value={f.nome} onChange={(e) => setFamiliar(idx, "nome", e.target.value)} width="100%" />
                <Select label={idx === 0 ? "Parentesco" : undefined} placeholder="Selecione" options={PARENTESCO_OPTS} value={f.parentesco} onChange={(e) => setFamiliar(idx, "parentesco", e.target.value)} width="220px" />
                <TextInput label={idx === 0 ? "Link (apenas se for profissional de dublagem)" : undefined} placeholder="Digite o link" value={f.link} onChange={(e) => setFamiliar(idx, "link", e.target.value)} width="100%" />
                {familiares.length > 1 && (
                  <button type="button" className={styles.btnRemover} onClick={() => removerFamiliar(idx)}>×</button>
                )}
              </div>
            ))}
            <div className={styles.btnAdicionar}>
              <button type="button" className={styles.btnAdicionarLink} onClick={adicionarFamiliar}>+ Adicionar familiar</button>
            </div>
          </div>

          {/* ─── Links ────────────────────────────────── */}
          <div className={styles.listaSection}>
            {links.map((l, idx) => (
              <div key={idx} className={styles.listaRow}>
                <Select label={idx === 0 ? "Informe a rede social" : undefined} placeholder="Selecione a rede social" options={REDES_SOCIAIS} value={l.tipo} onChange={(e) => setLink(idx, "tipo", e.target.value)} width="280px" />
                <TextInput label={idx === 0 ? "Link para o perfil" : undefined} placeholder="Digite o link" value={l.url} onChange={(e) => setLink(idx, "url", e.target.value)} width="100%" />
                {links.length > 1 && (
                  <button type="button" className={styles.btnRemover} onClick={() => removerLink(idx)}>×</button>
                )}
              </div>
            ))}
            <div className={styles.btnAdicionar}>
              <button type="button" className={styles.btnAdicionarLink} onClick={adicionarLink}>+ Adicionar outro link</button>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </div>
      </form>

      {/* ─── Confirmar deletar ─────────────────────────────── */}
      {confirmarDeletar && (
        <div className={styles.popoverOverlay} onClick={() => setConfirmarDeletar(false)}>
          <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
            <p className={styles.popoverTexto}>
              Deletar permanentemente <strong>"{nomeArtistico}"</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className={styles.popoverAcoes}>
              <button type="button" className={styles.popoverCancelar} onClick={() => setConfirmarDeletar(false)}>Cancelar</button>
              <button type="button" className={styles.popoverConfirmar} onClick={confirmarDelete} disabled={deletando}>
                {deletando ? "Deletando..." : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdmLayout>
  );
}
