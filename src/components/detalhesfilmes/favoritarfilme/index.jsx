import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider"; // Hook para verificar se é mobile
import ModalLoginCadastro from "@/components/modais/ModalLoginCadastro";

const FavoritarFilme = ({
  filmeId,
  salvarFilme,
  removerFilme,
  usuarioFavoritos,
}) => {
  const { user } = useAuth();
  const [favoritado, setFavoritado] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter(); // Hook para acessar o roteador
  const isMobile = useIsMobile();

  useEffect(() => {
    // Verifica se o filme está na lista de favoritos do usuário
    if (usuarioFavoritos.includes(filmeId)) {
      setFavoritado(true);
    } else {
      setFavoritado(false);
    }
  }, [usuarioFavoritos, filmeId]);

  const closeModal = () => {
    console.log("Fechando o modal...");
    setIsClosing(true);
    setTimeout(() => {
      console.log("Chamando onClose após animação...");
      setShowLoginModal(false); // Fecha o modal de login
    }, 300);
  };

  const handleClick = (event) => {
    event.preventDefault(); // Evita comportamento padrão

    // Verifica se o usuário está autenticado
    if (!user) {
      // Se for mobile, redireciona para a página de login
      if (isMobile) {
        console.log(
          "Usuário não autenticado em dispositivo móvel. Redirecionando para /login..."
        );
        window.location.href = "/login"; // Redireciona para a página de login
        return;
      }

      // Se não for mobile, exibe o modal de login
      console.log("Usuário não autenticado. Abrindo modal de login...");
      setShowLoginModal(true); // Exibe o modal de login
      return;
    }

    // Se o filme já estiver favoritado, remove da lista
    if (favoritado) {
      removerFilme(filmeId);
    } else {
      salvarFilme(filmeId); // Caso contrário, adiciona aos favoritos
    }
  };

  return (
    <div className={styles.favoritarFilme}>
      <button onClick={handleClick}>
        {favoritado ? (
          <img src="icones/favoritos-marcados.svg" alt="Favorito" />
        ) : (
          <img src="icones/favoritos-desmarcados.svg" alt="Não favorito" />
        )}
      </button>

      {showLoginModal && !isMobile && (
        <ModalLoginCadastro closeModal={closeModal} isClosing={isClosing} />
      )}
    </div>
  );
};

export default FavoritarFilme;
