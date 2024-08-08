import { useState, createContext, useEffect, useContext } from "react";
import { auth, db } from "@/services/firebaseConection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  updateDoc,
  doc,
  arrayRemove,
  arrayUnion,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { useRouter } from "next/router";

export const AuthContext = createContext({});
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true); // Adicionado para gerenciar o estado de carregamento inicial

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        // usuário está autenticado
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
        // nenhum usuário autenticado
        const storedUser = JSON.parse(localStorage.getItem("@ticketsPro"));
        if (storedUser) {
          setUser(storedUser);
        } else {
          setUser(null);
        }
      }
      setLoading(false); // Conclui o carregamento inicial
    });

    return () => unsubscribe();
  }, []);

  async function signIn(email, senha) {
    setLoadingAuth(true);

    await signInWithEmailAndPassword(auth, email, senha)
      .then(async (value) => {
        let uid = value.user.uid;

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        let data = {
          uid: uid,
          handle: docSnap.data().handle,
          nome: docSnap.data().nome,
          email: value.user.email,
          avatarUrl: docSnap.data().avatarUrl,
          genero: docSnap.data().genero,
          estilo: docSnap.data().estilo,
          favoritos: docSnap.data().favoritos || [],
          assistir: docSnap.data().assistir || [],
          visto: docSnap.data().visto || {},
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        router.push("/");
      })
      .catch((error) => {
        console.error("Erro ao tentar fazer login:", error.code, error.message);
        setLoadingAuth(false);
        throw error;
      });
  }

  async function signUp(email, senha, nome, handle) {
    setLoadingAuth(true);

    await createUserWithEmailAndPassword(auth, email, senha)
      .then(async (value) => {
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
        }).then(() => {
          let data = {
            uid: uid,
            handle: handle,
            nome: nome,
            email: value.user.email,
            avatarUrl: null,
            genero: null,
            estilo: null,
            favoritos: [],
            assistir: [],
            visto: {},
          };

          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
          router.push("/");
        });
      })
      .catch((error) => {
        console.error("Erro ao tentar registrar:", error);
        setLoadingAuth(false);
      });
  }

  function storageUser(data) {
    localStorage.setItem("@ticketsPro", JSON.stringify(data));
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem("@ticketsPro");
    setUser(null);
    router.push("/");
  }

  // Favoritos
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

  // Assistir
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

  // Já vistos
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

      // Verifica se o filme já foi avaliado
      if (userData.visto && userData.visto[filmeId] !== undefined) {
        console.log("Filme já foi avaliado anteriormente.");
        return;
      }

      // Adiciona o filme com valor 0 (avaliação inicial)
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

  // Avaliar com nota
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
    return <div>Carregando...</div>; // Adicionado para mostrar um carregamento inicial
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
    </AuthContext.Provider>
  );
}

export default AuthProvider;
