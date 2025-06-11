import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth";
import styles from "./index.module.scss";
import HeaderModal from "@/components/modais/header-modais";

const ModalResenha = ({ filmeId, onClose }) => {
  const modalRef = useRef(null);
  const [resenha, setResenha] = useState(""); // Estado para armazenar a resenha
  const { user, salvarResenha } = useAuth();
  const [nomeFilme, setNomeFilme] = useState("Carregando..."); // Estado para armazenar o nome do filme

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose(); // Fecha o modal se clicar fora
    }
  };

  const handleEnviarResenha = async () => {
    if (resenha.trim() === "") {
      alert("Por favor, escreva uma resenha.");
      return;
    }

    if (!user) {
      alert("Você precisa estar logado para enviar uma resenha.");
      return;
    }

    try {
      // Chama a função para salvar a resenha no Firebase
      await salvarResenha(filmeId, resenha);
      alert("Resenha enviada com sucesso!");
      onClose(); // Fecha o modal após enviar
    } catch (error) {
      console.error("Erro ao enviar a resenha:", error);
      alert("Houve um erro ao enviar sua resenha. Tente novamente.");
    }
  };

  useEffect(() => {
    // Adiciona listener para cliques fora do modal
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove listener ao desmontar
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Função para buscar o nome do filme na API do TMDB
    const fetchNomeFilme = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`
        );
        const data = await response.json();

        if (response.ok) {
          setNomeFilme(data.title || "Título não disponível");
        } else {
          setNomeFilme("Erro ao carregar o título");
          console.error("Erro ao buscar o filme:", data.status_message);
        }
      } catch (error) {
        setNomeFilme("Erro ao carregar o título");
        console.error("Erro na requisição:", error);
      }
    };

    if (filmeId) {
      fetchNomeFilme();
    }
  }, [filmeId]);

  return (
    <div className={styles.modal}>
      <div className={styles.ModalResenha} ref={modalRef}>
        <HeaderModal
          onClose={onClose}
          titulo="Escrever Resenha"
          icone={
            "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Favaliacao-cameo-desktop-01.png?alt=media&token=a8ec3d92-4a39-43a4-b80c-4fd15832017d"
          }
          iconeMobile={
            "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Favaliacao-cameo-mobile-01.png?alt=media&token=eaf63d83-e8e3-4f47-aa8a-560ddca88716"
          }
          altIcone={"Escrever Resenha"}
        />
        <div className={styles.contModal}>
          <div className={styles.tituloResenha}>
            <h2>O que achei de</h2>
            <p>{nomeFilme}</p>
          </div>
          {/* Adiciona o value ao textarea e liga o estado */}
          <textarea
            placeholder="|..."
            value={resenha} // Acompanha o estado
            onChange={(e) => setResenha(e.target.value)} // Atualiza o estado conforme o usuário digita
          />
          <button onClick={handleEnviarResenha}>Enviar avaliação</button>
        </div>
      </div>
    </div>
  );
};

export default ModalResenha;
