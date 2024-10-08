import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";
import Image from "next/image";

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
          <div className={styles.imageContainer}>
            <Image
              src={capaminiatura}
              alt={titulofilme}
              layout="fill" // Usa o layout fill
              objectFit="cover" // Ajusta a imagem para cobrir o contêiner
              quality={50} // Ajuste a qualidade se necessário
            />
          </div>
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
