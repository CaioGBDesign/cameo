import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";
import styles from "./index.module.scss";
import Image from "next/image";
import DeletarFilme from "@/components/modais/deletar-filmes";
import FavoritarFilme from "@/components/detalhesfilmes/favoritarfilme";
import { useIsMobile } from "@/components/DeviceProvider";
import Estrelas from "@/components/estrelas";

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
  const { user, salvarFilme, removerFilme } = useAuth();
  const [modalAberto, setModalAberto] = useState(null);
  const isMobile = useIsMobile();

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
      router.push(`/filme-aleatorio/?id=${selectedFilm.id}`, undefined, {
        shallow: true,
      });
    }
  };

  return (
    <div className={styles.modalListagem}>
      <div className={styles.fecharModalFilmes} onClick={onClose}>
        <img
          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fclose.svg?alt=media&token=c9af99dc-797e-4364-9df2-5ed76897cc92"
          alt="Fechar"
        />
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
            <img
              src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fdeletar.svg?alt=media&token=8542c24b-5124-4c10-91ee-a4918550dc92"
              alt=""
            />
          </div>
        )}
        <FavoritarFilme
          filmeId={String(selectedFilm?.id)}
          salvarFilme={salvarFilme}
          removerFilme={removerFilme}
          usuarioFavoritos={user?.favoritos || []}
        />

        {user?.visto?.[String(selectedFilm?.id)]?.nota && (
          <div className={styles.avaliacaoUsuario}>
            <Estrelas
              estrelas={user.visto[String(selectedFilm.id)].nota}
              starWidth="16px" // Ajuste conforme necessário
            />
          </div>
        )}
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
    </div>
  );
};

export default FilmesCarousel;
