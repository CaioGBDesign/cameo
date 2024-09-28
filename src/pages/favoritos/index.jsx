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
import Private from "@/components/Private";

const Favoritos = () => {
  const { user, removerFilme } = useAuth(); // Use o contexto para obter o usuário autenticado e a função para remover favoritos
  const [filmesFavoritos, setFilmesFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filmeAleatorio, setFilmeAleatorio] = useState(null);
  const [linkTrailer, setLinkTrailer] = useState("#"); // Adicionamos um estado para o link do trailer
  const [mostrarBotaoFechar, setMostrarBotaoFechar] = useState(false);

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!user) {
        console.error("Usuário não autenticado");
        return;
      }

      // Obter IDs dos filmes favoritos do usuário
      const ids = user.favoritos;

      if (!ids.length) {
        setFilmesFavoritos([]);
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
        setFilmesFavoritos(filmesData);

        // Selecionar um filme aleatório
        const filmeAleatorio =
          filmesData[Math.floor(Math.random() * filmesData.length)];
        setFilmeAleatorio(filmeAleatorio);

        // Encontrar o trailer do filme aleatório (se houver)
        const trailer = filmeAleatorio.videos.results.find(
          (video) => video.type === "Trailer"
        );

        if (trailer) {
          const videoId = trailer.key;
          setLinkTrailer(`https://www.youtube.com/watch?v=${videoId}`);
        } else {
          setLinkTrailer(null); // Define como null se não houver trailer disponível
        }
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [user]);

  const handleRemoverClick = () => {
    setMostrarBotaoFechar(!mostrarBotaoFechar); // Alterna o estado de visibilidade do botão
  };

  return (
    <Private>
      <div className={styles.filmesAssisti}>
        {/* Header */}
        <Header />

        <div className={styles.contFilmes}>
          <div className={styles.tituloFilmes}>
            <div className={styles.contTitulos}>
              <BotaoPlay linkTrailer={linkTrailer}></BotaoPlay>
              <TitulosFilmes
                titulofilme={filmeAleatorio ? filmeAleatorio.title : ""}
              ></TitulosFilmes>
              <div className={styles.NotasFavoritos}>
                <NotasFilmes estrelas="3" />
              </div>
            </div>
          </div>

          <div className={styles.todosOsTitulos}>
            <div className={styles.contlista}>
              <Search placeholder={"Buscar filmes"}></Search>

              <Titulolistagem
                quantidadeFilmes={filmesFavoritos.length}
                titulolistagem={"Meus favoritos"}
                configuracoes={true}
                handleRemoverClick={handleRemoverClick} // Passe a função para o componente Titulolistagem
              ></Titulolistagem>
              <div className={styles.listaFilmes}>
                {loading ? (
                  <p>Carregando...</p>
                ) : filmesFavoritos.length ? (
                  filmesFavoritos.map((filme) => (
                    <Miniaturafilmes
                      key={filme.id}
                      capaminiatura={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                      titulofilme={filme.title}
                      excluirFilme={() => removerFilme(String(filme.id))}
                      mostrarBotaoFechar={mostrarBotaoFechar} // Passe o estado para o componente Miniaturafilmes
                      mostrarEstrelas={false}
                    />
                  ))
                ) : (
                  <p>Você ainda não tem filmes favoritos.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <FundoTitulos
          exibirPlay={false}
          capaAssistidos={
            filmeAleatorio
              ? `https://image.tmdb.org/t/p/original/${filmeAleatorio.poster_path}`
              : "fundoAleatorio"
          }
          tituloAssistidos={filmeAleatorio}
        ></FundoTitulos>
      </div>
    </Private>
  );
};

export default Favoritos;
