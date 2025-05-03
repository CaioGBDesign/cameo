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
import Footer from "@/components/Footer";
import BannerNoticias from "@/components/banner-noticias";
import CarrosselNticias from "@/components/carrossel-noticias";
import empresas from "@/components/listas/tags/empresas.json";
import generos from "@/components/listas/tags/generos.json";
import BotoesCarrossel from "@/components/botoes-carrossel";
import ListaNoticias from "@/components/ListaNoticias";
import ListaResenhas from "@/components/ListaResenhas-resumo";
import BannerInformacao from "@/components/banner-informacao";
import Image from "next/image";

const Noticias = ({}) => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [userData, setUserData] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const ultimasNoticias = noticias.slice(0, 4);
  const [criticas, setCriticas] = useState([]);
  const ultimasCriticas = criticas.slice(0, 4);
  const [filtroSelecionado, setFiltroSelecionado] = useState(null);
  const botoesRef = useRef(null);
  const [filteredNoticias, setFilteredNoticias] = useState([]);
  const noticiaDestaque = ultimasNoticias[0];

  // Transformar os dados para o formato que o react-select precisa
  // Opções para o Select (mostra todas)
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
    const fetchNoticias = async () => {
      try {
        const q = query(
          collection(db, "noticias"),
          orderBy("dataPublicacao", "desc")
        );
        const querySnapshot = await getDocs(q);

        const noticiasData = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          const converterCampo = (campo) => {
            if (!data[campo]) return [];
            if (typeof data[campo] === "string")
              return data[campo].split(/\s*,\s*/);
            if (
              typeof data[campo] === "object" &&
              !Array.isArray(data[campo])
            ) {
              return Object.values(data[campo]);
            }
            return data[campo] || [];
          };

          const empresasConvertidas = converterCampo("empresas");
          const generosConvertidos = converterCampo("generos");

          // 👇 Log detalhado de cada notícia
          console.log(`📰 Notícia ID: ${doc.id}`, {
            Título: data.titulo,
            Empresas: empresasConvertidas,
            Gêneros: generosConvertidos,
            Data: data.dataPublicacao?.toDate() || "Sem data",
          });

          return {
            id: doc.id,
            ...data,
            empresas: converterCampo("empresas"),
            generos: converterCampo("generos"),
          };
        });

        setNoticias(noticiasData);
        setFilteredNoticias(noticiasData);
        console.log("✅ Total de notícias carregadas:", noticiasData.length);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

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
    setFilteredNoticias(aplicarFiltro(noticias, filtroSelecionado));
  }, [filtroSelecionado, noticias]);

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

  const renderElemento = (elemento, index, noticia = {}) => {
    if (elemento.tipo !== "imagem") return null;
    return (
      <div key={index} className={styles.imagemContainer}>
        <Image
          src={elemento.conteudo}
          alt={noticia.titulo || "Imagem da notícia"}
          width={600}
          height={200}
          layout="responsive"
          objectFit="cover"
        />
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {isMobile ? <Header /> : <HeaderDesktop />}
      <Head>
        <title>Cameo – Notícias</title>
        <meta
          name="description"
          content={
            noticiaDestaque?.resumo ??
            "Fique por dentro das últimas notícias de cinema."
          }
        />

        {/* canonical local */}
        <link rel="canonical" href="https://cameo.fun/noticias" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cameo.fun/noticias" />
        <meta property="og:title" content="Cameo – Notícias de Cinema" />
        <meta
          property="og:description"
          content="Fique por dentro das últimas notícias de filmes, estreias e bastidores. Descubra, discuta e compartilhe com outros cinéfilos!"
        />
        <meta
          property="og:image"
          content="https://cameo.fun/imagens/og-noticias.jpg"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://cameo.fun/noticias" />
        <meta name="twitter:title" content="Cameo – Notícias de Cinema" />
        <meta
          name="twitter:description"
          content="Notícias atualizadas sobre filmes, trailers, críticas e muito mais no Cameo.fun."
        />
        <meta
          name="twitter:image"
          content="https://cameo.fun/imagens/og-noticias.jpg"
        />
      </Head>

      <main className={styles.ContNoticias}>
        {/* Botão condicional para usuários logados */}

        {user && userData?.adm && (
          <div className={styles.adicionarNoticia}>
            <button onClick={() => router.push("/add-noticia")}>
              <img src="icones/add.svg" alt="Adicionar Resenha" /> Adicionar
              Notícia
            </button>
          </div>
        )}

        {isMobile ? null : (
          <section className={styles.bannerNoticias}>
            <BannerNoticias
              noticias={ultimasNoticias}
              tipo="noticias"
              className={styles.customWidth} // Estilo adicional se necessário
            />
          </section>
        )}

        {isMobile ? (
          <section className={styles.ultimasNoticiasECriticas}>
            <div className={styles.ultimasNoticias}>
              <CarrosselNticias
                noticias={ultimasNoticias}
                tipo="noticias"
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

        {isMobile ? null : <div className={styles.divisor}></div>}

        <div className={styles.criticasNoticias}>
          <div className={styles.colunaNoticias}>
            <ListaNoticias
              noticias={filteredNoticias}
              renderElemento={renderElemento}
              BannerComponent={BannerInformacao}
            />
          </div>

          {isMobile ? <div className={styles.divisor}></div> : null}

          <div className={styles.colunaCriticas}>
            <ListaResenhas
              criticas={ultimasCriticas}
              renderElemento={renderElemento}
            />
          </div>

          <div className={styles.containerGoogle}></div>
        </div>
      </main>

      <Footer></Footer>
    </>
  );
};

export default Noticias;
