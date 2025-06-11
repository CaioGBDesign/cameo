import styles from "./index.module.scss";
import { useState, useEffect } from "react";
import { db } from "@/services/firebaseConection";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/contexts/auth";
import Loading from "@/components/loading";
import { useRouter } from "next/router";
import { useIsMobile } from "@/components/DeviceProvider";
import Head from "next/head";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import Footer from "@/components/Footer";
import BannerResenhas from "@/components/banner-resenhas";
import ListaNoticias from "@/components/ListaNoticias-resumo";
import ListaResenhas from "@/components/ListaResenhas";
import BannerInformacao from "@/components/banner-informacao";
import Image from "next/image";

const Criticas = ({}) => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [userData, setUserData] = useState(null);
  const [criticas, setCriticas] = useState([]);
  const ultimasCriticas = criticas.slice(0, 4);
  const [noticias, setNoticias] = useState([]);
  const ultimasNoticias = noticias.slice(0, 4);
  const [filteredCriticas, setFilteredCriticas] = useState([]);
  const [filteredNoticias, setFilteredNoticias] = useState([]);

  // SEO: dynamic filtro from query
  const filtroParam = Array.isArray(router.query.filtro)
    ? router.query.filtro[0]
    : router.query.filtro || "";

  // Filtro aplicado a críticas e notícias
  const aplicarFiltro = (items, filtro) => {
    if (!filtro) return items;
    const [tipo, valor] = filtro.split(":");
    return items.filter((item) => {
      const lista = tipo === "empresa" ? item.empresas : item.generos;
      return lista?.some(
        (x) => x.trim().toLowerCase() === valor.trim().toLowerCase()
      );
    });
  };

  // Load críticas
  useEffect(() => {
    const fetchCriticas = async () => {
      const q = query(
        collection(db, "criticas"),
        orderBy("dataPublicacao", "desc")
      );
      const snapshot = await getDocs(q);
      setCriticas(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchCriticas();
  }, []);

  // Load notícias
  useEffect(() => {
    const fetchNoticias = async () => {
      const q = query(
        collection(db, "noticias"),
        orderBy("dataPublicacao", "desc")
      );
      const snapshot = await getDocs(q);
      setNoticias(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchNoticias();
  }, []);

  // Apply filter when filtroParam changes
  useEffect(() => {
    setFilteredCriticas(aplicarFiltro(criticas, filtroParam));
    setFilteredNoticias(aplicarFiltro(noticias, filtroParam));
  }, [criticas, noticias, filtroParam]);

  const renderElemento = (elemento, index, critica = {}) => {
    if (elemento.tipo !== "imagem") return null;
    return (
      <div key={index} className={styles.imagemContainer}>
        <Image
          src={elemento.conteudo}
          alt={critica.titulo || "Imagem da notícia"}
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
        <title>Cameo – Resenhas de Cinema</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="As últimas resenhas de filmes: opiniões, avaliações e análises detalhadas para ajudá-lo a escolher o que assistir."
        />
        <meta name="robots" content="index, follow" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://cameo.fun/resenhas" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://cameo.fun/resenhas" />
        <meta property="og:title" content="Cameo – Resenhas de Cinema" />
        <meta
          property="og:description"
          content="As últimas resenhas de filmes: opiniões, avaliações e análises detalhadas para ajudá-lo a escolher o que assistir."
        />
        <meta
          property="og:image"
          content="https://cameo.fun/imagens/og-resenhas.jpg"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@cameo_fun" />
        <meta name="twitter:title" content="Cameo – Resenhas de Cinema" />
        <meta
          name="twitter:description"
          content="As últimas resenhas de filmes: opiniões, avaliações e análises detalhadas para ajudá-lo a escolher o que assistir."
        />
        <meta
          name="twitter:image"
          content="https://cameo.fun/imagens/og-resenhas.jpg"
        />

        {/* Preload critical banner image */}
        <link rel="preload" as="image" href="/imagens/banner-resenhas.jpg" />
      </Head>
      <main className={styles.ContCriticas}>
        {user && userData?.adm && (
          <div className={styles.adicionarCritica}>
            <button onClick={() => router.push("/add-resenha")}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fadd.svg?alt=media&token=6efb9a03-ae69-4a5f-9f16-af5429506ea0"
                alt="Adicionar Resenha"
              />{" "}
              Adicionar Resenha
            </button>
          </div>
        )}

        {!isMobile && (
          <section className={styles.bannerResenhas}>
            <BannerResenhas criticas={ultimasCriticas} tipo="criticas" />
          </section>
        )}

        <div className={styles.criticasNoticias}>
          <div className={styles.colunaCriticas}>
            <ListaResenhas
              criticas={filteredCriticas}
              renderElemento={renderElemento}
              BannerComponent={BannerInformacao}
            />
          </div>

          <div className={styles.colunaNoticias}>
            <ListaNoticias
              noticias={ultimasNoticias}
              renderElemento={renderElemento}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Criticas;
