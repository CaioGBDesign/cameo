import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { useIsMobile } from "@/components/DeviceProvider";
import Head from "next/head";
import styles from "./index.module.scss";
import Header from "@/components/Header";
import TextInput from "@/components/inputs/text-input";
import CardFilme from "@/components/card-filme";

const DEBOUNCE_MS = 400;

const Busca = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [query, setQuery] = useState("");
  const [filmes, setFilmes] = useState([]);
  const abortRef = useRef(null);
  const timerRef = useRef(null);

  const fetchFilmes = useCallback(async (searchQuery) => {
    if (abortRef.current) abortRef.current.abort();

    if (!searchQuery) {
      setFilmes([]);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR&query=${searchQuery}`,
        { signal: controller.signal },
      );
      const data = await response.json();
      setFilmes(data.results ?? []);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Erro ao buscar filmes:", error);
        setFilmes([]);
      }
    }
  }, []);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchFilmes(query), DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [query, fetchFilmes]);

  const handleFilmeClick = (filme) => {
    router.push({ pathname: "/filme-aleatorio", query: { id: filme.id } });
  };

  return (
    <>
      <Head>
        <title>Cameo - Buscar filmes</title>
        <meta
          name="description"
          content="Encontre o filme perfeito em segundos! Utilize nossa busca avançada para filtrar por gênero, ano, classificação indicativa e muito mais. O filme ideal está a um clique de distância!"
        />
      </Head>

      <Header showBuscar={false} />

      <main className={styles.page}>
        <div className={styles.searchPage}>
          <div className={styles.conteudo}>
            <div className={styles.search}>
              <TextInput
                id="busca"
                name="busca"
                placeholder="Buscar filmes"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                width="100%"
              />
            </div>
            <div className={styles.resultado}>
              {filmes.map((filme) => (
                <CardFilme
                  key={filme.id}
                  movie={filme}
                  variant={isMobile ? "mini" : "titulo"}
                  onClick={() => handleFilmeClick(filme)}
                  showFavorito={false}
                  showStars={false}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Busca;
