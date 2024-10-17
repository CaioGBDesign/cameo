import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";
import Image from "next/image";

const Miniaturafilmes = ({
  capaminiatura,
  titulofilme,
  mostrarEstrelas = true,
  avaliacao = 0, // Adicione a avaliação como prop
  onClick, // Adicione a prop onClick
}) => {
  return (
    <div className={styles.miniaturafilmes} onClick={onClick}>
      <div className={styles.boxminiatura}>
        <div className={styles.capaminiatura}>
          <div className={styles.imageContainer}>
            <Image
              src={capaminiatura}
              alt={titulofilme}
              layout="fill"
              objectFit="cover"
              quality={50}
            />
          </div>
        </div>
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
