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

const TAGS_FILME = [{ value: "filme", label: "Filme" }];
const OPCOES_LETRAS = ["a", "b", "c", "d"];
const OPCOES_LABELS = ["Opção A", "Opção B", "Opção C", "Opção D"];

export default function Tipo10({ id = null, initialData = null }) {
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

  const [idFilmes, setIdFilmes] = useState(
    initialData?.idFilmes?.length ? initialData.idFilmes.map(String) : [""]
  );
  const [tagFilme, setTagFilme] = useState(initialData?.tagFilme ?? "filme");
  const [nomeFilme, setNomeFilme] = useState(initialData?.nomeFilme ?? "");
  const [opcoes, setOpcoes] = useState(initialData?.opcoes ?? { a: "", b: "", c: "", d: "" });
  const [respostaCorreta, setRespostaCorreta] = useState(initialData?.respostaCorreta ?? null);

  // poster_path e título por ID: { "123": "/abc.jpg" }
  const [posteres, setPosteres] = useState({});
  const [titulos, setTitulos] = useState({});
  const [generosPorId, setGenerosPorId] = useState({});

  const [previewSelected, setPreviewSelected] = useState(null);
  const [previewConfirmed, setPreviewConfirmed] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({});

  // Busca poster_path para cada ID único e válido
  useEffect(() => {
    const ids = idFilmes.filter((v) => v.trim() && !posteres[v.trim()]);
    if (!ids.length) return;

    ids.forEach((idStr) => {
      const timer = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/movie/${idStr}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`
          );
          if (!res.ok) return;
          const data = await res.json();
          if (data.poster_path) {
            setPosteres((prev) => ({ ...prev, [idStr]: data.poster_path }));
          }
          if (data.title) {
            setTitulos((prev) => ({ ...prev, [idStr]: data.title }));
          }
          if (data.genres?.length) {
            setGenerosPorId((prev) => ({
              ...prev,
              [idStr]: data.genres.map((g) => g.name).join(", "),
            }));
          }
        } catch {}
      }, 600);
      return () => clearTimeout(timer);
    });
  }, [idFilmes]);

  // Sincroniza nomeFilme com os títulos na ordem dos IDs
  useEffect(() => {
    const agrupado = idFilmes
      .filter((v) => v.trim() && titulos[v.trim()])
      .map((v) => titulos[v.trim()])
      .join(", ");
    if (agrupado) setNomeFilme(agrupado);
  }, [titulos, idFilmes]);

  // Sincroniza genero agregando gêneros únicos de todos os IDs
  useEffect(() => {
    const todos = idFilmes
      .filter((v) => v.trim() && generosPorId[v.trim()])
      .flatMap((v) => generosPorId[v.trim()].split(", "));
    const unicos = [...new Set(todos)];
    if (unicos.length) setGenero(unicos.join(", "));
  }, [generosPorId, idFilmes]);

  const handleOpcao = (letra, valor) => setOpcoes((prev) => ({ ...prev, [letra]: valor }));

  const handlePreviewSelect = (letra) => { setPreviewSelected(letra); setPreviewConfirmed(false); };

  const getPreviewOptionClass = (letra) => {
    if (!previewConfirmed) return previewSelected === letra ? styles.previewOptionSelected : "";
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
    if (!idFilmes.some((v) => v.trim())) e.idFilmes = true;
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
        tipo: 10,
        titulo, subtitulo, dificuldade, genero,
        cronometroAtivo, cronometroVisivel,
        cronometroRegressivoAtivo, cronometroRegressivoVisivel,
        cronometroTempo: cronometroRegressivoAtivo ? cronometroTempo : null,
        ativo, visibilidade, status,
        idFilmes: idFilmes.filter((v) => v.trim()).map((v) => parseInt(v)),
        tagFilme, nomeFilme,
        opcoes, respostaCorreta,
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

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const sidebar = (
    <div className={styles.sidebarContent}>
      <TextInput
        label="Título da pergunta"
        placeholder='Ex: "Qual é o ator em comum?"'
        value={titulo}
        onChange={(e) => { setTitulo(e.target.value); setErros((p) => ({ ...p, titulo: false })); }}
        error={!!erros.titulo}
      />

      <TextInput
        label="Subtítulo"
        placeholder='Ex: "Ele aparece em todos esses filmes"'
        value={subtitulo}
        onChange={(e) => { setSubtitulo(e.target.value); setErros((p) => ({ ...p, subtitulo: false })); }}
        error={!!erros.subtitulo}
      />

      <div className={styles.respostasWrapper}>
        <label className={styles.fieldLabel}>IDs dos Filmes</label>
        {idFilmes.map((v, i) => (
          <div key={i} className={styles.respostaRow}>
            <input
              type="number"
              min="1"
              className={`${styles.respostaInput} ${erros.idFilmes && !v.trim() ? styles.respostaInputErro : ""}`}
              placeholder={`ID Filme ${i + 1}`}
              value={v}
              onChange={(e) => {
                const nova = [...idFilmes];
                nova[i] = e.target.value;
                setIdFilmes(nova);
                setErros((p) => ({ ...p, idFilmes: false }));
              }}
            />
            {idFilmes.length > 1 && (
              <button
                type="button"
                className={styles.respostaRemover}
                onClick={() => setIdFilmes((prev) => prev.filter((_, idx) => idx !== i))}
              >
                <TrashIcon size={16} color="currentColor" />
              </button>
            )}
          </div>
        ))}
        <Button
          variant="ghost"
          label="Adicionar ID Filme"
          icon={<PlusIcon size={16} color="currentColor" />}
          type="button"
          width="220px"
          onClick={() => setIdFilmes((prev) => [...prev, ""])}
        />
        {erros.idFilmes && (
          <p className={styles.erroMsg}>Adicione ao menos um ID de filme</p>
        )}
      </div>

      <div className={styles.row}>
        <Select label="Tag" options={TAGS_FILME} value={tagFilme} onChange={(e) => setTagFilme(e.target.value)} />
        <TextInput
          label="Título do filme"
          placeholder='Ex: "Matrix"'
          value={nomeFilme}
          onChange={(e) => setNomeFilme(e.target.value)}
        />
      </div>

      <div className={styles.optionsGrid}>
        {OPCOES_LETRAS.map((letra, i) => (
          <div key={letra} className={styles.fieldWrapper}>
            <label className={styles.fieldLabel}>{OPCOES_LABELS[i]}</label>
            <div className={`${styles.optionRow} ${respostaCorreta === letra ? styles.optionCorrect : ""} ${erros[`opcao${letra.toUpperCase()}`] ? styles.optionRowErro : ""}`}>
              <input
                type="text"
                className={styles.optionInput}
                placeholder="Digite"
                value={opcoes[letra]}
                onChange={(e) => { handleOpcao(letra, e.target.value); setErros((p) => ({ ...p, [`opcao${letra.toUpperCase()}`]: false })); }}
              />
              <input
                type="radio"
                name="respostaCorreta"
                className={styles.optionRadio}
                checked={respostaCorreta === letra}
                onChange={() => { setRespostaCorreta(letra); setErros((p) => ({ ...p, respostaCorreta: false })); }}
              />
            </div>
          </div>
        ))}
        {erros.respostaCorreta && <p className={styles.erroMsg}>Selecione a opção correta</p>}
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
        idSuffix="-t10"
        cronometroAtivo={cronometroAtivo} setCronometroAtivo={setCronometroAtivo}
        cronometroVisivel={cronometroVisivel} setCronometroVisivel={setCronometroVisivel}
        cronometroRegressivoAtivo={cronometroRegressivoAtivo} setCronometroRegressivoAtivo={setCronometroRegressivoAtivo}
        cronometroRegressivoVisivel={cronometroRegressivoVisivel} setCronometroRegressivoVisivel={setCronometroRegressivoVisivel}
        cronometroTempo={cronometroTempo} setCronometroTempo={setCronometroTempo}
      />

      <SidebarStatusVisibilidade
        idSuffix="-t10"
        ativo={ativo} setAtivo={setAtivo}
        visibilidade={visibilidade} setVisibilidade={setVisibilidade}
      />
    </div>
  );

  // ── Preview ────────────────────────────────────────────────────────────────
  const posteresList = idFilmes
    .filter((v) => v.trim() && posteres[v.trim()])
    .map((v) => `https://image.tmdb.org/t/p/w342${posteres[v.trim()]}`);

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

        {posteresList.length > 0 && (
          <div className={styles.previewPostersGrid}>
            {posteresList.map((url, i) => (
              <div key={i} className={styles.previewPosterItem}>
                <img src={url} alt={`Filme ${i + 1}`} className={styles.previewPosterImg} unoptimized />
              </div>
            ))}
          </div>
        )}

        {posteresList.length === 0 && idFilmes.some((v) => v.trim()) && (
          <div className={styles.previewPostersGrid}>
            {idFilmes.filter((v) => v.trim()).map((_, i) => (
              <div key={i} className={styles.previewPosterItem}>
                <div className={styles.previewImagePlaceholder} />
              </div>
            ))}
          </div>
        )}

        <div className={styles.previewOptions}>
          {OPCOES_LETRAS.map((letra, i) => (
            <div
              key={letra}
              className={`${styles.previewOption} ${getPreviewOptionClass(letra)}`}
              onClick={() => handlePreviewSelect(letra)}
            >
              {opcoes[letra] || <span className={styles.previewOptionEmpty}>{OPCOES_LABELS[i]}</span>}
            </div>
          ))}
        </div>

        <div className={styles.previewFooter}>
          <div className={styles.previewJoias}><Joias dificuldade={dificuldade} /></div>
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
