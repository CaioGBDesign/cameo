import { useEffect, useState } from "react";
import styles from "./index.module.scss";

const AssistirFilme = ({
  filmeId,
  assistirFilme,
  removerAssistir,
  usuarioParaVer,
}) => {
  const [assistido, setAssistido] = useState(false);

  useEffect(() => {
    // Verifica se o filme está na lista de assistidos do usuário
    if (usuarioParaVer.includes(filmeId)) {
      setAssistido(true);
    } else {
      setAssistido(false);
    }
  }, [usuarioParaVer, filmeId]);

  const handleClick = (event) => {
    event.preventDefault(); // Evita comportamento padrão

    // Se o filme já estiver em assistidos, remove da lista
    if (assistido) {
      removerAssistir(filmeId);
    } else {
      assistirFilme(filmeId); // Caso contrário, adiciona aos assistidos
    }
  };

  return (
    <div className={styles.assistirFilme}>
      <button onClick={handleClick}>
        <div className={styles.paraVer}>
          <span>Quero ver</span>
          <img src="icones/para-ver-desabilitado.svg" alt="Assistido" />
        </div>
      </button>
    </div>
  );
};

export default AssistirFilme;
