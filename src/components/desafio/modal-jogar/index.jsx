import { useState, useEffect } from "react";
import { db } from "@/services/firebaseConection";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CloseIcon from "@/components/icons/CloseIcon";
import JoiaRosaIcon from "@/components/icons/JoiaRosaIcon";
import JoiaAmarelaIcon from "@/components/icons/JoiaAmarelaIcon";
import JoiaAzulIcon from "@/components/icons/JoiaAzulIcon";
import JoiaVaziaIcon from "@/components/icons/JoiaVaziaIcon";
import DragHandleIcon from "@/components/icons/DragHandleIcon";
import styles from "./index.module.scss";

const OPCOES_LETRAS = ["a", "b", "c", "d"];
const TAGS_FILME = [{ value: "filme", label: "Filme" }];

const tmdbImg = (path, size = "w1280") =>
  path
    ? `https://image.tmdb.org/t/p/${size}${path.startsWith("/") ? path : `/${path}`}`
    : null;

const profileUrl = (path) =>
  path
    ? `https://image.tmdb.org/t/p/w185${path.startsWith("/") ? path : `/${path}`}`
    : null;

const renderTextoHtml = (t) =>
  (t || "").replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

function Joias({ dificuldade }) {
  if (dificuldade === "1")
    return (
      <>
        <JoiaRosaIcon />
        <JoiaVaziaIcon />
        <JoiaVaziaIcon />
      </>
    );
  if (dificuldade === "2")
    return (
      <>
        <JoiaAmarelaIcon />
        <JoiaAmarelaIcon />
        <JoiaVaziaIcon />
      </>
    );
  if (dificuldade === "3")
    return (
      <>
        <JoiaAzulIcon />
        <JoiaAzulIcon />
        <JoiaAzulIcon />
      </>
    );
  return (
    <>
      <JoiaVaziaIcon />
      <JoiaVaziaIcon />
      <JoiaVaziaIcon />
    </>
  );
}

function SortableFilmCard({ idStr, index, nome, backdropUrl, cardClass }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: idStr });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style} className={`${styles.filmCard} ${cardClass}`}>
      <div className={styles.filmCardDrag} {...attributes} {...listeners}>
        <DragHandleIcon size={20} color="var(--text-sub)" />
      </div>
      <span className={styles.filmCardNome}>{nome || `Filme ${index + 1}`}</span>
      {backdropUrl ? (
        <img src={backdropUrl} alt={nome} className={styles.filmCardBackdrop} />
      ) : (
        <div className={styles.filmCardBackdropPlaceholder} />
      )}
    </div>
  );
}

function QuizTextInput({ value, status, placeholder, onChange }) {
  return (
    <div className={styles.previewInputWrapper}>
      <input
        type="text"
        className={`${styles.previewTextInput} ${
          status === "correta"
            ? styles.previewTextInputCorreta
            : status === "errada"
            ? styles.previewTextInputErrada
            : ""
        }`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={status === "correta"}
      />
    </div>
  );
}

export default function ModalJogar({ isOpen, onClose, tipoFiltro = null }) {
  const [pergunta, setPergunta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const [previewSelected, setPreviewSelected] = useState(null);
  const [previewConfirmed, setPreviewConfirmed] = useState(false);
  const [previewResposta, setPreviewResposta] = useState("");
  const [previewStatus, setPreviewStatus] = useState(null);

  const [tmdbPosteres, setTmdbPosteres] = useState({});
  const [tmdbTitulos, setTmdbTitulos] = useState({});
  const [tmdbBackdrops, setTmdbBackdrops] = useState({});
  const [tmdbReleaseDates, setTmdbReleaseDates] = useState({});
  const [ordemUsuario, setOrdemUsuario] = useState([]);

  const sensors = useSensors(useSensor(PointerSensor));

  const resetAll = () => {
    setPergunta(null);
    setPreviewSelected(null);
    setPreviewConfirmed(false);
    setPreviewResposta("");
    setPreviewStatus(null);
    setTmdbPosteres({});
    setTmdbTitulos({});
    setTmdbBackdrops({});
    setTmdbReleaseDates({});
    setOrdemUsuario([]);
  };

  useEffect(() => {
    if (!isOpen) return;
    resetAll();
    fetchRandom();
  }, [isOpen, tipoFiltro]);

  useEffect(() => {
    if (pergunta?.tipo === 12 && pergunta.idFilmes?.length) {
      setOrdemUsuario(pergunta.idFilmes.map(String));
    }
  }, [pergunta]);

  useEffect(() => {
    if (!pergunta) return;
    const { tipo, idFilmes } = pergunta;
    if ((tipo === 10 || tipo === 12) && idFilmes?.length) {
      idFilmes.forEach((id) => {
        const idStr = String(id);
        fetch(
          `https://api.themoviedb.org/3/movie/${idStr}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`
        )
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => {
            if (!data) return;
            if (data.poster_path)
              setTmdbPosteres((p) => ({ ...p, [idStr]: data.poster_path }));
            if (data.backdrop_path)
              setTmdbBackdrops((p) => ({ ...p, [idStr]: data.backdrop_path }));
            if (data.release_date)
              setTmdbReleaseDates((p) => ({ ...p, [idStr]: data.release_date }));
            if (data.title)
              setTmdbTitulos((p) => ({ ...p, [idStr]: data.title }));
          })
          .catch(() => {});
      });
    }
  }, [pergunta]);

  const fetchRandom = async () => {
    setLoading(true);
    setErro(null);
    try {
      const constraints = [where("status", "==", "publicado")];
      if (tipoFiltro) constraints.push(where("tipo", "==", Number(tipoFiltro)));
      const q = query(collection(db, "perguntas"), ...constraints);
      const snap = await getDocs(q);
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      if (!docs.length) {
        setErro("Nenhuma pergunta publicada encontrada.");
        return;
      }
      setPergunta(docs[Math.floor(Math.random() * docs.length)]);
    } catch {
      setErro("Erro ao buscar pergunta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const getOptClass = (letra) => {
    if (!previewConfirmed)
      return previewSelected === letra ? styles.previewOptionSelected : "";
    if (letra === pergunta?.respostaCorreta) return styles.previewOptionCorreta;
    if (letra === previewSelected) return styles.previewOptionErro;
    return "";
  };

  const handleSelect = (letra) => {
    if (previewConfirmed) return;
    setPreviewSelected(letra);
  };

  const handleConfirmText = () => {
    const digitado = previewResposta.trim().toLowerCase();
    const acertou = (pergunta?.respostasAceitas ?? []).some(
      (r) => r.trim().toLowerCase() === digitado
    );
    setPreviewStatus(acertou ? "correta" : "errada");
  };

  const ordemCorreta12 =
    pergunta?.tipo === 12 && pergunta.idFilmes
      ? [...pergunta.idFilmes.map(String)].sort((a, b) =>
          (tmdbReleaseDates[a] ?? "").localeCompare(tmdbReleaseDates[b] ?? "")
        )
      : [];

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIdx = ordemUsuario.indexOf(active.id);
    const newIdx = ordemUsuario.indexOf(over.id);
    setOrdemUsuario(arrayMove(ordemUsuario, oldIdx, newIdx));
    setPreviewConfirmed(false);
  };

  // ── Render parts ─────────────────────────────────────────────────────────────

  const Header = () => (
    <div className={styles.previewHeader}>
      <h2 className={styles.previewTitle}>{pergunta.titulo}</h2>
      {pergunta.subtitulo && <p className={styles.previewSubtitle}>{pergunta.subtitulo}</p>}
    </div>
  );

  const Footer = ({ canConfirm, onConfirm }) => (
    <div className={styles.previewFooter}>
      <div className={styles.previewJoias}>
        <Joias dificuldade={pergunta.dificuldade} />
      </div>
      <button
        className={styles.previewConfirm}
        type="button"
        disabled={!canConfirm || previewConfirmed}
        onClick={onConfirm}
      >
        CONFIRMAR
      </button>
    </div>
  );

  const Options = () => (
    <div className={styles.previewOptions}>
      {OPCOES_LETRAS.map((letra) => (
        <div
          key={letra}
          className={`${styles.previewOption} ${getOptClass(letra)}`}
          onClick={() => handleSelect(letra)}
        >
          {pergunta.opcoes?.[letra] ?? ""}
        </div>
      ))}
    </div>
  );

  const ImageWrapper = ({ src, tagFilme, nomeFilme }) => (
    <div className={styles.previewImageWrapper}>
      {src ? (
        <img src={src} alt={nomeFilme} className={styles.previewImage} />
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
  );


  // ── Content per tipo ─────────────────────────────────────────────────────────

  const renderContent = () => {
    if (!pergunta) return null;
    const { tipo, imagem, imagemUrl, imagemRespostaUrl, tagFilme, nomeFilme } = pergunta;

    switch (tipo) {
      case 1: {
        const backdropUrl = tmdbImg(imagem);
        const frase = pergunta.fraseComLacuna || "";
        const partes = frase.split("[___]");
        return (
          <>
            <Header />
            <div className={styles.previewImageWrapper}>
              {backdropUrl ? (
                <img src={backdropUrl} alt={nomeFilme} className={styles.previewImage} />
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
                <div className={styles.previewSeparador} />
                <span className={styles.previewPhraseText}>
                  {partes.length === 2 ? (
                    <>
                      {partes[0]}
                      <span className={styles.lacunaToken}>________</span>
                      {partes[1]}
                    </>
                  ) : (
                    frase
                  )}
                </span>
              </div>
            </div>
            <Options />
            <Footer canConfirm={!!previewSelected} onConfirm={() => setPreviewConfirmed(true)} />
          </>
        );
      }

      case 2: {
        const cast = [...(pergunta.elenco ?? [])].slice(0, 4);
        while (cast.length < 4) cast.push(null);
        const canConfirm = !!previewResposta.trim() && previewStatus !== "correta";
        return (
          <>
            <Header />
            <div className={styles.previewCastGrid}>
              {cast.map((ator, i) => (
                <div key={ator?.id ?? `ph-${i}`} className={styles.previewCastItem}>
                  {ator ? (
                    <>
                      <img
                        src={profileUrl(ator.profile_path)}
                        alt={ator.name}
                        className={styles.previewCastFoto}
                      />
                      <span className={styles.previewCastNome}>{ator.name}</span>
                    </>
                  ) : (
                    <div className={styles.previewCastPlaceholder} />
                  )}
                </div>
              ))}
            </div>
            <QuizTextInput
              value={previewResposta}
              status={previewStatus}
              placeholder="Digite o nome do filme"
              onChange={(e) => { setPreviewResposta(e.target.value); setPreviewStatus(null); }}
            />
            <Footer canConfirm={canConfirm} onConfirm={handleConfirmText} />
          </>
        );
      }

      case 3: {
        return (
          <>
            <Header />
            <div className={styles.previewAnoWrapper}>
              <span className={styles.previewAno}>{pergunta.anoLancamento}</span>
            </div>
            <Options />
            <Footer canConfirm={!!previewSelected} onConfirm={() => setPreviewConfirmed(true)} />
          </>
        );
      }

      case 4: {
        const canConfirm = !!previewResposta.trim() && previewStatus !== "correta";
        return (
          <>
            <Header />
            <div className={styles.previewAnoWrapper}>
              <span className={styles.previewEmojis}>{pergunta.emojis}</span>
            </div>
            <QuizTextInput
              value={previewResposta}
              status={previewStatus}
              placeholder="Digite o nome do filme"
              onChange={(e) => { setPreviewResposta(e.target.value); setPreviewStatus(null); }}
            />
            <Footer canConfirm={canConfirm} onConfirm={handleConfirmText} />
          </>
        );
      }

      case 5: {
        const canConfirm = !!previewResposta.trim() && previewStatus !== "correta";
        return (
          <>
            <Header />
            <div className={styles.previewImageWrapper}>
              {imagemUrl ? (
                <img src={imagemUrl} alt="Imagem" className={styles.previewImage} />
              ) : (
                <div className={styles.previewImagePlaceholder} />
              )}
            </div>
            <QuizTextInput
              value={previewResposta}
              status={previewStatus}
              placeholder="Digite o que está faltando"
              onChange={(e) => { setPreviewResposta(e.target.value); setPreviewStatus(null); }}
            />
            <Footer canConfirm={canConfirm} onConfirm={handleConfirmText} />
          </>
        );
      }

      case 6: {
        return (
          <>
            <Header />
            <div className={styles.previewImageWrapper}>
              {imagemUrl ? (
                <img src={imagemUrl} alt="Imagem" className={styles.previewImage} />
              ) : (
                <div className={styles.previewImagePlaceholder} />
              )}
            </div>
            <Options />
            <Footer canConfirm={!!previewSelected} onConfirm={() => setPreviewConfirmed(true)} />
          </>
        );
      }

      case 7: {
        return (
          <>
            <Header />
            <Options />
            <Footer canConfirm={!!previewSelected} onConfirm={() => setPreviewConfirmed(true)} />
          </>
        );
      }

      case 9:
      case 15: {
        const backdropUrl = tmdbImg(imagem);
        return (
          <>
            <Header />
            <ImageWrapper src={backdropUrl} tagFilme={tagFilme} nomeFilme={nomeFilme} />
            <Options />
            <Footer canConfirm={!!previewSelected} onConfirm={() => setPreviewConfirmed(true)} />
          </>
        );
      }

      case 10: {
        const ids = (pergunta.idFilmes ?? []).map(String);
        const posteresList = ids
          .filter((id) => tmdbPosteres[id])
          .map((id) => ({
            id,
            url: tmdbImg(tmdbPosteres[id], "w342"),
            nome: tmdbTitulos[id] ?? "",
          }));
        return (
          <>
            <Header />
            <div className={styles.previewPostersGrid}>
              {posteresList.length > 0
                ? posteresList.map(({ id, url, nome }) => (
                    <div key={id} className={styles.previewPosterItem}>
                      <img src={url} alt={nome} className={styles.previewPosterImg} />
                    </div>
                  ))
                : ids.map((id) => (
                    <div key={id} className={styles.previewPosterItem}>
                      <div className={styles.previewImagePlaceholder} />
                    </div>
                  ))}
            </div>
            <Options />
            <Footer canConfirm={!!previewSelected} onConfirm={() => setPreviewConfirmed(true)} />
          </>
        );
      }

      case 11: {
        const OPCOES_VF = ["verdadeiro", "falso"];
        const getVFClass = (opcao) => {
          if (!previewConfirmed) return previewSelected === opcao ? styles.previewOptionSelected : "";
          if (opcao === pergunta.respostaCorreta) return styles.previewOptionCorreta;
          if (opcao === previewSelected) return styles.previewOptionErro;
          return "";
        };
        return (
          <>
            <Header />
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
                  dangerouslySetInnerHTML={{ __html: pergunta.texto }}
                />
              </div>
            </div>
            <div className={styles.previewOptions}>
              {OPCOES_VF.map((opcao) => (
                <div
                  key={opcao}
                  className={`${styles.previewOption} ${getVFClass(opcao)}`}
                  onClick={() => { if (!previewConfirmed) setPreviewSelected(opcao); }}
                  style={{ justifyContent: "center", textTransform: "capitalize" }}
                >
                  {opcao}
                </div>
              ))}
            </div>
            {previewConfirmed && pergunta.respostaTexto?.trim() && (
              <div className={styles.previewRespostaTexto}>
                <div className={styles.separador} />
                <span dangerouslySetInnerHTML={{ __html: pergunta.respostaTexto }} />
              </div>
            )}
            <Footer canConfirm={!!previewSelected} onConfirm={() => setPreviewConfirmed(true)} />
          </>
        );
      }

      case 12: {
        return (
          <>
            <Header />
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={ordemUsuario} strategy={verticalListSortingStrategy}>
                <div className={styles.filmCardList}>
                  {ordemUsuario.map((idStr, i) => {
                    const bdPath = tmdbBackdrops[idStr];
                    const bdUrl = bdPath ? tmdbImg(bdPath, "w780") : null;
                    const isCorrect = previewConfirmed && ordemUsuario[i] === ordemCorreta12[i];
                    const isWrong = previewConfirmed && ordemUsuario[i] !== ordemCorreta12[i];
                    return (
                      <SortableFilmCard
                        key={idStr}
                        idStr={idStr}
                        index={i}
                        nome={tmdbTitulos[idStr] ?? ""}
                        backdropUrl={bdUrl}
                        cardClass={isCorrect ? styles.filmCardCorreta : isWrong ? styles.filmCardErro : ""}
                      />
                    );
                  })}
                  {ordemUsuario.length === 0 && (
                    <p style={{ opacity: 0.4, fontSize: 14, textAlign: "center", fontStyle: "italic" }}>
                      Carregando filmes...
                    </p>
                  )}
                </div>
              </SortableContext>
            </DndContext>
            <Footer canConfirm={ordemUsuario.length > 0} onConfirm={() => setPreviewConfirmed(true)} />
          </>
        );
      }

      case 14: {
        const imagemAtual = previewConfirmed && imagemRespostaUrl ? imagemRespostaUrl : imagemUrl;
        return (
          <>
            <Header />
            <div className={styles.previewImageWrapper14}>
              {imagemAtual ? (
                <img src={imagemAtual} alt="Imagem" className={styles.previewImage14} />
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
            <Options />
            <Footer canConfirm={!!previewSelected} onConfirm={() => setPreviewConfirmed(true)} />
          </>
        );
      }

      case 16: {
        return (
          <>
            <Header />
            <div className={styles.previewTrueFalse}>
              <span
                className={styles.previewPhraseTrueFalse}
                dangerouslySetInnerHTML={{ __html: renderTextoHtml(pergunta.texto ?? "") }}
              />
            </div>
            <Options />
            <Footer canConfirm={!!previewSelected} onConfirm={() => setPreviewConfirmed(true)} />
          </>
        );
      }

      default:
        return (
          <p style={{ color: "var(--text-sub)", fontStyle: "italic", textAlign: "center", padding: "2rem 0" }}>
            Tipo de pergunta não suportado.
          </p>
        );
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Fechar">
          <CloseIcon size={20} color="currentColor" />
        </button>

        <div className={styles.previewCard}>
          {loading && (
            <div className={styles.loadingState}>
              <span className={styles.spinner} />
              <p>Buscando pergunta...</p>
            </div>
          )}
          {erro && (
            <div className={styles.errorState}>
              <p>{erro}</p>
            </div>
          )}
          {!loading && !erro && pergunta && renderContent()}
        </div>
      </div>
    </div>
  );
}