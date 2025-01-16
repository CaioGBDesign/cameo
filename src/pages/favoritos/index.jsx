import styles from "./index.module.scss";
import { useIsMobile } from "@/components/DeviceProvider";
import { useEffect, useState, lazy, Suspense } from "react";
import { useAuth } from "@/contexts/auth";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderDesktop from "@/components/HeaderDesktop";
import NotasFilmes from "@/components/botoes/notas";
import TitulosFilmes from "@/components/titulosfilmes";
import FundoTitulos from "@/components/fundotitulos";
import Titulolistagem from "@/components/titulolistagem";
import Trailer from "@/components/botoes/trailer";
import Private from "@/components/Private";
import Loading from "@/components/loading";
import Link from "next/link";
import ServicosMiniatura from "@/components/detalhesfilmes/servicos-miniatura";
import FilmesCarousel from "@/components/modais/filmes-carousel";
import FundoTitulosDesktop from "@/components/fotoPrincipalDesktop";
import PosterInfoDesktop from "@/components/PosterInfoDesktop";

const Miniaturafilmes = lazy(() => import("@/components/miniaturafilmes"));

const Favoritos = () => {
  const { user, removerFilme } = useAuth();
  const [filmesFavoritos, setFilmesFavoritos] = useState([]);
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
    const fetchFavoritos = async () => {
      if (!user) {
        console.error("Usuário não autenticado");
        return;
      }

      const ids = user.favoritos || []; // Garantir que 'ids' seja um array

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

        const filmeAleatorio =
          filmesData[Math.floor(Math.random() * filmesData.length)];
        setFilmeAleatorio(filmeAleatorio);

        // buscando streaming do serviço que disponibiliza o filme aleatório
        const providersResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeAleatorio.id}/watch/providers?api_key=${apiKey}&language=pt-BR`
        );
        const providersData = await providersResponse.json();
        setServicosStreaming(providersData.results.BR?.flatrate || []);

        const trailer = filmeAleatorio.videos.results.find(
          (video) => video.type === "Trailer"
        );
        setLinkTrailer(
          trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : "#"
        );
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [user]);

  const handleRemoverClick = () => {
    setMostrarBotaoFechar(!mostrarBotaoFechar);
  };

  const handleExcluirFilme = async (filmeId) => {
    await removerFilme(filmeId);
    setFilmesFavoritos((prev) => prev.filter((filme) => filme.id !== filmeId));
  };

  const openModal = (filme) => {
    setSelectedFilm(filme);
    setModalOpen(true);
  };

  if (!filmesFavoritos.length && loading) return <Loading />;

  return (
    <Private>
      <Head>
        <title>Cameo - favoritos</title>
        <meta
          name="description"
          content="Encontre seus filmes favoritos em um só lugar! Salve os títulos que você mais ama e tenha sempre à mão suas melhores recomendações."
        />
      </Head>
      <div className={styles.filmesAssisti}>
        {loading ? (
          <p>Carregando...</p>
        ) : filmesFavoritos.length === 0 ? (
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
              <span>Você ainda não tem filmes adicionados a favoritos.</span>
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
                    ></TitulosFilmes>
                    <div className={styles.NotasFavoritos}>
                      <NotasFilmes estrelas="3" />
                      <Trailer linkTrailer={linkTrailer}></Trailer>
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
                    duracao={filmeAleatorio.runtime} // Assumindo que você tenha uma propriedade runtime
                  />
                )}
              </div>

              <div className={styles.todosOsTitulos}>
                <div className={styles.contlista}>
                  <Titulolistagem
                    quantidadeFilmes={filmesFavoritos.length}
                    titulolistagem={"Meus favoritos"}
                    configuracoes={false}
                    handleRemoverClick={handleRemoverClick}
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
                          excluirFilme={() =>
                            handleExcluirFilme(String(filme.id))
                          }
                          mostrarBotaoFechar={mostrarBotaoFechar}
                          mostrarEstrelas={false}
                          onClick={() => openModal(filme)}
                        />
                      ))
                    ) : (
                      <p>Você ainda não tem filmes favoritos.</p>
                    )}
                  </div>
                </div>
              </div>

              {isMobile ? (
                <Footer
                  style={{ backgroundColor: "#210C2A", paddingBottom: "50px" }}
                />
              ) : (
                <Footer
                  style={{
                    backgroundColor: "transparent",
                    paddingBottom: "0px",
                  }}
                />
              )}
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
                showDeletar={false}
                filmes={filmesFavoritos}
                selectedFilm={selectedFilm} // Mantenha esta linha
                onClose={() => setModalOpen(false)}
                excluirFilme={() => {
                  removerFilme(String(selectedFilm.id)); // Chama a função de remoção passando o ID do filme em foco
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

export default Favoritos;
