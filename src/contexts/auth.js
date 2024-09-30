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
} from "firebase/firestore";
import { useRouter } from "next/router";
import ModalConfirmacaoCadastro from "@/components/modais/confirmacao-cadastro";

export const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const docRef = doc(db, "users", userAuth.uid);
        const docSnap = await getDoc(docRef);

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
      const value = await signInWithEmailAndPassword(auth, email, senha);

      // Verifica se o e-mail está verificado
      if (!value.user.emailVerified) {
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
    } catch (error) {
      console.error("Erro ao tentar fazer login:", error);

      // Forçar deslogar o usuário
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("@ticketsPro");

      // Opcional: exibir uma mensagem de erro ao usuário
      setErrorMessage("Falha ao fazer login. Por favor, tente novamente."); // Você pode usar um estado para exibir essa mensagem em algum lugar da UI

      throw error; // Lança o erro para ser capturado no componente de login
    } finally {
      setLoadingAuth(false);
    }
  }

  async function signUp(email, senha, nome, handle) {
    setLoadingAuth(true);

    try {
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

      setModalMessage(
        "Cadastro realizado! Verifique seu e-mail para ativar sua conta."
      );
      setModalVisible(true);
    } catch (error) {
      console.error("Erro ao tentar registrar:", error);
    } finally {
      setLoadingAuth(false);
    }
  }

  const handleModalClose = () => {
    setModalVisible(false);
    router.push("/login"); // Redireciona após a confirmação
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

      await setDoc(
        userRef,
        {
          visto: {
            ...userData.visto,
            [filmeId]: 0,
          },
        },
        { merge: true }
      );

      setUser((prevUser) => ({
        ...prevUser,
        visto: {
          ...prevUser.visto,
          [filmeId]: 0,
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
      console.log("Atualizando a nota do filme:", filmeId, "para", nota);

      await updateDoc(userRef, {
        [`visto.${filmeId}`]: nota,
      });

      setUser((prevUser) => ({
        ...prevUser,
        visto: {
          ...prevUser.visto,
          [filmeId]: nota,
        },
      }));

      console.log("Nota do filme atualizada com sucesso no Firebase");
    } catch (error) {
      console.error("Erro ao atualizar a nota do filme no Firebase:", error);
    }
  }

  if (loading) {
    return <div>Carregando...</div>;
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