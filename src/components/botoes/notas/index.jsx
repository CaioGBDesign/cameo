import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";
import AvaliarFilme from "@/components/detalhesfilmes/avaliar-filme";
import { useAuth } from "@/contexts/auth";

const NotasFilmes = ({ filmeId, avaliarFilme, onClickModal }) => {
  const { user } = useAuth();

  const filmeVisto = user && user.visto && user.visto.hasOwnProperty(filmeId);

  const handleClick = (event) => {
    event.preventDefault();
    onClickModal(); // Abre o modal
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
