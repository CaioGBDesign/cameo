import { useEffect, useState, lazy, Suspense } from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "./index.module.scss";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import Search from "@/components/busca";

const Miniaturafilmes = lazy(() => import("@/components/miniaturafilmes"));

const Busca = () => {
  const router = useRouter(); // Inicialização do router
  const [query, setQuery] = useState("");
  const [filmes, setFilmes] = useState([]);

  // define se desktop ou mobile
  const isMobile = useIsMobile(); // Chame o Hook aqui

  const fetchFilmes = async (searchQuery) => {
    if (!searchQuery) {
      setFilmes([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR&query=${searchQuery}`
      );
      const data = await response.json();
      setFilmes(data.results);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
      setFilmes([]);
    }
  };

  useEffect(() => {
    fetchFilmes(query);
  }, [query]);

  const handleFilmeClick = (filme) => {
    const { id, title } = filme;
    router.push({
      pathname: "/filme-aleatorio",
      query: { filmeId: id },
    });
  };

  return (
    <main className={styles.mainSearch}>
      <Head>
        <title>Cameo - Buscar filmes</title>
        <meta
          name="description"
          content="Encontre o filme perfeito em segundos! Utilize nossa busca avançada para filtrar por gênero, ano, classificação indicativa e muito mais. O filme ideal está a um clique de distância!"
        />
      </Head>
      {isMobile ? <Header showBuscar={false} /> : <HeaderDesktop />}
      <div className={styles.searchPage}>
        <div className={styles.conteudo}>
          <div className={styles.search}>
            <Search placeholder={"Buscar filmes"} onSearch={setQuery} />
          </div>
          <div className={styles.resultado}>
            <Suspense fallback={<div>Carregando...</div>}>
              {filmes.map((filme) => (
                <div key={filme.id} className={styles.miniatura}>
                  <Miniaturafilmes
                    capaminiatura={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
                    titulofilme={filme.title}
                    mostrarEstrelas={false}
                    onClick={() => handleFilmeClick(filme)}
                  />
                </div>
              ))}
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Busca;
