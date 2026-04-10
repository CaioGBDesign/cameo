import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db, storage } from "@/services/firebaseConection";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/contexts/auth";
import AdmLayout from "@/components/adm/layout";
import UploadImagem from "@/components/upload-imagem";
import Button from "@/components/button";
import TextInput from "@/components/inputs/text-input";
import AdmEditor from "@/components/adm/editor";
import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import Switch from "@/components/inputs/switch";
import styles from "./index.module.scss";

export default function CriarEstudio({ id = null, initialData = null }) {
  const router = useRouter();
  const { user } = useAuth();
  const isEdit = !!id;

  // ── Campos ────────────────────────────────────────────────────────────────
  const [nome, setNome] = useState(initialData?.nome ?? "");
  const [slogan, setSlogan] = useState(initialData?.slogan ?? "");
  const [bio, setBio] = useState(initialData?.bio ?? "");
  const [fundacao, setFundacao] = useState(initialData?.fundacao ?? "");
  const [fundador, setFundador] = useState(initialData?.fundador ?? "");
  const [proprietarios, setProprietarios] = useState(
    initialData?.proprietarios?.length ? initialData.proprietarios : [""],
  );
  const [servicos, setServicos] = useState(
    initialData?.servicos?.length ? initialData.servicos : [""],
  );
  const [localizacaoAtual, setLocalizacaoAtual] = useState(
    initialData?.localizacaoAtual ?? "",
  );
  const [cidade, setCidade] = useState(initialData?.cidade ?? "");
  const [pais, setPais] = useState(initialData?.pais ?? "");
  const [site, setSite] = useState(initialData?.site ?? "");
  const [ativo, setAtivo] = useState(initialData?.ativo ?? true);

  // ── Imagem ────────────────────────────────────────────────────────────────
  const [imagem, setImagem] = useState(null);
  const imagemUrl = initialData?.imagemUrl ?? "";

  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({});

  // ── Upload ────────────────────────────────────────────────────────────────
  const uploadImagemFn = async (docId) => {
    if (!imagem?.file) return imagemUrl || null;
    const storageRef = ref(storage, `estudios/${docId}_${imagem.file.name}`);
    await uploadBytes(storageRef, imagem.file);
    return getDownloadURL(storageRef);
  };

  // ── Gerar ID ──────────────────────────────────────────────────────────────
  const gerarId = async () => {
    const snap = await getDocs(collection(db, "estudios"));
    const ids = snap.docs.map((d) => {
      const m = d.id.match(/^EU(\d+)$/);
      return m ? parseInt(m[1]) : 0;
    });
    return `EU${String(Math.max(0, ...ids) + 1).padStart(4, "0")}`;
  };

  // ── Salvar ────────────────────────────────────────────────────────────────
  const handleSalvar = async () => {
    if (!nome.trim()) {
      setErros({ nome: true });
      return;
    }
    setLoading(true);
    try {
      const newId = isEdit ? id : await gerarId();
      const uploadedUrl = await uploadImagemFn(newId);
      const dados = {
        nome: nome.trim(),
        slogan: slogan.trim(),
        bio: bio.trim(),
        fundacao: fundacao.trim(),
        fundador: fundador.trim(),
        proprietarios: proprietarios.filter((p) => p.trim()),
        servicos: servicos.filter((s) => s.trim()),
        localizacaoAtual: localizacaoAtual.trim(),
        cidade: cidade.trim(),
        pais: pais.trim(),
        site: site.trim(),
        ativo,
        imagemUrl: uploadedUrl,
        dataEdicao: serverTimestamp(),
      };

      if (isEdit) {
        await updateDoc(doc(db, "estudios", id), dados);
      } else {
        dados.autorId = user?.uid ?? null;
        dados.autorNome = user?.nome ?? null;
        dados.dataCadastro = serverTimestamp();
        await setDoc(doc(db, "estudios", newId), dados);
      }
      router.push("/adm/estudios");
    } finally {
      setLoading(false);
    }
  };

  const logoSrc = imagem?.preview ?? imagemUrl ?? null;

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const sidebar = (
    <div className={styles.sidebarContent}>
      <UploadImagem
        imagem={imagem || (imagemUrl ? { preview: imagemUrl } : null)}
        onImagemChange={(file) =>
          setImagem(file ? { file, preview: URL.createObjectURL(file) } : null)
        }
        dimensoes="Recomendado 400x400. JPG e PNG"
      />

      <TextInput
        label="Nome do estúdio"
        placeholder='Ex: "Herbert Richers"'
        value={nome}
        onChange={(e) => {
          setNome(e.target.value);
          setErros({});
        }}
        error={!!erros.nome}
      />

      <TextInput
        label="Slogan"
        placeholder='Ex: "O melhor som do Brasil"'
        value={slogan}
        onChange={(e) => setSlogan(e.target.value)}
      />

      <div className={styles.fieldWrapper}>
        <label className={styles.fieldLabel}>Bio</label>
        <AdmEditor value={bio} onChange={setBio} />
      </div>

      <div className={styles.row}>
        <TextInput
          label="Fundação"
          placeholder="Ex: 1952"
          value={fundacao}
          onChange={(e) => setFundacao(e.target.value)}
        />
        <TextInput
          label="Fundador"
          placeholder='Ex: "Herbert Richers"'
          value={fundador}
          onChange={(e) => setFundador(e.target.value)}
        />
      </div>

      {/* Proprietários */}
      <div className={styles.listaWrapper}>
        <label className={styles.fieldLabel}>Proprietários</label>
        {proprietarios.map((p, i) => (
          <div key={i} className={styles.listaRow}>
            <input
              type="text"
              className={styles.listaInput}
              placeholder={`Proprietário ${i + 1}`}
              value={p}
              onChange={(e) => {
                const nova = [...proprietarios];
                nova[i] = e.target.value;
                setProprietarios(nova);
              }}
            />
            {proprietarios.length > 1 && (
              <button
                type="button"
                className={styles.listaRemover}
                onClick={() =>
                  setProprietarios((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                <TrashIcon size={14} color="currentColor" />
              </button>
            )}
          </div>
        ))}
        <Button
          variant="ghost"
          label="Adicionar proprietário"
          icon={<PlusIcon size={16} color="currentColor" />}
          border="var(--stroke-base)"
          onClick={() => setProprietarios((prev) => [...prev, ""])}
        />
      </div>

      {/* Serviços */}
      <div className={styles.listaWrapper}>
        <label className={styles.fieldLabel}>Serviços</label>
        {servicos.map((s, i) => (
          <div key={i} className={styles.listaRow}>
            <input
              type="text"
              className={styles.listaInput}
              placeholder='Ex: "Dublagem"'
              value={s}
              onChange={(e) => {
                const nova = [...servicos];
                nova[i] = e.target.value;
                setServicos(nova);
              }}
            />
            {servicos.length > 1 && (
              <button
                type="button"
                className={styles.listaRemover}
                onClick={() =>
                  setServicos((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                <TrashIcon size={14} color="currentColor" />
              </button>
            )}
          </div>
        ))}
        <Button
          variant="ghost"
          label="Adicionar serviço"
          icon={<PlusIcon size={16} color="currentColor" />}
          border="var(--stroke-base)"
          onClick={() => setServicos((prev) => [...prev, ""])}
        />
      </div>

      <TextInput
        label="Localização atual"
        placeholder='Ex: "Rio de Janeiro, RJ"'
        value={localizacaoAtual}
        onChange={(e) => setLocalizacaoAtual(e.target.value)}
      />

      <div className={styles.row}>
        <TextInput
          label="Cidade"
          placeholder='Ex: "Rio de Janeiro"'
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
        />
        <TextInput
          label="País"
          placeholder='Ex: "Brasil"'
          value={pais}
          onChange={(e) => setPais(e.target.value)}
        />
      </div>

      <TextInput
        label="Site"
        placeholder="https://..."
        value={site}
        onChange={(e) => setSite(e.target.value)}
      />

      <div className={styles.toggleRow}>
        <label className={styles.fieldLabel} htmlFor="ativo-estudio">
          Estúdio ativo
        </label>
        <Switch
          id="ativo-estudio"
          checked={ativo}
          onChange={(e) => setAtivo(e.target.checked)}
        />
      </div>
    </div>
  );

  // ── Central (preview) ────────────────────────────────────────────────────
  const central = (
    <div className={styles.central}>
      <div className={styles.previewCard}>
        {logoSrc ? (
          <img src={logoSrc} alt="Logo" className={styles.previewImagem} />
        ) : (
          <div className={styles.previewImagemPlaceholder}>
            {nome?.[0]?.toUpperCase() ?? "E"}
          </div>
        )}

        {(fundacao ||
          fundador ||
          localizacaoAtual ||
          cidade ||
          pais ||
          site) && (
          <div className={styles.previewInfoGrid}>
            {fundacao && (
              <div className={styles.previewInfoItem}>
                <span className={styles.previewInfoLabel}>Fundação</span>
                <span className={styles.previewInfoValue}>{fundacao}</span>
              </div>
            )}
            {fundador && (
              <div className={styles.previewInfoItem}>
                <span className={styles.previewInfoLabel}>Fundador</span>
                <span className={styles.previewInfoValue}>{fundador}</span>
              </div>
            )}
            {localizacaoAtual && (
              <div className={styles.previewInfoItem}>
                <span className={styles.previewInfoLabel}>
                  Localização atual
                </span>
                <span className={styles.previewInfoValue}>
                  {localizacaoAtual}
                </span>
              </div>
            )}
            {(cidade || pais) && (
              <div className={styles.previewInfoItem}>
                <span className={styles.previewInfoLabel}>Origem</span>
                <span className={styles.previewInfoValue}>
                  {[cidade, pais].filter(Boolean).join(", ")}
                </span>
              </div>
            )}
            {site && (
              <div className={styles.previewInfoItem}>
                <span className={styles.previewInfoLabel}>Site</span>
                <span className={styles.previewInfoValue}>{site}</span>
              </div>
            )}
          </div>
        )}

        {proprietarios.some((p) => p.trim()) && (
          <div className={styles.previewSection}>
            <span className={styles.previewSectionTitle}>Proprietários</span>
            <div className={styles.previewPills}>
              {proprietarios
                .filter((p) => p.trim())
                .map((p, i) => (
                  <span key={i} className={styles.previewPill}>
                    {p}
                  </span>
                ))}
            </div>
          </div>
        )}

        {servicos.some((s) => s.trim()) && (
          <div className={styles.previewSection}>
            <span className={styles.previewSectionTitle}>Serviços</span>
            <div className={styles.previewPills}>
              {servicos
                .filter((s) => s.trim())
                .map((s, i) => (
                  <span key={i} className={styles.previewPill}>
                    {s}
                  </span>
                ))}
            </div>
          </div>
        )}

        {bio && (
          <div className={styles.previewSection}>
            <span className={styles.previewSectionTitle}>Bio</span>
            <div
              className={styles.previewBio}
              dangerouslySetInnerHTML={{ __html: bio }}
            />
          </div>
        )}
      </div>
    </div>
  );

  // ── Header ────────────────────────────────────────────────────────────────
  const headerActions = (
    <Button
      variant="ghost"
      label={loading ? "Salvando..." : "Salvar"}
      onClick={handleSalvar}
      disabled={loading}
      border="var(--stroke-base)"
    />
  );

  const breadcrumb = isEdit
    ? [
        { href: "/adm/estudios", label: "Estúdios" },
        { href: null, label: nome || id },
      ]
    : [
        { href: "/adm/estudios", label: "Estúdios" },
        { href: null, label: "Criar" },
      ];

  return (
    <>
      <Head>
        <title>{isEdit ? "Editar" : "Criar"} estúdio — Cameo ADM</title>
      </Head>
      <AdmLayout
        headerActions={headerActions}
        breadcrumb={breadcrumb}
        rightSidebar={sidebar}
      >
        {central}
      </AdmLayout>
    </>
  );
}
