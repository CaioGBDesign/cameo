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
import NotasCameo from "@/components/detalhesfilmes/notascameo";
import Servicos from "@/components/detalhesfilmes/servicos";
import Dublagem from "@/components/detalhesfilmes/dublagem";
import Elenco from "@/components/detalhesfilmes/elenco";
import Direcao from "@/components/detalhesfilmes/direcao";
import Avaliacao from "@/components/detalhesfilmes/avaliacao";
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
  const { filmeId: queryFilmeId } = router.query; // Captura o ID do filme da query string
  // console.log("Query Filme ID:", queryFilmeId); // Log do ID do filme da query
  const [filmeId, setFilmeId] = useState(null); // Estado para armazenar o ID do filme
  const [filme, setFilme] = useState(null); // Estado para armazenar os dados do filme
  const [elenco, setElenco] = useState([]); // Estado para o elenco do filme
  const [diretores, setDiretores] = useState([]); // Estado para os diretores do filme
  const [servicosStreaming, setServicosStreaming] = useState([]); // Estado para serviços de streaming
  const [trailerLink, setTrailerLink] = useState(null); // Estado para link do trailer
  const [recomendacoes, setRecomendacoes] = useState([]); // Estado para recomendações de filmes
  const [filmesExibidos, setFilmesExibidos] = useState(new Set()); // Estado para controlar filmes exibidos
  const [filmeIdParaAvaliar, setFilmeIdParaAvaliar] = useState(null); // Estado para ID do filme a ser avaliado
  const [notaAtual, setNotaAtual] = useState(0); // Estado para nota atual do filme
  const [modalAberto, setModalAberto] = useState(null); // Estado para controlar modais abertos
  const [countryNames, setCountryNames] = useState({}); // Estado para nomes dos países

  // define se desktop ou mobile
  const isMobile = useIsMobile();

  // Função para abrir um modal
  const abrirModal = (modalTipo) => {
    setModalAberto(modalTipo); // Define o tipo do modal aberto
  };

  // Função para fechar um modal
  const fecharModal = () => {
    setModalAberto(null); // Reseta o estado do modal
  };

  // Obtém funções de autenticação do contexto
  const {
    user,
    salvarFilme,
    removerFilme,
    assistirFilme,
    removerAssistir,
    avaliarFilme,
    removerVisto,
  } = useAuth();

  const handleSelectMovie = (movieId) => {
    setFilmeId(movieId);
    // Aqui você pode buscar os dados do filme usando o ID, se necessário
    console.log("Filme selecionado:", movieId);
  };

  // Seleciona um filme recomendado ao clicar
  const selecionarFilmeRecomendado = (id) => {
    setFilmeId(String(id)); // Converter id para string
    setFilme(null); // Limpa o estado do filme atual
    scrollToTop(); // Rola a página para o topo
  };

  // Seleciona um filme aleatório
  const selecionarFilmeAleatorio = () => {
    let randomFilmeId;

    // Se todos os filmes já foram exibidos, reinicia a lista
    if (filmesExibidos.size === Listafilmes.filmes.length) {
      setFilmesExibidos(new Set());
    }

    do {
      // Seleciona um filme aleatório
      randomFilmeId =
        Listafilmes.filmes[
          Math.floor(Math.random() * Listafilmes.filmes.length)
        ];
    } while (filmesExibidos.has(randomFilmeId)); // Evita repetir filmes exibidos

    setFilmeId(randomFilmeId); // Define o filme selecionado
    setFilmesExibidos((prev) => new Set(prev).add(randomFilmeId)); // Adiciona filme à lista de exibidos
    scrollToTop(); // Rola para o topo da página
  };

  // Efeito que monitora mudanças na query do filme
  useEffect(() => {
    // Verifica se há um filmeId na query
    if (queryFilmeId && queryFilmeId !== filmeId) {
      setFilmeId(queryFilmeId); // Define o filmeId a partir da query
      router.push(`/?filmeId=${queryFilmeId}`); // Atualiza a URL
    }
  }, [queryFilmeId, filmeId, router]);

  // Efeito que seleciona um filme aleatório se nenhum filme estiver definido
  useEffect(() => {
    if (!filmeId && !queryFilmeId) {
      selecionarFilmeAleatorio(); // Seleciona um filme aleatório
    }
    router.push("/"); // Remove a query da URL ao selecionar aleatório
  }, [filmeId, queryFilmeId]);

  // Efeito que busca detalhes do filme quando o filmeId é definido
  useEffect(() => {
    if (!filmeId) return; // Se não houver filmeId, sai da função

    const fetchFilme = async () => {
      try {
        // Fetch dos detalhes do filme
        const filmeResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR&append_to_response=videos,release_dates`
        );
        const filmeData = await filmeResponse.json(); // Converte resposta em JSON
        console.log("Dados do filme:", filmeData);
        setFilme(filmeData); // Define o estado do filme

        // Fetch do elenco do filme
        const elencoResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}/credits?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`
        );
        const elencoData = await elencoResponse.json();
        setElenco(elencoData.cast); // Define o elenco

        // Fetch dos provedores de streaming
        const providersResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}/watch/providers?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`
        );
        const providersData = await providersResponse.json();
        setServicosStreaming(providersData.results.BR?.flatrate || []); // Define os serviços de streaming

        // Fetch de recomendações
        const recomendacoesResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}/recommendations?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`
        );
        const recomendacoesData = await recomendacoesResponse.json();
        setRecomendacoes(recomendacoesData.results);

        // Busca o trailer do filme a partir dos dados recebidos
        const trailer = filmeData.videos.results.find(
          (video) => video.type === "Trailer" // Filtra apenas os vídeos do tipo "Trailer"
        );

        // Define o link do trailer, se encontrado, ou null se não houver trailer
        setTrailerLink(
          trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
        );

        // Filtra e mapeia os membros da equipe para encontrar os diretores
        const diretoresEncontrados = elencoData.crew
          .filter((member) => member.job === "Director") // Mantém apenas os membros que são diretores
          .map((diretor) => ({
            nome: diretor.name, // Nome do diretor
            imagemUrl: diretor.profile_path
              ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${diretor.profile_path}` // URL da imagem do diretor, se disponível
              : null,
          }));

        // Define o estado dos diretores encontrados; se nenhum diretor for encontrado, define uma mensagem padrão
        setDiretores(
          diretoresEncontrados.length
            ? diretoresEncontrados // Se diretores foram encontrados, usa-os
            : [{ nome: "Diretor não encontrado", imagemUrl: null }] // Caso contrário, define mensagem padrão
        );
      } catch (error) {
        // Trata erros que podem ocorrer durante a busca de filme, elenco ou provedores
      }
    };

    // Chama a função fetchFilme para buscar os dados do filme
    fetchFilme();
  }, [filmeId]); // O efeito depende do filmeId

  useEffect(() => {
    // Verifica se há um filmeId para avaliar e se o usuário está logado
    if (filmeIdParaAvaliar && user) {
      const nota = user.visto[filmeIdParaAvaliar] || 0; // Acessa a nota do filme, padrão 0 se não encontrado
      setNotaAtual(nota); // Atualiza o estado com a nota atual
    }
  }, [filmeIdParaAvaliar, user]); // O efeito depende do filmeIdParaAvaliar e do usuário

  useEffect(() => {
    // Altera o estilo do corpo da página para ocultar o scroll quando um modal está aberto
    document.body.style.overflow = modalAberto ? "hidden" : "auto";
  }, [modalAberto]); // O efeito depende do modalAberto

  const scrollToTop = () => {
    // Função para rolar a página até o topo suavemente
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Função para salvar um filme na lista do usuário
  const handleSalvarFilme = (id) => {
    console.log("Salvando filme:", id);
    salvarFilme(id); // Chama a função de salvar filme
  };

  // Função para marcar um filme como assistido
  const handleAssistirFilme = (id) => assistirFilme(id); // Chama a função de assistir filme

  // Função para avaliar um filme
  const handleAvaliarFilme = (id) => {
    console.log("Avaliando filme:", id);
    avaliarFilme(id); // Chama a função de avaliar filme
  };

  // Abre o modal de avaliação de filme
  const abrirModalAvaliar = (id) => {
    const nota = user?.visto?.[id] || 0; // Obtém a nota do filme, padrão 0 se não encontrado
    setFilmeIdParaAvaliar(id); // Define o filmeId que será avaliado
    setNotaAtual(nota); // Atualiza a nota atual no estado
    abrirModal("avaliar-filme"); // Abre o modal de avaliação
  };

  // Efeito para buscar os nomes dos países que têm provedores de streaming
  useEffect(() => {
    const fetchCountryNames = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/watch/providers/regions?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`
        );
        const data = await response.json();
        const countries = {};
        data.results.forEach((country) => {
          countries[country.iso_3166_1] = country.native_name; // Armazena native_name
        });
        setCountryNames(countries);
      } catch (error) {
        console.error("Erro ao buscar nomes dos países:", error);
      }
    };

    fetchCountryNames();
  }, []);

  if (!filme && filmeId) return <Loading />; // Use um componente loader

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
                  duracaofilme={`${filme ? filme.runtime : 0} min`} // Verifique se filme não é nulo
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

                  {user?.assistir && !user.assistir[filmeId] && (
                    <AssistirFilme
                      filmeId={filmeId}
                      assistirFilme={assistirFilme}
                      removerAssistir={removerAssistir}
                      usuarioParaVer={user.assistir || []}
                    />
                  )}
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
          TextoBotao={"Sugerir filme"}
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
