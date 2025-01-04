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
          <img src="/icones/close.svg" />
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
