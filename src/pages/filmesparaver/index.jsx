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

const FilmesParaVer = () => {
  const { user, removerAssistir } = useAuth();
  const [assistirFilme, setFilmesAssistidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filmeAleatorio, setFilmeAleatorio] = useState(null);
  const [linkTrailer, setLinkTrailer] = useState("#");
  const [mostrarBotaoFechar, setMostrarBotaoFechar] = useState(false);
  const [servicosStreaming, setServicosStreaming] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState(null);

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
        {loading ? (
          <p>Carregando...</p>
        ) : assistirFilme.length === 0 ? (
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
                  />
                  <div className={styles.NotasFavoritos}>
                    <NotasFilmes estrelas="3" />
                    <Trailer linkTrailer={linkTrailer} />
                  </div>
                  {servicosStreaming.length > 0 && (
                    <ServicosMiniatura servicos={servicosStreaming} />
                  )}
                </div>
              </div>
              <div className={styles.todosOsTitulos}>
                <div className={styles.contlista}>
                  <Titulolistagem
                    quantidadeFilmes={assistirFilme.length}
                    titulolistagem={"Filmes para assistir"}
                    handleRemoverClick={handleRemoverClick}
                  />
                  <div className={styles.listaFilmes}>
                    <Suspense fallback={<Loader />}>
                      {assistirFilme.map((filme) => (
                        <Miniaturafilmes
                          key={filme.id}
                          capaminiatura={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                          titulofilme={filme.title}
                          mostrarBotaoFechar={mostrarBotaoFechar}
                          excluirFilme={() => removerAssistir(String(filme.id))}
                          mostrarEstrelas={false}
                          onClick={() => openModal(filme)}
                        />
                      ))}
                    </Suspense>
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
              opacidade={0.5}
            />
            {modalOpen && (
              <FilmesCarousel
                filmes={assistirFilme}
                selectedFilm={selectedFilm} // Mantenha esta linha
                onClose={() => setModalOpen(false)}
              />
            )}
          </>
        )}
      </div>
    </Private>
  );
};

export default FilmesParaVer;
