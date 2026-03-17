import { useState } from "react";
import styles from "./index.module.scss";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import Modal from "@/components/modal";

const PERIODO_LABEL = {
  dia: "Meta diária",
  semana: "Meta semanal",
  mes: "Meta mensal",
  ano: "Meta anual",
};

const PERIODO_SUFFIX = {
  dia: "filmes por dia",
  semana: "filmes por semana",
  mes: "filmes por mês",
  ano: "filmes por ano",
};

const PERIODO_CORES = {
  ano: { bg: "var(--primitive-rosa-01)", ripado: "var(--primitive-rosa-02)" },
  mes: { bg: "var(--primitive-azul-01)", ripado: "var(--primitive-azul-02)" },
  semana: {
    bg: "var(--primitive-amarelo-02)",
    ripado: "var(--primitive-amarelo-01)",
  },
  dia: { bg: "var(--primitive-roxo-02)", ripado: "var(--primitive-roxo-01)" },
};

const CORES_CONCLUIDO = {
  bg: "var(--primitive-verde-02)",
  ripado: "var(--primitive-verde-01)",
};

const CardMeta = ({ meta, filmesVistos = 0 }) => {
  const [modalAberto, setModalAberto] = useState(false);

  const percentual = Math.min(
    Math.round((filmesVistos / meta.quantidade) * 100),
    100,
  );

  const cores =
    percentual === 100
      ? CORES_CONCLUIDO
      : (PERIODO_CORES[meta.periodo] ?? PERIODO_CORES.ano);

  return (
    <>
      <div className={styles.card}>
        {/* Topo */}
        <button className={styles.topo} onClick={() => setModalAberto(true)}>
          <div className={styles.topoInfo}>
            <span className={styles.titulo}>
              {PERIODO_LABEL[meta.periodo] ?? "Meta"}
            </span>
            <span className={styles.quantidade}>
              {meta.quantidade} {PERIODO_SUFFIX[meta.periodo]}
            </span>
          </div>
          <span className={styles.chevron}>
            <ChevronDownIcon
              size={16}
              color="var(--icon-base)"
              style={{ transform: "rotate(-90deg)" }}
            />
          </span>
        </button>

        {/* Chart */}
        <div className={styles.chart}>
          <div
            className={styles.percentualAtual}
            style={{ background: cores.bg }}
          >
            <span>{percentual}%</span>
          </div>

          <div className={styles.barra}>
            <div
              className={styles.progresso}
              style={{
                width: `${percentual}%`,
                backgroundImage: `repeating-linear-gradient(-45deg, ${cores.ripado}, ${cores.ripado} 6px, ${cores.bg} 6px, ${cores.bg} 12px)`,
                borderRadius: percentual === 100 ? "0px" : undefined,
              }}
            />
          </div>

          <div
            className={styles.percentualMax}
            style={
              percentual === 100
                ? { background: "var(--primitive-verde-02)" }
                : undefined
            }
          >
            <span>100%</span>
          </div>
        </div>

        {/* Informações finais */}
        <div className={styles.infos}>
          <span>Filmes vistos: {filmesVistos}</span>
          <span>Meta: {meta.quantidade}</span>
        </div>
      </div>

      {modalAberto && (
        <Modal
          title={PERIODO_LABEL[meta.periodo]}
          onClose={() => setModalAberto(false)}
        >
          {/* detalhes da meta — a implementar */}
        </Modal>
      )}
    </>
  );
};

export default CardMeta;
