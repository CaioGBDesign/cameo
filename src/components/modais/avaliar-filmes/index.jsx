import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth";
import styles from "./index.module.scss";
import { useIsMobile } from "@/components/DeviceProvider";
import HeaderModal from "@/components/modais/header-modais";

const ModalAvaliar = ({ filmeId, nota, onClose }) => {
  // define se desktop ou mobile
  const isMobile = useIsMobile();

  const [avaliacao, setAvaliacao] = useState(nota);
  const { darNota } = useAuth();

  const modalRef = useRef(null); // Criando uma referência para o modal

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

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose(); // Fecha o modal se clicar fora
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.modal}>
      <div className={styles.modalContainer} ref={modalRef}>
        <HeaderModal
          onClose={onClose}
          titulo="Avaliar filme"
          icone={"/icones/filtros-cameo-02.png"}
          altIcone={"Filtros Cameo"}
        />
        <div className={styles.contModal}>
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
