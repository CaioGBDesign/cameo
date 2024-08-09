import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";

const Miniaturafilmes = ({
  capaminiatura,
  titulofilme,
  mostrarEstrelas = true,
  botaoFechar = true,
  excluirFilme,
  mostrarBotaoFechar,
  avaliacao = 0, // Adicione a avaliação como prop
}) => {
  return (
    <div className={styles.miniaturafilmes}>
      <div className={styles.boxminiatura}>
        <div className={styles.capaminiatura}>
          <img src={capaminiatura} alt={titulofilme} />
        </div>
        {botaoFechar && (
          <button
            onClick={excluirFilme}
            className={mostrarBotaoFechar ? styles.show : ""}
          >
            <img src="/icones/close.svg" />
          </button>
        )}
      </div>

      {mostrarEstrelas && (
        <div className={styles.tamanhoestrelas}>
          <Estrelas estrelas={avaliacao} starWidth={"10px"} />{" "}
          {/* Passa a avaliação como prop */}
        </div>
      )}
    </div>
  );
};

export default Miniaturafilmes;
