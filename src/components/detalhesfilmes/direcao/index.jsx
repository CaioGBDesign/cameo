import React from "react";
import styles from "./index.module.scss";

const Direcao = ({ diretores }) => {
  const diretoresComImagem = diretores.filter((diretor) => diretor.imagemUrl);

  // Verifica se há diretores com imagem
  if (diretoresComImagem.length === 0) return null;

  return (
    <div className={styles.diretoresCameo}>
      <div className={styles.contDiretores}>
        <h3>Direção</h3>
        <div className={styles.diretores}>
          {diretoresComImagem.map((diretor, index) => (
            <div key={index} className={styles.diretor}>
              <div className={styles.fotoDiretor}>
                <img
                  src={diretor.imagemUrl}
                  alt={diretor.nome}
                  className={styles.imagemDiretor}
                />
              </div>

              <div className={styles.nomeDiretor}>
                <p>{diretor.nome}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Direcao;
