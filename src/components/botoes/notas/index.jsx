import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";
import AvaliarFilme from "@/components/detalhesfilmes/avaliar-filme";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider"; // Hook para verificar se é mobile
import ModalLoginCadastro from "@/components/modais/ModalLoginCadastro";

const NotasFilmes = ({
  filmeId,
  avaliarFilme,
  usuarioFilmeVisto,
  onClickModal,
}) => {
  const { user } = useAuth(); // Verifica se o usuário está autenticado
  const [mensagem, setMensagem] = useState("");
  const [nota, setNota] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // Estado para controlar o modal de login
  const isMobile = useIsMobile(); // Verifica se é mobile

  const filmeVisto = user && user.visto && user.visto.hasOwnProperty(filmeId);

  const closeModal = () => {
    console.log("Fechando o modal...");
    setIsClosing(true);
    setTimeout(() => {
      console.log("Chamando onClose após animação...");
      setShowLoginModal(false); // Fecha o modal de login
    }, 300);
  };

  const handleClick = async (event) => {
    event.preventDefault();
    setMensagem(""); // Limpa mensagem anterior

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

    // Se o filme ainda não foi visto, adiciona a avaliação
    if (!filmeVisto) {
      try {
        await avaliarFilme(filmeId); // Adiciona o filme aos vistos
        setMensagem(`Filme ${filmeId} adicionado aos vistos!`);
      } catch (error) {
        console.error("Erro ao adicionar filme:", error);
        setMensagem("Erro ao adicionar filme. Tente novamente.");
      }
    }

    // Chama o modal (de avaliação ou outro comportamento)
    onClickModal();
  };

  useEffect(() => {
    setNota(user?.visto[filmeId]?.nota);
  }, [user]);

  console.log(nota);

  return (
    <div className={styles.notasFilmes}>
      <button onClick={handleClick}>
        {filmeVisto ? (
          <div className={styles.estrelas}>
            <Estrelas estrelas={nota} starWidth={"14px"} />
          </div>
        ) : (
          <AvaliarFilme />
        )}
      </button>

      {/* Modal de login, que será exibido caso o usuário não esteja autenticado */}
      {showLoginModal && !isMobile && (
        <ModalLoginCadastro closeModal={closeModal} isClosing={isClosing} />
      )}
    </div>
  );
};

export default NotasFilmes;
