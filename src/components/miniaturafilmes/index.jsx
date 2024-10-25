import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";
import { useIsMobile } from "@/components/DeviceProvider";
import Image from "next/image";

const Miniaturafilmes = ({
  capaminiatura,
  titulofilme,
  mostrarEstrelas = true,
  avaliacao = 0, // Adicione a avaliação como prop
  onClick, // Adicione a prop onClick
}) => {
  // define se desktop ou mobile
  const isMobile = useIsMobile();

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
              sizes={isMobile ? "100vw" : "50vw"}
            />
          </div>
        </div>
      </div>
      {isMobile
        ? mostrarEstrelas && (
            <div className={styles.tamanhoestrelas}>
              <Estrelas estrelas={avaliacao} starWidth={"10px"} />
            </div>
          )
        : mostrarEstrelas && (
            <div className={styles.tamanhoestrelas}>
              <Estrelas estrelas={avaliacao} starWidth={"20px"} />
            </div>
          )}
    </div>
  );
};

export default Miniaturafilmes;
