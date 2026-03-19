import React, { useState, useMemo } from "react";
import styles from "./index.module.scss";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import { useIsMobile } from "@/components/DeviceProvider";

const CORES = [
  "var(--primitive-roxo-01)",
  "var(--primitive-azul-02)",
  "var(--primitive-amarelo-01)",
  "var(--primitive-verde-01)",
  "var(--primitive-roxo-04)",
];

const BAR_MAX_HEIGHT = 170;

export default function GraficoGeneros({
  filmesVistos = [],
  limiteMobile = 3,
  limiteDesktop = 5,
}) {
  const isMobile = useIsMobile();
  const [aberto, setAberto] = useState(true);

  const limite = isMobile ? limiteMobile : limiteDesktop;
  const total = filmesVistos.length;

  const dados = useMemo(() => {
    const contagem = {};
    filmesVistos.forEach((filme) => {
      (filme.genres || []).forEach((g) => {
        contagem[g.name] = (contagem[g.name] || 0) + 1;
      });
    });
    return Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .map(([nome, quantidade]) => ({ nome, quantidade }));
  }, [filmesVistos]);

  const dadosFiltrados = dados.slice(0, limite);
  const max = Math.max(...dadosFiltrados.map((d) => d.quantidade), 1);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.titulo}>Gêneros mais vistos</span>
        {isMobile && (
          <button
            className={styles.chevronBtn}
            onClick={() => setAberto((v) => !v)}
            type="button"
            aria-label={aberto ? "Recolher" : "Expandir"}
          >
            <span
              className={styles.chevron}
              style={{ transform: aberto ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <ChevronDownIcon size={16} color="var(--icon-base)" />
            </span>
          </button>
        )}
      </div>

      {(!isMobile || aberto) && dadosFiltrados.length > 0 && (
        <div className={styles.barras}>
          {dadosFiltrados.map(({ nome, quantidade }, i) => {
            const altura = Math.max(
              Math.round((quantidade / max) * BAR_MAX_HEIGHT),
              4,
            );
            const percentual =
              total > 0 ? Math.round((quantidade / total) * 100) : 0;
            const cor = CORES[i] ?? CORES[CORES.length - 1];

            return (
              <React.Fragment key={nome}>
              {i > 0 && <div className={styles.separador} />}
              <div className={styles.barra}>
                <div className={styles.textoTopo}>
                  <span className={styles.nomeGenero}>{nome}</span>
                  <span className={styles.quantidadeFilmes}>
                    {quantidade} filmes
                  </span>
                </div>
                <div className={styles.barraContainer}>
                  <div
                    className={styles.barraVisual}
                    style={{
                      height: `${altura}px`,
                      background: cor,
                    }}
                  />
                </div>
                <span className={styles.percentual}>{percentual}% do total</span>
              </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
