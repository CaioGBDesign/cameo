import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

// Lista estática de países
const countriesList = [
  { iso_3166_1: "US", name: "United States" },
  { iso_3166_1: "GB", name: "United Kingdom" },
  { iso_3166_1: "FR", name: "France" },
  { iso_3166_1: "DE", name: "Germany" },
  { iso_3166_1: "IT", name: "Italy" },
  { iso_3166_1: "ES", name: "Spain" },
  // Adicione mais países conforme necessário
];

const ModalFiltros = ({ onClose, user, onSelectMovie }) => {
  const modalRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [genres, setGenres] = useState([]); // Estado para armazenar os gêneros
  const [anoLancamento, setAnoLancamento] = useState(""); // Estado para armazenar o ano de lançamento selecionado
  const [anoInicial, setAnoInicial] = useState(1937); // Definindo 1937 como o ano inicial
  const [selectedStatus, setSelectedStatus] = useState("todos"); // Estado para rastrear o status selecionado
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]); // Estado para filmes em cartaz

  useEffect(() => {
    // Função para buscar os gêneros na API do TMDb
    const fetchGenres = async () => {
      try {
        const apiKey = "c95de8d6070dbf1b821185d759532f05";
        const genreEndpoint = "https://api.themoviedb.org/3/genre/movie/list";

        const response = await fetch(`${genreEndpoint}?api_key=${apiKey}`);
        const data = await response.json();

        // Atualiza o estado com os gêneros obtidos
        setGenres(data.genres);
      } catch (error) {
        console.error("Erro ao obter os gêneros:", error);
      }
    };

    // Atualiza a função para buscar filmes em cartaz com a nova URL
    const fetchNowPlayingMovies = async () => {
      try {
        const apiKey = "c95de8d6070dbf1b821185d759532f05";
        const nowPlayingEndpoint =
          "https://api.themoviedb.org/3/movie/now_playing";

        const response = await fetch(
          `${nowPlayingEndpoint}?api_key=${apiKey}&region=BR&language=pt-BR`
        );
        const data = await response.json();

        setNowPlayingMovies(data.results);
      } catch (error) {
        console.error("Erro ao obter filmes em cartaz:", error);
      }
    };

    fetchGenres();
    fetchNowPlayingMovies();

    // Mostra o modal após um pequeno atraso para garantir a animação de abertura
    setTimeout(() => {
      setModalVisible(true);
    }, 50);

    // Esta função verifica se o clique foi fora do modal
    const handleClickOutside = (event) => {
      // Se o modal está aberto e o clique foi fora dele, fecha o modal
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal(); // Chama a função para fechar o modal
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Função para fechar o modal
  const closeModal = () => {
    setClosing(true); // Marca o modal como fechando para aplicar a animação de fechamento
    setTimeout(() => {
      onClose(); // Chama onClose após a animação de fechamento
    }, 300); // Tempo deve ser o mesmo que a duração da animação CloseDown
  };

  // Função para buscar filmes por ano de lançamento
  const fetchMoviesByYear = async (year) => {
    try {
      const apiKey = "c95de8d6070dbf1b821185d759532f05";
      const discoverEndpoint = "https://api.themoviedb.org/3/discover/movie";

      const response = await fetch(
        `${discoverEndpoint}?api_key=${apiKey}&primary_release_year=${year}`
      );
      const data = await response.json();

      // Aqui você pode tratar os dados ou atualizar outro estado com os filmes encontrados
      console.log("Filmes encontrados:", data.results);
    } catch (error) {
      console.error("Erro ao buscar filmes por ano:", error);
    }
  };

  const aplicarFiltro = () => {
    const { visto, assistir } = user; // Obtém as listas de filmes já assistidos e a assistir do usuário
    console.log("Filmes vistos:", visto);
    console.log("Filmes a assistir:", assistir);

    if (selectedStatus === "JaAssisti" && visto) {
      const vistosIds = Object.keys(visto); // Assume que as chaves são os IDs
      if (vistosIds.length > 0) {
        const randomIndex = Math.floor(Math.random() * vistosIds.length);
        const randomMovieId = vistosIds[randomIndex];
        console.log("Filme aleatório a ser assistido:", randomMovieId);
        onSelectMovie(randomMovieId);
      } else {
        console.log("Nenhum filme visto disponível.");
      }
    } else if (
      selectedStatus === "NaoAssisti" &&
      assistir &&
      Object.keys(assistir).length > 0
    ) {
      // Extraindo apenas os IDs dos filmes a assistir
      const assistirIds = Object.values(assistir); // Aqui você pega os valores que representam os IDs
      const randomIndex = Math.floor(Math.random() * assistirIds.length);
      const randomMovieId = assistirIds[randomIndex];
      console.log("Filme aleatório a assistir:", randomMovieId);
      onSelectMovie(randomMovieId);
    } else if (selectedStatus === "NosCinemas" && nowPlayingMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * nowPlayingMovies.length);
      const randomMovieId = nowPlayingMovies[randomIndex].id; // ID do filme em cartaz
      console.log("Filme aleatório em cartaz:", randomMovieId);
      onSelectMovie(randomMovieId);
    } else {
      console.log("Nenhum filme disponível para a seleção.");
    }
  };

  return (
    <>
      {modalVisible && (
        <div className={styles.modal}>
          <div
            ref={modalRef}
            className={`${styles.contModal} ${closing && styles.close}`}
          >
            <div className={styles.separador}>
              <h3>Exibir filmes que</h3>

              <div className={styles.seletor}>
                <input type="radio" id="todos" name="status" />
                <label htmlFor="todos">Todos</label>
                <input
                  type="radio"
                  id="NaoAssisti"
                  name="status"
                  value="NaoAssisti"
                  onChange={() => setSelectedStatus("NaoAssisti")}
                  checked={selectedStatus === "NaoAssisti"}
                />
                <label htmlFor="NaoAssisti">Quero assistir</label>
                <input
                  type="radio"
                  id="JaAssisti"
                  name="status"
                  value="JaAssisti"
                  onChange={() => setSelectedStatus("JaAssisti")}
                  checked={selectedStatus === "JaAssisti"}
                />
                <label htmlFor="JaAssisti">Já assisti</label>
              </div>
            </div>

            <div className={styles.separador}>
              <h3>Disponível nos cinemas</h3>

              <div className={styles.seletor}>
                <input type="radio" id="todosCinema" name="cinema" />
                <label htmlFor="todosCinema">Todos</label>
                <input
                  type="radio"
                  id="NosCinemas"
                  name="cinema"
                  value="NosCinemas"
                  onChange={() => setSelectedStatus("NosCinemas")}
                  checked={selectedStatus === "NosCinemas"}
                />
                <label htmlFor="NosCinemas">Assistir nos cinemas</label>
              </div>
            </div>
          </div>

          <div className={styles.botoesFiltro}>
            <div className={styles.baseBotoes}>
              <button className={styles.aplicar} onClick={aplicarFiltro}>
                Aplicar filtros
              </button>
              <button className={styles.fechar} onClick={closeModal}>
                <img src="/icones/fechar-filtros.svg" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalFiltros;
