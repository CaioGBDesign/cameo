import styles from "./index.module.scss";
import { AuthContext } from "@/contexts/auth";
import React, { useContext, useState } from "react";
import Image from "next/image";

const fotoUsuario = ({ onClickModal }) => {
  const { user, storageUser, setUser } = useContext(AuthContext);

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const nomeUsuario = user && user.nome ? user.nome : "Nome de Usuário";

  return (
    <div className={styles.fotoUsuario}>
      <div onClick={onClickModal} className={styles.fotoPerfil}>
        <div className={styles.iconEditar}>
          <img src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Feditar.svg?alt=media&token=d70d85da-fe9d-4df9-8276-0da123d876a1" />
        </div>

        <div className={styles.avatarIMG}>
          {avatarUrl === null ? (
            <div className={styles.foto}>
              <Image
                src="/usuario/usuario.jpg"
                alt="Foto de perfil"
                layout="fill" // Usa o layout fill
                objectFit="cover" // Ajusta a imagem para cobrir o contêiner
                quality={50} // Ajuste a qualidade se necessário
              />
            </div>
          ) : (
            <div className={styles.foto}>
              <Image
                src={avatarUrl}
                alt={nomeUsuario}
                layout="fill" // Usa o layout fill
                objectFit="cover" // Ajusta a imagem para cobrir o contêiner
                quality={50} // Ajuste a qualidade se necessário
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default fotoUsuario;
