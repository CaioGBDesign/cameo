import { useState } from "react";
import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";
import AvaliarFilme from "@/components/detalhesfilmes/avaliar-filme";
import { useAuth } from "@/contexts/auth";

const NotasFilmes = ({ filmeId, avaliarFilme, onClickModal }) => {
  const { user } = useAuth();
  const [mensagem, setMensagem] = useState("");

  const filmeVisto = user && user.visto && user.visto.hasOwnProperty(filmeId);

  const handleClick = async (event) => {
    event.preventDefault();
    setMensagem(""); // Limpa mensagem anterior

    if (!filmeVisto) {
      try {
        await avaliarFilme(filmeId); // Adiciona o filme
        setMensagem(`Filme ${filmeId} adicionado aos vistos!`);
      } catch (error) {
        console.error("Erro ao adicionar filme:", error);
        setMensagem("Erro ao adicionar filme. Tente novamente.");
      }
    }

    // Sempre chama o modal, independentemente da condição
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
    </div>
  );
};

export default NotasFilmes;
