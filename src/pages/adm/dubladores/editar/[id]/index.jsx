import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db, storage } from "@/services/firebaseConection";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/auth";
import AdmLayout from "@/components/adm/layout";
import UploadImagem from "@/components/upload-imagem";
import Select from "@/components/inputs/select";
import MultiSelect from "@/components/inputs/multi-select";
import TextInput from "@/components/inputs/text-input";
import AdmEditor from "@/components/adm/editor";
import Button from "@/components/button";
import Badge from "@/components/badge";
import InstagramIcon from "@/components/icons/InstagramIcon";
import YoutubeIcon from "@/components/icons/YoutubeIcon";
import TiktokIcon from "@/components/icons/TiktokIcon";
import IMDBIcon from "@/components/icons/IMDBIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import XIcon from "@/components/icons/XIcon";
import BlueSkyIcon from "@/components/icons/BlueSkyIcon";
import TwitchIcon from "@/components/icons/TwitchIcon";
import LinktreeIcon from "@/components/icons/LinktreeIcon";
import ThreadsIcon from "@/components/icons/ThreadsIcon";
import GlobeIcon from "@/components/icons/GlobeIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { FamiliarNomeInput } from "../../criar/index";
import { REDES_SOCIAIS, REDE_PLACEHOLDER, gerarUrlRede } from "@/utils/redes";
import { toSlug } from "@/utils/slug";
import Switch from "@/components/inputs/switch";
import AvatarDublador from "@/components/avatar-dublador";
import styles from "../../criar/index.module.scss";

const REDE_ICONE_MAP = {
  instagram: <InstagramIcon size={24} color="currentColor" />,
  youtube: <YoutubeIcon size={24} color="currentColor" />,
  tiktok: <TiktokIcon size={24} color="currentColor" />,
  imdb: <IMDBIcon size={24} color="currentColor" />,
  facebook: <FacebookIcon size={24} color="currentColor" />,
  x: <XIcon size={24} color="currentColor" />,
  twitter: <XIcon size={24} color="currentColor" />,
  bluesky: <BlueSkyIcon size={24} color="currentColor" />,
  "blue sky": <BlueSkyIcon size={24} color="currentColor" />,
  twitch: <TwitchIcon size={24} color="currentColor" />,
  linktree: <LinktreeIcon size={24} color="currentColor" />,
  threads: <ThreadsIcon size={24} color="currentColor" />,
  site: <GlobeIcon size={24} color="currentColor" />,
};

function redeIcone(tipo) {
  return REDE_ICONE_MAP[tipo?.toLowerCase()] ?? tipo;
}

const ESTADOS_BR = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
].map((s) => ({ value: s, label: s }));

const PAISES = [
  "Brasil",
  "Estados Unidos",
  "Argentina",
  "Portugal",
  "Japão",
  "França",
  "Espanha",
  "México",
  "Itália",
  "Reino Unido",
  "Alemanha",
  "Canadá",
  "Chile",
  "Colômbia",
  "Austrália",
  "Outro",
].map((p) => ({ value: p, label: p }));

const PARENTESCO_OPTS = [
  "Pai",
  "Mãe",
  "Irmão",
  "Irmã",
  "Filho",
  "Filha",
  "Cônjuge",
  "Primo",
  "Prima",
  "Tio",
  "Tia",
  "Sobrinho",
  "Sobrinha",
  "Avô",
  "Avó",
  "Outro",
].map((p) => ({ value: p, label: p }));

const STATUS_ATIVIDADE = [
  { value: "Ativo", label: "Ativo" },
  { value: "Inativo", label: "Inativo" },
  { value: "Falecido", label: "Falecido" },
];

function OcupacoesInput({ value = [], onChange }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const adicionar = () => {
    const v = input.trim();
    if (!v || value.includes(v)) {
      setInput("");
      return;
    }
    onChange([...value, v]);
    setInput("");
  };
  const remover = (item) => onChange(value.filter((v) => v !== item));
  return (
    <div className={styles.fieldWrapper}>
      <label className={styles.label}>Ocupações</label>
      <div
        className={styles.pillsField}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((item) => (
          <span key={item} className={styles.pill}>
            {item}
            <button
              type="button"
              className={styles.pillRemove}
              onClick={(e) => {
                e.stopPropagation();
                remover(item);
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className={styles.pillInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              adicionar();
            }
            if (e.key === "Backspace" && !input && value.length > 0)
              remover(value[value.length - 1]);
          }}
          placeholder={value.length === 0 ? "Digite e pressione Enter…" : ""}
        />
      </div>
    </div>
  );
}

const IcoVisualizar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M14.3627 7.36325C14.5654 7.64745 14.6667 7.78959 14.6667 7.99992C14.6667 8.21025 14.5654 8.35238 14.3627 8.63658C13.452 9.91365 11.1262 12.6666 8.00004 12.6666C4.87389 12.6666 2.54811 9.91365 1.6374 8.63658C1.43471 8.35238 1.33337 8.21025 1.33337 7.99992C1.33337 7.78959 1.43471 7.64745 1.6374 7.36325C2.54811 6.08621 4.87389 3.33325 8.00004 3.33325C11.1262 3.33325 13.452 6.08621 14.3627 7.36325Z"
      stroke="currentColor"
    />
    <path
      d="M10 8C10 6.8954 9.1046 6 8 6C6.8954 6 6 6.8954 6 8C6 9.1046 6.8954 10 8 10C9.1046 10 10 9.1046 10 8Z"
      stroke="currentColor"
    />
  </svg>
);

const IcoDeletar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13 3.66675L12.5869 10.3501C12.4813 12.0577 12.4285 12.9115 12.0005 13.5253C11.7889 13.8288 11.5165 14.0849 11.2005 14.2774C10.5614 14.6667 9.706 14.6667 7.99513 14.6667C6.28208 14.6667 5.42553 14.6667 4.78603 14.2767C4.46987 14.0839 4.19733 13.8273 3.98579 13.5233C3.55792 12.9085 3.5063 12.0535 3.40307 10.3435L3 3.66675"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path
      d="M2 3.66659H14M10.7038 3.66659L10.2487 2.72774C9.9464 2.10409 9.7952 1.79227 9.53447 1.59779C9.47667 1.55465 9.4154 1.51628 9.35133 1.48305C9.0626 1.33325 8.71607 1.33325 8.023 1.33325C7.31253 1.33325 6.95733 1.33325 6.66379 1.48933C6.59873 1.52393 6.53665 1.56385 6.47819 1.6087C6.21443 1.81105 6.06709 2.13429 5.77241 2.78076L5.36861 3.66659"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path d="M6.33337 11V7" stroke="currentColor" strokeLinecap="round" />
    <path d="M9.66663 11V7" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

export default function AdmEditarDublador() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [imagem, setImagem] = useState(null);
  const [imagemAtual, setImagemAtual] = useState(null);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeArtistico, setNomeArtistico] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [anoInicioDublagem, setAnoInicioDublagem] = useState("");
  const [exibirDataInicioCompleta, setExibirDataInicioCompleta] =
    useState(false);
  const [verificarFamiliares, setVerificarFamiliares] = useState(false);
  const [nacionalidade, setNacionalidade] = useState("");
  const [estadoNatal, setEstadoNatal] = useState("");
  const [ondeAtua, setOndeAtua] = useState([]);
  const [ativoNaDublagem, setAtivoNaDublagem] = useState("");
  const [bio, setBio] = useState("");
  const [ocupacoes, setOcupacoes] = useState([]);
  const [familiares, setFamiliares] = useState([
    { nome: "", parentesco: "", idDublador: null },
  ]);
  const [links, setLinks] = useState([{ tipo: "", usuario: "" }]);
  const [statusPublicacao, setStatusPublicacao] = useState("rascunho");
  const [dubladores, setDubladores] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingPagina, setLoadingPagina] = useState(true);
  const [deletando, setDeletando] = useState(false);
  const [confirmarDeletar, setConfirmarDeletar] = useState(false);
  const [error, setError] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  useEffect(() => {
    getDocs(collection(db, "dubladores")).then((snap) =>
      setDubladores(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, []);

  const isDirty = nomeArtistico !== "";
  useUnsavedChanges(isDirty && !loading && !deletando);

  useEffect(() => {
    if (!id) return;
    const carregar = async () => {
      try {
        const snap = await getDoc(doc(db, "dubladores", id));
        if (!snap.exists()) {
          router.push("/adm/dubladores");
          return;
        }
        const d = snap.data();
        setNomeCompleto(d.nomeCompleto || "");
        setNomeArtistico(d.nomeArtistico || "");
        setDataNascimento(d.dataNascimento || "");
        setAnoInicioDublagem(d.anoInicioDublagem || "");
        setExibirDataInicioCompleta(d.exibirDataInicioCompleta ?? false);
        setVerificarFamiliares(d.verificarFamiliares ?? false);
        setNacionalidade(d.nacionalidade || "");
        setEstadoNatal(d.estadoNatal || "");
        setOndeAtua(d.ondeAtua || []);
        setAtivoNaDublagem(d.ativoNaDublagem || "");
        setBio(d.bio || "");
        setOcupacoes(d.ocupacoes || []);
        setFamiliares(
          d.familiares?.length
            ? d.familiares
            : [{ nome: "", parentesco: "", idDublador: null }],
        );
        setLinks(
          d.links?.length
            ? d.links.map((l) => ({
                tipo: l.type || l.tipo || "",
                usuario: l.usuario || l.url || "",
              }))
            : [{ tipo: "", usuario: "" }],
        );
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
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuAberto(false);
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

  const uploadNovaImagem = async () => {
    if (!imagem?.file) return imagemAtual;
    const storageRef = ref(storage, `dubladores/${id}_${imagem.file.name}`);
    await uploadBytes(storageRef, imagem.file);
    return getDownloadURL(storageRef);
  };

  const montarPayload = async (status) => {
    const imagemUrl = await uploadNovaImagem();
    return {
      nomeCompleto,
      nomeArtistico,
      dataNascimento,
      anoInicioDublagem,
      exibirDataInicioCompleta,
      verificarFamiliares,
      nacionalidade,
      estadoNatal,
      ondeAtua,
      ativoNaDublagem,
      bio,
      ocupacoes,
      familiares: familiares
        .filter((f) => f.nome.trim())
        .map(({ nome, parentesco, idDublador }) => ({
          nome,
          parentesco,
          idDublador: idDublador ?? null,
        })),
      links: links
        .filter((l) => l.tipo && l.usuario.trim())
        .map((l) => ({
          tipo: l.tipo,
          usuario: l.usuario,
          url: gerarUrlRede(l.tipo, l.usuario),
        })),
      imagemUrl,
      statusPublicacao: status,
      ...(status === "publicado" && statusPublicacao !== "publicado"
        ? { dataPublicacao: serverTimestamp() }
        : {}),
      ...(status === "rascunho" ? { dataRascunho: serverTimestamp() } : {}),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeArtistico.trim()) {
      setError("Nome artístico é obrigatório");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await updateDoc(
        doc(db, "dubladores", id),
        await montarPayload("publicado"),
      );
      router.push("/adm/dubladores");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmarDelete = async () => {
    setDeletando(true);
    try {
      await deleteDoc(doc(db, "dubladores", id));
      router.push("/adm/dubladores");
    } catch (err) {
      setError(err.message);
      setDeletando(false);
    }
  };

  const setFamiliar = (idx, field, val) =>
    setFamiliares((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [field]: val } : f)),
    );
  const setLink = (idx, field, val) =>
    setLinks((prev) =>
      prev.map((l, i) => (i === idx ? { ...l, [field]: val } : l)),
    );

  // ── Sidebar ──────────────────────────────────────────────────────────────────
  const sidebar = (
    <div className={styles.sidebarContent}>
      <UploadImagem
        imagem={imagem || (imagemAtual ? { preview: imagemAtual } : null)}
        onImagemChange={(file) =>
          setImagem(file ? { file, preview: URL.createObjectURL(file) } : null)
        }
        dimensoes="Dimensões recomendadas 1500x1500. JPG e PNG"
      />

      <TextInput
        label="Nome artístico"
        placeholder="Ex: Wendel Bezerra"
        value={nomeArtistico}
        onChange={(e) => setNomeArtistico(e.target.value)}
        required
      />
      <TextInput
        label="Nome completo"
        placeholder="Ex: Wendel Bezerra da Silva"
        value={nomeCompleto}
        onChange={(e) => setNomeCompleto(e.target.value)}
      />

      <div className={styles.row}>
        <TextInput
          label="Data de aniversário"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
          type="date"
        />
        <TextInput
          label="Início na dublagem"
          value={anoInicioDublagem}
          onChange={(e) => setAnoInicioDublagem(e.target.value)}
          type="date"
        />
      </div>

      <div className={styles.toggleRow}>
        <label className={styles.toggleLabel} htmlFor="exibir-data-inicio">
          Exibir data início completa?
        </label>
        <Switch
          id="exibir-data-inicio"
          checked={exibirDataInicioCompleta}
          onChange={(e) => setExibirDataInicioCompleta(e.target.checked)}
        />
      </div>

      <div className={styles.row}>
        <Select
          label="Nacionalidade"
          placeholder="Selecione"
          options={PAISES}
          value={nacionalidade}
          onChange={(e) => setNacionalidade(e.target.value)}
        />
        <Select
          label="Estado natal"
          placeholder="Selecione"
          options={ESTADOS_BR}
          value={estadoNatal}
          onChange={(e) => setEstadoNatal(e.target.value)}
        />
      </div>

      <div className={styles.row}>
        <MultiSelect
          label="Onde atua"
          placeholder="Selecione estados"
          options={ESTADOS_BR}
          selected={ondeAtua}
          onChange={setOndeAtua}
        />
        <Select
          label="Status"
          placeholder="Selecione"
          options={STATUS_ATIVIDADE}
          value={ativoNaDublagem}
          onChange={(e) => setAtivoNaDublagem(e.target.value)}
        />
      </div>

      <OcupacoesInput value={ocupacoes} onChange={setOcupacoes} />

      <div className={styles.listaSection}>
        <label className={styles.label}>Familiares</label>
        {familiares.map((f, idx) => (
          <div key={idx} className={styles.listaRow}>
            <FamiliarNomeInput
              value={f.nome}
              dubladores={dubladores}
              onChange={(nome, idDublador) =>
                setFamiliares((prev) =>
                  prev.map((x, i) =>
                    i === idx ? { ...x, nome, idDublador } : x,
                  ),
                )
              }
            />
            <Select
              placeholder="Parentesco"
              options={PARENTESCO_OPTS}
              value={f.parentesco}
              onChange={(e) => setFamiliar(idx, "parentesco", e.target.value)}
              width="160px"
            />
            {familiares.length > 1 && (
              <button
                type="button"
                className={styles.btnRemover}
                onClick={() =>
                  setFamiliares((p) => p.filter((_, i) => i !== idx))
                }
              >
                ×
              </button>
            )}
          </div>
        ))}
        <Button
          variant="ghost"
          label="Adicionar familiar"
          icon={<PlusIcon size={16} color="currentColor" />}
          type="button"
          width="220px"
          onClick={() =>
            setFamiliares((p) => [
              ...p,
              { nome: "", parentesco: "", idDublador: null },
            ])
          }
        />
      </div>

      <div className={styles.toggleRow}>
        <label className={styles.toggleLabel} htmlFor="verificar-familiares">
          Verificar familiares?
        </label>
        <Switch
          id="verificar-familiares"
          checked={verificarFamiliares}
          onChange={(e) => setVerificarFamiliares(e.target.checked)}
        />
      </div>

      <div className={styles.listaSection}>
        <label className={styles.label}>Redes sociais</label>
        {links.map((l, idx) => (
          <div key={idx} className={styles.listaRow}>
            <Select
              placeholder="Rede social"
              options={REDES_SOCIAIS}
              value={l.tipo}
              onChange={(e) => setLink(idx, "tipo", e.target.value)}
              width="160px"
            />
            <TextInput
              placeholder={REDE_PLACEHOLDER[l.tipo] ?? "Ex: philippemaiasuper"}
              width="100%"
              value={l.usuario}
              onChange={(e) => setLink(idx, "usuario", e.target.value)}
            />
            {links.length > 1 && (
              <button
                type="button"
                className={styles.btnRemover}
                onClick={() => setLinks((p) => p.filter((_, i) => i !== idx))}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <Button
          variant="ghost"
          label="Adicionar outro link"
          icon={<PlusIcon size={16} color="currentColor" />}
          type="button"
          width="220px"
          onClick={() => setLinks((p) => [...p, { tipo: "", usuario: "" }])}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );

  // ── Área central: editor + preview ───────────────────────────────────────────
  const fotoSrc = imagem?.preview ?? imagemAtual ?? null;
  const central = (
    <div className={styles.centralWrapper}>
      <div className={styles.previewCard}>
        {/* ── Foto Status ─────────────────────────────────── */}
        <div className={styles.sectionPage}>
          <div
            className={styles.article}
            style={{
              width: "auto",
            }}
          >
            <div className={styles.containerColumn}>
              {fotoSrc ? (
                <AvatarDublador src={fotoSrc} alt={nomeArtistico} size={100} />
              ) : (
                <div className={styles.previewAvatarPlaceholder}>
                  <span>
                    {nomeArtistico ? nomeArtistico[0].toUpperCase() : "?"}
                  </span>
                </div>
              )}

              <div className={styles.nomeArtisticoStatus}>
                {ativoNaDublagem && (
                  <Badge
                    label={ativoNaDublagem}
                    variant="outline"
                    width="100%"
                    borda={
                      ativoNaDublagem === "Falecido"
                        ? "--primitive-roxo-07"
                        : ativoNaDublagem === "Ativo"
                          ? "--primitive-azul-01"
                          : "--primitive-erro-01"
                    }
                    color={
                      ativoNaDublagem === "Falecido"
                        ? "--primitive-roxo-07"
                        : ativoNaDublagem === "Ativo"
                          ? "--primitive-azul-01"
                          : "--primitive-erro-01"
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* ── Identidade ─────────────────────────────────── */}

          <div
            className={styles.article}
            style={{
              alignSelf: "stretch",
            }}
          >
            <div className={styles.containerColumn}>
              <div className={styles.nomeArtisticoRedes}>
                <div className={styles.nomeArtistico}>
                  <h1>{nomeArtistico}</h1>
                </div>

                <div className={styles.nomeRedes}>
                  {links.filter((l) =>
                    (l.url || gerarUrlRede(l.tipo, l.usuario))?.trim(),
                  ).length > 0 && (
                    <ul>
                      {links
                        .filter((l) =>
                          (l.url || gerarUrlRede(l.tipo, l.usuario))?.trim(),
                        )
                        .map((l, i) => (
                          <li key={i}>
                            <a
                              href={l.url || gerarUrlRede(l.tipo, l.usuario)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {redeIcone(l.tipo)}
                            </a>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* ── Identidade completa ─────────────────────────────────── */}

              <div className={styles.detalhesDublador}>
                {nomeCompleto && (
                  <div className={styles.detalhesItem}>
                    <span>Nome completo</span>
                    <p>{nomeCompleto}</p>
                  </div>
                )}

                {ondeAtua.length > 0 && (
                  <div className={styles.detalhesItem}>
                    <span>Onde atua</span>
                    <ul>
                      {ondeAtua.map((e, i) => (
                        <li key={i}>
                          {e}
                          {i < ondeAtua.length - 1 ? "," : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ── Identidade aqui ─────────────────────────────────── */}

                {dataNascimento && (
                  <div className={styles.detalhesItem}>
                    <span>Data de nascimento</span>
                    <p>{dataNascimento}</p>
                  </div>
                )}

                {/* ── anosAtividade aqui ─────────────────────────────────── */}

                {anoInicioDublagem && (
                  <div className={styles.detalhesItem}>
                    <span>Dublando desde</span>
                    <p>{anoInicioDublagem}</p>
                  </div>
                )}

                {nacionalidade && (
                  <div className={styles.detalhesItem}>
                    <span>Nacionalidade</span>
                    <p>{nacionalidade}</p>
                  </div>
                )}

                {estadoNatal && (
                  <div className={styles.detalhesItem}>
                    <span>Estado natal</span>
                    <p>{estadoNatal}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Ocupações + Familiares ─────────────────────────────────── */}
        {(ocupacoes.length > 0 ||
          familiares.filter((f) => f.nome?.trim()).length > 0) && (
          <div className={styles.sectionPage}>
            {ocupacoes.length > 0 && (
              <div className={styles.article} style={{ alignSelf: "stretch" }}>
                <div
                  className={styles.containerColumn}
                  style={{ gap: "var(--space-lg)", alignItems: "start" }}
                >
                  <span>Ocupações</span>
                  <div className={styles.ocupacoes}>
                    {ocupacoes.map((o, i) => (
                      <Badge key={i} label={o} variant="soft" bg="--bg-base" />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {familiares.filter((f) => f.nome?.trim()).length > 0 && (
              <div className={styles.article}>
                <div
                  className={styles.containerColumn}
                  style={{ gap: "var(--space-lg)", alignItems: "start" }}
                >
                  <span>Familiares</span>
                  <div className={styles.contentFamiliares}>
                    <ul>
                      {familiares
                        .filter((f) => f.nome?.trim())
                        .map((f, i) => (
                          <li key={i}>
                            <span>{f.parentesco}</span>
                            <p>{f.nome}</p>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form id="form-dublador-editar" onSubmit={handleSubmit}>
        <AdmEditor value={bio} onChange={setBio} />
      </form>
    </div>
  );

  const headerActions = (
    <>
      <div className={styles.menuWrapper} ref={menuRef}>
        <div ref={menuBtnRef}>
          <Button
            variant="ghost"
            label="•••"
            type="button"
            onClick={abrirMenu}
            border="var(--stroke-base)"
          />
        </div>
        {menuAberto && (
          <div
            className={styles.menuDropdown}
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            <button
              type="button"
              className={styles.menuItem}
              onClick={() => {
                window.open(
                  `/dubladores/${toSlug(nomeArtistico || id)}`,
                  "_blank",
                );
                setMenuAberto(false);
              }}
            >
              <span className={styles.menuItemIcon}>
                <IcoVisualizar />
              </span>
              Visualizar
            </button>
            <button
              type="button"
              className={`${styles.menuItem} ${styles.menuItemDanger}`}
              onClick={() => {
                setConfirmarDeletar(true);
                setMenuAberto(false);
              }}
            >
              <span className={styles.menuItemIcon}>
                <IcoDeletar />
              </span>
              Deletar
            </button>
          </div>
        )}
      </div>
      <Button
        variant="ghost"
        label={loading ? "Salvando..." : "Salvar alterações"}
        type="submit"
        form="form-dublador-editar"
        disabled={loading}
        border="var(--stroke-base)"
      />
    </>
  );

  if (loadingPagina)
    return (
      <AdmLayout>
        <p
          style={{
            padding: "var(--space-2xl)",
            fontStyle: "italic",
            color: "var(--text-sub)",
          }}
        >
          Carregando...
        </p>
      </AdmLayout>
    );

  const breadcrumb = [
    { href: "/adm/dubladores", label: "Dubladores" },
    { href: null, label: nomeArtistico || nomeCompleto || id },
  ];

  return (
    <>
      <Head>
        <title>{nomeArtistico || "Editar dublador"} — Cameo ADM</title>
      </Head>
      <AdmLayout
        headerActions={headerActions}
        breadcrumb={breadcrumb}
        rightSidebar={sidebar}
      >
        {central}

        {confirmarDeletar && (
          <div
            className={styles.popoverOverlay}
            onClick={() => setConfirmarDeletar(false)}
          >
            <div
              className={styles.popover}
              onClick={(e) => e.stopPropagation()}
            >
              <p className={styles.popoverTexto}>
                Deletar permanentemente <strong>"{nomeArtistico}"</strong>? Esta
                ação não pode ser desfeita.
              </p>
              <div className={styles.popoverAcoes}>
                <button
                  type="button"
                  className={styles.popoverCancelar}
                  onClick={() => setConfirmarDeletar(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className={styles.popoverConfirmar}
                  onClick={confirmarDelete}
                  disabled={deletando}
                >
                  {deletando ? "Deletando..." : "Deletar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </AdmLayout>
    </>
  );
}
