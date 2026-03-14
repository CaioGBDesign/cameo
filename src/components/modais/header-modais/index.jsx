import styles from "./index.module.scss";
import { useIsMobile } from "@/components/DeviceProvider";
import CloseIcon from "@/components/icons/CloseIcon";

const HeaderModal = ({
  onClose,
  titulo,
  icone,
  iconeMobile,
  iconeNode,
  altIcone,
  showBotaoFechar = true,
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={styles.headerModal}>
      {showBotaoFechar && (
        <button onClick={onClose}>
          <CloseIcon size={20} />
        </button>
      )}

      <div className={styles.tituloModal}>
        <h2>{titulo}</h2>
        <div className={styles.imagemCapa}>
          {iconeNode ?? (isMobile ? (
            <img src={iconeMobile} alt={altIcone} />
          ) : (
            <img src={icone} alt={altIcone} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeaderModal;
