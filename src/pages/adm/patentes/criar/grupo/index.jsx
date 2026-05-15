import { useState } from "react";
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
import Button from "@/components/button";
import Select from "@/components/inputs/select";
import CloudUploadIcon from "@/components/icons/CloudUploadIcon";
import styles from "./index.module.scss";

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
  tema: "",
  origem: "",
  dificuldade: i < 3 ? "facil" : i < 7 ? "medio" : "dificil",
});

const NOME_OPTIONS = [
  "Aspirante",
  "Entusiasta",
  "Apreciador",
  "Conhecedor",
  "Colecionador",
  "Especialista",
  "Referência",
  "Mestre",
  "Ícone",
  "Lenda",
].map((n) => ({ value: n.toLowerCase(), label: n }));

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
  { value: "cinema", label: "Cinema" },
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

export default function CriarPatenteGrupo() {
  const router = useRouter();
  const { user } = useAuth();
  const [slots, setSlots] = useState(Array.from({ length: 10 }, (_, i) => SLOT_VAZIO(i)));
  const [slotAtivo, setSlotAtivo] = useState(null);
  const [loading, setLoading] = useState(false);

  const slot = slotAtivo !== null ? slots[slotAtivo] : null;
  const disabled = slotAtivo === null;

  const updateSlot = (campo, valor) => {
    if (slotAtivo === null) return;
    setSlots((prev) =>
      prev.map((s, i) => (i === slotAtivo ? { ...s, [campo]: valor } : s)),
    );
  };

  const handleImagem = (file) => {
    if (!file) return;
    updateSlot("imagem", { preview: URL.createObjectURL(file), file });
  };

  const gerarId = async () => {
    const snap = await getDocs(collection(db, "patentes"));
    const nums = snap.docs.map((d) => {
      const m = d.id.match(/^PT(\d+)$/);
      return m ? parseInt(m[1]) : 0;
    });
    return `PT${String(Math.max(0, ...nums) + 1).padStart(4, "0")}`;
  };

  const uploadImagemSlot = async (docId, idx, file) => {
    const storageRef = ref(
      storage,
      `patentes/${docId}_slot${idx}_${file.name}`,
    );
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSalvar = async (status) => {
    setLoading(true);
    try {
      const newId = await gerarId();

      const slotsParaSalvar = await Promise.all(
        slots.map(async (s, i) => {
          const imagemUrl = s.imagem?.file
            ? await uploadImagemSlot(newId, i, s.imagem.file)
            : null;
          return {
            nome: s.nome,
            qtdPerguntas: s.qtdPerguntas,
            tema: s.tema,
            origem: s.origem,
            dificuldade: s.dificuldade,
            imagemUrl,
          };
        }),
      );

      await setDoc(doc(db, "patentes", newId), {
        tipo: "grupo",
        slots: slotsParaSalvar,
        status,
        autorId: user?.uid ?? null,
        autorNome: user?.nome ?? null,
        dataCadastro: serverTimestamp(),
        ...(status === "publicado"
          ? { dataPublicacao: serverTimestamp() }
          : {}),
      });

      router.push("/adm/patentes");
    } finally {
      setLoading(false);
    }
  };

  const headerActions = (
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
      <h2 className={styles.sidebarTitulo}>Detalhes da patente</h2>

      <label className={styles.sidebarUpload}>
        {slot?.imagem ? (
          <img src={slot.imagem.preview} alt="" className={styles.sidebarImg} />
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
          disabled={disabled}
          onChange={(e) => e.target.files[0] && handleImagem(e.target.files[0])}
        />
      </label>

      <div
        className={`${styles.sidebarCampos} ${disabled ? styles.sidebarCamposDisabled : ""}`}
      >
        <Select
          label="Nível da patente"
          placeholder="Selecione"
          options={NOME_OPTIONS}
          value={slot?.nome ?? ""}
          onChange={(e) => updateSlot("nome", e.target.value)}
          disabled={disabled}
        />
        <Select
          label="Quantidade de perguntas necessárias"
          placeholder="Selecione"
          options={QTD_OPTIONS}
          value={slot?.qtdPerguntas ?? ""}
          onChange={(e) => updateSlot("qtdPerguntas", e.target.value)}
          disabled={disabled}
        />
        <Select
          label="Tema exigido"
          placeholder="Selecione"
          options={TEMA_OPTIONS}
          value={slot?.tema ?? ""}
          onChange={(e) => updateSlot("tema", e.target.value)}
          disabled={disabled}
        />
        <Select
          label="Selecione a origem"
          placeholder="Selecione"
          options={ORIGEM_OPTIONS}
          value={slot?.origem ?? ""}
          onChange={(e) => updateSlot("origem", e.target.value)}
          disabled={disabled}
        />
        <Select
          label="Dificuldade necessária"
          placeholder="Selecione"
          options={DIFICULDADE_OPTIONS}
          value={slot?.dificuldade ?? ""}
          onChange={(e) => updateSlot("dificuldade", e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  );

  return (
    <AdmLayout headerActions={headerActions} rightSidebar={rightSidebar}>
      <Head>
        <title>Criar patente — Cameo ADM</title>
      </Head>

      <div className={styles.page}>
        <h1 className={styles.titulo}>Criar patente</h1>

        <div className={styles.grid}>
          {LINHAS.map((linha, li) => (
            <div key={li} className={styles.gridLinha}>
              {linha.map((idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`${styles.slot} ${slotAtivo === idx ? styles.slotAtivo : ""} ${slots[idx].imagem ? styles.slotComImagem : ""}`}
                  onClick={() => setSlotAtivo(idx)}
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
    </AdmLayout>
  );
}
