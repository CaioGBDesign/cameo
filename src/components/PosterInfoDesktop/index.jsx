import styles from "./index.module.scss";
import PosterDesktop from "@/components/poster-desktop";

const PosterInfoDesktop = ({
  capaAssistidos,
  tituloAssistidos,
  trailerLink,
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
    </div>
  );
};

export default PosterInfoDesktop;
