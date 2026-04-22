import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import PlayIcon from "@/components/icons/PlayIcon";
import Badge from "@/components/badge";
import Classificacao from "@/components/detalhesfilmes/classificacao";
import Button from "@/components/button";
import Modal from "@/components/modal";
import CheckboxCard from "@/components/inputs/checkbox-card";
import AddToListIcon from "@/components/icons/AddToListIcon";
import BookmarkIcon from "@/components/icons/BookmarkIcon";
import ListIcon from "@/components/icons/ListIcon";
import SectionMetas from "@/components/section-metas";

const LISTA_CORES = [
  "--primitive-roxo-02",
  "--primitive-azul-01",
  "--primitive-rosa-01",
  "--primitive-verde-01",
  "--primitive-amarelo-01",
  "--primitive-azul-02",
  "--primitive-rosa-02",
  "--primitive-amarelo-02",
  "--primitive-verde-02",
  "--primitive-azul-03",
];

export default function FilmeHero({
  filme,
  trailerLink,
  releaseDates,
  showMetas = true,
  showNotas = true,
  elencoImagens = [],
}) {
  const {
    user,
    salvarFilme,
    removerFilme,
    assistirFilme,
    removerAssistir,
    toggleFilmeNaLista,
  } = useAuth();
  const isMobile = useIsMobile();
  const [modalListaAberto, setModalListaAberto] = useState(false);
  const [selecionarFavorito, setSelecionarFavorito] = useState(false);
  const [selecionarParaVer, setSelecionarParaVer] = useState(false);
  const [selecaoListas, setSelecaoListas] = useState({});

  const favoritosList = user?.favoritos || [];
  const assistList = user?.assistir || [];
  const listasCustom = user?.listasQueroVer || [];

  const abrirModalLista = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const sid = String(filme.id);
    setSelecionarFavorito(favoritosList.includes(sid));
    setSelecionarParaVer(assistList.includes(sid));
    const selecao = {};
    listasCustom.forEach((l) => {
      selecao[l.id] = l.filmes?.includes(sid) ?? false;
    });
    setSelecaoListas(selecao);
    setModalListaAberto(true);
  };

  const confirmarLista = async () => {
    if (!filme) return;
    const sid = String(filme.id);

    const jaFavorito = favoritosList.includes(sid);
    if (selecionarFavorito && !jaFavorito) salvarFilme(sid);
    else if (!selecionarFavorito && jaFavorito) removerFilme(sid);

    const jaParaVer = assistList.includes(sid);
    if (selecionarParaVer && !jaParaVer) assistirFilme(sid);
    else if (!selecionarParaVer && jaParaVer) removerAssistir(sid);

    for (const lista of listasCustom) {
      const estavaNA = lista.filmes?.includes(sid) ?? false;
      const deveEstar = selecaoListas[lista.id] ?? false;
      if (estavaNA !== deveEstar) await toggleFilmeNaLista(lista.id, sid);
    }

    setModalListaAberto(false);
  };

  const renderGeneros = () => {
    if (!Array.isArray(filme.genres) || filme.genres.length === 0)
      return <Badge variant="genero" label="--" />;
    return filme.genres.map((g) => (
      <Badge key={g.id} variant="genero" label={g.name} />
    ));
  };

  const formatRuntime = (minutes) => {
    if (typeof minutes !== "number") return "--";
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <div
      className={styles.hero}
      style={
        filme.backdrop_path
          ? {
              backgroundImage: `url(https://image.tmdb.org/t/p/original/${filme.backdrop_path})`,
            }
          : undefined
      }
    >
      <div className={styles.infoSide}>
        {!isMobile && filme.backdrop_path && (
          <div className={styles.posterTrailer}>
            {trailerLink && (
              <div className={styles.botaoTrailer}>
                <div className={styles.play}>
                  <Link
                    href={trailerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PlayIcon size={24} color="#fff" />
                  </Link>
                </div>
              </div>
            )}
            <div className={styles.posterFilme}>
              <Image
                unoptimized
                src={`https://image.tmdb.org/t/p/w780/${filme.backdrop_path}`}
                alt={filme.title}
                width={780}
                height={440}
                className={styles.imagem}
                loading="lazy"
              />
            </div>
          </div>
        )}

        <div className={styles.detalhes}>
          <div className={styles.filmInfo}>
            <h1 className={styles.titulo}>{filme.title}</h1>

            <div className={styles.generosList}>{renderGeneros()}</div>

            {!isMobile && (
              <div className={styles.info}>
                <Classificacao releaseDates={releaseDates} />
                <span className={styles.duracao}>
                  {formatRuntime(filme.runtime)}
                </span>
              </div>
            )}
          </div>

          <div className={styles.botoes}>
            {(!isMobile || showNotas) &&
              (user.visto?.[filme.id]?.nota > 0 ? (
                <Button
                  variant={isMobile ? "ghost" : "outline"}
                  stars={user.visto[filme.id].nota}
                  onClick={() => {}}
                  {...(!isMobile && {
                    border: "var(--stroke-solid)",
                    arrowColor: "var(--stroke-solid)",
                    bg: "none",
                  })}
                />
              ) : (
                <Button
                  variant={isMobile ? "ghost" : "outline"}
                  label="Já assisti"
                  onClick={() => {}}
                  {...(!isMobile && {
                    border: "var(--stroke-solid)",
                    arrowColor: "var(--stroke-solid)",
                    bg: "none",
                  })}
                />
              ))}

            {!isMobile && (
              <Button
                variant="submit"
                label="Adicionar a lista"
                icon={<AddToListIcon size={20} color="currentColor" />}
                onClick={abrirModalLista}
                width="220px"
              />
            )}
            {isMobile && <div className={styles.sugestao}>Sugestão</div>}
          </div>
        </div>
      </div>

      {elencoImagens.length > 0 && (
        <div className={styles.elencoImagens}>
          {elencoImagens.map((img, i) => (
            <div className={styles.elencoAvatar}>
              <img key={i} src={img} alt="" />
            </div>
          ))}
        </div>
      )}

      {!isMobile && showMetas && (
        <div className={styles.metasDesktop}>
          <SectionMetas />
        </div>
      )}

      {modalListaAberto && (
        <Modal
          title={
            <>
              Adicionar{" "}
              <span style={{ color: "var(--text-base)" }}>{filme.title}</span> à
              lista
            </>
          }
          onClose={() => setModalListaAberto(false)}
          primaryAction={{ label: "Confirmar", onClick: confirmarLista }}
        >
          <div className={styles.modalOpcoes}>
            <CheckboxCard
              id="hero-favorito"
              variant="card"
              label="Adicionar aos favoritos"
              checked={selecionarFavorito}
              onChange={(e) => setSelecionarFavorito(e.target.checked)}
              icon={<BookmarkIcon size={18} color="currentColor" />}
            />
            <CheckboxCard
              id="hero-para-ver"
              variant="card"
              label="Quero assistir"
              checked={selecionarParaVer}
              onChange={(e) => setSelecionarParaVer(e.target.checked)}
              icon={<ListIcon size={18} color="currentColor" />}
            />
            {listasCustom.map((lista, idx) => (
              <CheckboxCard
                key={lista.id}
                id={`hero-lista-${lista.id}`}
                variant="card"
                label={lista.nome}
                checked={selecaoListas[lista.id] ?? false}
                onChange={(e) =>
                  setSelecaoListas((prev) => ({
                    ...prev,
                    [lista.id]: e.target.checked,
                  }))
                }
                icon={
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 10,
                        background: `var(${LISTA_CORES[idx % LISTA_CORES.length]})`,
                      }}
                    />
                  </div>
                }
              />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
