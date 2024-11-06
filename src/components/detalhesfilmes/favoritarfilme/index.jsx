import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import { useIsMobile } from "@/components/DeviceProvider"; // Importando o hook para verificar o dispositivo
import ModalLoginCadastro from "@/components/modais/ModalLoginCadastro"; // Importando o componente de modal de login

const FavoritarFilme = ({
  filmeId,
  salvarFilme,
  removerFilme,
  usuarioLogado, // Agora estamos verificando se o usuário está logado
}) => {
  const [favoritado, setFavoritado] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // Estado para controlar a exibição do modal
  const [isClosing, setIsClosing] = useState(false); // Estado para controlar a animação de fechamento do modal
  const router = useRouter(); // Hook para acessar o roteador
  const isMobile = useIsMobile(); // Verifica se o dispositivo é móvel

  useEffect(() => {
    // Verifica se o filme está na lista de favoritos do usuário
    if (usuarioLogado?.favoritos?.includes(filmeId)) {
      setFavoritado(true);
    } else {
      setFavoritado(false);
    }
  }, [usuarioLogado, filmeId]);

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

    // Verifica se o usuário está logado
    if (!usuarioLogado) {
      if (isMobile) {
        // Se for mobile, redireciona para /login
        console.log(
          "Usuário não autenticado. Redirecionando para /login no mobile..."
        );
        router.push("/login");
      } else {
        // Se for desktop, exibe o modal de login
        console.log(
          "Usuário não autenticado. Exibindo modal de login no desktop..."
        );
        setShowLoginModal(true); // Exibe o modal de login no desktop
      }
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

      {/* Modal de login, que será exibido caso o usuário não esteja autenticado no desktop */}
      {showLoginModal && !isMobile && (
        <ModalLoginCadastro
          closeModal={closeModal} // Função para fechar o modal
          isClosing={isClosing} // Controla o estado de animação de fechamento
        />
      )}
    </div>
  );
};

export default FavoritarFilme;
