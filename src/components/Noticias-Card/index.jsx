import styles from "./index.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";

const NoticiasCard = ({
  linkDadosPerfil,
  imagemPerfil = true,
  DadosdoPerfil,
}) => {
  const router = useRouter();

  return (
    <Link href={linkDadosPerfil} className={styles.linkDadosCameo}>
      <div className={styles.botaoPerfil}>
        {imagemPerfil && (
          <div className={styles.iconePerfil}>
            <img src={imagemPerfil} alt="Ícone do perfil" />
          </div>
        )}
        <div className={styles.dadosPerfil}>
          <p>{DadosdoPerfil}</p>
        </div>
      </div>
    </Link>
  );
};

export default NoticiasCard;
