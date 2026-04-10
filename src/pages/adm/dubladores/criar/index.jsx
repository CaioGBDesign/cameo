import { useState, useRef } from "react";
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
import styles from "./index.module.scss";

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
  "Avô",
  "Avó",
  "Outro",
].map((p) => ({ value: p, label: p }));

const REDES_SOCIAIS = ["Instagram", "YouTube", "TikTok", "IMDB", "Site"].map(
  (r) => ({ value: r, label: r }),
);

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

export default function AdmCriarDublador() {
  const { user } = useAuth();
  const router = useRouter();

  const [imagem, setImagem] = useState(null);
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
  const [familiares, setFamiliares] = useState([
    { nome: "", parentesco: "", link: "" },
  ]);
  const [links, setLinks] = useState([{ tipo: "", url: "" }]);

  const [loading, setLoading] = useState(false);
  const [loadingRascunho, setLoadingRascunho] = useState(false);
  const [error, setError] = useState("");

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
      nacionalidade,
      estadoNatal,
      ondeAtua,
      ativoNaDublagem,
      bio,
      ocupacoes,
      familiares: familiares.filter((f) => f.nome.trim()),
      links: links.filter((l) => l.tipo && l.url.trim()),
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
          value={anoInicioDublagem}
          onChange={(e) => setAnoInicioDublagem(e.target.value)}
          type="date"
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
            <TextInput
              placeholder="Nome completo"
              value={f.nome}
              onChange={(e) => setFamiliar(idx, "nome", e.target.value)}
            />
            <Select
              placeholder="Parentesco"
              options={PARENTESCO_OPTS}
              value={f.parentesco}
              onChange={(e) => setFamiliar(idx, "parentesco", e.target.value)}
              width="160px"
            />
            <TextInput
              placeholder="Link (se profissional)"
              value={f.link}
              onChange={(e) => setFamiliar(idx, "link", e.target.value)}
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
            setFamiliares((p) => [...p, { nome: "", parentesco: "", link: "" }])
          }
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
              placeholder="URL do perfil"
              value={l.url}
              onChange={(e) => setLink(idx, "url", e.target.value)}
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
          onClick={() => setLinks((p) => [...p, { tipo: "", url: "" }])}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );

  // ── Área central: editor + preview ───────────────────────────────────────────
  const fotoSrc = imagem?.preview ?? null;
  const linksValidos = links.filter((l) => l.tipo && l.url.trim());
  const familiaresValidos = familiares.filter((f) => f.nome.trim());

  const central = (
    <div className={styles.centralWrapper}>
      <form id="form-dublador" onSubmit={handleSubmit}>
        <AdmEditor value={bio} onChange={setBio} />
      </form>

      <div className={styles.previewCard}>
        <div className={styles.previewAvatarRow}>
          {fotoSrc ? (
            <img
              src={fotoSrc}
              alt={nomeArtistico}
              className={styles.previewAvatar}
              unoptimized
            />
          ) : (
            <div className={styles.previewAvatarPlaceholder}>
              <span>
                {nomeArtistico ? nomeArtistico[0].toUpperCase() : "?"}
              </span>
            </div>
          )}
          <div className={styles.previewNameBlock}>
            <h2 className={styles.previewNomeArtistico}>
              {nomeArtistico || (
                <span className={styles.previewPlaceholder}>
                  Nome artístico
                </span>
              )}
            </h2>
            {nomeCompleto && (
              <p className={styles.previewNomeCompleto}>{nomeCompleto}</p>
            )}
            {ativoNaDublagem && (
              <span
                className={`${styles.previewBadge} ${styles[`badge${ativoNaDublagem}`]}`}
              >
                {ativoNaDublagem}
              </span>
            )}
          </div>
        </div>

        {(dataNascimento ||
          anoInicioDublagem ||
          nacionalidade ||
          estadoNatal) && (
          <div className={styles.previewInfoGrid}>
            {dataNascimento && (
              <div className={styles.previewInfoItem}>
                <span className={styles.previewInfoLabel}>Aniversário</span>
                <span className={styles.previewInfoValue}>
                  {formatarData(dataNascimento)}
                </span>
              </div>
            )}
            {anoInicioDublagem && (
              <div className={styles.previewInfoItem}>
                <span className={styles.previewInfoLabel}>
                  Início na dublagem
                </span>
                <span className={styles.previewInfoValue}>
                  {formatarData(anoInicioDublagem)}
                </span>
              </div>
            )}
            {nacionalidade && (
              <div className={styles.previewInfoItem}>
                <span className={styles.previewInfoLabel}>Nacionalidade</span>
                <span className={styles.previewInfoValue}>{nacionalidade}</span>
              </div>
            )}
            {estadoNatal && (
              <div className={styles.previewInfoItem}>
                <span className={styles.previewInfoLabel}>Estado natal</span>
                <span className={styles.previewInfoValue}>{estadoNatal}</span>
              </div>
            )}
          </div>
        )}

        {ocupacoes.length > 0 && (
          <div className={styles.previewOcupacoes}>
            {ocupacoes.map((o) => (
              <span key={o} className={styles.previewOcupacaoPill}>
                {o}
              </span>
            ))}
          </div>
        )}

        {bio && (
          <div
            className={styles.previewBio}
            dangerouslySetInnerHTML={{ __html: bio }}
          />
        )}

        {familiaresValidos.length > 0 && (
          <div className={styles.previewSection}>
            <h3 className={styles.previewSectionTitle}>Familiares</h3>
            {familiaresValidos.map((f, i) => (
              <div key={i} className={styles.previewFamiliarItem}>
                <span className={styles.previewFamiliarNome}>{f.nome}</span>
                {f.parentesco && (
                  <span className={styles.previewFamiliarParentesco}>
                    {f.parentesco}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {linksValidos.length > 0 && (
          <div className={styles.previewSection}>
            <h3 className={styles.previewSectionTitle}>Redes sociais</h3>
            <div className={styles.previewLinks}>
              {linksValidos.map((l, i) => (
                <span key={i} className={styles.previewLinkPill}>
                  {l.tipo}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
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
