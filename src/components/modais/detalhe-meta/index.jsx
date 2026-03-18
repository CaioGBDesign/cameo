import { useState } from "react";
import styles from "./index.module.scss";
import Modal from "@/components/modal";
import RadioButton from "@/components/inputs/radio-button";
import TextInput from "@/components/inputs/text-input";
import { useAuth } from "@/contexts/auth";
import { calcularDiasRestantes, formatarTempoRestante } from "@/utils/metas";

const NORMALIZAR = {
  Diário: "dia",
  Semanal: "semana",
  Mensal: "mes",
  Anual: "ano",
};

const PERIODO_LABEL = {
  dia: "Meta diária",
  semana: "Meta semanal",
  mes: "Meta mensal",
  ano: "Meta anual",
};

const PERIODO_SUFFIX = {
  dia: "por dia",
  semana: "por semana",
  mes: "por mês",
  ano: "por ano",
};

const PERIODOS = [
  { valor: "dia", label: "Diário" },
  { valor: "semana", label: "Semanal" },
  { valor: "mes", label: "Mensal" },
  { valor: "ano", label: "Anual" },
];

const TEMAS = [
  "Todos",
  "Animação",
  "Aventura",
  "Ação",
  "Cinema TV",
  "Comédia",
  "Crime",
  "Documentários",
  "Drama",
  "Família",
  "Fantasia",
  "Faroeste",
  "Ficção Científica",
  "Guerra",
  "História",
  "Mistério",
  "Musical",
  "Romance",
  "Terror",
  "Thriller",
];

const LOCAIS = ["Em casa", "No cinema"];

export default function DetalheMeta({ meta, onClose }) {
  const { atualizarMeta } = useAuth();

  const periodoInicial = NORMALIZAR[meta.periodo] ?? meta.periodo;

  const [periodo, setPeriodo] = useState(periodoInicial);
  const [quantidade, setQuantidade] = useState(String(meta.quantidade));
  const [tema, setTema] = useState(meta.tema ?? "Todos");
  const [local, setLocal] = useState(meta.local ?? "");

  const filmesVistos = meta.filmesVistosPeriodo ?? 0;
  const diasRestantes = calcularDiasRestantes(periodo);
  const filmesFaltando = Math.max(0, Number(quantidade) - filmesVistos);
  const filmesPorDia =
    diasRestantes > 0
      ? Math.ceil(filmesFaltando / diasRestantes)
      : filmesFaltando;

  const handleSalvar = async () => {
    await atualizarMeta({
      ...meta,
      periodo,
      quantidade: Number(quantidade),
      tema,
      local,
    });
    onClose();
  };

  return (
    <Modal
      title={PERIODO_LABEL[periodo]}
      onClose={onClose}
      primaryAction={{ label: "Salvar", onClick: handleSalvar }}
    >
      <div className={styles.conteudo}>
        <div className={styles.infoTextos}>
          <p className={styles.infoTexto}>
            {quantidade} filmes {PERIODO_SUFFIX[periodo]}
          </p>
          <p className={styles.infoTexto}>
            {formatarTempoRestante(diasRestantes)} para concluir a meta
          </p>
          {filmesFaltando > 0 && (
            <p className={styles.infoTexto}>
              Você precisa assistir a <strong>{filmesFaltando} filmes</strong>{" "}
              para completar a meta com sucesso
            </p>
          )}
          {filmesFaltando > 0 &&
            diasRestantes > 0 &&
            Number(quantidade) > 1 && (
              <p className={styles.infoTexto}>
                Se assistir a{" "}
                <strong>
                  {filmesPorDia} filme{filmesPorDia !== 1 ? "s" : ""} por dia
                </strong>{" "}
                sua meta será concluída com sucesso
              </p>
            )}
        </div>

        <div className={styles.grupo}>
          <span className={styles.grupoLabel}>Período da meta</span>
          <div className={styles.radios}>
            {PERIODOS.map((p) => (
              <RadioButton
                key={p.valor}
                id={`det-periodo-${p.valor}`}
                name="det-periodo"
                label={p.label}
                checked={periodo === p.valor}
                onChange={() => setPeriodo(p.valor)}
                iconVariant="none"
              />
            ))}
          </div>
        </div>

        <TextInput
          id="det-quantidade"
          label="Quantidade total de filmes"
          type="number"
          min={1}
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />

        <div className={styles.grupo}>
          <span className={styles.grupoLabel}>Gênero</span>
          <div className={styles.radios}>
            {TEMAS.map((t) => (
              <RadioButton
                key={t}
                id={`det-tema-${t}`}
                name="det-tema"
                label={t}
                checked={tema === t}
                onChange={() => setTema(t)}
                iconVariant="none"
              />
            ))}
          </div>
        </div>

        <div className={styles.grupo}>
          <span className={styles.grupoLabel}>Onde assistir</span>
          <div className={styles.radios}>
            {LOCAIS.map((l) => (
              <RadioButton
                key={l}
                id={`det-local-${l}`}
                name="det-local"
                label={l}
                checked={local === l}
                onChange={() => setLocal(l)}
                iconVariant="none"
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
