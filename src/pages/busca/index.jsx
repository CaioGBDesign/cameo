import { useEffect, useState, lazy, Suspense } from "react";
import { useRouter } from "next/router"; // Importação necessária
import styles from "./index.module.scss";
import Header from "@/components/Header";
import Search from "@/components/busca";

const Miniaturafilmes = lazy(() => import("@/components/miniaturafilmes"));

const Busca = () => {
  const router = useRouter(); // Inicialização do router
  const [query, setQuery] = useState("");
  const [filmes, setFilmes] = useState([]);

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
      pathname: "/",
      query: { filmeId: id, titulo: title },
    });
  };

  return (
    <main className={styles.mainSearch}>
      <Header showBuscar={false} />
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
