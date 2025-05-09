import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import styles from "./index.module.scss";

// Lazy-load play button and classification
const BotaoPlay = dynamic(() => import("@/components/botoes/play"), {
  ssr: false,
});
const Classificacao = dynamic(
  () => import("@/components/detalhesfilmes/classificacao"),
  { ssr: false }
);

export default function TitulosFilmes({ filme, trailerLink, releaseDates }) {
  // Renderiza cada gênero em sua própria div
  const renderGeneros = () => {
    if (!Array.isArray(filme.genres) || filme.genres.length === 0) {
      return <div className={styles.genero}>--</div>;
    }
    return filme.genres.map((g) => (
      <div key={g.id} className={styles.genero}>
        {g.name}
      </div>
    ));
  };

  // Extrai data de lançamento (priorizando Brasil 'BR')
  const getReleaseDate = () => {
    if (!Array.isArray(releaseDates) || releaseDates.length === 0) return "--";
    // procura país BR ou usa primeiro disponível
    const country =
      releaseDates.find((r) => r.iso_3166_1 === "BR") || releaseDates[0];
    const dateEntry = country.release_dates && country.release_dates[0];
    if (!dateEntry || !dateEntry.release_date) return "--";
    // formata para pt-BR
    try {
      return new Date(dateEntry.release_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateEntry.release_date;
    }
  };

  const dataLancamento = getReleaseDate();

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
        <div className={styles.posterTrailer}>
          {trailerLink && (
            <div className={styles.botaoTrailer}>
              <BotaoPlay linkTrailer={trailerLink} />
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
                priority
              />
            </div>
          )}
        </div>
        <div className={styles.detalhesTopo}>
          <div className={styles.tituloFilmes}>
            <h1>{filme.title}</h1>
          </div>

          <div className={styles.classificacaoGenero}>
            {/* Classificação indicativa */}
            <Classificacao releaseDates={releaseDates} />
            {/* Exibição dos gêneros em divs separadas */}
            <div className={styles.generosList}>{renderGeneros()}</div>

            {/* Data de lançamento */}
            <div className={styles.dataLancamento}>{dataLancamento}</div>
            <span>•</span>

            {/* Duração do filme */}
            <div className={styles.duracaoFilme}>{duracao}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
