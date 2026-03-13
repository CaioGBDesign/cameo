import { useState } from "react";
import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";
import AvaliarFilme from "@/components/detalhesfilmes/avaliar-filme";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import ModalLoginCadastro from "@/components/modais/ModalLoginCadastro";

const NotasFilmes = ({ filmeId, avaliarFilme, usuarioFilmeVisto, onClickModal }) => {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isMobile = useIsMobile();

  const filmeVisto = user?.visto?.hasOwnProperty(filmeId);

  const closeModal = () => setShowLoginModal(false);

  const handleClick = async (event) => {
    event.preventDefault();

    if (!user) {
      if (isMobile) {
        window.location.href = "/login";
        return;
      }
      setShowLoginModal(true);
      return;
    }

    if (!filmeVisto) {
      try {
        await avaliarFilme(filmeId);
      } catch (error) {
        console.error("Erro ao adicionar filme:", error);
      }
    }

    onClickModal();
  };

  return (
    <div className={styles.notasFilmes}>
      <button onClick={handleClick}>
        {filmeVisto ? (
          <div className={styles.estrelas}>
            <Estrelas estrelas={user.visto[filmeId]?.nota} starWidth={"14px"} />
          </div>
        ) : (
          <AvaliarFilme />
        )}
      </button>

      {showLoginModal && !isMobile && (
        <ModalLoginCadastro closeModal={closeModal} isClosing={false} />
      )}
    </div>
  );
};

export default NotasFilmes;
