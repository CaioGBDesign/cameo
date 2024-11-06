import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { useIsMobile } from "@/components/DeviceProvider"; // Importando o hook para verificar o dispositivo
import ModalLoginCadastro from "@/components/modais/ModalLoginCadastro";

const AssistirFilme = ({
  filmeId,
  assistirFilme,
  removerAssistir,
  usuarioLogado, // Agora estamos verificando se o usuário está logado
}) => {
  const [assistido, setAssistido] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // Estado para controlar a exibição do modal
  const [isClosing, setIsClosing] = useState(false); // Estado para controlar a animação de fechamento do modal
  const router = useRouter(); // Hook para acessar o roteador
  const isMobile = useIsMobile(); // Verifica se o dispositivo é móvel

  useEffect(() => {
    // Verifica se usuarioParaVer é um array
    const filmesParaVer = Array.isArray(usuarioLogado?.paraVer)
      ? usuarioLogado.paraVer
      : [];

    // Verifica se o filme está na lista de filmes para ver do usuário
    setAssistido(filmesParaVer.includes(filmeId));
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

    // Se o usuário não estiver autenticado
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

    // Se o filme já estiver assistido, remove da lista
    if (assistido) {
      removerAssistir(filmeId);
    } else {
      assistirFilme(filmeId); // Caso contrário, adiciona aos filmes para assistir
    }
  };

  // Não renderiza o botão se o filme já foi assistido
  if (assistido) {
    return null; // Ou você pode retornar algo como <span>Assistido</span> se desejar exibir uma mensagem
  }

  return (
    <div className={styles.assistirFilme}>
      <button onClick={handleClick}>
        <div className={styles.paraVer}>
          <span>Quero ver</span>
          <img src="icones/para-ver-desabilitado.svg" alt="Assistir" />
        </div>
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

export default AssistirFilme;
