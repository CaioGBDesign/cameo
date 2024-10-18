import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";
import styles from "./index.module.scss";
import NotasFilmes from "@/components/botoes/notas";
import Image from "next/image";
import DeletarFilme from "@/components/modais/deletar-filmes";
import FavoritarFilme from "@/components/detalhesfilmes/favoritarfilme";
import ModalAvaliar from "@/components/modais/avaliar-filmes";

const FilmesCarousel = ({
  filmes,
  selectedFilm,
  onClose,
  excluirFilme,
  onClick,
  showDeletar = true,
}) => {
  const [imagemFoco, setImagemFoco] = useState(0);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const carouselRef = useRef(null);
  const router = useRouter();
  const { user, salvarFilme, removerFilme, avaliarFilme } = useAuth();
  const [modalAberto, setModalAberto] = useState(null);
  const [filmeIdParaAvaliar, setFilmeIdParaAvaliar] = useState(null);
  const [notaAtual, setNotaAtual] = useState(0);
  const [autoScroll, setAutoScroll] = useState(true); // Estado para controle da rolagem automática

  // Atualiza a nota ao abrir o modal
  const abrirModalAvaliar = (id) => {
    const nota = user?.visto?.[id] || 0; // Obtém a nota do filme
    setFilmeIdParaAvaliar(id);
    setNotaAtual(nota); // Armazena a nota atual no estado
    setModalAberto("avaliar-filme"); // Altera o estado do modal para aberto
    setAutoScroll(false); // Desativa a rolagem automática ao abrir o modal
  };

  // Função para avaliar filme
  const handleAvaliarFilme = (nota) => {
    console.log("Avaliando filme:", filmeIdParaAvaliar, "com nota:", nota);
    avaliarFilme(filmeIdParaAvaliar, nota); // Chama a função para avaliar o filme
    setModalAberto(null); // Fecha o modal
  };

  const handleSalvarFilme = (id) => {
    if (typeof id === "string") {
      console.log("Salvando filme:", id);
      salvarFilme(id);
    } else {
      console.error("O ID do filme deve ser uma string. Recebido:", id);
      salvarFilme(String(id)); // Converte o ID para string, se necessário
    }
  };

  // Monitora mudanças em imagemFoco e loga o filme correspondente
  useEffect(() => {
    if (filmes[imagemFoco]) {
      console.log("Filme em foco mudou:", filmes[imagemFoco]);
    }
  }, [imagemFoco, filmes]);

  // Atualiza imagemFoco com base no selectedFilm
  useEffect(() => {
    if (selectedFilm && filmes.length > 0) {
      const selectedIndex = filmes.findIndex(
        (filme) => filme.id === selectedFilm.id
      );
      if (selectedIndex !== -1) {
        setImagemFoco(selectedIndex);
      }
    }
  }, [selectedFilm, filmes]);

  // Atualiza a posição de rolagem do carrossel para a imagem em foco
  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.scrollWidth / filmes.length;
      carouselRef.current.scrollLeft = imagemFoco * itemWidth; // Ajusta a rolagem para a imagem em foco
    }
    console.log("Filme em foco:", filmes[imagemFoco]?.title);
  }, [imagemFoco, filmes]);

  // Função para redirecionar ao clicar em uma imagem
  const handleImageClick = (index) => {
    const selectedFilmeId = filmes[index].id; // Obtenha o ID do filme
    router.push(`/?filmeId=${selectedFilmeId}`); // Redireciona para a home com o ID do filme
  };

  // Função para limitar a frequência com que a função de rolagem é chamada
  const debounceScroll = (func, delay) => {
    let timeout;
    return function (...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  // Calcula o índice da imagem em foco com base na posição de rolagem
  const handleScroll = () => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.scrollWidth / filmes.length;
      const scrollPosition = carouselRef.current.scrollLeft;
      const newIndex = Math.round(scrollPosition / itemWidth);

      console.log("Scroll Position:", scrollPosition);
      console.log("Item Width:", itemWidth);
      console.log("New Index:", newIndex);

      // Atualiza imagemFoco se newIndex for diferente de 0
      if (newIndex === 0 || newIndex !== imagemFoco) {
        setImagemFoco(newIndex);
        console.log("Imagem em foco atualizada para:", newIndex);
      } else {
        console.log("Retornando ao mesmo filme:", filmes[imagemFoco]);
      }
    }
  };

  // Configura o listener de rolagem e garante que seja removido quando o componente for desmontado
  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (carouselElement) {
      const debouncedScroll = debounceScroll(handleScroll, 100); // 100ms de debounce
      carouselElement.addEventListener("scroll", debouncedScroll);

      return () => {
        carouselElement.removeEventListener("scroll", debouncedScroll);
      };
    }
  }, [filmes]);

  // Verificações de renderização
  console.log("Renderizando filme em foco:", filmes[imagemFoco]);

  // Função para abrir o modal de confirmação
  const handleOpenDeleteModal = () => {
    setShowConfirmDelete(true);
  };

  // Função para confirmar a exclusão do filme
  const handleConfirmDelete = () => {
    if (selectedFilm) {
      excluirFilme(selectedFilm.id); // Passando o ID do filme
    }
    setShowConfirmDelete(false);
  };

  // Função para cancelar a exclusão
  const handleCancelDelete = () => {
    setShowConfirmDelete(false); // Fecha o modal
  };

  return (
    <div className={styles.modalListagem}>
      <div className={styles.fecharModalFilmes} onClick={onClose}>
        <img src="/icones/close.svg" alt="Fechar" />
      </div>
      <div className={styles.tituloGeneroDuracao}>
        <div className={styles.tituloFilme}>
          <span>{filmes[imagemFoco]?.title || "Título não disponível"}</span>
        </div>
        <div className={styles.filmeGeneros}>
          {filmes[imagemFoco]?.genres?.map((item, index) => (
            <div className={styles.genero} key={index}>
              <span>{item.name}</span>
            </div>
          )) || <span>Gêneros não disponíveis</span>}
        </div>
      </div>
      <div className={styles.contCarousel}>
        <div className={styles.carousel} ref={carouselRef}>
          <div className={styles.slider}>
            {filmes.map((filme, index) => (
              <div
                className={`${styles.imagens} ${
                  imagemFoco === index ? styles.destaque : ""
                }`}
                key={index}
                style={{ scrollSnapAlign: "center" }}
                onClick={() => handleImageClick(index)}
              >
                <div className={styles.capaFilme}>
                  <Image
                    src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                    alt={`Capa do filme ${filme.title}`}
                    layout="fill"
                    objectFit="cover"
                    quality={50}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.avaliacaoFilme}>
        {showDeletar && (
          <div className={styles.deletarFilme} onClick={handleOpenDeleteModal}>
            <img src="icones/deletar.svg" alt="" />
          </div>
        )}

        <NotasFilmes
          filmeId={String(filmes[imagemFoco]?.id)}
          avaliarFilme={avaliarFilme}
          usuarioFilmeVisto={user?.visto || []}
          onClickModal={() => {
            abrirModalAvaliar(filmes[imagemFoco]?.id);
            setAutoScroll(false); // Desativa a rolagem automática ao abrir o modal
          }}
        />
        <FavoritarFilme
          filmeId={String(filmes[imagemFoco]?.id)}
          salvarFilme={salvarFilme}
          removerFilme={removerFilme}
          usuarioFavoritos={user?.favoritos || []}
          onClick={() => setAutoScroll(false)}
        />
      </div>

      <div className={styles.fundoFilmeFoco}>
        {filmes[imagemFoco] && (
          <img
            src={`https://image.tmdb.org/t/p/original/${filmes[imagemFoco]?.poster_path}`}
            alt={`Fundo do filme ${filmes[imagemFoco]?.title}`}
          />
        )}
      </div>

      {showConfirmDelete && (
        <DeletarFilme
          TituloFilme={filmes[imagemFoco]?.title} // Passe o título do filme
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
      {modalAberto === "avaliar-filme" && (
        <ModalAvaliar
          filmeId={filmeIdParaAvaliar}
          nota={notaAtual}
          onClose={() => setModalAberto(null)} // Fecha o modal
        />
      )}
    </div>
  );
};

export default FilmesCarousel;
