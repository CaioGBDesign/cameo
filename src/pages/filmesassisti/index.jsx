import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import NotasFilmes from "@/components/botoes/notas";
import TitulosFilmes from "@/components/titulosfilmes";
import FundoTitulos from "@/components/fundotitulos";
import Search from "@/components/busca";
import Titulolistagem from "@/components/titulolistagem";
import Miniaturafilmes from "@/components/miniaturafilmes";
import BotaoPlay from "@/components/botoes/play";
import { useAuth } from "@/contexts/auth";

const FilmesAssisti = () => {
  const { user } = useAuth();
  const [filmesVistos, setFilmesVistos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filmeAleatorio, setFilmeAleatorio] = useState(null);
  const [linkTrailer, setLinkTrailer] = useState("#");
  const [mostrarBotaoFechar, setMostrarBotaoFechar] = useState(false);

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
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilmesVistos();
  }, [user]);

  const handleRemoverClick = () => {
    setMostrarBotaoFechar(!mostrarBotaoFechar);
  };

  return (
    <div className={styles.filmesAssisti}>
      <Header />
      <div className={styles.contFilmes}>
        <div className={styles.tituloFilmes}>
          <div className={styles.contTitulos}>
            <BotaoPlay linkTrailer={linkTrailer} />
            <TitulosFilmes
              titulofilme={filmeAleatorio ? filmeAleatorio.title : ""}
            />
            <div className={styles.NotasFavoritos}>
              <NotasFilmes estrelas="3" />
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
              ) : filmesVistos.length ? (
                filmesVistos.map((filme) => (
                  <Miniaturafilmes
                    key={filme.id}
                    capaminiatura={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                    titulofilme={filme.title}
                    mostrarBotaoFechar={mostrarBotaoFechar}
                    avaliacao={filme.avaliacao}
                  />
                ))
              ) : (
                <p>Você ainda não marcou nenhum filme como assistido.</p>
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
        />
      )}
    </div>
  );
};

export default FilmesAssisti;
