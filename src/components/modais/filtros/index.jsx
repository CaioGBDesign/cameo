import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

const ModalFiltros = ({ onClose }) => {
  const modalRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [genres, setGenres] = useState([]); // Estado para armazenar os gêneros
  const [anoLancamento, setAnoLancamento] = useState(""); // Estado para armazenar o ano de lançamento selecionado
  const [anoInicial, setAnoInicial] = useState(1937); // Definindo 1937 como o ano inicial

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

    // Mostra o modal após um pequeno atraso para garantir a animação de abertura
    setTimeout(() => {
      setModalVisible(true);
    }, 50);

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
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

  // Função para aplicar o filtro por ano de lançamento
  const aplicarFiltro = () => {
    if (anoLancamento) {
      fetchMoviesByYear(anoLancamento);
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
                <input type="radio" id="NaoAssisti" name="status" />
                <label htmlFor="NaoAssisti">Não assisti</label>
                <input type="radio" id="JaAssisti" name="status" />
                <label htmlFor="JaAssisti">Já assisti</label>
              </div>
            </div>

            <div className={styles.separador}>
              <h3>Disponível nos cinemas</h3>

              <div className={styles.seletor}>
                <input type="radio" id="todosCinema" name="cinema" />
                <label htmlFor="todosCinema">Todos</label>
                <input type="radio" id="NosCinemas" name="cinema" />
                <label htmlFor="NosCinemas">Assistir nos cinemas</label>
              </div>
            </div>

            <div className={styles.separador}>
              <h3>Streaming</h3>

              <div className={styles.streaming}>
                <input type="radio" id="netflix" name="servicos" />
                <label htmlFor="netflix">
                  <img src="/icones/servicos/netflix.svg" alt="Netflix" />
                </label>
                <input type="radio" id="prime-video" name="servicos" />
                <label htmlFor="prime-video">
                  <img
                    src="/icones/servicos/prime-video.svg"
                    alt="prime video"
                  />
                </label>
                <input type="radio" id="hbo" name="servicos" />
                <label htmlFor="hbo">
                  <img src="/icones/servicos/hbo.svg" alt="hbo" />
                </label>
                <input type="radio" id="disney" name="servicos" />
                <label htmlFor="disney">
                  <img
                    src="/icones/servicos/disney-plus.svg"
                    alt="disney plus"
                  />
                </label>
                <input type="radio" id="star" name="servicos" />
                <label htmlFor="star">
                  <img src="/icones/servicos/star-plus.svg" alt="star plus" />
                </label>
                <input type="radio" id="youtube" name="servicos" />
                <label htmlFor="youtube">
                  <img src="/icones/servicos/youtube.svg" alt="youtube" />
                </label>
                <input type="radio" id="apple" name="servicos" />
                <label htmlFor="apple">
                  <img src="/icones/servicos/apple-tv.svg" alt="apple tv" />
                </label>
                <input type="radio" id="paramount" name="servicos" />
                <label htmlFor="paramount">
                  <img src="/icones/servicos/paramount.svg" alt="paramount" />
                </label>
              </div>
            </div>

            <div className={styles.separador}>
              <h3>Categoria</h3>

              <div className={styles.seletor}>
                <input type="radio" id="todosCategoria" name="categoria" />
                <label htmlFor="todosCategoria">Todos</label>

                <input type="radio" id="animacao" name="categoria" />
                <label htmlFor="animacao">Animação</label>

                <input type="radio" id="aventura" name="categoria" />
                <label htmlFor="aventura">Aventura</label>

                <input type="radio" id="acao" name="categoria" />
                <label htmlFor="acao">Ação</label>

                <input type="radio" id="comedia" name="categoria" />
                <label htmlFor="comedia">Comédia</label>

                <input type="radio" id="crime" name="categoria" />
                <label htmlFor="crime">Crime</label>

                <input type="radio" id="documentarios" name="categoria" />
                <label htmlFor="documentarios">Documentarios</label>

                <input type="radio" id="drama" name="categoria" />
                <label htmlFor="drama">Drama</label>

                <input type="radio" id="familia" name="categoria" />
                <label htmlFor="familia">Família</label>

                <input type="radio" id="fantasia" name="categoria" />
                <label htmlFor="fantasia">Fantasia</label>

                <input type="radio" id="faroeste" name="categoria" />
                <label htmlFor="faroeste">Faroeste</label>

                <input type="radio" id="ficcao-cientifica" name="categoria" />
                <label htmlFor="ficcao-cientifica">Ficção científica</label>

                <input type="radio" id="guerra" name="categoria" />
                <label htmlFor="guerra">Guerra</label>

                <input type="radio" id="historia" name="categoria" />
                <label htmlFor="historia">História</label>

                <input type="radio" id="misterio" name="categoria" />
                <label htmlFor="misterio">Mistério</label>

                <input type="radio" id="musical" name="categoria" />
                <label htmlFor="musical">Musical</label>

                <input type="radio" id="romance" name="categoria" />
                <label htmlFor="romance">Romance</label>

                <input type="radio" id="terror" name="categoria" />
                <label htmlFor="terror">Terror</label>

                <input type="radio" id="thriller" name="categoria" />
                <label htmlFor="thriller">Thriller</label>
              </div>
            </div>

            <div className={styles.separador}>
              <h3>Classificação indicativa</h3>

              <div className={styles.seletor}>
                <input
                  type="radio"
                  id="todosClassificacao"
                  name="classificacao"
                />
                <label htmlFor="todosClassificacao">Todos</label>

                <input type="radio" id="livre" name="classificacao" />
                <label htmlFor="livre">Livre</label>

                <input type="radio" id="10 anos" name="classificacao" />
                <label htmlFor="10 anos">Livre</label>

                <input type="radio" id="12 anos" name="classificacao" />
                <label htmlFor="12 anos">Livre</label>

                <input type="radio" id="14 anos" name="classificacao" />
                <label htmlFor="14 anos">Livre</label>

                <input type="radio" id="16 anos" name="classificacao" />
                <label htmlFor="16 anos">Livre</label>

                <input type="radio" id="18 anos" name="classificacao" />
                <label htmlFor="18 anos">Livre</label>
              </div>
            </div>

            <div className={styles.separador}>
              <h3>País de origem</h3>
              <select>
                <option value="">Selecione o gênero</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.separador}>
              <h3>Ano de lançamento</h3>
              <select
                value={anoLancamento}
                onChange={(e) => setAnoLancamento(e.target.value)}
              >
                <option value="">Selecione o ano</option>
                {Array.from(
                  { length: new Date().getFullYear() - anoInicial + 1 },
                  (_, index) => new Date().getFullYear() - index
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
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
