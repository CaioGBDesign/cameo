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
    // Verifica se usuarioParaVer é um array
    const filmesParaVer = Array.isArray(usuarioParaVer) ? usuarioParaVer : [];

    // Verifica se o filme está na lista de assistidos do usuário
    setAssistido(filmesParaVer.includes(filmeId));
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

  // Não renderiza o botão se o filme já foi assistido
  if (assistido) {
    return null; // Ou você pode retornar algo como <span>Assistido</span> se desejar exibir uma mensagem
  }

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
