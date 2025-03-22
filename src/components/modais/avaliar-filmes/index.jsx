import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth";
import styles from "./index.module.scss";
import { useIsMobile } from "@/components/DeviceProvider";
import HeaderModal from "@/components/modais/header-modais";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebaseConection";

const ModalAvaliar = ({ filmeId, nota, onClose }) => {
  const isMobile = useIsMobile();
  const [avaliacao, setAvaliacao] = useState(nota);
  const [comentario, setComentario] = useState("");
  const [descricaoNota, setDescricaoNota] = useState("");
  const { user, darNota } = useAuth();
  const modalRef = useRef(null);

  // Mapeamento de estrelas para texto
  const estrelasDescricao = {
    1: "Zuado",
    2: "Ok",
    3: "Gostei",
    4: "Sinistro",
    5: "Cabuloso",
  };

  useEffect(() => {
    if (user && filmeId) {
      const fetchComentario = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          const userData = docSnap.data();

          console.log("Dados do usuário:", userData); // Verifique se o dado existe

          if (userData.visto && userData.visto[filmeId]) {
            const filme = userData.visto[filmeId];
            console.log("Comentário encontrado:", filme.comentario);
            setComentario(filme.comentario || ""); // Preenche o comentário, se existir
          } else {
            console.log("Filme não encontrado nos dados do usuário.");
          }
        } catch (error) {
          console.error("Erro ao buscar comentário:", error);
        }
      };

      fetchComentario();
    }
  }, [filmeId, user]);

  useEffect(() => {
    console.log("Nota recebida:", nota);
    if (nota) setAvaliacao(nota.nota); // Atualiza a nota corretamente
  }, [nota]);

  useEffect(() => {
    console.log("Valor de comentario:", comentario); // Verifique se o comentário está sendo atualizado
  }, [comentario]);

  // Atualiza a descrição da nota conforme a avaliação
  useEffect(() => {
    setDescricaoNota(estrelasDescricao[avaliacao]);
  }, [avaliacao]);

  const handleEstrelaClick = (value) => {
    setAvaliacao(value);
  };

  const handleSubmit = () => {
    const filmeIdString = String(filmeId);
    darNota(filmeIdString, avaliacao, comentario);
    onClose();
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
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
          icone={"/icones/avaliacao-cameo-desktop-01.png"}
          iconeMobile={"/icones/avaliacao-cameo-mobile-01.png"}
          altIcone={"Filtros Cameo"}
        />
        <div className={styles.contModal}>
          <div className={styles.contEstrelas}>
            <div className={styles.notaEscala}>
              <span>{descricaoNota}</span>
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

            <div className={styles.comentario}>
              <textarea
                value={comentario} // O valor do comentário agora será refletido corretamente
                onChange={(e) => setComentario(e.target.value)} // Permite editar o comentário
                placeholder="Escreva sua avaliação"
                rows="4"
                className={styles.textarea}
              />
            </div>
          </div>

          <button onClick={handleSubmit}>Confirmar avaliação</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAvaliar;
