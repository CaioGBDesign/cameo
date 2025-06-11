import styles from "./index.module.scss";
import React from "react";
import Image from "next/image";

const fotoUsuarioDesktop = ({ avatarUrl, nomeUsuario, handleFile }) => {
  return (
    <div className={styles.fotoUsuario}>
      <div className={styles.fotoPerfil}>
        <label htmlFor="fotoUsuario">
          <div className={styles.iconEditar}>
            <img src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Feditar.svg?alt=media&token=d70d85da-fe9d-4df9-8276-0da123d876a1" />
          </div>
          <input
            type="file"
            id="fotoUsuario"
            accept="image/*"
            onChange={handleFile}
          />

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
        </label>
      </div>
    </div>
  );
};

export default fotoUsuarioDesktop;
