import React, { useContext, useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/services/firebaseConection";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AuthContext } from "@/contexts/auth";
import styles from "./index.module.scss";

const SalvarFoto = ({ onClose }) => {
  const { user, storageUser, setUser } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [closing, setClosing] = useState(false);

  const closeModal = () => {
    setClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleFile = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      if (image.type === "image/jpeg" || image.type === "image/png") {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        setImageAvatar(null);
      }
    }
  };

  const handleUpload = async () => {
    const currentUid = user.uid;
    const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`);

    try {
      const snapshot = await uploadBytes(uploadRef, imageAvatar);
      const downLoadURL = await getDownloadURL(snapshot.ref);

      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { avatarUrl: downLoadURL });

      const updatedUser = { ...user, avatarUrl: downLoadURL };
      setUser(updatedUser);
      storageUser(updatedUser);
    } catch (error) {
      console.error("Erro ao enviar imagem para o Firebase:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageAvatar !== null) {
      await handleUpload();
      closeModal();
    }
  };

  return (
    <div className={styles.modalFoto}>
      <form onSubmit={handleSubmit}>
        <div
          className={`${styles.contModalFoto} ${closing ? styles.closing : ""}`}
        >
          <div className={styles.topoModal}>
            <span>Alterar foto</span>
            <button onClick={closeModal}>
              <img src="/icones/close.svg" alt="Fechar" />
            </button>
          </div>
          <div className={styles.modalFotoPerfil}>
            <div className={styles.avatarIMG}>
              {avatarUrl === null ? (
                <img src="/usuario/usuario.jpg" alt="Foto de perfil" />
              ) : (
                <img src={avatarUrl} alt="Foto de perfil" />
              )}
            </div>
          </div>
          <div className={styles.enviarFoto}>
            <span>Ver foto de perfil</span>
          </div>
          <div className={styles.enviarFoto}>
            <label htmlFor="avatar">
              <span>Alterar foto</span>
            </label>
          </div>
          <button type="submit">Salvar foto</button>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleFile}
          />
        </div>
      </form>
    </div>
  );
};

export default SalvarFoto;
