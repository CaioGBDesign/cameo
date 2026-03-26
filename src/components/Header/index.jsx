import { useState } from "react";
import styles from "./index.module.scss";
import Miniatura from "@/components/miniatura";
import AvatarSm from "@/components/avatar/sm";
import { useIsMobile } from "@/components/DeviceProvider";
import Menu02Icon from "@/components/icons/Menu02Icon";
import BotaoBuscarDesktop from "@/components/botoes/buscar-desktop";
import MenuDesktop from "@/components/botoes/menu-desktop";
import MenuMobile from "@/components/modais/menu-mobile";

const Header = ({
  showMiniatura = true,
  showMenu = true,
  showBuscar = true,
  showFotoPerfil = true,
}) => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {isMobile ? (
            <>
              <div className={styles.col}>
                {showMenu && (
                  <button
                    className={styles.menuBtn}
                    onClick={() => setMenuOpen(true)}
                  >
                    <Menu02Icon size={24} color="currentColor" />
                  </button>
                )}
              </div>
              <div className={styles.col}>{showMiniatura && <Miniatura />}</div>
              <div className={styles.col}>{showFotoPerfil && <AvatarSm />}</div>
            </>
          ) : (
            <>
              <div>{showMiniatura && <Miniatura />}</div>
              {showMenu && <MenuDesktop />}
              <div className={styles.buscadorEperfil}>
                {showBuscar && <BotaoBuscarDesktop />}
                {showFotoPerfil && <AvatarSm />}
              </div>
            </>
          )}
        </div>
      </header>

      <MenuMobile open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Header;
