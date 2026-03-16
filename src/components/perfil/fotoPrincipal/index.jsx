import styles from "./index.module.scss";
import { useAuth } from "@/contexts/auth";
import Image from "next/image";
import EditIcon from "@/components/icons/EditIcon";

const FotoPrincipal = ({ onClickEdit }) => {
  const { user } = useAuth();

  const avatarSrc = user?.avatarUrl || "/usuario/usuario.jpg";
  const nomeUsuario = user?.nome ?? "Usuário";

  return (
    <div className={styles.fotoUsuario}>
      <div onClick={onClickEdit} className={styles.fotoPerfil}>
        <div className={styles.iconEditar}>
          <EditIcon size={14} color="#250d2f" />
        </div>
        <div className={styles.foto}>
          <Image
            unoptimized
            src={avatarSrc}
            alt={nomeUsuario}
            fill
            style={{ objectFit: "cover" }}
            quality={50}
          />
        </div>
      </div>
    </div>
  );
};

export default FotoPrincipal;
