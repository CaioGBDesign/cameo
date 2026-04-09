import { useState, useEffect } from "react";
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
import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";
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
  28: "Ação", 12: "Aventura", 16: "Animação", 35: "Comédia",
  80: "Crime", 99: "Documentário", 18: "Drama", 10751: "Família",
  14: "Fantasia", 36: "História", 27: "Terror", 10402: "Musical",
  9648: "Mistério", 10749: "Romance", 878: "Ficção Científica",
  10770: "Cinema TV", 53: "Suspense", 10752: "Guerra", 37: "Faroeste",
};

const TAGS_FILME = [{ value: "filme", label: "Filme" }];

export default function Tipo4({ id = null, initialData = null }) {
  const router = useRouter();
  const { user } = useAuth();
  const isEdit = !!id;

  const [titulo, setTitulo] = useState(initialData?.titulo ?? "");
  const [subtitulo, setSubtitulo] = useState(initialData?.subtitulo ?? "");
  const [dificuldade, setDificuldade] = useState(initialData?.dificuldade ?? "");
  const [genero, setGenero] = useState(initialData?.genero ?? "");
  const [cronometroAtivo, setCronometroAtivo] = useState(initialData?.cronometroAtivo ?? true);
  const [cronometroVisivel, setCronometroVisivel] = useState(initialData?.cronometroVisivel ?? false);
  const [cronometroRegressivoAtivo, setCronometroRegressivoAtivo] = useState(initialData?.cronometroRegressivoAtivo ?? false);
  const [cronometroRegressivoVisivel, setCronometroRegressivoVisivel] = useState(initialData?.cronometroRegressivoVisivel ?? false);
  const [cronometroTempo, setCronometroTempo] = useState(initialData?.cronometroTempo ?? "00:10:00");
  const [ativo, setAtivo] = useState(initialData?.ativo ?? false);
  const [visibilidade, setVisibilidade] = useState(initialData?.visibilidade ?? "quiz");

  const [idFilme, setIdFilme] = useState(initialData?.idFilme ? String(initialData.idFilme) : "");
  const [tagFilme, setTagFilme] = useState(initialData?.tagFilme ?? "filme");
  const [nomeFilme, setNomeFilme] = useState(initialData?.nomeFilme ?? "");
  const [emojis, setEmojis] = useState(initialData?.emojis ?? "");
  const [respostasAceitas, setRespostasAceitas] = useState(
    initialData?.respostasAceitas?.length ? initialData.respostasAceitas : [""]
  );

  const [previewResposta, setPreviewResposta] = useState("");
  const [previewStatus, setPreviewStatus] = useState(null);

  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({});

  // TMDB auto-fetch
  useEffect(() => {
    if (!idFilme) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${idFilme}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.title && !nomeFilme) setNomeFilme(data.title);
        if (data.genres?.length) {
          setGenero(data.genres.map((g) => TMDB_GENEROS[g.id] || g.name).join(", "));
        }
      } catch {}
    }, 600);
    return () => clearTimeout(timer);
  }, [idFilme]);

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
    if (!emojis.trim()) e.emojis = true;
    if (!respostasAceitas.some((r) => r.trim())) e.respostasAceitas = true;
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSalvar = async (status = "rascunho") => {
    if (!validar()) return;
    setLoading(true);
    try {
      const dados = {
        tipo: 4,
        titulo, subtitulo, dificuldade, genero,
        cronometroAtivo, cronometroVisivel,
        cronometroRegressivoAtivo, cronometroRegressivoVisivel,
        cronometroTempo: cronometroRegressivoAtivo ? cronometroTempo : null,
        ativo, visibilidade, status,
        idFilme: idFilme ? parseInt(idFilme) : null,
        tagFilme, nomeFilme, emojis,
        respostasAceitas: respostasAceitas.filter((r) => r.trim()),
        ...(status === "publicado" ? { dataPublicacao: serverTimestamp() } : {}),
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

  const handleConfirmar = () => {
    const digitado = previewResposta.trim().toLowerCase();
    const acertou = respostasAceitas.some((r) => r.trim().toLowerCase() === digitado);
    setPreviewStatus(acertou ? "correta" : "errada");
  };

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const sidebar = (
    <div className={styles.sidebarContent}>
      <TextInput
        label="Título da pergunta"
        placeholder='Ex: "Adivinhe o filme pelos emojis"'
        value={titulo}
        onChange={(e) => { setTitulo(e.target.value); setErros((p) => ({ ...p, titulo: false })); }}
        error={!!erros.titulo}
      />

      <TextInput
        label="Subtítulo"
        placeholder='Ex: "Consegue adivinhar?"'
        value={subtitulo}
        onChange={(e) => { setSubtitulo(e.target.value); setErros((p) => ({ ...p, subtitulo: false })); }}
        error={!!erros.subtitulo}
      />

      <TextInput
        label="ID Filme"
        placeholder="Digite o ID do TMDB"
        type="number"
        min="1"
        value={idFilme}
        onChange={(e) => { setIdFilme(e.target.value); setErros((p) => ({ ...p, idFilme: false })); }}
        error={!!erros.idFilme}
      />

      <div className={styles.row}>
        <Select label="Tag" options={TAGS_FILME} value={tagFilme} onChange={(e) => setTagFilme(e.target.value)} />
        <TextInput
          label="Título do filme"
          placeholder='Ex: "Toy Story"'
          value={nomeFilme}
          onChange={(e) => setNomeFilme(e.target.value)}
        />
      </div>

      <TextInput
        label="Emojis"
        placeholder="Ex: 🤠🐍🎸"
        value={emojis}
        onChange={(e) => { setEmojis(e.target.value); setErros((p) => ({ ...p, emojis: false })); }}
        error={!!erros.emojis}
      />

      <div className={styles.respostasWrapper}>
        <label className={styles.fieldLabel}>Respostas aceitas</label>
        {respostasAceitas.map((r, i) => (
          <div key={i} className={styles.respostaRow}>
            <input
              type="text"
              className={`${styles.respostaInput} ${erros.respostasAceitas && !r.trim() ? styles.respostaInputErro : ""}`}
              placeholder={`Resposta ${i + 1}`}
              value={r}
              onChange={(e) => {
                const nova = [...respostasAceitas];
                nova[i] = e.target.value;
                setRespostasAceitas(nova);
                setErros((p) => ({ ...p, respostasAceitas: false }));
              }}
            />
            {respostasAceitas.length > 1 && (
              <button
                type="button"
                className={styles.respostaRemover}
                onClick={() => setRespostasAceitas((prev) => prev.filter((_, idx) => idx !== i))}
              >
                <TrashIcon size={16} color="currentColor" />
              </button>
            )}
          </div>
        ))}
        <Button
          variant="ghost"
          label="Adicionar resposta"
          icon={<PlusIcon size={16} color="currentColor" />}
          type="button"
          width="220px"
          onClick={() => setRespostasAceitas((prev) => [...prev, ""])}
        />
        {erros.respostasAceitas && (
          <p className={styles.erroMsg}>Adicione ao menos uma resposta aceita</p>
        )}
      </div>

      <div className={styles.row}>
        <Select
          label="Dificuldade"
          options={DIFICULDADES}
          value={dificuldade}
          onChange={(e) => { setDificuldade(e.target.value); setErros((p) => ({ ...p, dificuldade: false })); }}
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
        idSuffix="-t4"
        cronometroAtivo={cronometroAtivo} setCronometroAtivo={setCronometroAtivo}
        cronometroVisivel={cronometroVisivel} setCronometroVisivel={setCronometroVisivel}
        cronometroRegressivoAtivo={cronometroRegressivoAtivo} setCronometroRegressivoAtivo={setCronometroRegressivoAtivo}
        cronometroRegressivoVisivel={cronometroRegressivoVisivel} setCronometroRegressivoVisivel={setCronometroRegressivoVisivel}
        cronometroTempo={cronometroTempo} setCronometroTempo={setCronometroTempo}
      />

      <SidebarStatusVisibilidade
        idSuffix="-t4"
        ativo={ativo} setAtivo={setAtivo}
        visibilidade={visibilidade} setVisibilidade={setVisibilidade}
      />
    </div>
  );

  // ── Preview ────────────────────────────────────────────────────────────────
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

        <div className={styles.previewAnoWrapper}>
          {emojis.trim() ? (
            <span className={styles.previewEmojis}>{emojis}</span>
          ) : (
            <span className={styles.previewEmojis} style={{ opacity: 0.3 }}>🎬</span>
          )}
        </div>

        <div className={styles.previewInputWrapper}>
          <input
            type="text"
            className={`${styles.previewTextInput} ${
              previewStatus === "correta" ? styles.previewTextInputCorreta :
              previewStatus === "errada"  ? styles.previewTextInputErrada  : ""
            }`}
            placeholder="Digite o nome do filme"
            value={previewResposta}
            onChange={(e) => { setPreviewResposta(e.target.value); setPreviewStatus(null); }}
            disabled={previewStatus === "correta"}
          />
        </div>

        <div className={styles.previewFooter}>
          <div className={styles.previewJoias}><Joias dificuldade={dificuldade} /></div>
          <button
            className={styles.previewConfirm}
            type="button"
            disabled={!previewResposta.trim() || previewStatus === "correta"}
            onClick={handleConfirmar}
          >
            CONFIRMAR
          </button>
        </div>
      </div>
    </div>
  );

  const headerActions = (
    <>
      <Button variant="ghost" label={loading ? "Salvando..." : "Salvar rascunho"}
        onClick={() => handleSalvar("rascunho")} disabled={loading} border="var(--stroke-base)" />
      <Button variant="ghost" label={loading ? "Publicando..." : "Publicar"}
        onClick={() => handleSalvar("publicado")} disabled={loading} border="var(--stroke-base)" />
    </>
  );

  const breadcrumb = isEdit
    ? [{ href: "/adm/perguntas", label: "Perguntas" }, { href: null, label: id }]
    : null;

  return (
    <>
      <Head><title>{isEdit ? "Editar" : "Criar"} pergunta — Cameo ADM</title></Head>
      <AdmLayout headerActions={headerActions} breadcrumb={breadcrumb} rightSidebar={sidebar}>
        {preview}
      </AdmLayout>
    </>
  );
}
