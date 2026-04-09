import { useState, useRef, useEffect } from "react";
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
import { useAuth } from "@/contexts/auth";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import TextInput from "@/components/inputs/text-input";
import Select from "@/components/inputs/select";
import BoldIcon from "@/components/icons/BoldIcon";
import PreviewHeader from "./shared/PreviewHeader";
import SidebarCronometros from "./shared/SidebarCronometros";
import SidebarStatusVisibilidade from "./shared/SidebarStatusVisibilidade";
import Joias from "./shared/Joias";
import styles from "../criar/index.module.scss";

const DIFICULDADES = [
  { value: "1", label: "★ Fácil" },
  { value: "2", label: "★★ Médio" },
  { value: "3", label: "★★★ Difícil" },
];

const TMDB_GENEROS = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  99: "Documentário",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  36: "História",
  27: "Terror",
  10402: "Musical",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção Científica",
  10770: "Cinema TV",
  53: "Suspense",
  10752: "Guerra",
  37: "Faroeste",
};

const TAGS_FILME = [{ value: "filme", label: "Filme" }];
const OPCOES_VF = ["verdadeiro", "falso"];

const stripHtml = (html) => html.replace(/<[^>]*>/g, "").trim();

export default function Tipo11({ id = null, initialData = null }) {
  const router = useRouter();
  const { user } = useAuth();
  const isEdit = !!id;

  const [titulo, setTitulo] = useState(initialData?.titulo ?? "");
  const [subtitulo, setSubtitulo] = useState(initialData?.subtitulo ?? "");
  const [dificuldade, setDificuldade] = useState(
    initialData?.dificuldade ?? "",
  );
  const [genero, setGenero] = useState(initialData?.genero ?? "");
  const [cronometroAtivo, setCronometroAtivo] = useState(
    initialData?.cronometroAtivo ?? true,
  );
  const [cronometroVisivel, setCronometroVisivel] = useState(
    initialData?.cronometroVisivel ?? false,
  );
  const [cronometroRegressivoAtivo, setCronometroRegressivoAtivo] = useState(
    initialData?.cronometroRegressivoAtivo ?? false,
  );
  const [cronometroRegressivoVisivel, setCronometroRegressivoVisivel] =
    useState(initialData?.cronometroRegressivoVisivel ?? false);
  const [cronometroTempo, setCronometroTempo] = useState(
    initialData?.cronometroTempo ?? "00:10:00",
  );
  const [ativo, setAtivo] = useState(initialData?.ativo ?? false);
  const [visibilidade, setVisibilidade] = useState(
    initialData?.visibilidade ?? "quiz",
  );

  const [idFilme, setIdFilme] = useState(
    initialData?.idFilme ? String(initialData.idFilme) : "",
  );
  const [tagFilme, setTagFilme] = useState(initialData?.tagFilme ?? "filme");
  const [nomeFilme, setNomeFilme] = useState(initialData?.nomeFilme ?? "");
  const [texto, setTexto] = useState(initialData?.texto ?? "");
  const [respostaTexto, setRespostaTexto] = useState(
    initialData?.respostaTexto ?? "",
  );
  const [respostaCorreta, setRespostaCorreta] = useState(
    initialData?.respostaCorreta ?? null,
  );

  const [previewSelected, setPreviewSelected] = useState(null);
  const [previewConfirmed, setPreviewConfirmed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({});
  const textareaRef = useRef(null);
  const respostaRef = useRef(null);

  // Inicializa contenteditable com dados existentes (edit mode)
  useEffect(() => {
    if (textareaRef.current && initialData?.texto) {
      textareaRef.current.innerHTML = initialData.texto;
    }
  }, []);

  useEffect(() => {
    if (respostaRef.current && initialData?.respostaTexto) {
      respostaRef.current.innerHTML = initialData.respostaTexto;
    }
  }, []);

  // TMDB auto-fetch
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
        if (data.genres?.length) {
          setGenero(
            data.genres.map((g) => TMDB_GENEROS[g.id] || g.name).join(", "),
          );
        }
      } catch {}
    }, 600);
    return () => clearTimeout(timer);
  }, [idFilme]);

  const handleBold = () => {
    const sel = window.getSelection();
    console.log("[Bold] anchorNode:", sel?.anchorNode);
    console.log("[Bold] toString:", sel?.toString());
    console.log("[Bold] rangeCount:", sel?.rangeCount);
    const result = document.execCommand("bold");
    const html = textareaRef.current?.innerHTML ?? "";
    console.log("[Bold] execCommand result:", result);
    console.log("[Bold] innerHTML após:", html);
    setTexto(html);
  };

  const handleBoldResposta = () => {
    document.execCommand("bold");
    setRespostaTexto(respostaRef.current?.innerHTML ?? "");
  };

  const gerarId = async () => {
    const snap = await getDocs(collection(db, "perguntas"));
    const ids = snap.docs.map((d) => {
      const m = d.id.match(/^PQ(\d+)$/);
      return m ? parseInt(m[1]) : 0;
    });
    return `PQ${String(Math.max(0, ...ids) + 1).padStart(4, "0")}`;
  };

  const validar = () => {
    const e = {};
    if (!titulo.trim()) e.titulo = true;
    if (!subtitulo.trim()) e.subtitulo = true;
    if (!dificuldade) e.dificuldade = true;
    if (!idFilme) e.idFilme = true;
    if (!stripHtml(texto)) e.texto = true;
    if (!respostaCorreta) e.respostaCorreta = true;
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSalvar = async (status = "rascunho") => {
    if (!validar()) return;
    setLoading(true);
    try {
      const dados = {
        tipo: 11,
        titulo,
        subtitulo,
        dificuldade,
        genero,
        cronometroAtivo,
        cronometroVisivel,
        cronometroRegressivoAtivo,
        cronometroRegressivoVisivel,
        cronometroTempo: cronometroRegressivoAtivo ? cronometroTempo : null,
        ativo,
        visibilidade,
        status,
        idFilme: idFilme ? parseInt(idFilme) : null,
        tagFilme,
        nomeFilme,
        texto,
        respostaTexto,
        respostaCorreta,
        ...(status === "publicado"
          ? { dataPublicacao: serverTimestamp() }
          : {}),
      };

      if (isEdit) {
        await updateDoc(doc(db, "perguntas", id), dados);
      } else {
        dados.autorId = user?.uid ?? null;
        dados.autorNome = user?.nome ?? null;
        dados.dataCadastro = serverTimestamp();
        const newId = await gerarId();
        await setDoc(doc(db, "perguntas", newId), dados);
      }
      router.push("/adm/perguntas");
    } finally {
      setLoading(false);
    }
  };

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const sidebar = (
    <div className={styles.sidebarContent}>
      <TextInput
        label="Título da pergunta"
        placeholder='Ex: "Verdadeiro ou Falso?"'
        value={titulo}
        onChange={(e) => {
          setTitulo(e.target.value);
          setErros((p) => ({ ...p, titulo: false }));
        }}
        error={!!erros.titulo}
      />

      <TextInput
        label="Subtítulo"
        placeholder='Ex: "Analise a afirmação abaixo"'
        value={subtitulo}
        onChange={(e) => {
          setSubtitulo(e.target.value);
          setErros((p) => ({ ...p, subtitulo: false }));
        }}
        error={!!erros.subtitulo}
      />

      <TextInput
        label="ID Filme"
        placeholder="Digite o ID do TMDB"
        type="number"
        min="1"
        value={idFilme}
        onChange={(e) => {
          setIdFilme(e.target.value);
          setErros((p) => ({ ...p, idFilme: false }));
        }}
        error={!!erros.idFilme}
      />

      <div className={styles.row}>
        <Select
          label="Tag"
          options={TAGS_FILME}
          value={tagFilme}
          onChange={(e) => setTagFilme(e.target.value)}
        />
        <TextInput
          label="Título do filme"
          placeholder='Ex: "Matrix"'
          value={nomeFilme}
          onChange={(e) => setNomeFilme(e.target.value)}
        />
      </div>

      <div className={styles.lacunaWrapper}>
        <div className={styles.lacunaHeader}>
          <button
            type="button"
            className={styles.lacunaBtn}
            onMouseDown={(e) => {
              e.preventDefault();
              handleBold();
            }}
            title="Negrito"
          >
            <BoldIcon size={16} color="var(--text-base)" />
          </button>
        </div>
        <div className={styles.textareaContent}>
          <div
            ref={textareaRef}
            contentEditable
            suppressContentEditableWarning
            className={`${styles.lacunaContentEditable} ${erros.texto ? styles.lacunaTextareaErro : ""}`}
            data-placeholder="Digite a afirmação da pergunta"
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text/plain");
              document.execCommand("insertText", false, text);
            }}
            onInput={() => {
              setTexto(textareaRef.current?.innerHTML ?? "");
              setErros((p) => ({ ...p, texto: false }));
            }}
          />
        </div>
      </div>

      <div className={styles.fieldWrapper}>
        <label className={styles.fieldLabel}>Resposta correta</label>
        <div className={styles.optionsGrid}>
          {OPCOES_VF.map((opcao) => (
            <div key={opcao} className={styles.fieldWrapper}>
              <div
                className={`${styles.optionRow} ${respostaCorreta === opcao ? styles.optionCorrect : ""} ${erros.respostaCorreta && respostaCorreta !== opcao ? styles.optionRowErro : ""}`}
              >
                <span
                  className={styles.optionInput}
                  style={{ textTransform: "capitalize" }}
                >
                  {opcao}
                </span>
                <input
                  type="radio"
                  name="respostaCorreta"
                  className={styles.optionRadio}
                  checked={respostaCorreta === opcao}
                  onChange={() => {
                    setRespostaCorreta(opcao);
                    setErros((p) => ({ ...p, respostaCorreta: false }));
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {erros.respostaCorreta && (
          <p className={styles.erroMsg}>Selecione a resposta correta</p>
        )}
      </div>

      <div className={styles.lacunaWrapper}>
        <div className={styles.lacunaHeader}>
          <button
            type="button"
            className={styles.lacunaBtn}
            onMouseDown={(e) => {
              e.preventDefault();
              handleBoldResposta();
            }}
            title="Negrito"
          >
            <BoldIcon size={16} color="var(--text-base)" />
          </button>
        </div>
        <div className={styles.textareaContent}>
          <div
            ref={respostaRef}
            contentEditable
            suppressContentEditableWarning
            className={styles.lacunaContentEditable}
            data-placeholder="Digite o texto de resposta correta"
            onPaste={(e) => {
              e.preventDefault();
              const text = e.clipboardData.getData("text/plain");
              document.execCommand("insertText", false, text);
            }}
            onInput={() =>
              setRespostaTexto(respostaRef.current?.innerHTML ?? "")
            }
          />
        </div>
      </div>

      <div className={styles.row}>
        <Select
          label="Dificuldade"
          options={DIFICULDADES}
          value={dificuldade}
          onChange={(e) => {
            setDificuldade(e.target.value);
            setErros((p) => ({ ...p, dificuldade: false }));
          }}
          placeholder="Selecione"
          error={!!erros.dificuldade}
        />
        <TextInput
          label="Gênero(s)"
          placeholder="Ex: Ação, Aventura"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        />
      </div>

      <SidebarCronometros
        idSuffix="-t11"
        cronometroAtivo={cronometroAtivo}
        setCronometroAtivo={setCronometroAtivo}
        cronometroVisivel={cronometroVisivel}
        setCronometroVisivel={setCronometroVisivel}
        cronometroRegressivoAtivo={cronometroRegressivoAtivo}
        setCronometroRegressivoAtivo={setCronometroRegressivoAtivo}
        cronometroRegressivoVisivel={cronometroRegressivoVisivel}
        setCronometroRegressivoVisivel={setCronometroRegressivoVisivel}
        cronometroTempo={cronometroTempo}
        setCronometroTempo={setCronometroTempo}
      />

      <SidebarStatusVisibilidade
        idSuffix="-t11"
        ativo={ativo}
        setAtivo={setAtivo}
        visibilidade={visibilidade}
        setVisibilidade={setVisibilidade}
      />
    </div>
  );

  // ── Preview ────────────────────────────────────────────────────────────────
  const getPreviewVFClass = (opcao) => {
    if (!previewConfirmed)
      return previewSelected === opcao ? styles.previewOptionSelected : "";
    if (opcao === respostaCorreta) return styles.previewOptionCorreta;
    if (opcao === previewSelected) return styles.previewOptionErro;
    return "";
  };

  const preview = (
    <div className={styles.previewWrapper}>
      <div className={styles.previewCard}>
        <PreviewHeader
          titulo={titulo}
          subtitulo={subtitulo}
          cronometroVisivel={cronometroVisivel}
          cronometroRegressivoVisivel={cronometroRegressivoVisivel}
          cronometroTempo={cronometroTempo}
        />

        <div className={styles.previewPhraseTag}>
          {(tagFilme || nomeFilme) && (
            <div className={styles.previewImageLabel}>
              <span className={styles.previewImageTag}>
                {TAGS_FILME.find((t) => t.value === tagFilme)?.label}
              </span>{" "}
              <span className={styles.previewImageNome}>{nomeFilme}</span>
            </div>
          )}

          <div className={styles.previewTrueFalse}>
            <span
              className={styles.previewPhraseTrueFalse}
              dangerouslySetInnerHTML={{
                __html: !texto.replace(/<[^>]*>/g, "").trim()
                  ? '<span style="opacity:0.4">A afirmação aparecerá aqui...</span>'
                  : texto,
              }}
            />
          </div>
        </div>

        <div className={styles.previewOptions}>
          {OPCOES_VF.map((opcao) => (
            <div
              key={opcao}
              className={`${styles.previewOption} ${getPreviewVFClass(opcao)}`}
              onClick={() => {
                setPreviewSelected(opcao);
                setPreviewConfirmed(false);
              }}
              style={{ justifyContent: "center", textTransform: "capitalize" }}
            >
              {opcao}
            </div>
          ))}
        </div>

        {previewConfirmed && respostaTexto.trim() && (
          <div className={styles.previewRespostaTexto}>
            <div className={styles.separador}></div>
            <span
              dangerouslySetInnerHTML={{
                __html: respostaTexto,
              }}
            />
          </div>
        )}

        <div className={styles.previewFooter}>
          <div className={styles.previewJoias}>
            <Joias dificuldade={dificuldade} />
          </div>
          <button
            className={styles.previewConfirm}
            type="button"
            disabled={!previewSelected || previewConfirmed}
            onClick={() => setPreviewConfirmed(true)}
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    </div>
  );

  const headerActions = (
    <>
      <Button
        variant="ghost"
        label={loading ? "Salvando..." : "Salvar rascunho"}
        onClick={() => handleSalvar("rascunho")}
        disabled={loading}
        border="var(--stroke-base)"
      />
      <Button
        variant="ghost"
        label={loading ? "Publicando..." : "Publicar"}
        onClick={() => handleSalvar("publicado")}
        disabled={loading}
        border="var(--stroke-base)"
      />
    </>
  );

  const breadcrumb = isEdit
    ? [
        { href: "/adm/perguntas", label: "Perguntas" },
        { href: null, label: id },
      ]
    : null;

  return (
    <>
      <Head>
        <title>{isEdit ? "Editar" : "Criar"} pergunta — Cameo ADM</title>
      </Head>
      <AdmLayout
        headerActions={headerActions}
        breadcrumb={breadcrumb}
        rightSidebar={sidebar}
      >
        {preview}
      </AdmLayout>
    </>
  );
}
