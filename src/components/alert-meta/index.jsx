import { useRouter } from "next/router";
import { useAlertaMeta } from "@/contexts/alert-meta";
import BellIcon from "@/components/icons/BellIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import Button from "@/components/button";
import styles from "./index.module.scss";

const CONFIGS = {
  "tempo-acabando": {
    titulo: "Seu prazo está acabando!",
    barraVariante: "vermelha",
    labelAcao: "Ver meta",
    labelDescartar: "Entendi",
  },
  "deletada-sistema": {
    titulo: "Não foi dessa vez!",
    barraVariante: "vermelha",
    labelAcao: "Criar nova meta",
    labelDescartar: "Entendi",
  },
  "quase-concluida": {
    titulo: "Você está quase lá!",
    barraVariante: "verde",
    labelAcao: "Ver meta",
    labelDescartar: "Entendi",
  },
  concluida: {
    titulo: "VOCÊ CONSEGUIU!!!",
    barraVariante: "verde",
    labelAcao: "Ver meta",
    labelDescartar: "Entendi",
  },
};

function textoCorpo(tipo, meta, filmesFaltando, milestone) {
  const nome = meta.nome || meta.periodo;
  switch (tipo) {
    case "tempo-acabando":
      return {
        prefixo: "A",
        nome,
        sufixo: "está perto do prazo e você ainda tem muito o que fazer",
      };
    case "deletada-sistema":
      return {
        prefixo: "O prazo para",
        nome,
        sufixo:
          "foi atingido e sua meta foi deletada, mas você ainda pode criar novas.",
      };
    case "quase-concluida": {
      let sufixo;
      if (milestone <= 50)
        sufixo = `está cada vez mais perto de ser concluída, assista a mais ${filmesFaltando} filme${filmesFaltando !== 1 ? "s" : ""} e conseguirá.`;
      else if (milestone <= 80)
        sufixo = `está bem perto de ser concluída, assista a mais ${filmesFaltando} filme${filmesFaltando !== 1 ? "s" : ""} e conseguirá.`;
      else
        sufixo = `está quase concluída, assista a mais ${filmesFaltando} filme${filmesFaltando !== 1 ? "s" : ""} e conseguirá.`;
      const prefixo = milestone >= 90 ? "Falta muito pouco, a" : "A";
      return { prefixo, nome, sufixo };
    }
    case "concluida":
      return {
        prefixo: "A",
        nome,
        sufixo: "chegou a 100% nessa bagaça e você deitou.",
      };
    default:
      return { prefixo: "", nome, sufixo: "" };
  }
}

function AlertMetaCard({ alerta }) {
  const router = useRouter();
  const { removerAlerta } = useAlertaMeta();
  const { uid, tipo, meta, progresso, dataTermino, filmesFaltando, milestone } =
    alerta;
  const config = CONFIGS[tipo];
  const corpo = textoCorpo(tipo, meta, filmesFaltando, milestone);
  const isConcluida = tipo === "concluida";
  const isVerde = config.barraVariante === "verde";

  const handleDescartar = () => {
    if (tipo === "concluida") {
      localStorage.setItem(`cameo_concluida_${meta.id}`, "true");
    }
    removerAlerta(uid);
  };

  const handleAcao = () => {
    if (tipo === "deletada-sistema") {
      // abrir modal criar meta — navega para filmesassisti com flag
      router.push("/filmesassisti?criarMeta=true");
    } else {
      router.push(`/filmesassisti?meta=${meta.id}`);
    }
    if (tipo === "concluida") {
      localStorage.setItem(`cameo_concluida_${meta.id}`, "true");
    }
    removerAlerta(uid);
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <BellIcon
            size={16}
            color={isConcluida ? "var(--icon-card)" : "var(--text-base)"}
          />
          <span
            className={`${styles.titulo} ${isConcluida ? styles.tituloConcluida : ""}`}
          >
            {config.titulo}
          </span>
        </div>
        <button className={styles.fechar} onClick={handleDescartar}>
          <CloseIcon size={14} color="currentColor" />
        </button>
      </div>

      <p className={styles.corpo}>
        {corpo.prefixo} <span className={styles.badge}>{corpo.nome}</span>{" "}
        {corpo.sufixo}
      </p>

      <div className={styles.progressoWrapper}>
        <div className={styles.progressoInfo}>
          <span>{progresso}% concluída</span>
          <span>
            {tipo === "deletada-sistema" ? "Terminou" : "Termina"} em{" "}
            <strong>{dataTermino}</strong>
          </span>
        </div>
        <div className={styles.progressoBar}>
          <div
            className={`${styles.progressoFill} ${isVerde ? styles.verde : styles.vermelha}`}
            style={{ "--progresso": `${Math.min(progresso, 100)}%` }}
          />
        </div>
      </div>

      <div className={styles.acoes}>
        <Button
          variant="simple-secondary"
          label={config.labelDescartar}
          onClick={handleDescartar}
        />
        <Button
          variant="simple-primary"
          label={config.labelAcao}
          onClick={handleAcao}
        />
      </div>
    </div>
  );
}

export default function AlertMeta() {
  const { alertas } = useAlertaMeta();
  if (!alertas.length) return null;

  return (
    <div className={styles.container}>
      {alertas.map((alerta) => (
        <AlertMetaCard key={alerta.uid} alerta={alerta} />
      ))}
    </div>
  );
}
