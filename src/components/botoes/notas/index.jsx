import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";
import AvaliarFilme from "@/components/detalhesfilmes/avaliar-filme";
import { useAuth } from "@/contexts/auth";

const NotasFilmes = ({ filmeId }) => {
  const { user, avaliarFilme } = useAuth();

  // Verifica se user e suas propriedades estão definidas
  const filmeVisto = user && user.visto && user.visto.hasOwnProperty(filmeId);

  const handleClick = (event) => {
    event.preventDefault();

    if (filmeVisto) {
      console.log("Filme já adicionado anteriormente");
    } else {
      avaliarFilme(filmeId);
    }
  };

  return (
    <div className={styles.notasFilmes}>
      <button onClick={handleClick}>
        {filmeVisto ? (
          <div className={styles.estrelas}>
            <Estrelas estrelas={user.visto[filmeId]} starWidth={"14px"} />
          </div>
        ) : (
          <AvaliarFilme />
        )}
      </button>
    </div>
  );
};

export default NotasFilmes;
