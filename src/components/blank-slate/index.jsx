import styles from "./index.module.scss";
import { useIsMobile } from "@/components/DeviceProvider";
import Link from "next/link";

export default function BlankSlate() {
  const isMobile = useIsMobile();

  return (
    <div className={styles.blankSlate}>
      <div className={styles.banner}>
        {isMobile ? (
          <img
            src="background/banner-blank-slate-cameo.png"
            alt="Filmes já vistos"
          />
        ) : (
          <img
            src="background/banner-blank-slate-desktop-cameo.png"
            alt="Filmes já vistos"
          />
        )}
      </div>
      <div className={styles.alertaBlankSlate}>
        <span>Você ainda não tem filmes avaliados.</span>
      </div>
      <div className={styles.botaoHome}>
        <Link href={"/filme-aleatorio"}>
          <p>Adicionar filmes</p>
        </Link>
      </div>
    </div>
  );
}
