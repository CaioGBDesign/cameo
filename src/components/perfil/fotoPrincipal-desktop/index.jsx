import styles from "./index.module.scss";
import { AuthContext } from "@/contexts/auth";
import React, { useContext } from "react";
import Image from "next/image";

const FotoPrincipalDesktop = ({ foto, onClick }) => {
  const { user } = useContext(AuthContext);
  const nomeUsuario = user && user.nome ? user.nome : "Nome de Usuário";

  return (
    <div className={styles.fotoUsuario}>
      <div onClick={onClick} className={styles.fotoPerfil}>
        <div className={styles.iconEditar}>
          <img src="/icones/editar.svg" alt="Editar" />
        </div>

        <div className={styles.avatarIMG}>
          <div className={styles.foto}>
            <Image
              src={foto || "/usuario/usuario.jpg"} // Usa a foto fornecida ou uma padrão
              alt={nomeUsuario}
              layout="fill" // Usa o layout fill
              objectFit="cover" // Ajusta a imagem para cobrir o contêiner
              quality={50} // Ajuste a qualidade se necessário
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FotoPrincipalDesktop;
