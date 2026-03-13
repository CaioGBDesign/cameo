import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./index.module.scss";
import { useIsMobile } from "@/components/DeviceProvider";
import PlayIcon from "@/components/icons/PlayIcon";
import Badge from "@/components/badge";
import Classificacao from "@/components/detalhesfilmes/classificacao";

export default function TitulosFilmesDesktop({
  filme,
  trailerLink,
  releaseDates,
}) {
  // Renderiza cada gênero em sua própria div
  const renderGeneros = () => {
    if (!Array.isArray(filme.genres) || filme.genres.length === 0) {
      return <Badge variant="genero" label="--" />;
    }
    return filme.genres.map((g) => (
      <Badge key={g.id} variant="genero" label={g.name} />
    ));
  };

  const isMobile = useIsMobile();

  // Extrai data de lançamento (priorizando Brasil 'BR')
  const getReleaseYear = () => {
    if (!Array.isArray(releaseDates) || releaseDates.length === 0) return "--";
    // procura país BR ou usa primeiro disponível
    const country =
      releaseDates.find((r) => r.iso_3166_1 === "BR") || releaseDates[0];
    const dateEntry = country.release_dates && country.release_dates[0];
    if (!dateEntry || !dateEntry.release_date) return "--";
    // formata para pt-BR
    try {
      return new Date(dateEntry.release_date).getFullYear().toString();
    } catch {
      return dateEntry.release_date.slice(0, 4);
    }
  };

  const dataLancamento = getReleaseYear();

  // Formata duração em minutos para "Xh Ym"
  const formatRuntime = (minutes) => {
    if (typeof minutes !== "number") return "--";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const duracao = formatRuntime(filme.runtime);

  return (
    <div className={styles.detalhesFilmes}>
      <div className={styles.topoFilmes}>
        {!isMobile && (
          <div className={styles.posterTrailer}>
            {trailerLink && (
              <div className={styles.botaoTrailer}>
                <div className={styles.play}>
                  <Link href={trailerLink} target="_blank" rel="noopener noreferrer">
                    <PlayIcon size={24} color="#fff" />
                  </Link>
                </div>
              </div>
            )}
            {filme.backdrop_path && (
              <div className={styles.posterFilme}>
                <Image
                  src={`https://image.tmdb.org/t/p/w780/${filme.backdrop_path}`}
                  alt={filme.title}
                  width={780}
                  height={440}
                  className={styles.imagem}
                  loading="lazy"
                />
              </div>
            )}
          </div>
        )}

        <div className={styles.detalhesTopo}>
          <div className={styles.tituloFilmes}>
            <h1>{filme.title}</h1>
          </div>

          <div className={styles.classificacaoGenero}>
            <div className={styles.generosList}>{renderGeneros()}</div>

            <div className={styles.lancamentoDuracao}>
              <Classificacao releaseDates={releaseDates} />
              <div className={styles.duracaoFilme}>{duracao}</div>
              {isMobile && (
                <>
                  <span className={styles.separador}>•</span>
                  <div className={styles.dataLancamento}>{dataLancamento}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
