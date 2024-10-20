import styles from "./index.module.scss";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/contexts/auth";
import Header from "@/components/Header";
import BotaoSecundario from "@/components/botoes/secundarios";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConection";
import { getAuth, sendPasswordResetEmail } from "firebase/auth"; // Importação necessária
import Private from "@/components/Private";
import ModalRedefinirSenha from "@/components/modais/redefinir-senha";

const DadosPessoais = () => {
  const { user, storageUser, setUser, logout } = useContext(AuthContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalSentVisible, setModalSentVisible] = useState(false); // Modal de confirmação
  const [nome, setNome] = useState(user ? user.nome : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [handle, setHandle] = useState(user ? user.handle : "");
  const [genero, setGenero] = useState(user ? user.genero : "");
  const [estilo, setEstilo] = useState(user ? user.estilo : "");
  const [alteracoesPendentes, setAlteracoesPendentes] = useState(false);

  const selectGenero = [
    { value: "Mulher", label: "Mulher" },
    { value: "Homem", label: "Homem" },
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

  return (
    <Private>
      <div className={styles.dadosPessoais}>
        <Header />
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

            <BotaoSecundario
              textoBotaoSecundario={"Redefinir senha"}
              typeBsecundario={"button"}
              idBsecundario={"redefinirSenha"}
              onClick={handleRedefinirSenha}
            />
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
              <button type="button" onClick={logout}>
                Sair
                <img src="/icones/sair.svg" />
              </button>
            </div>
          </div>

          <div className={styles.baseSalvar}>
            <button type="submit">Salvar alterações</button>
          </div>
        </form>
        {isModalSentVisible && (
          <ModalRedefinirSenha onClose={() => setModalSentVisible(false)} />
        )}
      </div>
    </Private>
  );
};

export default DadosPessoais;
