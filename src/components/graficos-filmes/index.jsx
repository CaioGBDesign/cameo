import { useState, useMemo } from "react";
import styles from "./index.module.scss";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import InfoIcon from "@/components/icons/InfoIcon";
import { useIsMobile } from "@/components/DeviceProvider";

const MESES_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
const BAR_MAX_HEIGHT = 170;
const BAR_WIDTH = 80;

function GraficoBarras({ dados, corBarra, corDestaque, mesAtual }) {
  const max = Math.max(...dados.map((d) => d.valor), 1);

  return (
    <div className={styles.barras}>
      {dados.map(({ label, valor, destaque }) => {
        const altura = Math.max(Math.round((valor / max) * BAR_MAX_HEIGHT), 4);
        const cor = destaque ? corDestaque : corBarra;
        return (
          <div key={label} className={styles.barra}>
            <div className={styles.barraVisualWrapper}>
              <span className={styles.barraValor}>{valor}</span>
              <div
                className={styles.barraVisual}
                style={{
                  height: `${altura}px`,
                  background: cor,
                  width: `${BAR_WIDTH}px`,
                }}
              />
            </div>
            <span className={styles.barraLabel}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function GraficoHeader({ titulo, onToggle, aberto, showInfo }) {
  return (
    <button className={styles.header} onClick={onToggle} type="button">
      <div className={styles.headerLeft}>
        <span className={styles.titulo}>{titulo}</span>
        {showInfo && (
          <span className={styles.infoIcon}>
            <InfoIcon size={14} color="var(--text-sub)" />
          </span>
        )}
      </div>
      <span
        className={styles.chevron}
        style={{ transform: aberto ? "rotate(180deg)" : "rotate(0deg)" }}
      >
        <ChevronDownIcon size={16} color="var(--icon-base)" />
      </span>
    </button>
  );
}

export default function GraficosFilmes({ filmesVistos = [], visto = {} }) {
  const isMobile = useIsMobile();
  const [generoAberto, setGeneroAberto] = useState(true);
  const [mesAberto, setMesAberto] = useState(true);

  const hoje = new Date();
  const mesHoje = hoje.getMonth() + 1;
  const anoHoje = hoje.getFullYear();

  const dadosGenero = useMemo(() => {
    const contagem = {};
    filmesVistos.forEach((filme) => {
      (filme.genres || []).forEach((g) => {
        contagem[g.name] = (contagem[g.name] || 0) + 1;
      });
    });
    return Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .map(([label, valor]) => ({ label, valor }));
  }, [filmesVistos]);

  const dadosMes = useMemo(() => {
    const contagem = {};
    Object.values(visto).forEach(({ data }) => {
      if (!data) return;
      const partes = data.split("/");
      if (partes.length < 3) return;
      const mes = Number(partes[1]);
      const ano = Number(partes[2]);
      const key = `${mes}/${ano}`;
      contagem[key] = (contagem[key] || 0) + 1;
    });
    return Object.entries(contagem)
      .filter(([key]) => Number(key.split("/")[1]) >= 2026)
      .sort(([a], [b]) => {
        const [ma, ya] = a.split("/").map(Number);
        const [mb, yb] = b.split("/").map(Number);
        return ya !== yb ? ya - yb : ma - mb;
      })
      .map(([key, valor]) => {
        const [mes, ano] = key.split("/").map(Number);
        const destaque = mes === mesHoje && ano === anoHoje;
        const label =
          ano !== anoHoje
            ? `${MESES_PT[mes - 1]}/${String(ano).slice(2)}`
            : MESES_PT[mes - 1];
        return { label, valor, destaque };
      });
  }, [visto, mesHoje, anoHoje]);

  return (
    <div className={styles.container}>
      <div className={styles.grafico}>
        <GraficoHeader
          titulo="Gêneros mais vistos"
          aberto={!isMobile || generoAberto}
          onToggle={() => isMobile && setGeneroAberto((v) => !v)}
        />
        {(!isMobile || generoAberto) && dadosGenero.length > 0 && (
          <GraficoBarras
            dados={dadosGenero}
            corBarra="var(--primitive-roxo-01)"
            corDestaque="var(--primitive-roxo-01)"
          />
        )}
      </div>

      <div className={styles.grafico}>
        <GraficoHeader
          titulo="Quantidade de filmes assistidos"
          aberto={!isMobile || mesAberto}
          onToggle={() => isMobile && setMesAberto((v) => !v)}
          showInfo
        />
        {(!isMobile || mesAberto) && dadosMes.length > 0 && (
          <GraficoBarras
            dados={dadosMes}
            corBarra="var(--primitive-roxo-04)"
            corDestaque="var(--primitive-roxo-01)"
          />
        )}
      </div>
    </div>
  );
}
