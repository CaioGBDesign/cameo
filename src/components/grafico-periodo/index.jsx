import { useState, useMemo } from "react";
import styles from "./index.module.scss";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import Select from "@/components/inputs/select";
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
const LIMITE_MOBILE = 7;
const LIMITE_DESKTOP = 9;
const BAR_WIDTH_MOBILE = 65;
const BAR_WIDTH_DESKTOP = 75;

const PERIODOS = [
  { value: "esse-mes", label: "Esse mês" },
  { value: "90dias", label: "Últimos 90 dias" },
  { value: "6meses", label: "Últimos 6 meses" },
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
];

function parseData(str) {
  const parts = str?.split("/");
  if (!parts || parts.length < 3) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y) return null;
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
}

function hoje() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function GraficoPeriodo({ visto = {} }) {
  const isMobile = useIsMobile();
  const [aberto, setAberto] = useState(true);
  const [periodo, setPeriodo] = useState("esse-mes");

  const agora = useMemo(() => hoje(), []);
  const mesAtual = agora.getMonth();
  const anoAtual = agora.getFullYear();

  const registros = useMemo(
    () =>
      Object.values(visto)
        .map(({ data }) => parseData(data))
        .filter(Boolean),
    [visto],
  );

  const dados = useMemo(() => {
    if (periodo === "esse-mes") {
      const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
      return Array.from({ length: diasNoMes }, (_, i) => {
        const dia = new Date(anoAtual, mesAtual, i + 1);
        dia.setHours(0, 0, 0, 0);
        const valor = registros.filter(
          (r) => r.getTime() === dia.getTime(),
        ).length;
        const label = String(i + 1);
        const destaque = dia.getTime() === agora.getTime();
        return { label, valor, destaque };
      });
    }

    if (periodo === "90dias") {
      return Array.from({ length: 3 }, (_, i) => {
        const d = new Date(anoAtual, mesAtual - (2 - i), 1);
        const m = d.getMonth();
        const y = d.getFullYear();
        const valor = registros.filter(
          (r) => r.getMonth() === m && r.getFullYear() === y,
        ).length;
        const destaque = m === mesAtual && y === anoAtual;
        const label =
          y !== anoAtual ? `${MESES_PT[m]}/${String(y).slice(2)}` : MESES_PT[m];
        return { label, valor, destaque };
      });
    }

    if (periodo === "6meses") {
      return Array.from({ length: 6 }, (_, i) => {
        const d = new Date(anoAtual, mesAtual - (5 - i), 1);
        const m = d.getMonth();
        const y = d.getFullYear();
        const valor = registros.filter(
          (r) => r.getMonth() === m && r.getFullYear() === y,
        ).length;
        const destaque = m === mesAtual && y === anoAtual;
        const label =
          y !== anoAtual ? `${MESES_PT[m]}/${String(y).slice(2)}` : MESES_PT[m];
        return { label, valor, destaque };
      });
    }

    const ano = Number(periodo);
    return MESES_PT.map((label, i) => {
      const valor = registros.filter(
        (r) => r.getMonth() === i && r.getFullYear() === ano,
      ).length;
      const destaque = i === mesAtual && ano === anoAtual;
      return { label, valor, destaque };
    });
  }, [visto, periodo, agora, mesAtual, anoAtual, registros]).filter(
    (d) => d.valor > 0,
  );

  const max = Math.max(...dados.map((d) => d.valor), 1);
  const limite = isMobile ? LIMITE_MOBILE : LIMITE_DESKTOP;
  const scrollMode = dados.length > limite;
  const barraWidth = isMobile ? BAR_WIDTH_MOBILE : BAR_WIDTH_DESKTOP;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.titulo}>Filmes assistidos</span>
        {isMobile ? (
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
        ) : (
          <Select
            options={PERIODOS}
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            width="200px"
          />
        )}
      </div>

      {(!isMobile || aberto) && (
        <>
          {isMobile && (
            <div className={styles.selects}>
              <Select
                options={PERIODOS}
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                width="100%"
              />
            </div>
          )}

          <div className={styles.barras}>
            {dados.map(({ label, valor, destaque }) => {
              const altura =
                valor > 0
                  ? Math.max(Math.round((valor / max) * BAR_MAX_HEIGHT), 4)
                  : 0;
              const cor = destaque
                ? "var(--primitive-roxo-01)"
                : "var(--primitive-roxo-04)";

              return (
                <div
                  key={label}
                  className={styles.barra}
                  style={
                    scrollMode
                      ? { flex: "none", width: `${barraWidth}px` }
                      : undefined
                  }
                >
                  <div className={styles.barraVisualWrapper}>
                    {valor > 0 && (
                      <span className={styles.barraValor}>{valor}</span>
                    )}
                    <div
                      className={styles.barraVisual}
                      style={{ height: `${altura}px`, background: cor }}
                    />
                  </div>
                  <span className={styles.barraLabel}>{label}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
