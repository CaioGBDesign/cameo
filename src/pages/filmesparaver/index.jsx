import styles from "./index.module.scss";
import { useEffect, useState, lazy, Suspense } from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";
import Head from "next/head";
import Header from "@/components/Header";
import FooterB from "@/components/FooterB";
import HeaderDesktop from "@/components/HeaderDesktop";
import NotasFilmes from "@/components/botoes/notas";
import TitulosFilmes from "@/components/titulosfilmes";
import FundoTitulos from "@/components/fundotitulos";
import Titulolistagem from "@/components/titulolistagem";
import Trailer from "@/components/botoes/trailer";
import Private from "@/components/Private";
import Link from "next/link";
import ServicosMiniatura from "@/components/detalhesfilmes/servicos-miniatura";
import FilmesCarousel from "@/components/modais/filmes-carousel";
import FundoTitulosDesktop from "@/components/fotoPrincipalDesktop";
import PosterInfoDesktop from "@/components/PosterInfoDesktop";
import Loading from "@/components/loading";

const Miniaturafilmes = lazy(() => import("@/components/miniaturafilmes"));

const FilmesParaVer = () => {
  const router = useRouter();
  const { user, removerAssistir } = useAuth();
  const [assistirFilme, setFilmesAssistidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filmeAleatorio, setFilmeAleatorio] = useState(null);
  const [linkTrailer, setLinkTrailer] = useState("#");
  const [mostrarBotaoFechar, setMostrarBotaoFechar] = useState(false);
  const [servicosStreaming, setServicosStreaming] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

  // define se desktop ou mobile
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchAssistidos = async () => {
      if (!user) {
        console.error("Usuário não autenticado");
        setLoading(false);
        return;
      }

      const ids = user.assistir || [];
      if (!Array.isArray(ids) || !ids.length) {
        setFilmesAssistidos([]);
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
        setFilmesAssistidos(filmesData);

        const filmeAleatorio =
          filmesData[Math.floor(Math.random() * filmesData.length)];
        setFilmeAleatorio(filmeAleatorio);

        const providersResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeAleatorio.id}/watch/providers?api_key=${apiKey}&language=pt-BR`
        );
        const providersData = await providersResponse.json();
        setServicosStreaming(providersData.results.BR?.flatrate || []);

        const trailer = filmeAleatorio.videos.results.find(
          (video) => video.type === "Trailer"
        );
        if (trailer) {
          const videoId = trailer.key;
          setLinkTrailer(`https://www.youtube.com/watch?v=${videoId}`);
        } else {
          setLinkTrailer("#");
        }
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistidos();
  }, [user]);

  const convertDuracao = (duracao) => {
    const horas = Math.floor(duracao / 60);
    const minutos = duracao % 60;
    return `${horas}h ${minutos}min`;
  };

  const handleRemoverClick = () => {
    setMostrarBotaoFechar(!mostrarBotaoFechar);
  };

  const openModal = (filme) => {
    setSelectedFilm(filme);
    setModalOpen(true);
  };

  if (!assistirFilme.length && loading) return <Loading />;

  return (
    <Private>
      <Head>
        <title>Cameo - Filmes para ver</title>
        <meta
          name="description"
          content="Explore a sua lista de filmes para assistir. Descubra novas opções, adicione títulos que você deseja ver e organize sua próxima maratona de cinema!"
        />
      </Head>
      <div className={styles.filmesAssisti}>
        {loading ? (
          <p>Carregando...</p>
        ) : assistirFilme.length === 0 ? (
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
              <span>Você ainda não tem filmes marcados para ver.</span>
            </div>
            <div className={styles.botaoHome}>
              <Link href={"/"}>
                <p>Adicionar filmes</p>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {isMobile ? <Header /> : <HeaderDesktop />}
            <div className={styles.contFilmes}>
              <div className={styles.tituloFilmes}>
                {isMobile ? (
                  <div className={styles.contTitulos}>
                    <TitulosFilmes
                      titulofilme={filmeAleatorio ? filmeAleatorio.title : ""}
                    />
                    <div className={styles.NotasFavoritos}>
                      <NotasFilmes estrelas="3" />
                      <Trailer linkTrailer={linkTrailer} />
                    </div>
                    {servicosStreaming.length > 0 && (
                      <ServicosMiniatura servicos={servicosStreaming} />
                    )}
                  </div>
                ) : (
                  <PosterInfoDesktop
                    exibirPlay={false}
                    capaAssistidos={`https://image.tmdb.org/t/p/original/${filmeAleatorio.poster_path}`}
                    tituloAssistidos={filmeAleatorio.title}
                    trailerLink={linkTrailer}
                    generofilme={filmeAleatorio.genres
                      .map((genre) => genre.name)
                      .join(", ")} // Assumindo que você tenha uma propriedade genres
                    duracao={convertDuracao(filmeAleatorio.runtime)}
                  />
                )}
              </div>
              <div className={styles.todosOsTitulos}>
                <div className={styles.contlista}>
                  <Titulolistagem
                    quantidadeFilmes={assistirFilme.length}
                    titulolistagem={"Filmes para assistir"}
                    configuracoes={false}
                    handleRemoverClick={handleRemoverClick}
                  />
                  <div className={styles.listaFilmes}>
                    {assistirFilme.map((filme) => (
                      <Suspense key={filme.id} fallback={<Loading />}>
                        <Miniaturafilmes
                          capaminiatura={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                          titulofilme={filme.title}
                          mostrarBotaoFechar={mostrarBotaoFechar}
                          mostrarEstrelas={false}
                          onClick={() => openModal(filme)}
                        />
                      </Suspense>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.footerFilmes}>
              <FooterB />
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
                filmes={assistirFilme}
                selectedFilm={selectedFilm} // Mantenha esta linha
                onClose={() => setModalOpen(false)}
                excluirFilme={() => {
                  removerAssistir(String(selectedFilm.id)); // Chama a função de remoção passando o ID do filme em foco
                  setModalOpen(false); // Fecha o modal após a exclusão
                }}
              />
            )}
          </>
        )}
      </div>
    </Private>
  );
};

export default FilmesParaVer;
