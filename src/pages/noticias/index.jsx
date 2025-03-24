import styles from "./index.module.scss";
import { useState, useEffect } from "react";
import { db } from "@/services/firebaseConection";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/contexts/auth";
import Loading from "@/components/loading";
import { useRouter } from "next/router";
import { useIsMobile } from "@/components/DeviceProvider";
import { doc, getDoc } from "firebase/firestore";
import AddNoticias from "@/components/add-noticias";
import Head from "next/head";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import FooterB from "@/components/FooterB";
import CarrosselNoticias from "@/components/carrossel-noticias";
import CarrosselCriticas from "@/components/carrossel-criticas";

const Noticias = ({}) => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [showAddNoticias, setShowAddNoticias] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const ultimasNoticias = noticias.slice(0, 4);
  const [criticas, setCriticas] = useState([]);
  const ultimasCriticas = criticas.slice(0, 4);

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
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

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

  // Efeito para rotacionar slides automaticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % ultimasNoticias.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ultimasNoticias.length]);

  // Encontra a primeira imagem da notícia
  const encontrarImagem = (noticia) => {
    return (
      noticia.elementos.find((el) => el.tipo === "imagem")?.conteudo ||
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
              alt="Imagem da notícia"
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
        <title>Cameo - Home</title>
        <meta
          name="description"
          content="Notícias quentes do cinema, spoilers dos bastidores e lançamentos imperdíveis! Na Cameo.fun, você cria listas personalizadas, debate teorias e celebra filmes com a comunidade cinéfila mais animada."
        />
      </Head>
      <main className={styles.ContNoticias}>
        {/* Botão condicional para usuários logados */}
        {user && userData ? (
          userData.adm && (
            <div className={styles.adicionarNoticia}>
              <button onClick={() => setShowAddNoticias(true)}>
                <img src="icones/add.svg" alt="Adicionar notícia" />
                Adicionar Notícia
              </button>
            </div>
          )
        ) : (
          <Loading pequeno /> // Ou null se não quiser mostrar nada
        )}

        <section className={styles.ultimasNoticiasECriticas}>
          <div className={styles.ultimasNoticias}>
            <CarrosselNoticias
              noticias={ultimasNoticias}
              tipo="noticias"
              className={styles.customWidth} // Estilo adicional se necessário
            />
          </div>

          <div className={styles.ultimasCriticas}>
            <CarrosselCriticas
              criticas={ultimasCriticas}
              tipo="criticas"
              className={styles.customWidth}
            />
          </div>
        </section>

        <div className={styles.tituloPagina}>
          <span>Todas as notícias</span>
        </div>

        <div className={styles.AddNoticia}>
          {noticias.map((noticia) => (
            <article
              key={noticia.id}
              className={styles.noticia}
              onClick={() => router.push(`/noticias/detalhes/${noticia.id}`)}
            >
              <div className={styles.cabecalho}>
                {/* Título principal da notícia */}
                {noticia.titulo && (
                  <h1 className={styles.tituloPrincipal}>{noticia.titulo}</h1>
                )}

                {/* Tempo de leitura */}
                {noticia.numero && (
                  <div className={styles.numeroNoticia}>
                    <img src="icones/relogio.svg" alt="Tempo de leitura" />
                    {noticia.numero} min de leitura
                  </div>
                )}
              </div>

              <div className={styles.conteudo}>
                {noticia.elementos.map((elemento, index) =>
                  renderElemento(elemento, index)
                )}
              </div>
            </article>
          ))}

          {/* Modal AddNoticias */}
          {showAddNoticias && (
            <div
              className={styles.modalOverlay}
              onClick={() => setShowAddNoticias(false)}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <AddNoticias onClose={() => setShowAddNoticias(false)} />
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterB></FooterB>
    </>
  );
};

export default Noticias;
