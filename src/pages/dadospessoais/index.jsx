import styles from "./index.module.scss";
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/contexts/auth";
import Header from "@/components/Header";
import BotaoSecundario from "@/components/botoes/secundarios";
import BaseBotoes from "@/components/botoes/base";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/services/firebaseConection";
import Private from "@/components/Private";

const DadosPessoais = () => {
  const { user, storageUser, setUser, logout } = useContext(AuthContext);

  const [nome, setNome] = useState(user ? user.nome : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [handle, setHandle] = useState(user ? user.handle : "");
  const [genero, setGenero] = useState(user ? user.genero : "");
  const [estilo, setEstilo] = useState(user ? user.estilo : "");
  const [alteracoesPendentes, setAlteracoesPendentes] = useState(false);

  const selectGenero = [
    { value: "genero", label: "Mulher" },
    { value: "genero", label: "Homem" },
    { value: "genero", label: "Não binário" },
    { value: "genero", label: "Outro" },
    { value: "genero", label: "Prefiro não dizer" },
  ];

  const estiloCinefilo = [
    { value: "PotterHead", label: "PotterHead" },
    { value: "MeioSangue", label: "Meio Sangue" },
    { value: "Tolkienianos", label: "Tolkienianos" },
    { value: "GeekStarWars", label: "Geek de Star Wars" },
    { value: "Trekker", label: "Trekker" },
    { value: "Thronie", label: "Thronie" },
    { value: "Sherlockiano", label: "Sherlockiano" },
    { value: "Caçador", label: "Caçador" },
    { value: "Marvelita", label: "Marvelita" },
    { value: "FaDC", label: "Fã da DC" },
    { value: "Twihard", label: "Twihard" },
    { value: "Tributo", label: "Tributo" },
    { value: "Walker", label: "Walker" },
  ];

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      nome !== user.nome ||
      handle !== user.handle ||
      genero !== user.genero ||
      estilo !== user.estilo
    ) {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        nome: nome,
        handle: handle,
        genero: genero,
        estilo: estilo,
      })
        .then(() => {
          let updatedUser = {
            ...user,
            nome: nome,
            handle: handle,
            genero: genero,
            estilo: estilo,
          };

          setUser(updatedUser);
          storageUser(updatedUser);
          setAlteracoesPendentes(false); // Resetando para desabilitar o botão
        })
        .catch((error) => {
          console.error("Erro ao atualizar dados:", error);
        });
    }
  }

  // Efeito para verificar alterações pendentes
  useEffect(() => {
    if (user) {
      if (
        nome !== user.nome ||
        handle !== user.handle ||
        genero !== user.genero ||
        estilo !== user.estilo
      ) {
        setAlteracoesPendentes(true);
      } else {
        setAlteracoesPendentes(false);
      }
    }
  }, [nome, handle, genero, estilo, user]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (nome !== "" && handle !== "" && genero !== "" && estilo !== "") {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        nome: nome,
        handle: handle,
        genero: genero,
        estilo: estilo,
      })
        .then(() => {
          let updatedUser = {
            ...user,
            nome: nome,
            handle: handle,
            genero: genero,
            estilo: estilo,
          };

          setUser(updatedUser);
          storageUser(updatedUser);
          setAlteracoesPendentes(false); // Resetando para desabilitar o botão
        })
        .catch((error) => {
          console.error("Erro ao atualizar dados:", error);
        });
    }
  }

  return (
    <Private>
      <div className={styles.dadosPessoais}>
        {/* Header */}
        <Header />

        <form onSubmit={handleSubmit}>
          <div className={styles.formDadosPessoais}>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
            />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
            <BotaoSecundario
              textoBotaoSecundario={"Redefinir senha"}
              typeBsecundario={"submit"}
              idBsecundario={"redefinirSenha"}
            />

            <select
              id="selectGenero"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
            >
              <option value="">Qual opção melhor descreve você?</option>
              {selectGenero.map((item, index) => (
                <option key={`${item.value}-${index}`} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>

            {/*<select
            id="selectEstilo"
            value={estilo}
            onChange={(e) => setEstilo(e.target.value)}
          >
            <option value="">Estilo cinéfilo</option>
            {estiloCinefilo.map((item, index) => (
              <option key={`${item.value}-${index}`} value={item.label}>
                {item.label}
              </option>
            ))}
          </select>*/}

            <div className={styles.sair}>
              <button onClick={() => logout()}>
                Sair
                <img src="/icones/sair.svg" />
              </button>
            </div>
          </div>

          <div className={styles.baseSalvar}>
            <button type="submit" disabled={!alteracoesPendentes}>
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </Private>
  );
};

export default DadosPessoais;
