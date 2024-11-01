import styles from "./index.module.scss";
import { useEffect, useState, lazy, Suspense } from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import Titulolistagem from "@/components/titulolistagem";
import GraficoVistos from "@/components/detalhesfilmes/grafico-vistos";
import GraficoDatas from "@/components/detalhesfilmes/grafico-datas";
import Private from "@/components/Private";
import Link from "next/link";
import FilmesCarousel from "@/components/modais/filmes-carousel";
import Loading from "@/components/loading";
import PosterInfoDesktop from "@/components/PosterInfoDesktop";
import FundoTitulosDesktop from "@/components/fundotitulos-desktop";

const FundoTitulos = lazy(() => import("@/components/fundotitulos"));
const Miniaturafilmes = lazy(() => import("@/components/miniaturafilmes"));

const FilmesAssisti = () => {
  const router = useRouter();
  const { user, removerNota } = useAuth();
  const [filmesVistos, setFilmesVistos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filmeAleatorio, setFilmeAleatorio] = useState(null);
  const [mostrarBotaoFechar, setMostrarBotaoFechar] = useState(false);
  const totalFilmesVistos = filmesVistos.length; // Total de filmes vistos
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);
  const [trailerLink, setTrailerLink] = useState(null); // Estado para link do trailer
  const [filme, setFilme] = useState(null); // Estado para armazenar os dados do filme

  // define se desktop ou mobile
  const isMobile = useIsMobile();

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

        const filmesComAvaliacoes = filmesData
          .map((filme) => {
            const trailer =
              filme.videos && filme.videos.results
                ? filme.videos.results.find((video) => video.type === "Trailer")
                : null;

            const trailerLink = trailer
              ? `https://www.youtube.com/watch?v=${trailer.key}`
              : "#";

            // Pega a certificação para o Brasil
            const certification =
              filme.release_dates && filme.release_dates.results
                ? filme.release_dates.results.find(
                    (release) => release.iso_3166_1 === "BR"
                  )
                : null;

            return {
              ...filme,
              avaliacao: user.visto[filme.id] || 0,
              trailerLink,
              generos: filme.genres,
              duracao: filme.runtime,
              classificacao: certification
                ? certification.certification
                : "N/A",
            };
          })
          .filter(Boolean); // Remove filmes inválidos

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

  const convertDuracao = (duracao) => {
    const horas = Math.floor(duracao / 60);
    const minutos = duracao % 60;
    return `${horas}h ${minutos}min`;
  };

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

  if (!filmesVistos.length && loading) return <Loading />;

  return (
    <Private>
      <div className={styles.filmesAssisti}>
        {filmesVistos.length > 0 ? (
          <>
            {isMobile ? <Header /> : <HeaderDesktop />}
            <div className={styles.contFilmes}>
              <div className={styles.topoInfos}>
                {isMobile ? null : (
                  <PosterInfoDesktop
                    exibirPlay={false}
                    capaAssistidos={`https://image.tmdb.org/t/p/original/${filmeAleatorio.poster_path}`}
                    tituloAssistidos={filmeAleatorio.title}
                    generofilme={filmeAleatorio.generos
                      .map((genre) => genre.name)
                      .join(", ")}
                    duracao={convertDuracao(filmeAleatorio.duracao)}
                  />
                )}

                <div className={styles.graficosGeneroMes}>
                  <GraficoVistos
                    filmesVistos={filmesVistos}
                    totalFilmesVistos={totalFilmesVistos} // Passando totalFilmesVistos como prop
                  />
                  {isMobile ? null : (
                    <GraficoDatas
                      filmesVistos={filmesVistos}
                      totalFilmesVistos={totalFilmesVistos}
                    />
                  )}
                </div>
              </div>

              <div className={styles.todosOsTitulos}>
                <div className={styles.contlista}>
                  <Titulolistagem
                    quantidadeFilmes={filmesVistos.length}
                    titulolistagem={"Filmes que já assisti"}
                    configuracoes={true}
                    handleRemoverClick={handleRemoverClick}
                  />
                  <div className={styles.listaFilmes}>
                    {filmesVistos && (
                      <>
                        {loading ? (
                          <p>Carregando...</p>
                        ) : (
                          filmesVistos.map((filme) => (
                            <Suspense key={filme.id} fallback={<Loading />}>
                              <Miniaturafilmes
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {isMobile ? (
              filmeAleatorio ? (
                <Suspense fallback={<Loading />}>
                  <FundoTitulos
                    exibirPlay={false}
                    capaAssistidos={`https://image.tmdb.org/t/p/original/${filmeAleatorio.poster_path}`}
                    tituloAssistidos={filmeAleatorio.title}
                    opacidade={0.2}
                  />
                </Suspense>
              ) : null
            ) : (
              filmeAleatorio && (
                <FundoTitulosDesktop
                  capaAssistidos={`https://image.tmdb.org/t/p/original/${filmeAleatorio.backdrop_path}`}
                />
              )
            )}

            {modalOpen && (
              <FilmesCarousel
                filmes={filmesVistos}
                selectedFilm={selectedFilm} // Mantenha esta linha
                onClose={() => setModalOpen(false)}
                excluirFilme={() => {
                  removerNota(String(selectedFilm.id)); // Chama a função de remoção passando o ID do filme em foco
                  setModalOpen(false); // Fecha o modal após a exclusão
                }}
              />
            )}
          </>
        ) : (
          <div className={styles.blankSlate}>
            {isMobile ? <Header /> : <HeaderDesktop />}
            <div className={styles.banner}>
              {isMobile ? (
                <img
                  src="background/banner-blank-slate-cameo.png"
                  alt="Filmes já vistos"
                />
              ) : (
                <img
                  src="background/banner-blank-slate-desktop-cameo.png"
                  alt="Filmes já vistos"
                />
              )}
            </div>
            <div className={styles.alertaBlankSlate}>
              <span>Você ainda não tem filmes avaliados.</span>
            </div>
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
