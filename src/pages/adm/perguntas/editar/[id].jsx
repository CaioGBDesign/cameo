import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import TextInput from "@/components/inputs/text-input";
import Select from "@/components/inputs/select";
import Switch from "@/components/inputs/switch";
import LacunaIcon from "@/components/icons/LacunaIcon";
import JoiaRosaIcon from "@/components/icons/JoiaRosaIcon";
import JoiaAzulIcon from "@/components/icons/JoiaAzulIcon";
import JoiaAmarelaIcon from "@/components/icons/JoiaAmarelaIcon";
import JoiaVaziaIcon from "@/components/icons/JoiaVaziaIcon";
import styles from "../criar/index.module.scss";

// ─── Dados estáticos ──────────────────────────────────────────────────────────

const DIFICULDADES = [
  { value: "1", label: "★ Fácil" },
  { value: "2", label: "★★ Médio" },
  { value: "3", label: "★★★ Difícil" },
];

const TMDB_GENEROS = {
  28: "Ação", 12: "Aventura", 16: "Animação", 35: "Comédia",
  80: "Crime", 99: "Documentário", 18: "Drama", 10751: "Família",
  14: "Fantasia", 36: "História", 27: "Terror", 10402: "Musical",
  9648: "Mistério", 10749: "Romance", 878: "Ficção Científica",
  10770: "Cinema TV", 53: "Suspense", 10752: "Guerra", 37: "Faroeste",
};

const VISIBILIDADES = [
  { value: "quiz", label: "Exclusiva para Quiz" },
  { value: "evento", label: "Exclusiva para eventos" },
  { value: "ambos", label: "Ambos" },
];

const TAGS_FILME = [{ value: "filme", label: "Filme" }];

const OPCOES_LETRAS = ["a", "b", "c", "d"];
const OPCOES_LABELS = ["Opção A", "Opção B", "Opção C", "Opção D"];

// ─── Componente principal ─────────────────────────────────────────────────────

export default function EditarPergunta() {
  const router = useRouter();
  const { id } = router.query;

  const [loadingInit, setLoadingInit] = useState(true);
  const [tipo, setTipo] = useState(null);

  // ── Campos comuns ──────────────────────────────────────────────────────────
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [dificuldade, setDificuldade] = useState("");
  const [genero, setGenero] = useState("");
  const [cronometroAtivo, setCronometroAtivo] = useState(false);
  const [cronometroVisivel, setCronometroVisivel] = useState(false);
  const [cronometroRegressivoAtivo, setCronometroRegressivoAtivo] =
    useState(false);
  const [cronometroRegressivoVisivel, setCronometroRegressivoVisivel] =
    useState(false);
  const [cronometroTempo, setCronometroTempo] = useState("00:10:00");
  const [ativo, setAtivo] = useState(false);
  const [visibilidade, setVisibilidade] = useState("quiz");

  // ── Campos tipo 1 ──────────────────────────────────────────────────────────
  const [idFilme, setIdFilme] = useState("");
  const [imagem, setImagem] = useState("");
  const [tagFilme, setTagFilme] = useState("filme");
  const [nomeFilme, setNomeFilme] = useState("");
  const [fraseComLacuna, setFraseComLacuna] = useState("");
  const [opcoes, setOpcoes] = useState({ a: "", b: "", c: "", d: "" });
  const [respostaCorreta, setRespostaCorreta] = useState(null);

  const [previewSelected, setPreviewSelected] = useState(null);
  const [previewConfirmed, setPreviewConfirmed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingFilme, setLoadingFilme] = useState(false);
  const fraseRef = useRef(null);

  // ── Carregar dados existentes ──────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const carregar = async () => {
      try {
        const snap = await getDoc(doc(db, "perguntas", id));
        if (!snap.exists()) {
          router.replace("/adm/perguntas");
          return;
        }
        const d = snap.data();

        setTipo(d.tipo ?? null);
        setTitulo(d.titulo ?? "");
        setSubtitulo(d.subtitulo ?? "");
        setDificuldade(d.dificuldade ?? "");
        setGenero(d.genero ?? "");
        setCronometroAtivo(d.cronometroAtivo ?? false);
        setCronometroVisivel(d.cronometroVisivel ?? false);
        setCronometroRegressivoAtivo(d.cronometroRegressivoAtivo ?? false);
        setCronometroRegressivoVisivel(d.cronometroRegressivoVisivel ?? false);
        setCronometroTempo(d.cronometroTempo ?? "00:10:00");
        setAtivo(d.ativo ?? false);
        setVisibilidade(d.visibilidade ?? "quiz");

        if (d.tipo === 1) {
          setIdFilme(d.idFilme ? String(d.idFilme) : "");
          setImagem(d.imagem ?? "");
          setTagFilme(d.tagFilme ?? "filme");
          setNomeFilme(d.nomeFilme ?? "");
          setFraseComLacuna(d.fraseComLacuna ?? "");
          setOpcoes(d.opcoes ?? { a: "", b: "", c: "", d: "" });
          setRespostaCorreta(d.respostaCorreta ?? null);
        }
      } finally {
        setLoadingInit(false);
      }
    };
    carregar();
  }, [id]);

  // ── Preview interativo ─────────────────────────────────────────────────────
  const handlePreviewSelect = (letra) => {
    setPreviewSelected(letra);
    setPreviewConfirmed(false);
  };

  const getPreviewOptionClass = (letra) => {
    if (!previewConfirmed) {
      return previewSelected === letra ? styles.previewOptionSelected : "";
    }
    if (letra === respostaCorreta) return styles.previewOptionCorreta;
    if (letra === previewSelected) return styles.previewOptionErro;
    return "";
  };

  // ── Busca automática TMDB ao digitar ID ────────────────────────────────────
  useEffect(() => {
    if (!idFilme || idFilme.length < 1) return;
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
          setGenero(data.genres.map((g) => TMDB_GENEROS[g.id] || g.name).join(", "));
        }
      } catch {
        // silencioso
      } finally {
        setLoadingFilme(false);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [idFilme]);

  // ── Helpers ────────────────────────────────────────────────────────────────
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

  const handleSalvar = async (status = "rascunho") => {
    if (!id) return;
    setLoading(true);
    try {
      const dados = {
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
        ...(status === "publicado"
          ? { dataPublicacao: serverTimestamp() }
          : {}),
      };

      if (tipo === 1) {
        Object.assign(dados, {
          idFilme: idFilme ? parseInt(idFilme) : null,
          imagem,
          tagFilme,
          nomeFilme,
          fraseComLacuna,
          opcoes,
          respostaCorreta,
        });
      }

      await updateDoc(doc(db, "perguntas", id), dados);
      router.push("/adm/perguntas");
    } finally {
      setLoading(false);
    }
  };

  // ── Lacuna preview ─────────────────────────────────────────────────────────
  const renderFrasePreview = () => {
    const texto = fraseComLacuna || "Sua frase aparecerá aqui...";
    const partes = texto.split("[___]");
    if (partes.length === 1) {
      return <span className={styles.previewPhraseText}>{texto}</span>;
    }
    return (
      <span className={styles.previewPhraseText}>
        {partes[0]}
        <span className={styles.lacunaToken}>________</span>
        {partes[1]}
      </span>
    );
  };

  // ── Joias de dificuldade ───────────────────────────────────────────────────
  const renderJoias = () => {
    if (dificuldade === "1")
      return [
        <JoiaRosaIcon key="a" />,
        <JoiaVaziaIcon key="b" />,
        <JoiaVaziaIcon key="c" />,
      ];
    if (dificuldade === "2")
      return [
        <JoiaAmarelaIcon key="a" />,
        <JoiaAmarelaIcon key="b" />,
        <JoiaVaziaIcon key="c" />,
      ];
    if (dificuldade === "3")
      return [
        <JoiaAzulIcon key="a" />,
        <JoiaAzulIcon key="b" />,
        <JoiaAzulIcon key="c" />,
      ];
    return [
      <JoiaVaziaIcon key="a" />,
      <JoiaVaziaIcon key="b" />,
      <JoiaVaziaIcon key="c" />,
    ];
  };

  // ── TMDB URL ───────────────────────────────────────────────────────────────
  const backdropUrl = imagem
    ? `https://image.tmdb.org/t/p/w1280${imagem.startsWith("/") ? imagem : `/${imagem}`}`
    : null;

  // ── Sidebar tipo 1 ─────────────────────────────────────────────────────────
  const renderSidebarTipo1 = () => (
    <div className={styles.sidebarContent}>
      <TextInput
        label="Título da pergunta"
        placeholder='Ex: "Complete a frase do filme"'
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <TextInput
        label="Subtítulo"
        placeholder='Ex: "Será que consegue?"'
        value={subtitulo}
        onChange={(e) => setSubtitulo(e.target.value)}
      />

      <TextInput
        label="ID Filme"
        placeholder="Digite o ID do TMDB"
        type="number"
        min="1"
        value={idFilme}
        onChange={(e) => setIdFilme(e.target.value)}
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

      {/* Frase com lacuna */}
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
            className={styles.lacunaTextarea}
            placeholder="Digite a frase e use o botão para inserir a lacuna"
            value={fraseComLacuna}
            onChange={(e) => setFraseComLacuna(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      {/* Opções A / B / C / D */}
      <div className={styles.optionsGrid}>
        {OPCOES_LETRAS.map((letra, i) => (
          <div key={letra} className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>{OPCOES_LABELS[i]}</label>
            <div
              className={`${styles.optionRow} ${respostaCorreta === letra ? styles.optionCorrect : ""}`}
            >
              <input
                type="text"
                className={styles.optionInput}
                placeholder="Digite"
                value={opcoes[letra]}
                onChange={(e) => handleOpcao(letra, e.target.value)}
              />
              <input
                type="radio"
                name="respostaCorreta"
                className={styles.optionRadio}
                checked={respostaCorreta === letra}
                onChange={() => setRespostaCorreta(letra)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dificuldade + Gênero */}
      <div className={styles.row}>
        <Select
          label="Dificuldade"
          options={DIFICULDADES}
          value={dificuldade}
          onChange={(e) => setDificuldade(e.target.value)}
          placeholder="Selecione"
        />
        <TextInput
          label="Gênero(s)"
          placeholder="Ex: Ação, Aventura"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        />
      </div>

      {/* Cronômetros */}
      <div className={styles.cronometroCard}>
        <div className={styles.cronometroHeader}>
          <span />
          <div className={styles.cronometroHeaderLabels}>
            <span className={styles.toggleLabel}>Ativo</span>
            <span className={styles.toggleLabel}>Visível</span>
          </div>
        </div>
        <div className={styles.cronometroRow}>
          <span className={styles.cronometroLabel}>Cronômetro</span>
          <div className={styles.cronometroToggles}>
            <Switch
              id="cron-ativo"
              checked={cronometroAtivo}
              onChange={(e) => setCronometroAtivo(e.target.checked)}
            />
            <Switch
              id="cron-visivel"
              checked={cronometroVisivel}
              onChange={(e) => setCronometroVisivel(e.target.checked)}
            />
          </div>
        </div>
        <div className={styles.cronometroRow}>
          <input
            type="text"
            className={styles.cronometroTempoInput}
            value={cronometroTempo}
            onChange={(e) => setCronometroTempo(e.target.value)}
            placeholder="00:10:00"
          />
          <div className={styles.cronometroToggles}>
            <Switch
              id="cronreg-ativo"
              checked={cronometroRegressivoAtivo}
              onChange={(e) => setCronometroRegressivoAtivo(e.target.checked)}
            />
            <Switch
              id="cronreg-visivel"
              checked={cronometroRegressivoVisivel}
              onChange={(e) => setCronometroRegressivoVisivel(e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Status + Visibilidade */}
      <div className={styles.row}>
        <div className={styles.statusField}>
          <label className={styles.fieldLabel}>Status da pergunta</label>
          <div className={styles.statusRow}>
            <span className={styles.statusLabel}>
              {ativo ? "Ativo" : "Inativo"}
            </span>
            <Switch
              id="pergunta-ativo"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
            />
          </div>
        </div>
        <Select
          label="Selecione a visibilidade"
          options={VISIBILIDADES}
          value={visibilidade}
          onChange={(e) => setVisibilidade(e.target.value)}
        />
      </div>
    </div>
  );

  // ── Preview tipo 1 ─────────────────────────────────────────────────────────
  const renderPreviewTipo1 = () => (
    <div className={styles.previewWrapper}>
      <div className={styles.previewCard}>
        <div className={styles.previewHeader}>
          {titulo ? (
            <h2 className={styles.previewTitle}>{titulo}</h2>
          ) : (
            <h2
              className={`${styles.previewTitle} ${styles.previewPlaceholder}`}
            >
              Título da pergunta
            </h2>
          )}
          {subtitulo && <p className={styles.previewSubtitle}>{subtitulo}</p>}
        </div>

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
            />
          ) : (
            <div className={styles.previewImagePlaceholder} />
          )}
          {(tagFilme || nomeFilme) && (
            <div className={styles.previewImageLabel}>
              <span className={styles.previewImageTag}>
                {TAGS_FILME.find((t) => t.value === tagFilme)?.label}
              </span>{" "}
              <span className={styles.previewImageNome}>{nomeFilme}</span>
            </div>
          )}
        </div>

        <div className={styles.previewPhrase}>
          <div className={styles.previewSeparador}></div>
          {renderFrasePreview()}
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
          <div className={styles.previewJoias}>{renderJoias()}</div>
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

  // ── Header actions ─────────────────────────────────────────────────────────
  const headerActions =
    !loadingInit && tipo ? (
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
    ) : null;

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loadingInit) {
    return (
      <AdmLayout>
        <Head>
          <title>Editar pergunta — Cameo ADM</title>
        </Head>
      </AdmLayout>
    );
  }

  const breadcrumb = [
    { href: "/adm/perguntas", label: "Perguntas" },
    { href: null, label: id || "Editar" },
  ];

  return (
    <>
      <Head>
        <title>Editar pergunta — Cameo ADM</title>
      </Head>

      <AdmLayout
        headerActions={headerActions}
        breadcrumb={breadcrumb}
        rightSidebar={tipo ? renderSidebarTipo1() : null}
      >
        {tipo === 1 && renderPreviewTipo1()}
      </AdmLayout>
    </>
  );
}
