import { useState, createContext, useEffect, useContext } from "react";
import { auth, db } from "@/services/firebaseConection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import {
  updateDoc,
  doc,
  arrayRemove,
  arrayUnion,
  getDoc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { useRouter } from "next/router";
import ModalConfirmacaoCadastro from "@/components/modais/confirmacao-cadastro";
import { deleteField } from "firebase/firestore";
import { toast } from "react-toastify";
import Loading from "@/components/loading";

export const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const docRef = doc(db, "users", userAuth.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            throw new Error("Usuário não encontrado no Firestore.");
          }

          let userData = {
            uid: userAuth.uid,
            email: userAuth.email,
            handle: docSnap.data().handle,
            nome: docSnap.data().nome,
            avatarUrl: docSnap.data().avatarUrl,
            genero: docSnap.data().genero,
            estilo: docSnap.data().estilo,
            favoritos: docSnap.data().favoritos || [],
            assistir: docSnap.data().assistir || [],
            visto: docSnap.data().visto || {},
          };

          setUser(userData);
          storageUser(userData);
        } catch (error) {
          console.error("Erro ao obter dados do usuário:", error);
          setUser(null); // Limpa o usuário se não conseguir buscar os dados
        }
      } else {
        const storedUser = JSON.parse(localStorage.getItem("@ticketsPro"));
        if (storedUser) {
          setUser(storedUser);
        } else {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function signIn(email, senha) {
    setLoadingAuth(true);
    try {
      // Tenta fazer login
      const value = await signInWithEmailAndPassword(auth, email, senha);

      // Atualiza o objeto do usuário
      await value.user.reload();

      // Verifica se o e-mail está verificado
      if (!value.user.emailVerified) {
        await signOut(auth); // Deslogar o usuário

        toast.warn("Verifique seu e-mail antes de fazer login.", {
          position: "top-right",
          autoClose: 5000, // Duração do toast
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        throw new Error(
          "Por favor, verifique seu e-mail antes de fazer login."
        );
      }

      const uid = value.user.uid;
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error("Usuário não encontrado.");
      }

      let userData = {
        uid: uid,
        email: value.user.email,
        ...docSnap.data(),
      };

      setUser(userData);
      storageUser(userData);
      router.push("/");

      toast.success("Login realizado com sucesso!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } catch (error) {
      console.error("Erro ao tentar fazer login:", error);

      // Limpar o estado do usuário e do localStorage em caso de erro
      setUser(null);
      localStorage.removeItem("@ticketsPro");

      // Exibir mensagem de erro ao usuário
      setErrorMessage(
        error.message || "Falha ao fazer login. Por favor, tente novamente."
      );
    } finally {
      setLoadingAuth(false);
    }
  }

  function validatePassword(password) {
    return password.length >= 8;
  }

  async function signUp(email, senha, nome, handle) {
    setLoadingAuth(true);

    // Valida a senha
    if (!validatePassword(senha)) {
      throw new Error("A senha deve ter pelo menos 8 caracteres.");
    }

    try {
      // Verifica se o handle já está em uso
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("handle", "==", handle));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        throw new Error("Esse nome de usuário já está em uso. Escolha outro."); // Aqui é onde você lança o erro
      }

      const value = await createUserWithEmailAndPassword(auth, email, senha);
      let uid = value.user.uid;

      await setDoc(doc(db, "users", uid), {
        handle: handle,
        nome: nome,
        avatarUrl: null,
        genero: null,
        estilo: null,
        favoritos: [],
        assistir: [],
        visto: {},
        createdAt: new Date(),
        emailVerified: false,
      });

      const actionCodeSettings = {
        url: "https://www.cameo.fun/login?emailVerified=true",
        handleCodeInApp: true,
      };

      await sendEmailVerification(value.user, actionCodeSettings);
      console.log("E-mail de verificação enviado com sucesso.");

      // Recarga do usuário e desconexão
      await value.user.reload(); // Opcional, mas pode ajudar a garantir que o estado está atualizado
      await signOut(auth); // Desconectar o usuário

      setModalMessage(
        "Cadastro realizado! Verifique seu e-mail para ativar sua conta."
      );
      setModalVisible(true);
    } catch (error) {
      console.error("Erro ao tentar registrar:", error);
      throw error; // Lança o erro para ser capturado no componente de cadastro
    } finally {
      setLoadingAuth(false);
    }
  }

  const handleModalClose = () => {
    setModalVisible(false);
    signOut(auth).then(() => {
      localStorage.clear(); // Limpa o localStorage
      router.push("/login"); // Redireciona após a confirmação
    });
  };

  function storageUser(data) {
    localStorage.setItem("@ticketsPro", JSON.stringify(data));
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem("@ticketsPro");
    setUser(null);
    router.push("/");
  }

  async function deleteUnverifiedUsers() {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    querySnapshot.forEach(async (userDoc) => {
      const userData = userDoc.data();
      const createdAt = userData.createdAt.toDate();
      const now = new Date();
      const diffTime = Math.abs(now - createdAt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (!userData.emailVerified && diffDays > 1) {
        await deleteDoc(doc(db, "users", userDoc.id));
        console.log(
          `Usuário ${userDoc.id} deletado por não verificar o e-mail.`
        );
      }
    });
  }

  async function salvarFilme(filmeId) {
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    if (typeof filmeId !== "string") {
      console.error("O ID do filme deve ser uma string.");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      await setDoc(
        userRef,
        {
          favoritos: arrayUnion(filmeId),
        },
        { merge: true }
      );

      setUser((prevUser) => ({
        ...prevUser,
        favoritos: [...(prevUser.favoritos || []), filmeId],
      }));

      console.log("Filme salvo com sucesso no Firebase");

      toast.success("Filme adicionado aos favoritos!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark", // Mude para "dark" se quiser o fundo escuro
      });
    } catch (error) {
      console.error("Erro ao salvar filme no Firebase:", error);
    }
  }

  async function removerFilme(filmeId) {
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    if (typeof filmeId !== "string") {
      console.error("O ID do filme deve ser uma string.");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      await setDoc(
        userRef,
        {
          favoritos: arrayRemove(filmeId),
        },
        { merge: true }
      );

      setUser((prevUser) => ({
        ...prevUser,
        favoritos: prevUser.favoritos.filter((id) => id !== filmeId),
      }));

      console.log("Filme removido com sucesso do Firebase");

      toast.success("Filme removido de favoritos!", {
        position: "top-right",
        autoClose: 5000, // Duração do toast
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    } catch (error) {
      console.error("Erro ao remover filme do Firebase:", error);
    }
  }

  async function assistirFilme(filmeId) {
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    if (typeof filmeId !== "string") {
      console.error("O ID do filme deve ser uma string.");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      await setDoc(
        userRef,
        {
          assistir: arrayUnion(filmeId),
        },
        { merge: true }
      );

      setUser((prevUser) => ({
        ...prevUser,
        assistir: [...(prevUser.assistir || []), filmeId],
      }));

      console.log("Filme salvo com sucesso no Firebase");

      toast.success("Filme adicionado a lista para ver!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark", // Mude para "dark" se quiser o fundo escuro
      });
    } catch (error) {
      console.error("Erro ao salvar filme no Firebase:", error);
    }
  }

  async function removerAssistir(filmeId) {
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    if (typeof filmeId !== "string") {
      console.error("O ID do filme deve ser uma string.");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      await setDoc(
        userRef,
        {
          assistir: arrayRemove(filmeId),
        },
        { merge: true }
      );

      setUser((prevUser) => ({
        ...prevUser,
        assistir: prevUser.assistir.filter((id) => id !== filmeId),
      }));

      console.log("Filme removido com sucesso do Firebase");
    } catch (error) {
      console.error("Erro ao remover filme do Firebase:", error);
    }
  }

  async function avaliarFilme(filmeId) {
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    if (typeof filmeId !== "string") {
      console.error("O ID do filme deve ser uma string.");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      const docSnap = await getDoc(userRef);
      const userData = docSnap.data();

      if (userData.visto && userData.visto[filmeId] !== undefined) {
        console.log("Filme já foi avaliado anteriormente.");
        return;
      }

      // Buscando detalhes do filme para pegar os gêneros
      const filmeResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${filmeId}?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`
      );
      const filmeData = await filmeResponse.json();
      const generos = filmeData.genres.map((g) => g.name);

      // Estrutura do objeto para o filme visto
      const dataAtual = new Date();
      const vistoFilme = {
        nota: 0,
        data: `${dataAtual.getDate()}/${
          dataAtual.getMonth() + 1
        }/${dataAtual.getFullYear()}`, // Formato: dia/mês/ano
        generos: generos, // Armazenando os gêneros
      };

      await setDoc(
        userRef,
        {
          visto: {
            ...userData.visto,
            [filmeId]: vistoFilme,
          },
        },
        { merge: true }
      );

      setUser((prevUser) => ({
        ...prevUser,
        visto: {
          ...prevUser.visto,
          [filmeId]: vistoFilme,
        },
      }));

      console.log("Filme avaliado com sucesso no Firebase");
    } catch (error) {
      console.error("Erro ao avaliar filme no Firebase:", error);
    }
  }

  async function darNota(filmeId, nota) {
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    if (typeof filmeId !== "string" || typeof nota !== "number") {
      console.error(
        "O ID do filme deve ser uma string e a nota deve ser um número."
      );
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      const docSnap = await getDoc(userRef);
      const userData = docSnap.data();

      if (!userData.visto || !userData.visto[filmeId]) {
        console.error("Filme não encontrado nos dados do usuário.");
        return;
      }

      // Obtém o filme existente
      const filmeExistente = userData.visto[filmeId];

      // Atualiza a nota e mantém os outros campos
      await updateDoc(userRef, {
        [`visto.${filmeId}`]: {
          ...filmeExistente,
          nota: nota, // Atualiza apenas a nota
        },
      });

      setUser((prevUser) => ({
        ...prevUser,
        visto: {
          ...prevUser.visto,
          [filmeId]: {
            ...prevUser.visto[filmeId],
            nota: nota, // Atualiza a nota no estado local
          },
        },
      }));

      console.log("Nota do filme atualizada com sucesso no Firebase");
    } catch (error) {
      console.error("Erro ao atualizar a nota do filme no Firebase:", error);
    }
  }

  async function removerNota(filmeId) {
    console.log(
      "ID recebido na função removerNota:",
      filmeId,
      "Tipo:",
      typeof filmeId
    ); // Adicione este log
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    if (typeof filmeId !== "string") {
      console.error("O ID do filme deve ser uma string.");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      console.log("Removendo a nota do filme:", filmeId);

      await updateDoc(userRef, {
        [`visto.${filmeId}`]: deleteField(), // Usa deleteField() para remover o campo
      });

      setUser((prevUser) => {
        const updatedVisto = { ...prevUser.visto };
        delete updatedVisto[filmeId]; // Remove o filme do estado local

        return {
          ...prevUser,
          visto: updatedVisto,
        };
      });

      console.log("Nota do filme removida com sucesso do Firebase");
    } catch (error) {
      console.error("Erro ao remover a nota do filme no Firebase:", error);
    }
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        signUp,
        logout,
        loadingAuth,
        salvarFilme,
        removerFilme,
        assistirFilme,
        removerAssistir,
        avaliarFilme,
        darNota,
        removerNota,
        setUser,
      }}
    >
      {children}
      {modalVisible && (
        <ModalConfirmacaoCadastro
          message={modalMessage}
          onClose={handleModalClose}
        />
      )}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
