import styles from "./index.module.scss";
import { useContext, useRef } from "react";
import { AuthContext } from "@/contexts/auth";
import Image from "next/image";

const AvatarEdit = ({ onImageChange }) => {
  const { user } = useContext(AuthContext);
  const inputRef = useRef(null);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) onImageChange(file);
  };

  return (
    <div className={styles.avatar} onClick={handleClick}>
      {user?.avatarUrl ? (
        <Image unoptimized
          src={user.avatarUrl}
          alt={user.nome ?? "Usuário"}
          layout="fill"
          objectFit="cover"
          quality={80}
        />
      ) : (
        <div className={styles.placeholder} />
      )}

      <div className={styles.overlay}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Feditar.svg?alt=media"
          alt="Editar foto"
          className={styles.iconeEdicao}
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={styles.inputHidden}
        onChange={handleChange}
      />
    </div>
  );
};

export default AvatarEdit;