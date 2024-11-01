import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebaseConection";
import styles from "./index.module.scss";
import BotaoBuscarDesktop from "@/components/botoes/buscar-desktop";
import Miniatura from "@/components/miniatura";
import FotoPerfil from "@/components/perfil/miniatura";
import MenuDesktop from "@/components/botoes/menu-desktop";

const Header = ({
  showBuscar = true,
  showMiniatura = true,
  showFotoPerfil = true,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Função para verificar se o usuário já está rolando para baixo no carregamento da página
    const checkInitialScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      }
    };

    // Adiciona um listener para verificar o scroll inicial quando a página carregar
    checkInitialScroll();
    window.addEventListener("scroll", checkInitialScroll);

    // Remove o listener quando o componente for desmontado
    return () => {
      window.removeEventListener("scroll", checkInitialScroll);
    };
  }, []);

  // Função para verificar o scroll ao longo do tempo
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setIsScrolled(scrollY > 0); // Define o estado isScrolled baseado na posição do scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // [] vazio assegura que o useEffect só será executado uma vez

  useEffect(() => {
    const checkLoginStatus = () => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsLoggedIn(!!user); // Atualiza o estado com base na presença do usuário
      });

      // Retorna a função de unsubscribe para limpar o listener quando o componente for desmontado
      return () => unsubscribe();
    };

    checkLoginStatus();
  }, []);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.headerContent}>
        <div>{showMiniatura && <Miniatura className={styles.miniatura} />}</div>
        {isLoggedIn && <MenuDesktop />}
        <div className={styles.buscadorEperfil}>
          {showBuscar && <BotaoBuscarDesktop className={styles.botaoBuscar} />}
          {showFotoPerfil && <FotoPerfil className={styles.fotoPerfil} />}
        </div>
      </div>
    </header>
  );
};

export default Header;
