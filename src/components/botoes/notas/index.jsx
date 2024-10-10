import styles from "./index.module.scss";
import Estrelas from "@/components/estrelas";
import AvaliarFilme from "@/components/detalhesfilmes/avaliar-filme";
import { useAuth } from "@/contexts/auth";

const NotasFilmes = ({ filmeId, avaliarFilme, onClickModal }) => {
  const { user } = useAuth();

  // Verifica se user e suas propriedades estão definidas
  const filmeVisto = user && user.visto && user.visto.hasOwnProperty(filmeId);

  const handleClick = (event) => {
    event.preventDefault();

    // Abre o modal independentemente do estado do filme
    onClickModal();

    // Avalia o filme se ainda não foi avaliado
    if (!filmeVisto) {
      avaliarFilme(filmeId);
    }
  };

  return (
    <div className={styles.notasFilmes}>
      <button onClick={handleClick}>
        {filmeVisto ? (
          <div className={styles.estrelas}>
            {/* Acesse a nota do filme corretamente */}
            <Estrelas estrelas={user.visto[filmeId].nota} starWidth={"14px"} />
          </div>
        ) : (
          <AvaliarFilme />
        )}
      </button>
    </div>
  );
};

export default NotasFilmes;
