import styles from "./index.module.scss";
import Miniatura from "@/components/miniatura";
import Button from "@/components/button";
import InstagramIcon from "@/components/icons/InstagramIcon";
import TiktokIcon from "@/components/icons/TiktokIcon";
import YoutubeIcon from "@/components/icons/YoutubeIcon";
import { useAuth } from "@/contexts/auth";

const Footer = () => {
  const { user } = useAuth();
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.infoTopo}>
          <div className={styles.logo}>
            <Miniatura />
          </div>

          <div className={styles.mapaSite}>
            <div className={styles.quemSomos}>
              <h2>Quem somos</h2>
              <Button
                variant="outline"
                label={"Sobre a Cameo"}
                href={"/sobre"}
                border="var(--stroke-base)"
                arrowColor="var(--stroke-base)"
                width="220px"
              />
            </div>
            <div className={styles.contato}>
              <h2>Contato</h2>
              <Button
                variant="outline"
                label={"Entrar em contato"}
                href={"mailto:contato@cameo.fun"}
                border="var(--stroke-base)"
                arrowColor="var(--stroke-base)"
                width="220px"
              />
            </div>
            {!user && (
              <div className={styles.comecar}>
                <Button
                  variant="outline"
                  label={"Começar"}
                  href={"/login"}
                  border="var(--stroke-solid)"
                  arrowColor="var(--stroke-solid)"
                  width="220px"
                />
              </div>
            )}
          </div>

          <div className={styles.redes}>
            <a
              href="https://www.instagram.com/cameo.fun"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.tiktok.com/@cameo.fun"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TiktokIcon />
            </a>
            <a
              href="https://www.youtube.com/@cameo_fun"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YoutubeIcon />
            </a>
          </div>
        </div>

        <div className={styles.separador}></div>

        <div className={styles.copy}>
          <p>
            © COPYRIGHT 2026 - , <span>cameo.fun.</span> todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
