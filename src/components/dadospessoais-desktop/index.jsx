import styles from "./index.module.scss";
import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "@/contexts/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/services/firebaseConection";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import FotoPrincipalDesktop from "@/components/perfil/fotoPrincipal";
import NomeUsuario from "@/components/perfil/nomeUsuario";
import Handle from "@/components/perfil/handle";
import Private from "@/components/Private";

const DadosPessoaisModalDesktop = ({ closeModal, isClosing }) => {
  const { user, storageUser, setUser, logout } = useContext(AuthContext);
  const [nome, setNome] = useState(user ? user.nome : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [handle, setHandle] = useState(user ? user.handle : "");
  const [genero, setGenero] = useState(user ? user.genero : "");
  const [estilo, setEstilo] = useState(user ? user.estilo : "");
  const [avatarUrl, setAvatarUrl] = useState(user ? user.avatarUrl : ""); // URL da foto
  const [imageAvatar, setImageAvatar] = useState(null); // Estado para o arquivo da imagem
  const [alteracoesPendentes, setAlteracoesPendentes] = useState(false);
  const modalRef = useRef(null);

  const selectGenero = [
    { value: "Feminino", label: "Feminino" },
    { value: "Masculino", label: "Masculino" },
    { value: "Não binário", label: "Não binário" },
    { value: "Outro", label: "Outro" },
    { value: "Prefiro não dizer", label: "Prefiro não dizer" },
  ];

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

  const handleRedefinirSenha = async () => {
    const auth = getAuth();
    const actionCodeSettings = {
      url: "https://www.cameo.fun/redefinir-senha",
      handleCodeInApp: true,
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      toast.success("E-mail de redefinição de senha enviado!");
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição:", error);
    }
  };

  const handleUpload = async () => {
    if (imageAvatar) {
      const currentUid = user.uid;
      const uploadRef = ref(
        storage,
        `images/${currentUid}/${imageAvatar.name}`
      );

      try {
        const snapshot = await uploadBytes(uploadRef, imageAvatar);
        const downLoadURL = await getDownloadURL(snapshot.ref);
        return downLoadURL;
      } catch (error) {
        console.error("Erro ao enviar imagem para o Firebase:", error);
        throw error;
      }
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const updatedData = {};

    if (nome !== user.nome) updatedData.nome = nome;
    if (genero !== user.genero) updatedData.genero = genero;
    if (estilo !== user.estilo) updatedData.estilo = estilo;

    if (Object.keys(updatedData).length > 0 || imageAvatar) {
      const docRef = doc(db, "users", user.uid);
      try {
        if (imageAvatar) {
          const downLoadURL = await handleUpload();
          updatedData.avatarUrl = downLoadURL;
        }

        await updateDoc(docRef, updatedData);
        const updatedUser = {
          ...user,
          ...updatedData,
          avatarUrl: updatedData.avatarUrl || user.avatarUrl,
        };

        setUser(updatedUser);
        storageUser(updatedUser);
        setAlteracoesPendentes(false);
        console.log("Dados atualizados com sucesso.");
      } catch (error) {
        console.error("Erro ao atualizar dados:", error);
      }
    } else {
      console.log("Nenhuma alteração detectada.");
    }
  }

  useEffect(() => {
    setAlteracoesPendentes(
      nome !== user.nome ||
        genero !== user.genero ||
        estilo !== user.estilo ||
        avatarUrl !== user.avatarUrl
    );
  }, [nome, genero, estilo, avatarUrl, user]);

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <Private>
      <div
        className={`${styles.modal} ${isClosing ? styles.close : ""}`}
        ref={modalRef}
      >
        <div className={styles.fecharDesktop}>
          <button onClick={closeModal}>
            <img src="/icones/fechar-filtros.svg" alt="Fechar" />
          </button>
        </div>
        <div className={styles.contModal}>
          <div className={styles.tituloFiltros}>
            <h2>Dados pessoais</h2>
          </div>

          <div className={styles.FotoNomeHandle}>
            <FotoPrincipalDesktop
              foto={avatarUrl}
              onClick={() => document.getElementById("fileInput").click()}
            />

            <input
              type="file"
              id="fileInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFile}
            />
            <div className={styles.NomeHandle}>
              <NomeUsuario />
              <Handle />
            </div>
          </div>

          <div className={styles.contInfos}>
            <div className={styles.separador}>
              <form onSubmit={handleSubmit}>
                <div className={styles.formDadosPessoais}>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome"
                  />

                  <div className={styles.inputDisable}>
                    <p>{handle}</p>
                  </div>

                  <div className={styles.inputDisable}>
                    <p>{email}</p>
                  </div>
                  <select
                    id="selectGenero"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                  >
                    <option value="">Gênero</option>
                    {selectGenero.map((item, index) => (
                      <option key={`${item.value}-${index}`} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>

                  <div className={styles.sair}>
                    <button type="button" onClick={handleLogout}>
                      Sair
                      <img src="/icones/sair.svg" alt="Sair" />
                    </button>
                  </div>

                  <div className={styles.redefinirSenha}>
                    <button
                      type="button"
                      id="redefinirSenha"
                      onClick={handleRedefinirSenha}
                    >
                      Redefinir senha
                    </button>
                  </div>
                </div>

                <div className={styles.baseSalvar}>
                  <button type="submit">Salvar alterações</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Private>
  );
};

export default DadosPessoaisModalDesktop;
