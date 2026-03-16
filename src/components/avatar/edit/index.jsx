import styles from "./index.module.scss";
import { useContext, useRef } from "react";
import { AuthContext } from "@/contexts/auth";
import Image from "next/image";
import EditIcon from "@/components/icons/EditIcon";

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
        <div className={styles.borderImage}>
          <div className={styles.contentImage}>
            <Image
              unoptimized
              src={user.avatarUrl}
              alt={user.nome ?? "Usuário"}
              fill
              style={{ objectFit: "cover" }}
              quality={80}
            />
          </div>
        </div>
      ) : (
        <div className={styles.placeholder} />
      )}

      <div className={styles.overlay}>
        <EditIcon size={16} color="white" />
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
