import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import { auth } from "@/services/firebaseConection";
import styles from "./index.module.scss";
import Link from "next/link";
import Image from "next/image";

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
                    <Image
                      src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Farrow.svg?alt=media&token=0ea58b26-50c2-4ba7-b125-4a07e26f5926"
                      alt="seta apontando para a direita"
                      width={24}
                      height={24}
                      priority={false}
                    />
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
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Finstagram.svg?alt=media&token=f7cec9d2-fcc7-4fc1-971d-f3b3235ec12f"
                  alt="Instagram"
                  width={24}
                  height={24}
                  priority={false}
                />
              </a>
              <a
                href="https://www.tiktok.com/@cameo.fun"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Ftiktok.svg?alt=media&token=438263b9-26ef-4628-bdbe-635b26e41122"
                  alt="TikTok"
                  width={24}
                  height={24}
                  priority={false}
                />
              </a>
              <a
                href="https://www.youtube.com/@cameo_fun"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fyoutube.svg?alt=media&token=f18edca3-ab54-4387-a388-d13fe22f87fc"
                  alt="YouTube"
                  width={24}
                  height={24}
                  priority={false}
                />
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
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Farrow.svg?alt=media&token=0ea58b26-50c2-4ba7-b125-4a07e26f5926"
                        alt="seta"
                      />
                    </div>
                  </Link>

                  {!isLoggedIn && (
                    <Link href="/filme-aleatorio">
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
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-deadpool.png?alt=media&token=1c720245-b49e-4346-9ce1-f1135a1e7446"
            alt="Mascote Deadpool"
            width={150}
            height={185}
            priority={false}
          />
        </div>
      </div>

      <div className={styles.FooterLogo}>
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/logo%2Fcameo-logo-miniatura.svg?alt=media&token=bb482344-e73f-4cee-ac6f-97a1c003b6e7"
          alt="Cameo logo"
          width={150}
          height={55}
          priority={false}
        />
      </div>
    </footer>
  );
};

export default Footer;
