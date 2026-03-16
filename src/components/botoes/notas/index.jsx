import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";
import AvaliarFilme from "@/components/detalhesfilmes/avaliar-filme";
import { useAuth } from "@/contexts/auth";

const NotasFilmes = ({ filmeId, avaliarFilme, usuarioFilmeVisto, onClickModal }) => {
  const { user } = useAuth();

  const filmeVisto = user?.visto?.hasOwnProperty(filmeId);

  const handleClick = async (event) => {
    event.preventDefault();

    if (!user) {
      window.location.href = "/login";
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
    </div>
  );
};

export default NotasFilmes;
