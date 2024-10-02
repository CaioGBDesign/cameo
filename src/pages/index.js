import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
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
import AssistirFilme from "@/components/detalhesfilmes/paraver";
import Listafilmes from "@/components/listafilmes/listafilmes.json";
import ModalFiltros from "@/components/modais/filtros";
import ModalAvaliar from "@/components/modais/avaliar-filmes";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
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

  const abrirModal = (modalTipo) => {
    setModalAberto(modalTipo);
  };

  const fecharModal = () => {
    setModalAberto(null);
  };

  const {
    user,
    salvarFilme,
    removerFilme,
    assistirFilme,
    removerAssistir,
    avaliarFilme,
    removerVisto,
  } = useAuth();

  const selecionarFilmeRecomendado = (id) => {
    setFilmeId(String(id)); // Converter id para string
    setFilme(null); // Limpa o estado do filme para forçar um novo fetch
    scrollToTop();
  };

  const Loader = () => <div>Carregando...</div>;

  const selecionarFilmeAleatorio = () => {
    let randomFilmeId;

    if (filmesExibidos.size === Listafilmes.filmes.length) {
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

  useEffect(() => {
    selecionarFilmeAleatorio();
  }, []);

  useEffect(() => {
    if (!filmeId) return;

    const fetchFilme = async () => {
      try {
        const filmeResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR&append_to_response=videos,release_dates`
        );
        const filmeData = await filmeResponse.json();
        setFilme(filmeData);

        const elencoResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}/credits?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`
        );
        const elencoData = await elencoResponse.json();
        setElenco(elencoData.cast);

        const providersResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}/watch/providers?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`
        );
        const providersData = await providersResponse.json();
        setServicosStreaming(providersData.results.BR?.flatrate || []);

        const recomendacoesResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}/recommendations?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`
        );
        const recomendacoesData = await recomendacoesResponse.json();
        setRecomendacoes(recomendacoesData.results);

        const trailer = filmeData.videos.results.find(
          (video) => video.type === "Trailer"
        );
        setTrailerLink(
          trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
        );

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
        console.error("Erro ao buscar filme, elenco ou provedores:", error);
      }
    };

    fetchFilme();
  }, [filmeId]);

  useEffect(() => {
    if (filmeIdParaAvaliar && user) {
      const fetchNota = async () => {
        const nota =
          user.visto && user.visto[filmeIdParaAvaliar] !== undefined
            ? user.visto[filmeIdParaAvaliar]
            : 0; // Se não houver nota, usa 0 como padrão
        setNotaAtual(nota);
      };

      fetchNota();
    }
  }, [filmeIdParaAvaliar, user]);

  useEffect(() => {
    document.body.style.overflow = modalAberto ? "hidden" : "auto";
  }, [modalAberto]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSalvarFilme = (id) => {
    console.log("Salvando filme:", id);
    salvarFilme(id);
  };

  const handleAssistirFilme = (id) => assistirFilme(id);

  const handleAvaliarFilme = (id) => {
    console.log("Avaliando filme:", id);
    avaliarFilme(id);
  };

  const abrirModalAvaliar = (id) => {
    setFilmeIdParaAvaliar(id);
    abrirModal("avaliar-filme");
  };

  useEffect(() => {
    if (!filmeId) return;

    const fetchFilme = async () => {
      // código para buscar o filme e definir os estados
    };

    fetchFilme();
  }, [filmeId]);

  if (!filme && filmeId) return <Loader />; // Use um componente loader

  return (
    <>
      <Header />
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
                />
                <div className={styles.NotasFavoritos}>
                  <NotasFilmes
                    filmeId={filmeId}
                    avaliarFilme={avaliarFilme}
                    removerVisto={removerVisto}
                    usuarioFilmeVisto={user?.visto || []}
                    onClickModal={() => abrirModalAvaliar(filmeId)}
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
              {filme && filme.overview && <Sinopse sinopse={filme.overview} />}
              <NotasCameo />
              <Avaliacao avaliador={"Caio Goulart"} />
              {servicosStreaming.length > 0 && (
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

              <div className={styles.detalhes}>
                <h3>Lançamento</h3>
                <p>
                  {filme && filme.release_date
                    ? new Date(filme.release_date).toLocaleDateString()
                    : "Data de lançamento não disponível"}
                </p>
              </div>

              <div className={styles.detalhes}>
                <h3>Classificação Indicativa</h3>
                <p>
                  {filme && filme.release_dates && filme.release_dates.results
                    ? filme.release_dates.results.find(
                        (result) => result.iso_3166_1 === "BR"
                      )?.release_dates[0]?.certification || "Não disponível"
                    : "Classificação não disponível"}
                </p>
              </div>

              {filme && filme.budget && (
                <div className={styles.detalhes}>
                  <h3>Orçamento</h3>
                  <p>US$ {filme.budget.toLocaleString()}</p>
                </div>
              )}

              {filme && filme.revenue && (
                <div className={styles.detalhes}>
                  <h3>Bilheteira</h3>
                  <p>US$ {filme.revenue.toLocaleString()}</p>
                </div>
              )}

              <div className={styles.detalhes}>
                <h3>País de origem</h3>
                <p>
                  {filme && filme.production_countries
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
                          onClick={
                            () =>
                              selecionarFilmeRecomendado(
                                String(recomendacao.id)
                              ) // Converter ID para string
                          }
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
          botaoPrimario={true} // Habilita o botão primário
          botaoSecundario={true} // Habilita o botão secundário
          onClick={selecionarFilmeAleatorio} // Função para sugerir um filme
          onClickModal={() => abrirModal("filtros")} // Função para abrir o modal
        />

        <FundoTitulos
          exibirPlay={!!trailerLink}
          capaAssistidos={`https://image.tmdb.org/t/p/original/${
            filme ? filme.poster_path : ""
          }`}
          tituloAssistidos={filme ? filme.title : "Título não disponível"}
          trailerLink={trailerLink || "#"}
        />

        {modalAberto === "filtros" && <ModalFiltros onClose={fecharModal} />}
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
