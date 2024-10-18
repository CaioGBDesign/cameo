import styles from "./index.module.scss";
import { useEffect, useState, lazy, Suspense } from "react";
import Header from "@/components/Header";
import NotasFilmes from "@/components/botoes/notas";
import TitulosFilmes from "@/components/titulosfilmes";
import FundoTitulos from "@/components/fundotitulos";
import Titulolistagem from "@/components/titulolistagem";
import Trailer from "@/components/botoes/trailer";
import { useAuth } from "@/contexts/auth";
import Private from "@/components/Private";
import Link from "next/link";
import ServicosMiniatura from "@/components/detalhesfilmes/servicos-miniatura";
import FilmesCarousel from "@/components/modais/filmes-carousel";

const Miniaturafilmes = lazy(() => import("@/components/miniaturafilmes"));

const Loader = () => <div>Carregando...</div>;

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

  return (
    <Private>
      <div className={styles.filmesAssisti}>
        {loading ? (
          <p>Carregando...</p>
        ) : filmesFavoritos.length === 0 ? (
          <div className={styles.blankSlate}>
            <Header />

            <div className={styles.banner}>
              <img
                src="background/banner-blank-slate.png"
                alt="Filmes para ver"
              />
            </div>
            <span>Você ainda não tem filmes marcados para ver.</span>
            <div className={styles.botaoHome}>
              <Link href={"/"}>
                <p>Adicionar filmes</p>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <Header />
            <div className={styles.contFilmes}>
              <div className={styles.tituloFilmes}>
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
              </div>

              <div className={styles.todosOsTitulos}>
                <div className={styles.contlista}>
                  <Titulolistagem
                    quantidadeFilmes={filmesFavoritos.length}
                    titulolistagem={"Meus favoritos"}
                    configuracoes={true}
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
