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
            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fbanner-blank-slate-cameo.png?alt=media&token=8c439e86-c147-42c4-9952-c39767a99255"
            alt="Filmes já vistos"
          />
        ) : (
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fbanner-blank-slate-desktop-cameo.png?alt=media&token=dc21cf0c-2f56-4424-81ba-3a4a8d324684"
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
