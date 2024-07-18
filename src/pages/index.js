import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import FundoTitulos from "@/components/fundotitulos";
import { Inter } from "next/font/google";
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
import Listafilmes from "@/components/listafilmes/Listafilmes.json";
import ModalFiltros from "@/components/modais/filtros";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const [filmeId, setFilmeId] = useState(null);
  const [filme, setFilme] = useState(null);
  const [elenco, setElenco] = useState([]);
  const [diretores, setDiretores] = useState([]);
  const [servicosStreaming, setServicosStreaming] = useState([]);
  const [trailerLink, setTrailerLink] = useState(null); // Inicializa com null
  const [recomendacoes, setRecomendacoes] = useState([]);
  const [filmesExibidos, setFilmesExibidos] = useState(new Set());

  // Estado para controlar se o modal está aberto ou fechado
  const [modalAberto, setModalAberto] = useState(false);

  const selecionarFilmeAleatorio = () => {
    let randomFilmeId;

    if (filmesExibidos.size === Listafilmes.filmes.length) {
      // Reinicia se todos foram exibidos
      setFilmesExibidos(new Set());
    }

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

  // Chamando a função ao iniciar
  useEffect(() => {
    selecionarFilmeAleatorio();
  }, []);

  const selecionarFilme = (id) => {
    setFilmeId(id);
    scrollToTop(); // Opcional: rolar para o topo ao selecionar um novo filme
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Opção para rolagem suave
    });
  };

  useEffect(() => {
    selecionarFilmeAleatorio();
  }, []); // Executa uma vez quando o componente monta

  useEffect(() => {
    if (!filmeId) return;

    const fetchFilme = async () => {
      try {
        // Busca informações do filme
        const filmeResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR&append_to_response=videos,release_dates`
        );
        const filmeData = await filmeResponse.json();
        setFilme(filmeData);

        // Busca informações de elenco
        const elencoResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}/credits?api_key=c95de8d6070dbf1b821185d759532f05`
        );
        const elencoData = await elencoResponse.json();
        setElenco(elencoData.cast);

        // Busca provedores de streaming no Brasil
        const providersResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}/watch/providers?api_key=c95de8d6070dbf1b821185d759532f05`
        );
        const providersData = await providersResponse.json();

        if (providersData.results.BR && providersData.results.BR.flatrate) {
          setServicosStreaming(providersData.results.BR.flatrate);
        } else {
          setServicosStreaming([]);
        }

        // Busca recomendações
        const recomendacoesResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}/recommendations?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`
        );
        const recomendacoesData = await recomendacoesResponse.json();
        setRecomendacoes(recomendacoesData.results);

        // Encontra o link do trailer (se houver)
        const trailer = filmeData.videos.results.find(
          (video) => video.type === "Trailer"
        );

        if (trailer) {
          const videoId = trailer.key;
          setTrailerLink(`https://www.youtube.com/watch?v=${videoId}`);
        } else {
          setTrailerLink(null); // Define como null se não houver trailer disponível
        }

        // Encontra os diretores no array de equipe (crew)...
        const diretoresEncontrados = elencoData.crew
          .filter((member) => member.job === "Director")
          .map((diretor) => ({
            nome: diretor.name,
            imagemUrl: diretor.profile_path
              ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2/${diretor.profile_path}`
              : null,
          }));
        if (diretoresEncontrados.length > 0) {
          setDiretores(diretoresEncontrados);
        } else {
          setDiretores([{ nome: "Diretor não encontrado", imagemUrl: null }]);
        }
      } catch (error) {
        console.error("Erro ao buscar filme, elenco ou provedores:", error);
      }
    };

    fetchFilme();
  }, [filmeId]);

  useEffect(() => {
    // Efeito para controlar o overflow do body
    if (modalAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalAberto]);

  if (!filme) return <p>Carregando...</p>;

  // Função para abrir o modal
  const abrirModal = () => {
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
  };

  return (
    <>
      <Header />

      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.detalhesFilmes}>
          <div className={styles.informacoes}>
            <div className={styles.tituloFilmes}>
              <div className={styles.contTitulos}>
                <TitulosFilmes
                  titulofilme={filme.title}
                  generofilme={
                    filme.genres
                      ? filme.genres.map((g) => g.name).join(", ")
                      : "Gênero não disponível"
                  }
                  duracaofilme={`${filme.runtime} min`}
                  paisOrigem={
                    filme.production_countries
                      ? filme.production_countries.map((pc) => pc.iso_3166_1)
                      : []
                  }
                />

                <div className={styles.NotasFavoritos}>
                  <NotasFilmes estrelas="3" />
                  <FavoritarFilme />
                </div>
              </div>
            </div>

            <div className={styles.infoFilmes}>
              {filme.overview && filme.overview.length > 0 && (
                <Sinopse sinopse={filme.overview} />
              )}
              <NotasCameo />

              <Avaliacao avaliador={"Caio Goulart"} />

              {servicosStreaming && servicosStreaming.length > 0 && (
                <Servicos servicos={servicosStreaming} />
              )}
            </div>

            <div className={styles.elencoGeral}>
              <Dublagem />
              <hr />
              <Elenco elenco={elenco} />
              <hr />
              <Direcao diretores={diretores} />
            </div>
            <div className={styles.infoFilmes}>
              <div className={styles.detalhes}>
                <h3>Produção</h3>
                <div className={styles.producao}>
                  {filme.production_companies &&
                    filme.production_companies.map((pc) => (
                      <div className={styles.produtora} key={pc.id}>
                        <p>{pc.name}</p>
                      </div>
                    ))}
                  {!filme.production_companies && (
                    <p>Produção não disponível</p>
                  )}
                </div>
              </div>

              <div className={styles.detalhes}>
                <h3>Lançamento</h3>
                <p>{new Date(filme.release_date).toLocaleDateString()}</p>
              </div>

              <div className={styles.detalhes}>
                <h3>Classificação Indicativa</h3>
                <p>
                  {filme.release_dates &&
                  filme.release_dates.results &&
                  filme.release_dates.results.length > 0
                    ? filme.release_dates.results.find(
                        (result) => result.iso_3166_1 === "BR"
                      )?.release_dates[0]?.certification || "Não disponível"
                    : "Não disponível"}
                </p>
              </div>

              {filme.budget ? (
                <div className={styles.detalhes}>
                  <h3>Orçamento</h3>
                  <p>US$ {filme.budget.toLocaleString()}</p>
                </div>
              ) : null}

              {filme.revenue ? (
                <div className={styles.detalhes}>
                  <h3>Bilheteria</h3>
                  <p>US$ {filme.revenue.toLocaleString()}</p>
                </div>
              ) : null}

              <div className={styles.detalhes}>
                <h3>País de origem</h3>
                <p>
                  {filme.production_countries
                    ? filme.production_countries.map((pc) => pc.name).join(", ")
                    : "País não disponível"}
                </p>
              </div>

              {recomendacoes.length > 0 && (
                <div className={styles.recomendacoes}>
                  <h3>Recomendações</h3>
                  <div className={styles.contRecomendacoes}>
                    <div className={styles.scrollRecomendacoes}>
                      {recomendacoes.map((recomendacao) => (
                        <div
                          className={styles.listaRecomendacoes}
                          key={recomendacao.id}
                          onClick={() => selecionarFilme(recomendacao.id)} // Chama a função ao clicar
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${recomendacao.poster_path}`}
                            alt={recomendacao.title}
                          />
                          <span>{recomendacao.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <BaseBotoes
          TextoBotao={"Sugerir filme"}
          onClick={selecionarFilmeAleatorio}
          onClickModal={abrirModal} // Passa a função abrirModal para abrir o modal
        />

        <FundoTitulos
          exibirPlay={trailerLink ? true : false} // Define exibirPlay com base na presença de trailerLink
          capaAssistidos={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
          tituloAssistidos={filme.title}
          trailerLink={trailerLink ? trailerLink : "#"} // Passa o link do trailer para FundoTitulos
        />

        {modalAberto && <ModalFiltros onClose={() => setModalAberto(false)} />}
      </main>
    </>
  );
};

export default Home;
