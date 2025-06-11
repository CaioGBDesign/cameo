import styles from "./index.module.scss";
import { useIsMobile } from "@/components/DeviceProvider";

const HeaderModal = ({
  onClose,
  titulo,
  icone,
  iconeMobile,
  altIcone,
  showBotaoFechar = true,
}) => {
  // define se desktop ou mobile
  const isMobile = useIsMobile();

  return (
    <div className={styles.headerModal}>
      {showBotaoFechar && (
        <button onClick={onClose}>
          <img src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fclose.svg?alt=media&token=c9af99dc-797e-4364-9df2-5ed76897cc92" />
        </button>
      )}

      <div className={styles.tituloModal}>
        <h2>{titulo}</h2>
        <div className={styles.imagemCapa}>
          {isMobile ? (
            <img src={iconeMobile} alt={altIcone} />
          ) : (
            <img src={icone} alt={altIcone} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HeaderModal;
