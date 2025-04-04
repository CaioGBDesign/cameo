import styles from "./index.module.scss";
import { useEffect, useState, lazy, Suspense } from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import Head from "next/head";
import Header from "@/components/Header";
import FooterB from "@/components/FooterB";
import HeaderDesktop from "@/components/HeaderDesktop";
import Titulolistagem from "@/components/titulolistagem";
import GraficoVistos from "@/components/detalhesfilmes/grafico-vistos";
import GraficoMetas from "@/components/detalhesfilmes/grafico-metas";
import GraficoMetasMobile from "@/components/detalhesfilmes/grafico-metas-mobile";
import Private from "@/components/Private";
import Link from "next/link";
import FilmesCarousel from "@/components/modais/filmes-carousel";
import Loading from "@/components/loading";
import PosterInfoDesktop from "@/components/PosterInfoDesktop";
import FundoTitulosDesktop from "@/components/fotoPrincipalDesktop";

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
  const [modalAberto, setModalAberto] = useState(null);

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

  useEffect(() => {
    document.body.style.overflow = modalAberto ? "hidden" : "auto";
  }, [modalAberto]);

  if (!filmesVistos.length && loading) return <Loading />;

  return (
    <Private>
      <Head>
        <title>Cameo - Filmes que já assisti</title>
        <meta
          name="description"
          content="Reviva suas experiências cinematográficas! Veja todos os filmes que você já assistiu, avalie suas escolhas e compartilhe suas opiniões com a comunidade."
        />
      </Head>
      <div className={styles.filmesAssisti}>
        {filmesVistos.length > 0 ? (
          <>
            {isMobile ? <Header /> : <HeaderDesktop />}
            <div className={styles.contFilmes}>
              {isMobile ? null : (
                <div className={styles.topoInfos}>
                  <PosterInfoDesktop
                    exibirPlay={false}
                    capaAssistidos={`https://image.tmdb.org/t/p/original/${filmeAleatorio.poster_path}`}
                    tituloAssistidos={filmeAleatorio.title}
                    generofilme={filmeAleatorio.generos
                      .map((genre) => genre.name)
                      .join(", ")}
                    duracao={convertDuracao(filmeAleatorio.duracao)}
                  />
                </div>
              )}

              <div className={styles.contAssisti}>
                <div className={styles.todosOsTitulos}>
                  <div className={styles.contlista}>
                    <Titulolistagem
                      quantidadeFilmes={filmesVistos.length}
                      titulolistagem={"Filmes que já assisti"}
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
                <div className={styles.graficosGeneroMes}>
                  <GraficoVistos
                    filmesVistos={filmesVistos}
                    totalFilmesVistos={totalFilmesVistos} // Passando totalFilmesVistos como prop
                  />
                  {isMobile ? (
                    <GraficoMetasMobile
                      filmesVistos={filmesVistos}
                      totalFilmesVistos={totalFilmesVistos}
                      user={user}
                    />
                  ) : (
                    <GraficoMetas
                      filmesVistos={filmesVistos}
                      totalFilmesVistos={totalFilmesVistos}
                      user={user}
                    />
                  )}
                </div>
              </div>

              <div className={styles.footerFilmes}>
                <FooterB />
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
                    style={{
                      height: "440px",
                    }}
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
