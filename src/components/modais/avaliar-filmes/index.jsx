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
    2: "Fraco",
    3: "Bom",
    4: "Surpreendeu",
    5: "Foda",
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
          icone={
            "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Favaliacao-cameo-desktop-01.png?alt=media&token=a8ec3d92-4a39-43a4-b80c-4fd15832017d"
          }
          iconeMobile={
            "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Favaliacao-cameo-mobile-01.png?alt=media&token=eaf63d83-e8e3-4f47-aa8a-560ddca88716"
          }
          altIcone={"Filtros Cameo"}
        />
        <div className={styles.contModal}>
          <div className={styles.contEstrelas}>
            <div className={styles.notaEscala}>
              <span>{descricaoNota}</span>
            </div>
            <div className={styles.estrelas}>
              {[1, 2, 3, 4, 5].map((value) => {
                const isFilled = avaliacao >= value;
                const src = isFilled
                  ? "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrela-preenchida.svg?alt=media&token=d59fbabb-c1bf-498f-adad-8a9dc4a88062"
                  : "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrela-vazia.svg?alt=media&token=a3d23b07-dd81-4729-bb4f-d73efb72feed";

                return (
                  <img
                    key={value}
                    src={src}
                    alt={`Estrela ${value}`}
                    onClick={() => handleEstrelaClick(value)}
                    className={styles.estrela}
                  />
                );
              })}
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
