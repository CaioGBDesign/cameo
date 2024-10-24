import styles from "./index.module.scss";
import PosterDesktop from "@/components/poster-desktop";
import TitulosFilmes from "@/components/titulosfilmes";

const PosterInfoDesktop = ({
  capaAssistidos,
  tituloAssistidos,
  trailerLink,
  generofilme,
  duracao,
}) => {
  return (
    <div className={styles.InfoFilme}>
      <div className={styles.posterTrailer}>
        <PosterDesktop
          exibirPlay={trailerLink}
          capaAssistidos={capaAssistidos}
          tituloAssistidos={tituloAssistidos}
          trailerLink={trailerLink}
        />
      </div>
      <div className={styles.tituloGeneroAvaliacao}>
        <TitulosFilmes
          titulofilme={tituloAssistidos}
          generofilme={generofilme}
          duracaofilme={duracao}
        />
      </div>
    </div>
  );
};

export default PosterInfoDesktop;
