import styles from "./index.module.scss";
import BotaoPlay from "@/components/botoes/play";

const FundoTitulos = ({
  exibirPlay = true,
  capaAssistidos,
  tituloAssistidos,
}) => {
  return (
    <div className={styles.contCapa}>
      {exibirPlay && (
        <div className={styles.play}>
          <BotaoPlay linkTrailer={"#"}></BotaoPlay>
        </div>
      )}

      <div className={styles.capaAssistidos}>
        <img src={capaAssistidos} alt={tituloAssistidos} />
      </div>
    </div>
  );
};

export default FundoTitulos;
