import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";
import styles from "./index.module.scss";
import NotasFilmes from "@/components/botoes/notas";
import Image from "next/image";
import DeletarFilme from "@/components/modais/deletar-filmes";
import FavoritarFilme from "@/components/detalhesfilmes/favoritarfilme";
import ModalAvaliar from "@/components/modais/avaliar-filmes";
import ModalAvaliarDesktop from "@/components/modais/avaliar-filmes-desktop";
import { useIsMobile } from "@/components/DeviceProvider";

const FilmesCarousel = ({
  filmes,
  selectedFilm,
  onClose,
  excluirFilme,
  onClick,
  showDeletar = true,
}) => {
  const router = useRouter();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { user, salvarFilme, removerFilme, avaliarFilme } = useAuth();
  const [modalAberto, setModalAberto] = useState(null);
  const [filmeIdParaAvaliar, setFilmeIdParaAvaliar] = useState(null);
  const [notaAtual, setNotaAtual] = useState(0);
  const isMobile = useIsMobile();

  // Atualiza a nota ao abrir o modal
  const abrirModalAvaliar = (id) => {
    const nota = user?.visto?.[id] || 0;
    setFilmeIdParaAvaliar(id);
    setNotaAtual(nota);
    setModalAberto("avaliar-filme");
  };

  const handleAvaliarFilme = (nota) => {
    avaliarFilme(filmeIdParaAvaliar, nota);
    setModalAberto(null);
  };

  const handleSalvarFilme = (id) => {
    salvarFilme(String(id));
  };

  // Função para abrir o modal de confirmação
  const handleOpenDeleteModal = () => {
    setShowConfirmDelete(true);
  };

  // Função para confirmar a exclusão do filme
  const handleConfirmDelete = () => {
    if (selectedFilm) {
      excluirFilme(selectedFilm.id);
    }
    setShowConfirmDelete(false);
  };

  // Função para cancelar a exclusão
  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  useEffect(() => {
    const { filmeId } = router.query;
    // Garante que o filme selecionado está sempre sincronizado com a URL
    if (filmeId && selectedFilm?.id !== filmeId) {
      const filme = filmes.find((f) => f.id === filmeId);
      if (filme) {
        onClick(filme); // Assume que 'onClick' atualiza o filme selecionado
      }
    }
  }, [router.query.filmeId, filmes]);

  // Função para atualizar a URL ao clicar na imagem
  const handleImageClick = () => {
    if (selectedFilm) {
      router.push(`/?filmeId=${selectedFilm.id}`, undefined, { shallow: true });
    }
  };

  return (
    <div className={styles.modalListagem}>
      <div className={styles.fecharModalFilmes} onClick={onClose}>
        <img src="/icones/close.svg" alt="Fechar" />
      </div>

      <div className={styles.tituloGeneroDuracao}>
        <div className={styles.tituloFilme}>
          <span>{selectedFilm?.title || "Título não disponível"}</span>
        </div>
        <div className={styles.filmeGeneros}>
          {selectedFilm?.genres?.map((item, index) => (
            <div className={styles.genero} key={index}>
              <span>{item.name}</span>
            </div>
          )) || <span>Gêneros não disponíveis</span>}
        </div>
      </div>

      <div className={styles.contCarousel}>
        <div className={styles.carousel}>
          <div className={styles.slider}>
            <div className={styles.imagens}>
              <div className={styles.capaFilme} onClick={handleImageClick}>
                <Image
                  src={`https://image.tmdb.org/t/p/original/${
                    isMobile
                      ? selectedFilm?.poster_path
                      : selectedFilm?.backdrop_path
                  }`}
                  alt={`Capa do filme ${selectedFilm?.title}`}
                  layout="fill"
                  objectFit="cover"
                  quality={80}
                />
              </div>
            </div>
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
          filmeId={String(selectedFilm?.id)}
          avaliarFilme={avaliarFilme}
          usuarioFilmeVisto={user?.visto || []}
          onClickModal={() => abrirModalAvaliar(selectedFilm?.id)}
        />
        <FavoritarFilme
          filmeId={String(selectedFilm?.id)}
          salvarFilme={salvarFilme}
          removerFilme={removerFilme}
          usuarioFavoritos={user?.favoritos || []}
        />
      </div>

      {isMobile && (
        <div className={styles.fundoFilmeFoco}>
          {selectedFilm && (
            <img
              src={`https://image.tmdb.org/t/p/original/${selectedFilm?.poster_path}`}
              alt={`Fundo do filme ${selectedFilm?.title}`}
            />
          )}
        </div>
      )}

      {showConfirmDelete && (
        <DeletarFilme
          TituloFilme={selectedFilm?.title}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}

      {modalAberto === "avaliar-filme" &&
        (isMobile ? (
          <ModalAvaliar
            filmeId={filmeIdParaAvaliar}
            nota={notaAtual}
            onClose={() => setModalAberto(null)}
          />
        ) : (
          <ModalAvaliarDesktop
            filmeId={filmeIdParaAvaliar}
            nota={notaAtual}
            onClose={() => setModalAberto(null)}
          />
        ))}
    </div>
  );
};

export default FilmesCarousel;
