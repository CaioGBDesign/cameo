import React, { useState, useEffect, lazy, Suspense } from "react";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { useIsMobile } from "@/components/DeviceProvider";
import Head from "next/head";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import styles from "@/styles/index.module.scss";
import TitulosFilmes from "@/components/titulosfilmes";
import NotasFilmes from "@/components/botoes/notas";
import Sinopse from "@/components/detalhesfilmes/sinopse";
import Servicos from "@/components/detalhesfilmes/servicos";
import Dublagem from "@/components/detalhesfilmes/dublagem";
import Elenco from "@/components/detalhesfilmes/elenco";
import Direcao from "@/components/detalhesfilmes/direcao";
import BaseBotoes from "@/components/botoes/base";
import FavoritarFilme from "@/components/detalhesfilmes/favoritarfilme";
import AssistirFilme from "@/components/detalhesfilmes/paraver";
import Listafilmes from "@/components/listafilmes/listafilmes.json";
import ModalFiltros from "@/components/modais/filtros";
import ModalAvaliar from "@/components/modais/avaliar-filmes";
import Classificacao from "@/components/detalhesfilmes/classificacao";
import FundoTitulosDesktop from "@/components/fotoPrincipalDesktop";
import Loading from "@/components/loading";
import Recomendacoes from "@/components/detalhesfilmes/recomendacoes";

const inter = Inter({ subsets: ["latin"] });
const FundoTitulos = lazy(() => import("@/components/fundotitulos"));

const Home = () => {
  const router = useRouter();
  const { filmeId: queryFilmeId } = router.query;
  const [filmeId, setFilmeId] = useState(null);
  const [filme, setFilme] = useState(null);
  const [elenco, setElenco] = useState([]);
  const [diretores, setDiretores] = useState([]);
  const [servicosStreaming, setServicosStreaming] = useState([]);
  const [trailerLink, setTrailerLink] = useState(null);
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [filmesExibidos, setFilmesExibidos] = useState(new Set());
  const [filmeIdParaAvaliar, setFilmeIdParaAvaliar] = useState(null);
  const [notaAtual, setNotaAtual] = useState(0);
  const [modalAberto, setModalAberto] = useState(null);
  const [countryNames, setCountryNames] = useState({});
  const isMobile = useIsMobile();

  const {
    user,
    salvarFilme,
    avaliarFilme,
    assistirFilme,
    removerVisto,
    removerAssistir,
    removerFilme,
  } = useAuth();

  const abrirModal = (modalTipo) => setModalAberto(modalTipo);
  const fecharModal = () => setModalAberto(null);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleSelectMovie = (movieId) => {
    setFilmeId(movieId);
    console.log("Filme selecionado:", movieId);
  };

  const selecionarFilmeRecomendado = (id) => {
    setFilmeId(String(id));
    setFilme(null);
    scrollToTop();
  };

  const selecionarFilmeAleatorio = () => {
    if (filmesExibidos.size === Listafilmes.filmes.length) {
      setFilmesExibidos(new Set());
    }
    let randomFilmeId;
    do {
      randomFilmeId =
        Listafilmes.filmes[
          Math.floor(Math.random() * Listafilmes.filmes.length)
        ];
    } while (filmesExibidos.has(randomFilmeId));

    setFilmeId(randomFilmeId);
    setFilmesExibidos((prev) => new Set(prev).add(randomFilmeId));
    scrollToTop();
  };

  useEffect(() => {
    if (queryFilmeId && queryFilmeId !== filmeId) {
      setFilmeId(queryFilmeId);
      router.push(`/?filmeId=${queryFilmeId}`);
    }
  }, [queryFilmeId, filmeId, router]);

  useEffect(() => {
    if (!filmeId && !queryFilmeId) {
      selecionarFilmeAleatorio();
      router.push("/");
    }
  }, [filmeId, queryFilmeId]);

  // Função de formatação da duração
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  useEffect(() => {
    if (!filmeId) return;

    const fetchData = async () => {
      try {
        const filmeUrl = `https://api.themoviedb.org/3/movie/${filmeId}?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR&append_to_response=videos,release_dates`;
        const filmeData = await fetch(filmeUrl).then((response) =>
          response.json()
        );

        // Armazena os dados do filme para uso posterior
        setFilme(filmeData);

        // Tenta encontrar o trailer
        const trailer = filmeData.videos.results.find(
          (video) => video.type === "Trailer"
        );
        let videoLink;

        if (trailer) {
          videoLink = `https://www.youtube.com/watch?v=${trailer.key}`;
        } else {
          // Tenta encontrar um teaser
          const teaser = filmeData.videos.results.find(
            (video) => video.type === "Teaser"
          );
          if (teaser) {
            videoLink = `https://www.youtube.com/watch?v=${teaser.key}`;
          } else {
            // Se não houver trailer nem teaser, pega o primeiro vídeo disponível
            const primeiroVideo = filmeData.videos.results[0];
            videoLink = primeiroVideo
              ? `https://www.youtube.com/watch?v=${primeiroVideo.key}`
              : null;
          }
        }

        setTrailerLink(videoLink);

        // Busca dados adicionais em segundo plano
        const elencoUrl = `https://api.themoviedb.org/3/movie/${filmeId}/credits?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`;
        const providersUrl = `https://api.themoviedb.org/3/movie/${filmeId}/watch/providers?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`;
        const recomendacoesUrl = `https://api.themoviedb.org/3/movie/${filmeId}/recommendations?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`;

        const [elencoData, providersData, recomendacoesData] =
          await Promise.all([
            fetch(elencoUrl).then((response) => response.json()),
            fetch(providersUrl).then((response) => response.json()),
            fetch(recomendacoesUrl).then((response) => response.json()),
          ]);

        setElenco(elencoData.cast);
        setServicosStreaming(providersData.results.BR?.flatrate || []);
        setRecomendacoes(recomendacoesData.results);

        const diretoresEncontrados = elencoData.crew
          .filter((member) => member.job === "Director")
          .map((diretor) => ({
            nome: diretor.name,
            imagemUrl: diretor.profile_path
              ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${diretor.profile_path}`
              : null,
          }));

        setDiretores(
          diretoresEncontrados.length
            ? diretoresEncontrados
            : [{ nome: "Diretor não encontrado", imagemUrl: null }]
        );
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [filmeId]);

  useEffect(() => {
    if (filmeIdParaAvaliar && user) {
      setNotaAtual(user.visto[filmeIdParaAvaliar] || 0);
    }
  }, [filmeIdParaAvaliar, user]);

  useEffect(() => {
    document.body.style.overflow = modalAberto ? "hidden" : "auto";
  }, [modalAberto]);

  // Abre o modal de avaliação de filme
  const abrirModalAvaliar = (id) => {
    const nota = user?.visto?.[id] || 0; // Obtém a nota do filme, padrão 0 se não encontrado
    setFilmeIdParaAvaliar(id); // Define o filmeId que será avaliado
    setNotaAtual(nota); // Atualiza a nota atual no estado
    abrirModal("avaliar-filme"); // Abre o modal de avaliação
  };

  const fetchCountryNames = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/watch/providers/regions?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`
      );
      const data = await response.json();
      const countries = {};
      data.results.forEach((country) => {
        countries[country.iso_3166_1] = country.native_name;
      });
      setCountryNames(countries);
    } catch (error) {
      console.error("Erro ao buscar nomes dos países:", error);
    }
  };

  useEffect(() => {
    fetchCountryNames();
  }, []);

  if (!filme && filmeId) return <Loading />;

  return (
    <>
      {isMobile ? <Header /> : <HeaderDesktop />}
      <Head>
        <title>Cameo - Home</title>
        <meta
          name="description"
          content="Descubra o filme perfeito com o Cameo! Oferecemos sugestões aleatórias e personalizadas, filtradas por gênero, classificação indicativa, serviços de streaming e muito mais. Crie listas de filmes, avalie suas escolhas e compartilhe com amigos. Mergulhe no mundo do cinema e nunca fique sem o que assistir. Cadastre-se agora e transforme sua experiência cinematográfica!"
        />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.detalhesFilmes}>
          <div className={styles.informacoes}>
            <div className={styles.tituloFilmes}>
              <div className={styles.contTitulos}>
                <TitulosFilmes
                  titulofilme={filme ? filme.title : "Título não disponível"} // Adicione a verificação aqui
                  generofilme={
                    filme && filme.genres
                      ? filme.genres.map((g) => g.name).join(", ")
                      : "Gênero não disponível"
                  }
                  duracaofilme={
                    filme && filme.runtime
                      ? formatDuration(filme.runtime)
                      : null
                  }
                  paisOrigem={
                    filme && filme.production_countries
                      ? filme.production_countries.map((pc) => pc.iso_3166_1)
                      : []
                  }
                  releaseDates={
                    filme &&
                    filme.release_dates &&
                    filme.release_dates.results.length > 0
                      ? filme.release_dates.results
                      : null
                  }
                  backdropUrl={`https://image.tmdb.org/t/p/original/${
                    filme ? filme.backdrop_path : ""
                  }`}
                  trailerLink={trailerLink || "#"}
                />

                {!isMobile && filme && filme.overview ? (
                  <Sinopse sinopse={filme.overview} />
                ) : null}

                <div className={styles.NotasFavoritos}>
                  <NotasFilmes
                    filmeId={filmeId}
                    avaliarFilme={avaliarFilme}
                    removerVisto={removerVisto}
                    usuarioFilmeVisto={user?.visto || []}
                    onClickModal={() => abrirModalAvaliar(filmeId)} // aqui você deve garantir que a nota está sendo passada corretamente
                  />

                  <AssistirFilme
                    filmeId={filmeId}
                    assistirFilme={assistirFilme}
                    removerAssistir={removerAssistir}
                    usuarioParaVer={user?.assistir || []}
                  />
                  <FavoritarFilme
                    filmeId={filmeId}
                    salvarFilme={salvarFilme}
                    removerFilme={removerFilme}
                    usuarioFavoritos={user?.favoritos || []}
                  />
                </div>
              </div>
            </div>

            <div className={styles.infoFilmes}>
              {isMobile && filme && filme.overview && (
                <Sinopse sinopse={filme.overview} />
              )}

              {servicosStreaming.length > 0 && (
                <Servicos servicos={servicosStreaming} />
              )}
            </div>

            {isMobile ? null : (
              <div className={styles.infoFilmes}>
                <div className={styles.detalhesDispositivo}>
                  <div className={styles.detalhes}>
                    <h3>Lançamento</h3>
                    <p>
                      {filme && filme.release_date
                        ? new Date(filme.release_date).toLocaleDateString()
                        : "Data de lançamento não disponível"}
                    </p>
                  </div>

                  {filme && filme.budget > 0 && (
                    <div className={styles.detalhes}>
                      <h3>Orçamento</h3>
                      <p>US$ {filme.budget.toLocaleString()}</p>
                    </div>
                  )}

                  {filme && filme.revenue > 0 && (
                    <div className={styles.detalhes}>
                      <h3>Bilheteira</h3>
                      <p>US$ {filme.revenue.toLocaleString()}</p>
                    </div>
                  )}

                  <div className={styles.detalhes}>
                    <h3>País de origem</h3>
                    <div className={styles.origemDeskop}>
                      {filme &&
                      filme.production_countries &&
                      filme.production_countries.length > 0 ? (
                        filme.production_countries.map((country) => (
                          <div
                            className={styles.produtora}
                            key={country.iso_3166_1}
                          >
                            <p>
                              {countryNames[country.iso_3166_1] ||
                                country.iso_3166_1}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>País não disponível</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Suspense fallback={<Loading />}>
              <div className={styles.elencoGeral}>
                <Dublagem />

                {isMobile ? <hr /> : null}
                <Elenco elenco={elenco} />

                {isMobile ? <hr /> : null}
                <Direcao diretores={diretores} />
              </div>
            </Suspense>

            <div className={styles.infoFilmes}>
              <div className={styles.detalhesDispositivo}>
                <div className={styles.detalhes}>
                  <h3>Produção</h3>
                  <div className={styles.producao}>
                    {filme && filme.production_companies ? (
                      filme.production_companies.map((pc) => (
                        <div className={styles.produtora} key={pc.id}>
                          <p>{pc.name}</p>
                        </div>
                      ))
                    ) : (
                      <p>Produção não disponível</p>
                    )}
                  </div>
                </div>
              </div>

              {isMobile ? (
                <div className={styles.detalhesDispositivo}>
                  <div className={styles.detalhes}>
                    <h3>Lançamento</h3>
                    <p>
                      {filme && filme.release_date
                        ? new Date(filme.release_date).toLocaleDateString()
                        : "Data de lançamento não disponível"}
                    </p>
                  </div>

                  {filme && filme.release_dates && (
                    <Classificacao releaseDates={filme.release_dates.results} />
                  )}

                  {filme && filme.budget > 0 && (
                    <div className={styles.detalhes}>
                      <h3>Orçamento</h3>
                      <p>US$ {filme.budget.toLocaleString()}</p>
                    </div>
                  )}

                  {filme && filme.revenue > 0 && (
                    <div className={styles.detalhes}>
                      <h3>Bilheteira</h3>
                      <p>US$ {filme.revenue.toLocaleString()}</p>
                    </div>
                  )}

                  <div className={styles.detalhes}>
                    <h3>País de origem</h3>
                    <div className={styles.producao}>
                      {filme &&
                      filme.production_countries &&
                      filme.production_countries.length > 0 ? (
                        filme.production_countries.map((country) => (
                          <div
                            className={styles.produtora}
                            key={country.iso_3166_1}
                          >
                            <p>
                              {countryNames[country.iso_3166_1] ||
                                country.iso_3166_1}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>País não disponível</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              <Recomendacoes
                recomendacoes={recomendacoes}
                selecionarFilmeRecomendado={selecionarFilmeRecomendado}
              />
            </div>
          </div>
        </div>
        <BaseBotoes
          TextoBotao={"Filme aleatório"}
          botaoPrimario={true} // Habilita o botão primário
          botaoSecundario={true} // Habilita o botão secundário
          onClick={selecionarFilmeAleatorio} // Função para sugerir um filme
          onClickModal={() => abrirModal("filtros")} // Função para abrir o modal
        />
        {isMobile ? (
          <Suspense fallback={<Loading />}>
            <FundoTitulos
              exibirPlay={!!trailerLink}
              capaAssistidos={`https://image.tmdb.org/t/p/original/${
                filme ? filme.poster_path : ""
              }`}
              tituloAssistidos={filme ? filme.title : "Título não disponível"}
              trailerLink={trailerLink || "#"}
            />
          </Suspense>
        ) : (
          <FundoTitulosDesktop
            capaAssistidos={`https://image.tmdb.org/t/p/original/${
              filme ? filme.backdrop_path : ""
            }`}
          />
        )}

        {modalAberto === "filtros" && (
          <ModalFiltros
            onClose={fecharModal}
            user={user}
            onSelectMovie={handleSelectMovie}
          />
        )}
        {modalAberto === "avaliar-filme" && (
          <ModalAvaliar
            filmeId={filmeIdParaAvaliar} // Use filmeIdParaAvaliar no lugar de selectedFilmeId
            nota={notaAtual} // Use notaAtual no lugar de currentNota
            onClose={fecharModal}
          />
        )}
      </main>
    </>
  );
};

export default Home;
