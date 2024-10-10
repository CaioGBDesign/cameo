import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import styles from "./index.module.scss";

const ModalAvaliar = ({ filmeId, nota, onClose }) => {
  const [avaliacao, setAvaliacao] = useState(nota);
  const { darNota } = useAuth();

  useEffect(() => {
    console.log("Nota recebida:", nota); // Adicione esta linha
    setAvaliacao(nota.nota);
  }, [nota]);

  const handleEstrelaClick = (value) => {
    setAvaliacao(value);
  };

  const handleSubmit = () => {
    const filmeIdString = String(filmeId); // Força a conversão para string
    darNota(filmeIdString, avaliacao); // Passa o filmeId e a nota
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContainer}>
        <div className={styles.contModal}>
          <div className={styles.tituloModal}>
            <h2>Avaliar Filme</h2>
            <button onClick={onClose}>
              <img src="/icones/close.svg" alt="" />
            </button>
          </div>

          <div className={styles.contEstrelas}>
            <div className={styles.notaEscala}>
              <span>Não gostei</span>
              <span>Adorei</span>
            </div>
            <div className={styles.estrelas}>
              {[1, 2, 3, 4, 5].map((value) => (
                <img
                  key={value}
                  src={`/icones/${
                    avaliacao >= value ? "estrela-preenchida" : "estrela-vazia"
                  }.svg`}
                  alt={`Estrela ${value}`}
                  onClick={() => handleEstrelaClick(value)}
                  className={styles.estrela}
                />
              ))}
            </div>
          </div>

          <button onClick={handleSubmit}>Enviar Avaliação</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAvaliar;
