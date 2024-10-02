import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import FundoTitulos from "@/components/fundotitulos";
import Search from "@/components/busca";
import Titulolistagem from "@/components/titulolistagem";
import Miniaturafilmes from "@/components/miniaturafilmes";
import { useAuth } from "@/contexts/auth";
import Private from "@/components/Private";
import Link from "next/link";

const FilmesAssisti = () => {
  const { user, removerNota } = useAuth();
  const [filmesVistos, setFilmesVistos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filmeAleatorio, setFilmeAleatorio] = useState(null);
  const [linkTrailer, setLinkTrailer] = useState("#");
  const [mostrarBotaoFechar, setMostrarBotaoFechar] = useState(false);
  const [generoCounts, setGeneroCounts] = useState([]);
  const [heights, setHeights] = useState({}); // Estado para armazenar as alturas das barras
  const totalFilmesVistos = 22;

  useEffect(() => {
    const fetchFilmesVistos = async () => {
      if (!user) {
        console.error("Usuário não autenticado");
        return;
      }

      const ids = Object.keys(user.visto);
      if (!ids.length) {
        setFilmesVistos([]);
        setLoading(false);
        return;
      }

      try {
        const apiKey = "c95de8d6070dbf1b821185d759532f05";
        const fetchFilmes = ids.map((id) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=pt-BR&append_to_response=videos`
          ).then((response) => response.json())
        );

        const filmesData = await Promise.all(fetchFilmes);

        const filmesComAvaliacoes = filmesData.map((filme) => {
          const trailer = filme.videos.results.find(
            (video) => video.type === "Trailer"
          );
          const trailerLink = trailer
            ? `https://www.youtube.com/watch?v=${trailer.key}`
            : "#";
          return {
            ...filme,
            avaliacao: user.visto[filme.id] || 0,
            trailerLink,
          };
        });

        setFilmesVistos(filmesComAvaliacoes);

        if (filmesComAvaliacoes.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * filmesComAvaliacoes.length
          );
          setFilmeAleatorio(filmesComAvaliacoes[randomIndex]);
          setLinkTrailer(filmesComAvaliacoes[randomIndex]?.trailerLink || "#");
        }

        // Cálculo de gêneros após obter filmes
        const novosGeneroCounts = {};
        filmesComAvaliacoes.forEach((filme) => {
          filme.genres.forEach((genero) => {
            if (!novosGeneroCounts[genero.name]) {
              novosGeneroCounts[genero.name] = 0;
            }
            novosGeneroCounts[genero.name]++;
          });
        });

        // Transformar o objeto em um array e ordenar
        const generosOrdenados = Object.entries(novosGeneroCounts).sort(
          (a, b) => b[1] - a[1]
        );

        setGeneroCounts(generosOrdenados);

        // Define as alturas para as barras de gênero
        const newHeights = {};
        generosOrdenados.forEach(([genero, quantidade]) => {
          newHeights[genero] = `${(quantidade / totalFilmesVistos) * 100}%`; // Usando total fixo
        });
        setHeights(newHeights);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilmesVistos();
  }, [user, filmesVistos.length]); // Adicionei filmesVistos.length como dependência para recalcular as alturas

  const handleExcluirFilme = async (filmeId) => {
    console.log(
      "ID do filme sendo excluído:",
      filmeId,
      "Tipo:",
      typeof filmeId
    );
    try {
      await removerNota(String(filmeId)); // Converte para string

      // Atualiza a lista de filmes vistos após a remoção
      setFilmesVistos((prevFilmes) => {
        const novosFilmes = prevFilmes.filter((filme) => filme.id !== filmeId);

        // Retorna novos filmes, mesmo se a lista ficar vazia
        return novosFilmes;
      });
    } catch (error) {
      console.error("Erro ao excluir filme:", error);
    }
  };

  const handleRemoverClick = () => {
    setMostrarBotaoFechar(!mostrarBotaoFechar);
  };

  return (
    <Private>
      <div className={styles.filmesAssisti}>
        {filmesVistos.length > 0 ? (
          <>
            <Header />
            <div className={styles.contFilmes}>
              <div className={styles.ContGraficosGeneros}>
                <div className={styles.GraficosGeneros}>
                  <div className={styles.ContGraficos}>
                    {generoCounts.map(([genero, quantidade]) => (
                      <div key={genero} className={styles.BoxtGraficos}>
                        <div className={styles.quantidadePercentual}>
                          <span>
                            {quantidade} (
                            {totalFilmesVistos > 0
                              ? Math.floor(
                                  (quantidade / totalFilmesVistos) * 100
                                )
                              : 0}
                            %)
                          </span>
                        </div>
                        <div
                          className={styles.BarraGenero}
                          style={{ height: heights[genero] || "0%" }}
                        >
                          <img src="/icones/estrado.svg" />
                        </div>
                        <div className={styles.GeneroFilmes}>
                          <span>{genero}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.todosOsTitulos}>
                <div className={styles.contlista}>
                  <Search placeholder={"Buscar filmes"} />
                  <Titulolistagem
                    quantidadeFilmes={filmesVistos.length}
                    titulolistagem={"Filmes que já assisti"}
                    configuracoes={true}
                    handleRemoverClick={handleRemoverClick}
                  />
                  <div className={styles.listaFilmes}>
                    {loading ? (
                      <p>Carregando...</p>
                    ) : (
                      filmesVistos.map((filme) => (
                        <Miniaturafilmes
                          key={filme.id}
                          capaminiatura={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                          titulofilme={filme.title}
                          mostrarBotaoFechar={mostrarBotaoFechar}
                          excluirFilme={() =>
                            handleExcluirFilme(String(filme.id))
                          }
                          avaliacao={filme.avaliacao}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            {filmeAleatorio && (
              <FundoTitulos
                exibirPlay={false}
                capaAssistidos={`https://image.tmdb.org/t/p/original/${filmeAleatorio.poster_path}`}
                tituloAssistidos={filmeAleatorio.title}
                opacidade={0.2}
              />
            )}
          </>
        ) : (
          <div className={styles.blankSlate}>
            <Header />

            <div className={styles.banner}>
              <img
                src="background/banner-blank-slate.png"
                alt="Filmes já vistos"
              />
            </div>
            <span>Você ainda não tem filmes avaliados.</span>
            <div className={styles.botaoHome}>
              <Link href={"/"}>
                <p>Adicionar filmes</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Private>
  );
};

export default FilmesAssisti;
