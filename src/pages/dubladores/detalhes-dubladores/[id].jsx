// pages/dubladores/[id].jsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "@/services/firebaseConection";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Loading from "@/components/loading";
import styles from "./index.module.scss";
import Head from "next/head";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";
import ListaPageFilmes from "@/components/detalhesfilmes/listaPageFilmes";
import Titulolistagem from "@/components/titulolistagem";

export default function DetalhesDubladorPage() {
  const router = useRouter();
  const { id } = router.query; // id do dublador vindo da URL

  const [dublador, setDublador] = useState(null);
  const [filmesDoDublador, setFilmesDoDublador] = useState([]);
  const [filmesDetalhes, setFilmesDetalhes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiKey = "c95de8d6070dbf1b821185d759532f05";

  useEffect(() => {
    if (!id) return;

    async function buscarDetalhes() {
      try {
        // 1) Busca detalhes do dublador em /dubladores/{id}
        const docRef = doc(db, "dubladores", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDublador({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Dublador não encontrado.");
          setLoading(false);
          return;
        }

        // 2) Busca todos os filmes e filtra pelos IDs em que este dublador aparece
        const filmesSnapshot = await getDocs(collection(db, "filmes"));
        const listaFilmes = filmesSnapshot.docs
          .map((fdoc) => ({ id: fdoc.id, ...fdoc.data() }))
          .filter(
            (filme) =>
              Array.isArray(filme.dubladores) &&
              filme.dubladores.some((entrada) => entrada.dublador === id)
          )
          .map((filme) => filme.id); // fica só com o ID do filme

        setFilmesDoDublador(listaFilmes);
      } catch (err) {
        console.error("Erro ao buscar detalhes ou filmes:", err);
        setError("Erro ao carregar detalhes.");
      }
    }

    buscarDetalhes();
  }, [id]);

  // Quando filmesDoDublador mudar, chamar TMDB para obter detalhes
  useEffect(() => {
    if (filmesDoDublador.length === 0) {
      setLoading(false);
      return;
    }

    async function fetchMovieDetails() {
      try {
        const requests = filmesDoDublador.map((movieId) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=pt-BR`
          ).then((res) => {
            if (!res.ok)
              throw new Error(`Filme ${movieId} não encontrado no TMDB.`);
            return res.json();
          })
        );

        const results = await Promise.all(requests);
        // Construir array no formato que ListaPageFilmes espera:
        const detalhesFormatados = results.map((movie) => ({
          id: movie.id.toString(), // certifique-se de ser string
          title: movie.title,
          poster_path: movie.poster_path,
          // caso não tenha nota no dublador, use TMDB vote_average arredondado
          avaliacao: {
            nota: movie.vote_average ? Math.round(movie.vote_average) : 0,
          },
        }));

        setFilmesDetalhes(detalhesFormatados);
      } catch (err) {
        console.error("Erro ao buscar detalhes do TMDB:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [filmesDoDublador]);

  function calcularIdade(dataNascimento) {
    if (!dataNascimento) return "-";

    const hoje = new Date();
    const nascimento = new Date(dataNascimento);

    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mesAtual = hoje.getMonth();
    const mesNascimento = nascimento.getMonth();

    if (
      mesAtual < mesNascimento ||
      (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())
    ) {
      idade--;
    }

    return idade;
  }

  const getIconSrcForLink = (type) => {
    const filename = type.toLowerCase();

    // Verifica se o nome bate com os disponíveis
    const validIcons = ["instagram", "youtube", "tiktok", "imdb", "site"];

    return validIcons.includes(filename)
      ? `/icones/${filename}.svg`
      : "/icones/default.svg";
  };

  function converterEstadoParaSigla(estado) {
    const mapaSiglas = {
      "São Paulo": "SP",
      "Rio de Janeiro": "RJ",
    };

    return mapaSiglas[estado] || estado;
  }

  function formatarDataNascimento(dataString) {
    if (!dataString) return "";

    const meses = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];

    const [ano, mes, dia] = dataString.split("-");
    return `${dia} ${meses[parseInt(mes) - 1]} de ${ano}`;
  }

  if (loading || !dublador) return <Loading />;

  if (error) return <p className={styles.errorMessage}>{error}</p>;

  return (
    <>
      <Head>
        <title>Cadastrar Dublador</title>
        <meta
          name="description"
          content="Página para adicionar dubladores à base de dados"
        />
      </Head>

      {/** Header responsivo */}
      {typeof window !== "undefined" && window.innerWidth < 768 ? (
        <Header />
      ) : (
        <HeaderDesktop />
      )}
      <div className={styles.containerDetalhes}>
        <div className={styles.contDetalhesBox}>
          <div className={styles.detalhesBox}>
            <div className={styles.detalhesDoDublador}>
              <div className={styles.infoGrupo}>
                <div className={styles.imagemDublador}>
                  <img
                    src={dublador.imagemUrl || "/sem-imagem.png"}
                    alt={dublador.nomeArtistico}
                  />
                </div>

                <div className={styles.nomeNascimento}>
                  <h1>{dublador.nomeArtistico}</h1>
                  <p>{formatarDataNascimento(dublador.dataNascimento)}</p>
                </div>

                <div className={styles.idadeNascimento}>
                  <div className={styles.detalheNascimento}>
                    <p>{calcularIdade(dublador.dataNascimento)}</p>
                    <span>anos</span>
                  </div>

                  <div className={styles.detalheNascimento}>
                    <p>{dublador.paisNascimento}</p>
                    <span>nacionalidade</span>
                  </div>

                  <div className={styles.detalheNascimento}>
                    <p>{dublador.estadoNascimento}</p>
                    <span>nacionalidade</span>
                  </div>
                </div>

                <div className={styles.detalheNascimento}>
                  <p>{dublador.nomeCompleto}</p>
                  <span>nome completo</span>
                </div>
              </div>

              <div className={styles.infoGrupo}>
                <div className={styles.tituloInfo}>
                  <h2>Áreas de Atuação</h2>
                </div>

                <div className={styles.ocupacoes}>
                  {dublador.ocupacoes.map((ocupacao, index) => (
                    <div key={index} className={styles.ocupacaoItem}>
                      {ocupacao}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.infoGrupo}>
                <div className={styles.tituloInfo}>
                  <h2>Família</h2>
                </div>

                {dublador.familiares && dublador.familiares.length > 0 && (
                  <div className={styles.dadosGrupo}>
                    <ul className={styles.lista}>
                      {dublador.familiares.map((fam, idx) => (
                        <li key={idx} className={styles.boxLista}>
                          <a
                            href={fam.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{fam.relacao}</span>
                            <p>{fam.nome}</p>
                          </a>

                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fseta-direita.svg?alt=media&token=7cc2c37f-f8d8-4643-aefb-c5190b01e3e3"
                            alt="seta  usuário não logado"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className={styles.infoGrupo}>
                <div className={styles.tituloInfo}>
                  <h2>Informações profissionais</h2>
                </div>

                <div className={styles.dadosGrupo}>
                  <div className={styles.lista}>
                    <div className={styles.boxLista}>
                      <span>Quando iniciou na dublagem</span>
                      <p>{dublador.anoInicioDublagem}</p>
                    </div>

                    <div className={styles.boxLista}>
                      <span>Anos em atividade</span>
                      <p>{calcularIdade(dublador.anoInicioDublagem)}</p>
                    </div>

                    <div className={styles.boxLista}>
                      <span>Onde dubla</span>
                      <p>
                        {Array.isArray(dublador.lugarDublagem)
                          ? dublador.lugarDublagem.map((lugar, idx) => (
                              <span key={idx}>
                                {converterEstadoParaSigla(lugar)}
                                {idx < dublador.lugarDublagem.length - 1 &&
                                  ", "}
                              </span>
                            ))
                          : converterEstadoParaSigla(dublador.lugarDublagem)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.infoGrupo}>
                <div className={styles.tituloInfo}>
                  <h2>Redes</h2>
                </div>

                {dublador.links && dublador.links.length > 0 && (
                  <div className={styles.dadosGrupo}>
                    <div className={styles.lista}>
                      {dublador.links.map((lnk, idx) => (
                        <div key={idx} className={styles.boxLista}>
                          <a
                            href={lnk.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.linkAnchor}
                          >
                            <img
                              src={getIconSrcForLink(lnk.type)}
                              alt={lnk.type}
                              width={18}
                              height={18}
                              style={{ marginRight: "6px" }}
                            />
                            <p>
                              {lnk.type.charAt(0).toUpperCase() +
                                lnk.type.slice(1)}
                            </p>
                          </a>

                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fseta-direita.svg?alt=media&token=7cc2c37f-f8d8-4643-aefb-c5190b01e3e3"
                            alt="seta  usuário não logado"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.infoGrupo}>
                <div className={styles.dadosGrupo}>
                  <div className={styles.lista}>
                    <div className={styles.boxLista}>
                      <span>Status de atividade</span>
                      <p>{dublador.status}</p>
                    </div>

                    <div className={styles.boxLista}>
                      <span>Código do dublador</span>
                      <p>{dublador.codigo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* === FILMES QUE DUBLAR NO TMDB === */}
            <div className={styles.filmesQueDublou}>
              {filmesDetalhes.length > 0 && (
                <div className={styles.listaFilmesDublador}>
                  <Titulolistagem
                    quantidadeFilmes={filmesDetalhes.length}
                    titulolistagem="Filmes que dublou"
                  />

                  <div className={styles.dadosGrupo}>
                    <ListaPageFilmes
                      listagemDeFilmes={filmesDetalhes}
                      loading={false}
                      mostrarEstrelas={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
