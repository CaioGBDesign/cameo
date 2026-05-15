import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db, storage } from "@/services/firebaseConection";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/auth";
import AdmLayout from "@/components/adm/layout";
import AdmModal from "@/components/adm/modal";
import Button from "@/components/button";
import Select from "@/components/inputs/select";
import TextInput from "@/components/inputs/text-input";
import CloudUploadIcon from "@/components/icons/CloudUploadIcon";
import styles from "../criar/index.module.scss";

const NIVEIS = [
  "aspirante",
  "entusiasta",
  "apreciador",
  "conhecedor",
  "colecionador",
  "especialista",
  "referência",
  "mestre",
  "ícone",
  "lenda",
];

const SLOT_VAZIO = (i) => ({
  imagem: null,
  nome: NIVEIS[i] ?? "",
  qtdPerguntas: String((i + 1) * 5),
  dificuldade: i < 3 ? "facil" : i < 7 ? "medio" : "dificil",
});

const TIPO_OPTIONS = [
  { value: "grupo", label: "Grupo" },
  { value: "especial", label: "Especial" },
];

const NOME_OPTIONS = NIVEIS.map((n) => ({
  value: n,
  label: n.charAt(0).toUpperCase() + n.slice(1),
}));

const QTD_OPTIONS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((n) => ({
  value: String(n),
  label: String(n),
}));

const TEMA_OPTIONS = [
  { value: "comedia", label: "Comédia" },
  { value: "romance", label: "Romance" },
  { value: "terror", label: "Terror" },
  { value: "drama", label: "Drama" },
  { value: "dublagem", label: "Dublagem" },
  { value: "selecao-variada", label: "Seleção variada" },
];

const ORIGEM_OPTIONS = [
  { value: "quiz-padrao", label: "Quiz padrão" },
  { value: "eventos", label: "Eventos" },
];

const DIFICULDADE_OPTIONS = [
  { value: "facil", label: "Fácil" },
  { value: "medio", label: "Médio" },
  { value: "dificil", label: "Difícil" },
];

const LINHAS = [
  [0, 1, 2],
  [3, 4, 5, 6],
  [7, 8, 9],
];

export default function EditarPatenteGrupo() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();

  const [slots, setSlots] = useState(
    Array.from({ length: 10 }, (_, i) => SLOT_VAZIO(i)),
  );
  const [slotModal, setSlotModal] = useState(null);
  const [nomePatente, setNomePatente] = useState("");
  const [tipo, setTipo] = useState("grupo");
  const [tema, setTema] = useState("");
  const [origem, setOrigem] = useState("");
  const [status, setStatus] = useState("rascunho");
  const [loading, setLoading] = useState(false);
  const [loadingPagina, setLoadingPagina] = useState(true);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, "patentes", id))
      .then((snap) => {
        if (!snap.exists()) {
          router.push("/adm/patentes");
          return;
        }
        const data = snap.data();
        setNomePatente(data.nomePatente ?? "");
        setTipo(data.tipo ?? "grupo");
        setTema(data.tema ?? data.slots?.[0]?.tema ?? "");
        setOrigem(data.origem ?? data.slots?.[0]?.origem ?? "");
        setStatus(data.status ?? "rascunho");
        setSlots(
          Array.from({ length: 10 }, (_, i) => {
            const s = data.slots?.[i];
            if (!s) return SLOT_VAZIO(i);
            return {
              imagem: s.imagemUrl ? { preview: s.imagemUrl, file: null } : null,
              nome: s.nome ?? NIVEIS[i] ?? "",
              qtdPerguntas: s.qtdPerguntas ?? String((i + 1) * 5),
              dificuldade:
                s.dificuldade ??
                (i < 3 ? "facil" : i < 7 ? "medio" : "dificil"),
            };
          }),
        );
      })
      .finally(() => setLoadingPagina(false));
  }, [id]);

  const updateSlot = (campo, valor) => {
    if (slotModal === null) return;
    setSlots((prev) =>
      prev.map((s, i) => (i === slotModal ? { ...s, [campo]: valor } : s)),
    );
  };

  const handleImagem = (file) => {
    if (!file || slotModal === null) return;
    setSlots((prev) =>
      prev.map((s, i) =>
        i === slotModal
          ? { ...s, imagem: { preview: URL.createObjectURL(file), file } }
          : s,
      ),
    );
  };

  const uploadImagemSlot = async (idx, file) => {
    const storageRef = ref(storage, `patentes/${id}_slot${idx}_${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSalvar = async (novoStatus) => {
    setLoading(true);
    try {
      const slotsParaSalvar = await Promise.all(
        slots.map(async (s, i) => {
          const imagemUrl = s.imagem?.file
            ? await uploadImagemSlot(i, s.imagem.file)
            : (s.imagem?.preview ?? null);
          return {
            nome: s.nome,
            qtdPerguntas: s.qtdPerguntas,
            dificuldade: s.dificuldade,
            imagemUrl,
          };
        }),
      );

      await updateDoc(doc(db, "patentes", id), {
        nomePatente,
        tipo,
        tema,
        origem,
        slots: slotsParaSalvar,
        status: novoStatus,
        dataEdicao: serverTimestamp(),
        editadoPorId: user?.uid ?? null,
        editadoPorNome: user?.nome ?? null,
        ...(novoStatus === "publicado"
          ? { dataPublicacao: serverTimestamp() }
          : {}),
      });

      router.push("/adm/patentes");
    } finally {
      setLoading(false);
    }
  };

  const headerActions =
    status === "publicado" ? (
      <Button
        variant="ghost"
        label={loading ? "Salvando..." : "Salvar alterações"}
        border="var(--stroke-base)"
        disabled={loading}
        onClick={() => handleSalvar("publicado")}
      />
    ) : (
      <>
        <Button
          variant="ghost"
          label={loading ? "Salvando..." : "Salvar rascunho"}
          border="var(--stroke-base)"
          disabled={loading}
          onClick={() => handleSalvar("rascunho")}
        />
        <Button
          variant="ghost"
          label={loading ? "Publicando..." : "Publicar"}
          border="var(--stroke-base)"
          disabled={loading}
          onClick={() => handleSalvar("publicado")}
        />
      </>
    );

  const rightSidebar = (
    <div className={styles.sidebar}>
      <h2 className={styles.sidebarTitulo}>Detalhes do grupo</h2>
      <div className={styles.sidebarCampos}>
        <TextInput
          label="Nome da patente"
          placeholder="Digite o nome da patente"
          value={nomePatente}
          onChange={(e) => setNomePatente(e.target.value)}
        />
        <Select
          label="Tipo"
          placeholder="Selecione"
          options={TIPO_OPTIONS}
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        />
        <Select
          label="Tema"
          placeholder="Selecione"
          options={TEMA_OPTIONS}
          value={tema}
          onChange={(e) => setTema(e.target.value)}
        />
        <Select
          label="Origem"
          placeholder="Selecione"
          options={ORIGEM_OPTIONS}
          value={origem}
          onChange={(e) => setOrigem(e.target.value)}
        />
      </div>
    </div>
  );

  const slotAtual = slotModal !== null ? slots[slotModal] : null;

  const breadcrumb = [
    { href: "/adm/patentes", label: "Patentes" },
    { href: null, label: id ?? "…" },
  ];

  if (loadingPagina)
    return (
      <AdmLayout breadcrumb={breadcrumb}>
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

  return (
    <AdmLayout
      headerActions={headerActions}
      rightSidebar={rightSidebar}
      breadcrumb={breadcrumb}
    >
      <Head>
        <title>Editar patente — Cameo ADM</title>
      </Head>

      <div className={styles.page}>
        <h1 className={styles.titulo}>Editar patente</h1>

        <div className={styles.grid}>
          {LINHAS.map((linha, li) => (
            <div key={li} className={styles.gridLinha}>
              {linha.map((idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.slot} ${slotModal === idx ? styles.slotAtivo : ""} ${slots[idx].imagem ? styles.slotComImagem : ""}`}
                  onClick={() => setSlotModal(idx)}
                >
                  {slots[idx].imagem ? (
                    <img
                      src={slots[idx].imagem.preview}
                      alt={slots[idx].nome || `Patente ${idx + 1}`}
                      className={styles.slotImg}
                    />
                  ) : (
                    <div className={styles.placeholderSlot}>
                      <div className={styles.svgUpload}>
                        <CloudUploadIcon size={40} color="var(--text-sub)" />
                      </div>
                      <div className={styles.moldura}>
                        <svg
                          width="148"
                          height="166"
                          viewBox="0 0 148 166"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 48.7636V117.236C0 122.428 2.77603 127.224 7.28238 129.819L66.7187 164.054C71.225 166.649 76.775 166.649 81.2814 164.054L140.718 129.819C145.224 127.224 148 122.426 148 117.236V48.7636C148 43.572 145.224 38.7762 140.718 36.1814L81.2814 1.94604C76.775 -0.648682 71.225 -0.648682 66.7187 1.94604L7.28238 36.1814C2.77603 38.7762 0 43.5741 0 48.7636Z"
                            fill="#191419"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      <AdmModal
        isOpen={slotModal !== null}
        onClose={() => setSlotModal(null)}
        title={
          slotModal !== null
            ? NIVEIS[slotModal]?.charAt(0).toUpperCase() +
              NIVEIS[slotModal]?.slice(1)
            : ""
        }
      >
        <div className={styles.modalBody}>
          <label
            className={styles.sidebarUpload}
            style={{ margin: "var(--space-2xl)", marginBottom: 0 }}
          >
            {slotAtual?.imagem ? (
              <img
                src={slotAtual.imagem.preview}
                alt=""
                className={styles.sidebarImg}
              />
            ) : (
              <>
                <CloudUploadIcon size={28} color="var(--text-sub)" />
                <span className={styles.sidebarUploadDim}>
                  Dimensões recomendadas 1500x1500
                </span>
                <span className={styles.sidebarUploadDim}>
                  Arquivos aceitos: JPG e PNG
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png"
              style={{ display: "none" }}
              onChange={(e) =>
                e.target.files[0] && handleImagem(e.target.files[0])
              }
            />
          </label>

          <div className={styles.modalCampos}>
            <Select
              label="Nível da patente"
              placeholder="Selecione"
              options={NOME_OPTIONS}
              value={slotAtual?.nome ?? ""}
              onChange={(e) => updateSlot("nome", e.target.value)}
            />
            <Select
              label="Quantidade de perguntas necessárias"
              placeholder="Selecione"
              options={QTD_OPTIONS}
              value={slotAtual?.qtdPerguntas ?? ""}
              onChange={(e) => updateSlot("qtdPerguntas", e.target.value)}
            />
            <Select
              label="Dificuldade necessária"
              placeholder="Selecione"
              options={DIFICULDADE_OPTIONS}
              value={slotAtual?.dificuldade ?? ""}
              onChange={(e) => updateSlot("dificuldade", e.target.value)}
            />
          </div>
        </div>
      </AdmModal>
    </AdmLayout>
  );
}
