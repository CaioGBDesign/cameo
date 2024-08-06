import styles from "./index.module.scss";
import { AuthContext } from "@/contexts/auth";
import React, { useContext, useState } from "react";

const fotoUsuario = ({ onClickModal }) => {
  const { user, storageUser, setUser } = useContext(AuthContext);

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);

  return (
    <div className={styles.fotoUsuario}>
      <div onClick={onClickModal} className={styles.fotoPerfil}>
        <div className={styles.iconEditar}>
          <img src="/icones/editar.svg" />
        </div>

        <div className={styles.avatarIMG}>
          {avatarUrl === null ? (
            <img src="/usuario/usuario.jpg" alt="Foto de perfil" />
          ) : (
            <img src={avatarUrl} alt="Foto de perfil" />
          )}
        </div>
      </div>
    </div>
  );
};

export default fotoUsuario;
