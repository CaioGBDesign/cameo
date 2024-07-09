import React, { useRef } from "react";
import { differenceInYears, isValid } from "date-fns";
import styles from "./index.module.scss";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import dubladoresJson from "@/components/dubladores/dubladores.json";
import FundoTitulos from "@/components/fundotitulos";

const DetalhesDublador = () => {
  const router = useRouter();
  const { id } = router.query;
  const audioRef = useRef(null); // Referência para o elemento de áudio

  // Encontrar o dublador pelo nome
  const dublador = dubladoresJson.find((d) => d.nome === id);

  if (!dublador) {
    return <div>Dublador não encontrado.</div>;
  }

  // Verificar se a data de nascimento é válida
  const dataNascimento = new Date(dublador.nascimento);
  if (!isValid(dataNascimento)) {
    return <div>Data de nascimento inválida.</div>;
  }

  // Calcular a idade a partir da data de nascimento
  const idade = differenceInYears(new Date(), dataNascimento);

  // Função para controlar a reprodução e pausa do áudio
  const toggleAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  return (
    <div className={styles.pageDublador}>
      {/* Header */}
      <Header />

      <div className={styles.detalhesDublador}>
        <div className={styles.contDublador}>
          <div className={styles.fotoDublador}>
            <img src={dublador.foto} alt={dublador.nome} />
          </div>
        </div>

        <div className={styles.topoInformacoes}>
          <h2>
            {dublador.nome}
            <br />
            {dublador.sobrenome}
          </h2>

          <div className={styles.idadeCidade}>
            <p>{idade} anos</p>
            <p>{dublador.cidade}</p>
          </div>
        </div>

        <div className={styles.audioContainer}>
          <audio
            ref={audioRef}
            src={dublador.audio}
            className={styles.audioPlayer}
          ></audio>
          <button className={styles.playButton} onClick={toggleAudio}>
            {audioRef.current && audioRef.current.paused ? "■" : "►"}
          </button>

          <img src="/icones/duracao-audio.png" />
        </div>

        <div className={styles.sobreDublador}>
          <h3>Um pouco sobre {dublador.nome}</h3>
          <p>{dublador.sobre}</p>
        </div>
      </div>

      <FundoTitulos
        exibirPlay={false}
        capaAssistidos={"/background/background-cameo-perfil.png"}
        tituloAssistidos={"background"}
      ></FundoTitulos>
    </div>
  );
};

export default DetalhesDublador;
