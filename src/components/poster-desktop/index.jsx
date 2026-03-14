import styles from "./index.module.scss";
import Image from "next/image";
import BotaoPlay from "@/components/botoes/play";

const PosterDesktop = ({
  exibirPlay = true,
  capaAssistidos,
  tituloAssistidos,
  trailerLink,
}) => {
  return (
    <div className={styles.contPoster}>
      {exibirPlay && trailerLink && (
        <div className={styles.play}>
          <BotaoPlay linkTrailer={trailerLink}></BotaoPlay>
        </div>
      )}

      <div className={styles.posterAssistidos}>
        <div className={styles.imageContainer}>
          <Image unoptimized
            src={capaAssistidos}
            alt={tituloAssistidos}
            fill
            quality={50} // Ajuste a qualidade se necessário
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.objectFit}
          />
        </div>
      </div>
    </div>
  );
};

export default PosterDesktop;
