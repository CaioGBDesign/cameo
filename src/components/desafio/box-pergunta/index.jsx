import DesafioButton from "@/components/desafio/button";
import styles from "./index.module.scss";

const GRADIENTS = [
  "radial-gradient(50% 50% at 50% 50%, rgba(243, 20, 251, 0.10) 0%, rgba(25, 20, 25, 0.10) 100%), var(--bg-overlay)",
  "radial-gradient(50% 50% at 50% 50%, rgba(254, 220, 51, 0.10) 0%, rgba(25, 20, 25, 0.10) 100%), var(--bg-overlay)",
  "radial-gradient(50% 50% at 50% 50%, rgba(26, 245, 235, 0.10) 0%, rgba(25, 20, 25, 0.10) 100%), var(--bg-overlay)",
];

export default function BoxPergunta({
  index = 0,
  titulo,
  descricao,
  imagemUrl,
  style,
  onJogar,
}) {
  return (
    <div
      className={styles.box}
      style={{ background: GRADIENTS[index % 3], ...style }}
    >
      <div className={styles.titulo}>
        <span>{titulo}</span>
      </div>

      <div className={styles.conteudo}>
        <div className={styles.capa}>
          {imagemUrl && (
            <img src={imagemUrl} alt={titulo} className={styles.capaImg} />
          )}
        </div>

        {descricao && (
          <div className={styles.descricao}>
            <p>{descricao}</p>
          </div>
        )}

        <DesafioButton
          variant="solid"
          label="Jogar agora"
          width="100%"
          onClick={onJogar}
        />
      </div>
    </div>
  );
}
