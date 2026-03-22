import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import ModalViews from "@/components/modais/modal-views";
import AvaliarFilmeContent from "@/components/modais/avaliar-filmes/content";
import Badge from "@/components/badge";
import Classificacao from "@/components/detalhesfilmes/classificacao";
import Button from "@/components/button";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import StarRatingIcon from "@/components/icons/StarRatingIcon";
import styles from "./index.module.scss";

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function ModalDetalhesFilme({
  filmes,
  indexInicial = 0,
  onClose,
}) {
  const { user, darNota } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const contentRef = useRef();

  const [filmeIndex, setFilmeIndex] = useState(indexInicial);
  const [detalhes, setDetalhes] = useState(null);
  const [loadingDetalhes, setLoadingDetalhes] = useState(true);
  const [step, setStep] = useState(0); // 0 = detalhes, 1 = avaliação
  const [erroNota, setErroNota] = useState(false);

  const filmeAtual = filmes[filmeIndex];

  useEffect(() => {
    if (!filmeAtual?.id) return;
    setLoadingDetalhes(true);
    fetch(
      `https://api.themoviedb.org/3/movie/${filmeAtual.id}?api_key=${TMDB_KEY}&language=pt-BR&append_to_response=release_dates`,
    )
      .then((r) => r.json())
      .then((data) => setDetalhes(data))
      .catch(() => {})
      .finally(() => setLoadingDetalhes(false));
  }, [filmeAtual?.id]);

  const handleAvaliar = () => setStep(1);

  const handleVoltar = () => {
    setStep(0);
    setErroNota(false);
  };

  const handleSalvar = () => {
    if (!contentRef.current) return;
    const { avaliacao, comentario, ondeAssistiu, quadroMetas, dataAssistido } =
      contentRef.current.getValues();
    if (!avaliacao || avaliacao === 0) {
      setErroNota(true);
      return;
    }
    setErroNota(false);
    darNota(
      String(filmeAtual.id),
      avaliacao,
      comentario,
      ondeAssistiu,
      quadroMetas,
      dataAssistido,
    );
    onClose();
  };

  const navAnterior = () => {
    if (filmeIndex > 0) {
      setFilmeIndex((i) => i - 1);
      setStep(0);
    }
  };

  const navProximo = () => {
    if (filmeIndex < filmes.length - 1) {
      setFilmeIndex((i) => i + 1);
      setStep(0);
    }
  };

  const formatRuntime = (min) => {
    if (!min) return null;
    return `${Math.floor(min / 60)}h ${min % 60}m`;
  };

  const nota = user?.visto?.[filmeAtual?.id];
  const imagemSrc = filmeAtual
    ? `https://image.tmdb.org/t/p/${isMobile ? "w500" : "w780"}/${isMobile ? filmeAtual.poster_path : filmeAtual.backdrop_path || filmeAtual.poster_path}`
    : null;

  // ── View 0: detalhes ──
  const detalhesContent = (
    <div className={styles.carrossel}>
      <div className={styles.carrosselImagem}>
        <button
          className={styles.setaLeft}
          onClick={navAnterior}
          disabled={filmeIndex === 0}
          type="button"
          aria-label="Filme anterior"
        >
          <ChevronDownIcon
            size={18}
            color="var(--icon-base)"
            className={styles.setaEsquerda}
          />
        </button>
        <div className={styles.imagemWrapper}>
          {imagemSrc && (
            <Image
              unoptimized
              src={imagemSrc}
              alt={filmeAtual?.title || ""}
              fill
              className={styles.imagem}
            />
          )}
        </div>
        <button
          className={styles.setaRight}
          onClick={navProximo}
          disabled={filmeIndex === filmes.length - 1}
          type="button"
          aria-label="Próximo filme"
        >
          <ChevronDownIcon
            size={18}
            color="var(--icon-base)"
            className={styles.setaDireita}
          />
        </button>
      </div>

      {!loadingDetalhes && detalhes && (
        <div className={styles.detalhes}>
          <h2 className={styles.titulo}>{detalhes.title}</h2>
          <div className={styles.meta}>
            {detalhes.genres?.length > 0 && (
              <div className={styles.generos}>
                {detalhes.genres.map((g) => (
                  <Badge key={g.id} variant="genero" label={g.name} />
                ))}
              </div>
            )}
            {(() => {
              const releaseDates = detalhes.release_dates?.results;
              const temClassificacao = releaseDates?.some(
                (r) =>
                  r.iso_3166_1 === "BR" && r.release_dates?.[0]?.certification,
              );
              return (
                <div className={styles.infos}>
                  <Classificacao releaseDates={releaseDates} />
                  {detalhes.runtime > 0 && (
                    <>
                      {temClassificacao && (
                        <span className={styles.separador}>•</span>
                      )}
                      <span className={styles.infoTexto}>
                        {formatRuntime(detalhes.runtime)}
                      </span>
                    </>
                  )}
                  {detalhes.release_date && (
                    <>
                      <span className={styles.separador}>•</span>
                      <span className={styles.infoTexto}>
                        {detalhes.release_date.slice(0, 4)}
                      </span>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );

  const detalhesFooter = (
    <>
      {isMobile && nota?.nota > 0 && (
        <button
          className={styles.estrelasMobileBtn}
          onClick={handleAvaliar}
          type="button"
        >
          {[1, 2, 3, 4, 5].map((v) => (
            <StarRatingIcon key={v} size={22} filled={nota.nota >= v} />
          ))}
        </button>
      )}
      <div
        className={`${styles.footerBotoes} ${nota?.nota > 0 ? styles.footerBotoesAvaliado : ""}`}
      >
        {!isMobile && nota?.nota > 0 && (
          <button
            className={styles.estrelasDesktopBtn}
            onClick={handleAvaliar}
            type="button"
          >
            {[1, 2, 3, 4, 5].map((v) => (
              <div key={v} className={styles.boxEstrelas}>
                <StarRatingIcon size={22} filled={nota.nota >= v} />
              </div>
            ))}
          </button>
        )}

        {!(nota?.nota > 0) && (
          <Button
            variant="outline"
            label={isMobile ? undefined : "Já assisti"}
            icon={
              isMobile ? <StarRatingIcon size={20} color="white" /> : undefined
            }
            onClick={handleAvaliar}
            border="var(--stroke-solid)"
            arrowColor="var(--stroke-solid)"
            width={isMobile ? "64px" : "220px"}
          />
        )}

        <Button
          variant="solid"
          label="Ver detalhes"
          onClick={() => {
            router.push(`/filme-aleatorio?id=${filmeAtual.id}`);
            onClose();
          }}
          width={isMobile ? "100%" : "220px"}
        />
      </div>
    </>
  );

  // ── View 1: avaliação ──
  const avaliacaoContent = (
    <AvaliarFilmeContent
      key={filmeAtual?.id}
      ref={contentRef}
      filmeId={filmeAtual?.id}
      nota={nota}
      onAvaliacaoChange={() => setErroNota(false)}
    />
  );

  const avaliacaoFooter = (
    <>
      {erroNota && isMobile && (
        <span className={styles.erroNota}>
          Você precisa avaliar o filme para confirmar
        </span>
      )}
      <div className={styles.footerBotoes}>
        {erroNota && !isMobile && (
          <span className={styles.erroNota}>
            Você precisa avaliar o filme para confirmar
          </span>
        )}
        <Button
          variant="ghost"
          label={isMobile ? undefined : "Cancelar"}
          icon={
            isMobile ? (
              <ChevronDownIcon
                size={20}
                color="currentColor"
                style={{ transform: "rotate(90deg)" }}
              />
            ) : undefined
          }
          onClick={handleVoltar}
          width={isMobile ? "64px" : "220px"}
        />
        <Button
          variant="solid"
          label="Salvar avaliação"
          onClick={handleSalvar}
          width={isMobile ? "100%" : "220px"}
        />
      </div>
    </>
  );

  return (
    <ModalViews
      title={filmeAtual?.title}
      onClose={onClose}
      onBack={step === 1 ? handleVoltar : undefined}
      activeView={step}
      views={[
        { content: detalhesContent, footer: detalhesFooter },
        { content: avaliacaoContent, footer: avaliacaoFooter },
      ]}
    />
  );
}
