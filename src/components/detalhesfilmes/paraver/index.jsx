import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider"; // Hook para verificar se é mobile
import ModalLoginCadastro from "@/components/modais/ModalLoginCadastro";

const AssistirFilme = ({
  filmeId,
  assistirFilme,
  removerAssistir,
  usuarioParaVer,
}) => {
  const { user } = useAuth();
  const [assistido, setAssistido] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isMobile = useIsMobile();

  const closeModal = () => {
    console.log("Fechando o modal...");
    setIsClosing(true);
    setTimeout(() => {
      console.log("Chamando onClose após animação...");
      setShowLoginModal(false); // Fecha o modal de login
    }, 300);
  };

  useEffect(() => {
    // Verifica se usuarioParaVer é um array
    const filmesParaVer = Array.isArray(usuarioParaVer) ? usuarioParaVer : [];

    // Verifica se o filme está na lista de assistidos do usuário
    setAssistido(filmesParaVer.includes(filmeId));
  }, [usuarioParaVer, filmeId]);

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

    // Se o filme já estiver em assistidos, remove da lista
    if (assistido) {
      removerAssistir(filmeId);
    } else {
      assistirFilme(filmeId); // Caso contrário, adiciona aos assistidos
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
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fpara-ver-desabilitado.svg?alt=media&token=a18aced1-1b26-49ff-b413-4f12e246ebd4"
            alt="Assistido"
          />
        </div>
      </button>

      {showLoginModal && !isMobile && (
        <ModalLoginCadastro closeModal={closeModal} isClosing={isClosing} />
      )}
    </div>
  );
};

export default AssistirFilme;
