import React, { useState, useEffect, lazy, Suspense } from "react";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/router";
import Header from "@/components/Header";
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
import Classificacao from "@/components/detalhesfilmes/classificacao";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });
const FundoTitulos = lazy(() => import("@/components/fundotitulos"));

const Loader = () => (
  <div className={styles.loading}>
    <div className={styles.loadingCont}>
      <div className={styles.loadBola}></div>
      <div className={styles.loadBola}></div>
      <div className={styles.loadBola}></div>
      <div className={styles.loadBola}></div>
      <div className={styles.loadBola}></div>
    </div>
  </div>
);

const Home = () => {
  const router = useRouter();
  const { filmeId: queryFilmeId } = router.query;
  console.log("Query Filme ID:", queryFilmeId);
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
    // Verifica se há um filmeId na query
    if (queryFilmeId && queryFilmeId !== filmeId) {
      console.log("Definindo filmeId a partir da query:", queryFilmeId);
      setFilmeId(queryFilmeId);
      router.push(`/?filmeId=${queryFilmeId}`);
    }
  }, [queryFilmeId, filmeId, router]);

  useEffect(() => {
    // Somente seleciona um filme aleatório se filmeId não estiver definido
    if (!filmeId) {
      console.log("Selecionando filme aleatório");
      selecionarFilmeAleatorio();
    }
  }, [filmeId]);

  useEffect(() => {
    if (!filmeId) return;

    const fetchFilme = async () => {
      console.log("Buscando filme com ID:", filmeId);

      try {
        const filmeResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR&append_to_response=videos,release_dates`
        );
        const filmeData = await filmeResponse.json();
        console.log("Dados do filme:", filmeData);
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
      const nota = user.visto[filmeIdParaAvaliar] || 0; // Acesso direto ao objeto
      setNotaAtual(nota);
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
    const nota = user?.visto?.[id] || 0; // Obtém a nota do filme
    setFilmeIdParaAvaliar(id);
    setNotaAtual(nota); // Armazena a nota atual no estado
    abrirModal("avaliar-filme");
  };

  useEffect(() => {
    if (!filmeId) return;

    const fetchFilme = async () => {
      // código para buscar o filme e definir os estados
    };

    fetchFilme();
  }, [filmeId]);

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
              {filme && filme.overview && <Sinopse sinopse={filme.overview} />}
              <NotasCameo />
              <Avaliacao avaliador={"Caio Goulart"} />
              {servicosStreaming.length > 0 && (
                <Servicos servicos={servicosStreaming} />
              )}
            </div>

            <Suspense fallback={<Loader />}>
              <div className={styles.elencoGeral}>
                <Dublagem />
                <hr />
                <Elenco elenco={elenco} />
                <hr />
                <Direcao diretores={diretores} />
              </div>
            </Suspense>

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

              {filme && filme.release_dates && (
                <Classificacao releaseDates={filme.release_dates.results} />
              )}

              {filme &&
                filme.budget > 0 && ( // Verifica se o orçamento é maior que zero
                  <div className={styles.detalhes}>
                    <h3>Orçamento</h3>
                    <p>US$ {filme.budget.toLocaleString()}</p>
                  </div>
                )}

              {filme &&
                filme.revenue > 0 && ( // Verifica se a bilheteira é maior que zero
                  <div className={styles.detalhes}>
                    <h3>Bilheteira</h3>
                    <p>US$ {filme.revenue.toLocaleString()}</p>
                  </div>
                )}

              <div className={styles.detalhes}>
                <h3>País de origem</h3>
                <div className={styles.producao}>
                  {filme && filme.production_countries.length > 0 ? (
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
                          <Suspense fallback={<Loader />}>
                            <div className={styles.fotoRecomendacoes}>
                              <Image
                                src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${recomendacao.poster_path}`}
                                alt={recomendacao.title}
                                fill
                                quality={50} // Ajuste a qualidade se necessário
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className={styles.objectFit}
                              />
                            </div>
                          </Suspense>
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

        <Suspense fallback={<Loader />}>
          <FundoTitulos
            exibirPlay={!!trailerLink}
            capaAssistidos={`https://image.tmdb.org/t/p/original/${
              filme ? filme.poster_path : ""
            }`}
            tituloAssistidos={filme ? filme.title : "Título não disponível"}
            trailerLink={trailerLink || "#"}
          />
        </Suspense>

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
