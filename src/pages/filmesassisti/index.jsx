import styles from "./index.module.scss";
import { useEffect, useState, lazy, Suspense } from "react";
import Header from "@/components/Header";
import Search from "@/components/busca";
import Titulolistagem from "@/components/titulolistagem";
import GraficoVistos from "@/components/detalhesfilmes/grafico-vistos";
import { useAuth } from "@/contexts/auth";
import Private from "@/components/Private";
import Link from "next/link";
import FilmesCarousel from "@/components/modais/filmes-carousel";

const FundoTitulos = lazy(() => import("@/components/fundotitulos"));
const Miniaturafilmes = lazy(() => import("@/components/miniaturafilmes"));

const Loader = () => <div>Carregando...</div>;

const FilmesAssisti = () => {
  const { user, removerNota } = useAuth();
  const [filmesVistos, setFilmesVistos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filmeAleatorio, setFilmeAleatorio] = useState(null);
  const [mostrarBotaoFechar, setMostrarBotaoFechar] = useState(false);
  const totalFilmesVistos = filmesVistos.length; // Total de filmes vistos
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

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

        console.log("Filmes com avaliações:", filmesComAvaliacoes);

        setFilmesVistos(filmesComAvaliacoes);

        if (filmesComAvaliacoes.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * filmesComAvaliacoes.length
          );
          setFilmeAleatorio(filmesComAvaliacoes[randomIndex]);
        }
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilmesVistos();
  }, [user]);

  const handleExcluirFilme = async (filmeId) => {
    try {
      await removerNota(String(filmeId));
      setFilmesVistos((prevFilmes) =>
        prevFilmes.filter((filme) => filme.id !== filmeId)
      );
    } catch (error) {
      console.error("Erro ao excluir filme:", error);
    }
  };

  const handleRemoverClick = () => {
    setMostrarBotaoFechar(!mostrarBotaoFechar);
  };

  const openModal = (filme) => {
    setSelectedFilm(filme);
    setModalOpen(true);
  };

  return (
    <Private>
      <div className={styles.filmesAssisti}>
        {filmesVistos.length > 0 ? (
          <>
            <Header />
            <div className={styles.contFilmes}>
              <GraficoVistos
                filmesVistos={filmesVistos}
                totalFilmesVistos={totalFilmesVistos} // Passando totalFilmesVistos como prop
              />

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
                        <Suspense fallback={<Loader />}>
                          <Miniaturafilmes
                            key={filme.id}
                            capaminiatura={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                            titulofilme={filme.title}
                            mostrarEstrelas={true}
                            mostrarBotaoFechar={mostrarBotaoFechar}
                            excluirFilme={() =>
                              handleExcluirFilme(String(filme.id))
                            }
                            avaliacao={filme.avaliacao.nota}
                            onClick={() => openModal(filme)}
                          />
                        </Suspense>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            {filmeAleatorio && (
              <Suspense fallback={<Loader />}>
                <FundoTitulos
                  exibirPlay={false}
                  capaAssistidos={`https://image.tmdb.org/t/p/original/${filmeAleatorio.poster_path}`}
                  tituloAssistidos={filmeAleatorio.title}
                  opacidade={0.2}
                />
              </Suspense>
            )}
            {modalOpen && (
              <FilmesCarousel
                filmes={filmesVistos}
                selectedFilm={selectedFilm} // Mantenha esta linha
                onClose={() => setModalOpen(false)}
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
