import styles from "./index.module.scss";
import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "@/contexts/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConection";
import { getAuth, sendPasswordResetEmail } from "firebase/auth"; // Importação necessária
import { toast } from "react-toastify";
import FotoPrincipal from "@/components/perfil/fotoPrincipal";
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
  const [alteracoesPendentes, setAlteracoesPendentes] = useState(false);
  const modalRef = useRef(null); // Cria uma referência para o modal

  const selectGenero = [
    { value: "Feminino", label: "Feminino" },
    { value: "Masculino", label: "Masculino" },
    { value: "Não binário", label: "Não binário" },
    { value: "Outro", label: "Outro" },
    { value: "Prefiro não dizer", label: "Prefiro não dizer" },
  ];

  const estiloCinefilo = [
    { value: "PotterHead", label: "PotterHead" },
    { value: "MeioSangue", label: "Meio Sangue" },
    // Adicione outros estilos aqui
  ];

  const handleRedefinirSenha = async () => {
    const auth = getAuth();
    const actionCodeSettings = {
      url: "https://www.cameo.fun/redefinir-senha", // Substitua pela URL da sua página de redefinição de senha
      handleCodeInApp: true, // Isso é importante para garantir que o link seja tratado pela sua aplicação
    };

    try {
      await sendPasswordResetEmail(auth, email, actionCodeSettings);
      toast.success("E-mail de redefinição de senha enviado!");
      setModalSentVisible(true);
    } catch (error) {
      console.error("Erro ao enviar e-mail de redefinição:", error);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    console.log("Tentando atualizar:", { nome, genero, estilo });

    const updatedData = {};
    if (nome !== user.nome) updatedData.nome = nome;
    if (genero !== user.genero) updatedData.genero = genero;
    if (estilo !== user.estilo) updatedData.estilo = estilo;

    if (Object.keys(updatedData).length > 0) {
      const docRef = doc(db, "users", user.uid);
      try {
        await updateDoc(docRef, updatedData);

        let updatedUser = {
          ...user,
          ...updatedData,
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
    if (user) {
      setAlteracoesPendentes(
        nome !== user.nome || genero !== user.genero || estilo !== user.estilo
      );
    }
  }, [nome, genero, estilo, user]);

  // Função para fechar o modal se o clique for fora dele
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  // Adiciona o listener de evento ao montar e remove ao desmontar
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Recarrega a página
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
            <img src="/icones/fechar-filtros.svg" />
          </button>
        </div>
        <div className={styles.contModal}>
          <div className={styles.tituloFiltros}>
            <h2>Dados pessoais</h2>
          </div>

          <div className={styles.FotoNomeHandle}>
            <FotoPrincipal></FotoPrincipal>
            <div className={styles.NomeHandle}>
              <NomeUsuario></NomeUsuario>
              <Handle></Handle>
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
                      <img src="/icones/sair.svg" />
                    </button>
                  </div>

                  <div className={styles.redefinirSenha}>
                    <button
                      type={"button"}
                      id={"redefinirSenha"}
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
