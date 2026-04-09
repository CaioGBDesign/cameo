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
import LacunaIcon from "@/components/icons/LacunaIcon";
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
const OPCOES_LETRAS = ["a", "b", "c", "d"];
const OPCOES_LABELS = ["Opção A", "Opção B", "Opção C", "Opção D"];

export default function Tipo1({ id = null, initialData = null }) {
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
  const [imagem, setImagem] = useState(initialData?.imagem ?? "");
  const [tagFilme, setTagFilme] = useState(initialData?.tagFilme ?? "filme");
  const [nomeFilme, setNomeFilme] = useState(initialData?.nomeFilme ?? "");
  const [fraseComLacuna, setFraseComLacuna] = useState(
    initialData?.fraseComLacuna ?? "",
  );
  const [opcoes, setOpcoes] = useState(
    initialData?.opcoes ?? { a: "", b: "", c: "", d: "" },
  );
  const [respostaCorreta, setRespostaCorreta] = useState(
    initialData?.respostaCorreta ?? null,
  );

  const [previewSelected, setPreviewSelected] = useState(null);
  const [previewConfirmed, setPreviewConfirmed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingFilme, setLoadingFilme] = useState(false);
  const [erros, setErros] = useState({});
  const fraseRef = useRef(null);

  // TMDB auto-fetch
  useEffect(() => {
    if (!idFilme) return;
    const timer = setTimeout(async () => {
      setLoadingFilme(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${idFilme}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.backdrop_path) setImagem(data.backdrop_path);
        if (data.title && !nomeFilme) setNomeFilme(data.title);
        if (data.genres?.length) {
          setGenero(
            data.genres.map((g) => TMDB_GENEROS[g.id] || g.name).join(", "),
          );
        }
      } catch {
      } finally {
        setLoadingFilme(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [idFilme]);

  // Helpers
  const hasLacuna = fraseComLacuna.includes("[___]");

  const handleInserirLacuna = () => {
    const el = fraseRef.current;
    if (!el || hasLacuna) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const nova =
      fraseComLacuna.substring(0, start) +
      "[___]" +
      fraseComLacuna.substring(end);
    setFraseComLacuna(nova);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + 5, start + 5);
    }, 0);
  };

  const handleOpcao = (letra, valor) =>
    setOpcoes((prev) => ({ ...prev, [letra]: valor }));

  const handlePreviewSelect = (letra) => {
    setPreviewSelected(letra);
    setPreviewConfirmed(false);
  };

  const getPreviewOptionClass = (letra) => {
    if (!previewConfirmed)
      return previewSelected === letra ? styles.previewOptionSelected : "";
    if (letra === respostaCorreta) return styles.previewOptionCorreta;
    if (letra === previewSelected) return styles.previewOptionErro;
    return "";
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
    if (!fraseComLacuna.trim()) e.fraseComLacuna = true;
    if (!opcoes.a.trim()) e.opcaoA = true;
    if (!opcoes.b.trim()) e.opcaoB = true;
    if (!opcoes.c.trim()) e.opcaoC = true;
    if (!opcoes.d.trim()) e.opcaoD = true;
    if (!respostaCorreta) e.respostaCorreta = true;
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSalvar = async (status = "rascunho") => {
    if (!validar()) return;
    setLoading(true);
    try {
      const dados = {
        tipo: 1,
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
        imagem,
        tagFilme,
        nomeFilme,
        fraseComLacuna,
        opcoes,
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

  // Backdrop URL
  const backdropUrl = imagem
    ? `https://image.tmdb.org/t/p/w1280${imagem.startsWith("/") ? imagem : `/${imagem}`}`
    : null;

  // Frase preview
  const renderFrasePreview = () => {
    const texto = fraseComLacuna || "Sua frase aparecerá aqui...";
    const partes = texto.split("[___]");
    if (partes.length === 1)
      return <span className={styles.previewPhraseText}>{texto}</span>;
    return (
      <span className={styles.previewPhraseText}>
        {partes[0]}
        <span className={styles.lacunaToken}>________</span>
        {partes[1]}
      </span>
    );
  };

  const sidebar = (
    <div className={styles.sidebarContent}>
      <TextInput
        label="Título da pergunta"
        placeholder='Ex: "Complete a frase do filme"'
        value={titulo}
        onChange={(e) => {
          setTitulo(e.target.value);
          setErros((p) => ({ ...p, titulo: false }));
        }}
        error={!!erros.titulo}
      />

      <TextInput
        label="Subtítulo"
        placeholder='Ex: "Será que consegue?"'
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
          placeholder='Ex: "Esqueceram de Mim"'
          value={nomeFilme}
          onChange={(e) => setNomeFilme(e.target.value)}
        />
      </div>

      <div className={styles.lacunaWrapper}>
        <div className={styles.lacunaHeader}>
          <button
            type="button"
            className={styles.lacunaBtn}
            onClick={handleInserirLacuna}
            disabled={hasLacuna}
            title={
              hasLacuna
                ? "Já existe uma lacuna"
                : "Inserir lacuna na posição do cursor"
            }
          >
            <LacunaIcon size={16} color="var(--text-base)" />
          </button>
        </div>
        <div className={styles.textareaContent}>
          <textarea
            ref={fraseRef}
            className={`${styles.lacunaTextarea} ${erros.fraseComLacuna ? styles.lacunaTextareaErro : ""}`}
            placeholder="Digite a frase e use o botão para inserir a lacuna"
            value={fraseComLacuna}
            onChange={(e) => {
              setFraseComLacuna(e.target.value);
              setErros((p) => ({ ...p, fraseComLacuna: false }));
            }}
            rows={3}
          />
        </div>
      </div>

      <div className={styles.optionsGrid}>
        {OPCOES_LETRAS.map((letra, i) => (
          <div key={letra} className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>{OPCOES_LABELS[i]}</label>
            <div
              className={`${styles.optionRow} ${respostaCorreta === letra ? styles.optionCorrect : ""} ${erros[`opcao${letra.toUpperCase()}`] ? styles.optionRowErro : ""}`}
            >
              <input
                type="text"
                className={styles.optionInput}
                placeholder="Digite"
                value={opcoes[letra]}
                onChange={(e) => {
                  handleOpcao(letra, e.target.value);
                  setErros((p) => ({
                    ...p,
                    [`opcao${letra.toUpperCase()}`]: false,
                  }));
                }}
              />
              <input
                type="radio"
                name="respostaCorreta"
                className={styles.optionRadio}
                checked={respostaCorreta === letra}
                onChange={() => {
                  setRespostaCorreta(letra);
                  setErros((p) => ({ ...p, respostaCorreta: false }));
                }}
              />
            </div>
          </div>
        ))}
        {erros.respostaCorreta && (
          <p className={styles.erroMsg}>Selecione a opção correta</p>
        )}
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
        idSuffix="-t1"
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
        idSuffix="-t1"
        ativo={ativo}
        setAtivo={setAtivo}
        visibilidade={visibilidade}
        setVisibilidade={setVisibilidade}
      />
    </div>
  );

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

        <div className={styles.previewImageWrapper}>
          {loadingFilme ? (
            <div className={styles.previewImageLoading}>
              <span className={styles.previewImageLoadingSpinner} />
            </div>
          ) : backdropUrl ? (
            <img
              src={backdropUrl}
              alt={nomeFilme}
              className={styles.previewImage}
              unoptimized
            />
          ) : (
            <div className={styles.previewImagePlaceholder} />
          )}
        </div>

        <div className={styles.previewPhraseTag} style={{ marginTop: "-95px" }}>
          {(tagFilme || nomeFilme) && (
            <div className={styles.previewImageLabel}>
              <span className={styles.previewImageTag}>
                {TAGS_FILME.find((t) => t.value === tagFilme)?.label}
              </span>{" "}
              <span className={styles.previewImageNome}>{nomeFilme}</span>
            </div>
          )}
          <div className={styles.previewPhrase}>
            <div className={styles.previewSeparador}></div>
            {renderFrasePreview()}
          </div>
        </div>

        <div className={styles.previewOptions}>
          {OPCOES_LETRAS.map((letra, i) => (
            <div
              key={letra}
              className={`${styles.previewOption} ${getPreviewOptionClass(letra)}`}
              onClick={() => handlePreviewSelect(letra)}
            >
              {opcoes[letra] || (
                <span className={styles.previewOptionEmpty}>
                  {OPCOES_LABELS[i]}
                </span>
              )}
            </div>
          ))}
        </div>

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
