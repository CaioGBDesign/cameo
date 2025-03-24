import styles from "./index.module.scss";
import { useState, useEffect } from "react";
import { db } from "@/services/firebaseConection";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/contexts/auth";
import Loading from "@/components/loading";
import { useRouter } from "next/router";
import { useIsMobile } from "@/components/DeviceProvider";
import { doc, getDoc } from "firebase/firestore";
import AddCriticas from "@/components/add-criticas";
import Head from "next/head";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import FooterB from "@/components/FooterB";
import CarrosselCriticas from "@/components/carrossel-criticas";
import CarrosselNoticias from "@/components/carrossel-noticias";

const Criticas = ({}) => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [showAddCriticas, setShowAddCriticas] = useState(false);
  const [userData, setUserData] = useState(null);
  const [criticas, setCriticas] = useState([]);
  const ultimasCriticas = criticas.slice(0, 4);
  const [noticias, setNoticias] = useState([]);
  const ultimasNoticias = noticias.slice(0, 4);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchCriticas = async () => {
      try {
        const q = query(
          collection(db, "criticas"),
          orderBy("dataPublicacao", "desc")
        );
        const querySnapshot = await getDocs(q);

        const criticasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCriticas(criticasData);
      } catch (error) {
        console.error("Erro ao buscar críticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCriticas();
  }, []);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const q = query(
          collection(db, "noticias"),
          orderBy("dataPublicacao", "desc")
        );
        const querySnapshot = await getDocs(q);

        const noticiasData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setNoticias(noticiasData);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    };

    fetchNoticias();
  }, []);

  // Encontra a primeira imagem da crítica
  const encontrarImagem = (critica) => {
    return (
      critica.elementos.find((el) => el.tipo === "imagem")?.conteudo ||
      "/background/placeholder.jpg"
    );
  };

  const renderElemento = (elemento, index) => {
    switch (elemento.tipo) {
      case "imagem":
        return (
          <div key={index} className={styles.imagemContainer}>
            <img
              src={elemento.conteudo}
              alt="Imagem da crítica"
              className={styles.imagem}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isMobile ? <Header /> : <HeaderDesktop />}
      <Head>
        <title>Cameo - Resenhas</title>
        <meta
          name="description"
          content="Notícias quentes do cinema, spoilers dos bastidores e lançamentos imperdíveis! Na Cameo.fun, você cria listas personalizadas, debate teorias e celebra filmes com a comunidade cinéfila mais animada."
        />
      </Head>
      <main className={styles.ContCriticas}>
        {/* Botão condicional para usuários logados */}
        {user && userData ? (
          userData.adm && (
            <div className={styles.adicionarCritica}>
              <button onClick={() => setShowAddCriticas(true)}>
                <img src="icones/add.svg" alt="Adicionar crítica" />
                Adicionar Resenha
              </button>
            </div>
          )
        ) : (
          <Loading pequeno /> // Ou null se não quiser mostrar nada
        )}

        <section className={styles.ultimasECriticasNoticias}>
          <div className={styles.ultimasCriticas}>
            <CarrosselCriticas
              criticas={ultimasCriticas}
              tipo="criticas"
              className={styles.customWidth}
            />
          </div>

          <div className={styles.ultimasNoticias}>
            <CarrosselNoticias
              noticias={ultimasNoticias}
              tipo="noticias"
              className={styles.customWidth} // Estilo adicional se necessário
            />
          </div>
        </section>

        <div className={styles.tituloPagina}>
          <span>Todas as resenhas</span>
        </div>

        <div className={styles.AddCritica}>
          {criticas.map((critica) => (
            <article
              key={critica.id}
              className={styles.critica}
              onClick={() => router.push(`/resenhas/detalhes/${critica.id}`)}
            >
              <div className={styles.cabecalho}>
                {/* Título principal da crítica */}
                {critica.titulo && (
                  <h1 className={styles.tituloPrincipal}>{critica.titulo}</h1>
                )}

                {/* Tempo de leitura */}
                {critica.numero && (
                  <div className={styles.numeroCritica}>
                    <img src="icones/relogio.svg" alt="Tempo de leitura" />
                    {critica.numero} min de leitura
                  </div>
                )}
              </div>

              <div className={styles.conteudo}>
                {critica.elementos.map((elemento, index) =>
                  renderElemento(elemento, index)
                )}
              </div>
            </article>
          ))}

          {/* Modal AddCriticas */}
          {showAddCriticas && (
            <div
              className={styles.modalOverlay}
              onClick={() => setShowAddCriticas(false)}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <AddCriticas onClose={() => setShowAddCriticas(false)} />
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterB></FooterB>
    </>
  );
};

export default Criticas;
