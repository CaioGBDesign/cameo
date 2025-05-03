import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import { auth } from "@/services/firebaseConection";
import styles from "./index.module.scss";
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
    <footer className={styles.ApresentacaoFooter}>
      <div className={styles.FooterCont}>
        <div className={styles.FooterInformacoes}>
          <div className={styles.TodosOsBotoes}>
            <div className={styles.SobreSocial}>
              <div className={styles.BotaoSobre}>
                <h3>Quem somos</h3>

                <Link href="/sobre">
                  <div className={styles.BotaoSobreBox}>
                    <span>Sobre a Cameo</span>
                    <img src="/icones/arrow.svg" alt="seta" />
                  </div>
                </Link>
              </div>
            </div>
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

          <div className={styles.TodosOsBotoes}>
            <div className={styles.SobreSocial}>
              <div className={styles.BotaoSobre}>
                <h3>Contato</h3>

                <div className={styles.Cta}>
                  <Link href="mailto:contato@cameo.fun">
                    <div className={styles.BotaoSobreBox}>
                      <span>Entrar em contato</span>
                      <img src="/icones/arrow.svg" alt="seta" />
                    </div>
                  </Link>

                  {!isLoggedIn && (
                    <Link href="/">
                      <button>Começar</button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.MascoteDeadpool}>
          <span>Você ainda está aqui?... Já acabou!!!</span>
          <img src="/icones/lp-deadpool.png" alt="Mascote Deadpool" />
        </div>
      </div>

      <div className={styles.FooterLogo}>
        <img src="/logo/cameo-logo-miniatura.svg" alt="Cameo logo" />
      </div>
    </footer>
  );
};

export default Footer;
