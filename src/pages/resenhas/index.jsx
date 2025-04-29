import styles from "./index.module.scss";
import { useState, useEffect, useRef } from "react";
import { db } from "@/services/firebaseConection";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/contexts/auth";
import Loading from "@/components/loading";
import { useRouter } from "next/router";
import { useIsMobile } from "@/components/DeviceProvider";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import FooterB from "@/components/FooterB";
import CarrosselCriticas from "@/components/carrossel-criticas";
import BotoesCarrossel from "@/components/botoes-carrossel";
import BannerResenhas from "@/components/banner-resenhas";
import empresas from "@/components/listas/tags/empresas.json";
import generos from "@/components/listas/tags/generos.json";
import ListaNoticias from "@/components/ListaNoticias-resumo";
import ListaResenhas from "@/components/ListaResenhas";
import BannerInformacao from "@/components/banner-informacao";

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
  const [filtroSelecionado, setFiltroSelecionado] = useState(null);
  const botoesRef = useRef(null);
  const [filteredNoticias, setFilteredNoticias] = useState([]);
  const [filteredCriticas, setFilteredCriticas] = useState([]);

  const opcoesSelect = [
    {
      label: "Empresas",
      options: empresas.map((empresa) => ({
        value: `empresa:${empresa.name}`,
        label: empresa.name,
      })),
    },
    {
      label: "Gêneros",
      options: generos.map((genero) => ({
        value: `genero:${genero.name}`,
        label: genero.name,
      })),
    },
  ];

  // Opções filtradas para os botões
  const opcoesBotoes = [
    {
      label: "Empresas",
      options: empresas
        .filter((empresa) => empresa.Exibir === "Sim")
        .map((empresa) => ({
          value: `empresa:${empresa.name}`,
          label: empresa.name,
        })),
    },
    {
      label: "Gêneros",
      options: generos
        .filter((genero) => genero.Exibir === "Sim")
        .map((genero) => ({
          value: `genero:${genero.name}`,
          label: genero.name,
        })),
    },
  ];

  const aplicarFiltro = (noticias, filtro) => {
    console.log("Filtro selecionado:", filtro?.value);

    if (!filtro) return noticias;

    const [tipo, valor] = filtro.value.split(":");

    const filtradas = noticias.filter((noticia) => {
      if (tipo === "empresa") {
        return noticia.empresas?.some(
          (empresa) =>
            empresa.trim().toLowerCase() === valor.trim().toLowerCase() // ✅ Correção aplicada
        );
      }

      if (tipo === "genero") {
        return noticia.generos?.some(
          (genero) => genero.trim().toLowerCase() === valor.trim().toLowerCase() // ✅ Correção aplicada
        );
      }

      return false;
    });

    console.log("Notícias filtradas:", filtradas);
    return filtradas;
  };

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
    setFilteredCriticas(aplicarFiltro(criticas, filtroSelecionado));
  }, [filtroSelecionado, criticas]);

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
              <button onClick={() => router.push("/add-resenha")}>
                <img src="icones/add.svg" alt="Adicionar notícia" />
                Adicionar Resenha
              </button>
            </div>
          )
        ) : (
          <Loading pequeno /> // Ou null se não quiser mostrar nada
        )}

        {isMobile ? null : (
          <section className={styles.bannerResenhas}>
            <BannerResenhas
              criticas={ultimasCriticas}
              tipo="criticas"
              className={styles.customWidth}
            />
          </section>
        )}

        {isMobile ? (
          <section className={styles.ultimasECriticasNoticias}>
            <div className={styles.ultimasCriticas}>
              <CarrosselCriticas
                criticas={ultimasCriticas}
                tipo="criticas"
                className={styles.customWidth}
              />
            </div>
          </section>
        ) : null}

        {isMobile ? null : (
          <div className={styles.tituloPagina}>
            <BotoesCarrossel
              opcoesBotoes={opcoesBotoes}
              onFilterChange={setFiltroSelecionado}
            />
          </div>
        )}

        <div className={styles.criticasNoticias}>
          <div className={styles.colunaCriticas}>
            <ListaResenhas
              criticas={filteredCriticas}
              renderElemento={renderElemento}
              BannerComponent={BannerInformacao}
            />
          </div>

          {isMobile ? <div className={styles.divisor}></div> : null}

          <div className={styles.colunaNoticias}>
            <ListaNoticias
              noticias={ultimasNoticias}
              renderElemento={renderElemento}
            />
          </div>

          <div className={styles.containerGoogle}></div>
        </div>
      </main>

      <FooterB></FooterB>
    </>
  );
};

export default Criticas;
