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
import SectionMetas from "@/components/section-metas";

export default function FilmeHero({ filme, trailerLink, releaseDates, showMetas = true }) {
  const { user, salvarFilme, removerFilme, assistirFilme, removerAssistir } =
    useAuth();
  const isMobile = useIsMobile();
  const [modalListaAberto, setModalListaAberto] = useState(false);
  const [selecionarFavorito, setSelecionarFavorito] = useState(false);
  const [selecionarParaVer, setSelecionarParaVer] = useState(false);

  const favoritosList = user?.favoritos || [];
  const assistList = user?.assistir || [];

  const abrirModalLista = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    const sid = String(filme.id);
    setSelecionarFavorito(favoritosList.includes(sid));
    setSelecionarParaVer(assistList.includes(sid));
    setModalListaAberto(true);
  };

  const confirmarLista = () => {
    if (!filme) return;
    const sid = String(filme.id);

    const jaFavorito = favoritosList.includes(sid);
    if (selecionarFavorito && !jaFavorito) salvarFilme(sid);
    else if (!selecionarFavorito && jaFavorito) removerFilme(sid);

    const jaParaVer = assistList.includes(sid);
    if (selecionarParaVer && !jaParaVer) assistirFilme(sid);
    else if (!selecionarParaVer && jaParaVer) removerAssistir(sid);

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
            {user.visto?.[filme.id]?.nota > 0 ? (
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
            )}

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
            />
            <CheckboxCard
              id="hero-para-ver"
              variant="card"
              label="Quero assistir"
              checked={selecionarParaVer}
              onChange={(e) => setSelecionarParaVer(e.target.checked)}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
