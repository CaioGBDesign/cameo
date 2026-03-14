import styles from "./index.module.scss";
import { useContext } from "react";
import { AuthContext } from "@/contexts/auth";
import Image from "next/image";

const AvatarLg = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className={styles.avatar}>
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
    </div>
  );
};

export default AvatarLg;