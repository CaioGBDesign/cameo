import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import { auth } from "@/services/firebaseConection";
import styles from "./index.module.scss";
import Miniatura from "@/components/miniatura";
import Link from "next/link";

const Footer = ({ style }) => {
  const isMobile = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
    <footer className={styles.footer} style={style}>
      <div className={styles.container}>
        <div className={styles.topoFooter}>
          {isMobile ? (
            <div className={styles.logoSection}>
              <Miniatura className={styles.miniatura} />
            </div>
          ) : null}

          <div className={styles.socialMedia}>
            <a
              href="https://www.instagram.com/cameo.fun"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icones/instagram.svg" alt="Instagram" />
            </a>
            <a
              href="https://www.tiktok.com/@cameo.fun"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icones/tiktok.svg" alt="TikTok" />
            </a>
            <a
              href="https://www.youtube.com/@cameo_fun"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/icones/youtube.svg" alt="YouTube" />
            </a>
          </div>
        </div>

        <nav
          aria-label="Links de navegação do rodapé"
          className={styles.navLinks}
        >
          <div className={styles.quemSomos}>
            {isMobile ? <h3>Quem somos</h3> : null}

            <ul>
              <li>
                <Link href="/sobre">Sobre a Cameo</Link>
              </li>
              <li>
                <Link href="mailto:contato@cameo.fun">Contato</Link>
              </li>
            </ul>
          </div>

          {isLoggedIn && !isMobile && <hr />}

          {isLoggedIn && (
            <div className={styles.encontre}>
              {isMobile ? <h3>Encontre</h3> : null}

              <ul>
                <li>
                  <Link href="/filmesassisti">Filmes que Assisti</Link>
                </li>
                <li>
                  <Link href="/filmesparaver">Filmes para Ver</Link>
                </li>
                <li>
                  <Link href="/favoritos">Meus Favoritos</Link>
                </li>
              </ul>
            </div>
          )}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
