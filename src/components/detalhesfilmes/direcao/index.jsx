import React from "react";
import styles from "./index.module.scss";
import Image from "next/image";

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
                <div className={styles.imagemDiretor}>
                  <Image
                    src={diretor.imagemUrl}
                    alt={diretor.nome}
                    layout="fill" // Usa o layout fill
                    objectFit="cover" // Ajusta a imagem para cobrir o contêiner
                    quality={50} // Ajuste a qualidade se necessário
                  />
                </div>
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
