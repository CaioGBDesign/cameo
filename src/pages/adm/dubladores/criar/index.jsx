import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db, storage } from "@/services/firebaseConection";
import {
  collection,
  getDocs,
  doc,
  setDoc,
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
import PlusIcon from "@/components/icons/PlusIcon";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import Badge from "@/components/badge";
import AvatarDublador from "@/components/avatar-dublador";
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
import Switch from "@/components/inputs/switch";
import styles from "./index.module.scss";
import { REDES_SOCIAIS, REDE_PLACEHOLDER, gerarUrlRede } from "@/utils/redes";

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
  "Enteado",
  "Enteada",
  "Nora",
  "Genro",
  "Cônjuge",
  "Primo",
  "Prima",
  "Tio",
  "Tia",
  "Sobrinho",
  "Sobrinha",
  "Afilhado",
  "Afilhada",
  "Avô",
  "Avó",
  "Neto",
  "Neta",
  "Bisneto",
  "Bisneta",
  "Padrasto",
  "Madrasta",
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

export function FamiliarNomeInput({
  value,
  onChange,
  dubladores = [],
  idDublador = "",
  dubladorValido = null,
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

  const filtrados =
    value.trim().length > 1
      ? dubladores
          .filter((d) =>
            (d.nomeArtistico || d.nomeCompleto || "")
              .toLowerCase()
              .includes(value.toLowerCase()),
          )
          .slice(0, 6)
      : [];

  const selecionar = (d) => {
    const nome = d.nomeArtistico || d.nomeCompleto;
    onChange(nome, d.id);
    setAberto(false);
  };

  return (
    <div ref={wrapperRef} className={styles.familiarNomeWrapper}>
      <TextInput
        placeholder="Nome completo"
        value={value}
        onChange={(e) => {
          onChange(e.target.value, null);
          setAberto(true);
        }}
        prefix={dubladorValido && idDublador ? idDublador : undefined}
        success={!!dubladorValido}
      />
      {aberto && filtrados.length > 0 && (
        <div className={styles.familiarDropdown}>
          {filtrados.map((d) => (
            <button
              key={d.id}
              type="button"
              className={styles.familiarDropdownItem}
              onMouseDown={() => selecionar(d)}
            >
              {d.nomeArtistico || d.nomeCompleto}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

async function gerarProximoId() {
  const snap = await getDocs(collection(db, "dubladores"));
  let max = 0;
  snap.docs.forEach((d) => {
    const match = d.id.match(/^DB(\d+)$/i);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  });
  return `DB${String(max + 1).padStart(4, "0")}`;
}

function formatarData(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function mascaraData(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 4) return d;
  if (d.length <= 6) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export default function AdmCriarDublador() {
  const { user } = useAuth();
  const router = useRouter();

  const [imagem, setImagem] = useState(null);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [nomeArtistico, setNomeArtistico] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [anoInicioDublagem, setAnoInicioDublagem] = useState("");
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
  const [dubladores, setDubladores] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingRascunho, setLoadingRascunho] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getDocs(collection(db, "dubladores")).then((snap) =>
      setDubladores(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );
  }, []);

  const isDirty =
    nomeCompleto !== "" ||
    nomeArtistico !== "" ||
    bio !== "" ||
    imagem !== null;
  useUnsavedChanges(isDirty);

  const uploadImagem = async (id) => {
    if (!imagem?.file) return null;
    const storageRef = ref(storage, `dubladores/${id}_${imagem.file.name}`);
    await uploadBytes(storageRef, imagem.file);
    return getDownloadURL(storageRef);
  };

  const montarPayload = async (status, id) => {
    const imagemUrl = status === "publicado" ? await uploadImagem(id) : null;
    return {
      nomeCompleto,
      nomeArtistico,
      dataNascimento,
      anoInicioDublagem,
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
      autor: user
        ? {
            id: user.uid,
            nome: user.nome || user.displayName || "",
            avatarUrl: user.avatarUrl || "",
          }
        : null,
      dataCadastro: serverTimestamp(),
      ...(status === "publicado"
        ? { dataPublicacao: serverTimestamp() }
        : { dataRascunho: serverTimestamp() }),
    };
  };

  const salvarRascunho = async () => {
    if (!nomeArtistico.trim()) {
      setError("Nome artístico é obrigatório");
      return;
    }
    setLoadingRascunho(true);
    setError("");
    try {
      const id = await gerarProximoId();
      await setDoc(
        doc(db, "dubladores", id),
        await montarPayload("rascunho", id),
        { merge: true },
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingRascunho(false);
    }
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
      const id = await gerarProximoId();
      await setDoc(
        doc(db, "dubladores", id),
        await montarPayload("publicado", id),
      );
      router.push("/adm/dubladores");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        imagem={imagem}
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
          placeholder="DD/MM/AAAA"
          value={anoInicioDublagem}
          onChange={(e) => setAnoInicioDublagem(mascaraData(e.target.value))}
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
  const fotoSrc = imagem?.preview ?? null;
  const familiaresValidos = familiares.filter((f) => f.nome.trim());

  const central = (
    <div className={styles.centralWrapper}>
      <div className={styles.previewCard}>
        {/* ── Foto + Status ─────────────────────────────────── */}
        <div className={styles.sectionPage}>
          <div
            className={styles.article}
            style={{
              width: "auto",
              background:
                "linear-gradient(203deg, var(--Rosa-01, rgba(243, 20, 251, 0.05)) 0%, var(--Roxo-06, rgba(22, 18, 22, 0.10)) 100%), rgba(22, 18, 22, 0.20)",
            }}
          >
            <div className={styles.containerColumn}>
              {fotoSrc ? (
                <AvatarDublador src={fotoSrc} alt={nomeArtistico} />
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
              background:
                "linear-gradient(117deg, rgba(243, 20, 251, 0.05) 0%, rgba(22, 18, 22, 0.10) 40.47%), rgba(22, 18, 22, 0.20)",
            }}
          >
            <div className={styles.containerColumn}>
              <div className={styles.nomeArtisticoRedes}>
                <div className={styles.nomeArtistico}>
                  <h1>
                    {nomeArtistico || (
                      <span className={styles.previewPlaceholder}>
                        Nome artístico
                      </span>
                    )}
                  </h1>
                </div>
                <div className={styles.nomeRedes}>
                  {links.filter((l) => gerarUrlRede(l.tipo, l.usuario)?.trim())
                    .length > 0 && (
                    <ul>
                      {links
                        .filter((l) => gerarUrlRede(l.tipo, l.usuario)?.trim())
                        .map((l, i) => (
                          <li key={i}>
                            <a
                              href={gerarUrlRede(l.tipo, l.usuario)}
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
                {dataNascimento && (
                  <div className={styles.detalhesItem}>
                    <span>Data de nascimento</span>
                    <p>{formatarData(dataNascimento)}</p>
                  </div>
                )}
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
        {(ocupacoes.length > 0 || familiaresValidos.length > 0) && (
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
            {familiaresValidos.length > 0 && (
              <div className={styles.article}>
                <div
                  className={styles.containerColumn}
                  style={{ gap: "var(--space-lg)", alignItems: "start" }}
                >
                  <span>Familiares</span>
                  <div className={styles.contentFamiliares}>
                    <ul>
                      {familiaresValidos.map((f, i) => (
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

      <form id="form-dublador" onSubmit={handleSubmit}>
        <AdmEditor value={bio} onChange={setBio} />
      </form>
    </div>
  );

  const headerActions = (
    <>
      <Button
        variant="ghost"
        label={loadingRascunho ? "Salvando..." : "Salvar rascunho"}
        type="button"
        disabled={loadingRascunho}
        onClick={salvarRascunho}
        border="var(--stroke-base)"
      />
      <Button
        variant="ghost"
        label={loading ? "Publicando..." : "Publicar"}
        type="submit"
        form="form-dublador"
        disabled={loading}
        border="var(--stroke-base)"
      />
    </>
  );

  return (
    <>
      <Head>
        <title>Criar dublador — Cameo ADM</title>
      </Head>
      <AdmLayout headerActions={headerActions} rightSidebar={sidebar}>
        {central}
      </AdmLayout>
    </>
  );
}
