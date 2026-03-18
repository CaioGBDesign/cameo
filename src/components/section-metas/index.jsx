import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./index.module.scss";
import CardMeta from "@/components/card-meta";
import Button from "@/components/button";
import Modal from "@/components/modal";
import RadioButton from "@/components/inputs/radio-button";
import TextInput from "@/components/inputs/text-input";
import TrashIcon from "@/components/icons/TrashIcon";
import CriarMeta from "@/components/modais/criar-meta";
import { useAuth } from "@/contexts/auth";
import { contarFilmesPorPeriodo, calcularDiasRestantes, formatarTempoRestante } from "@/utils/metas";

const NORMALIZAR = {
  "Diário": "dia", "Semanal": "semana", "Mensal": "mes", "Anual": "ano",
};

const PERIODO_SUFFIX = {
  dia: "por dia", semana: "por semana", mes: "por mês", ano: "por ano",
};

const PERIODOS = [
  { valor: "dia", label: "Diário" },
  { valor: "semana", label: "Semanal" },
  { valor: "mes", label: "Mensal" },
  { valor: "ano", label: "Anual" },
];

const TEMAS = [
  "Todos", "Animação", "Aventura", "Ação", "Cinema TV", "Comédia",
  "Crime", "Documentários", "Drama", "Família", "Fantasia", "Faroeste",
  "Ficção Científica", "Guerra", "História", "Mistério", "Musical",
  "Romance", "Terror", "Thriller",
];

const LOCAIS = ["Em casa", "No cinema"];

function MetaPainel({ meta, periodo, setPeriodo, quantidade, setQuantidade, tema, setTema, local, setLocal }) {
  const filmesVistos = meta.filmesVistosPeriodo ?? 0;
  const diasRestantes = calcularDiasRestantes(periodo);
  const filmesFaltando = Math.max(0, Number(quantidade) - filmesVistos);
  const filmesPorDia = diasRestantes > 0 ? Math.ceil(filmesFaltando / diasRestantes) : filmesFaltando;

  return (
    <div className={styles.metaPainel}>
      <div className={styles.infoTextos}>
        <p className={styles.infoTexto}>{quantidade} filmes {PERIODO_SUFFIX[periodo]}</p>
        <p className={styles.infoTexto}>{formatarTempoRestante(diasRestantes)} para concluir a meta</p>
        {filmesFaltando > 0 && (
          <p className={styles.infoTexto}>
            Você precisa assistir a <strong>{filmesFaltando} filmes</strong> para completar a meta com sucesso
          </p>
        )}
        {filmesFaltando > 0 && diasRestantes > 0 && Number(quantidade) > 1 && (
          <p className={styles.infoTexto}>
            Se assistir a <strong>{filmesPorDia} filme{filmesPorDia !== 1 ? "s" : ""} por dia</strong> sua meta será concluída com sucesso
          </p>
        )}
      </div>

      <div className={styles.grupo}>
        <span className={styles.grupoLabel}>Período da meta</span>
        <div className={styles.radios}>
          {PERIODOS.map((p) => (
            <RadioButton
              key={p.valor}
              id={`painel-periodo-${p.valor}`}
              name="painel-periodo"
              label={p.label}
              checked={periodo === p.valor}
              onChange={() => setPeriodo(p.valor)}
              iconVariant="none"
            />
          ))}
        </div>
      </div>

      <TextInput
        id="painel-quantidade"
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
              id={`painel-tema-${t}`}
              name="painel-tema"
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
              id={`painel-local-${l}`}
              name="painel-local"
              label={l}
              checked={local === l}
              onChange={() => setLocal(l)}
              iconVariant="none"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SectionMetas() {
  const { user, atualizarMeta, removerMeta } = useAuth();
  const [modalAberto, setModalAberto] = useState(false);
  const [modalTodasAberto, setModalTodasAberto] = useState(false);
  const [popoverAberto, setPopoverAberto] = useState(false);

  const [metaSelecionada, setMetaSelecionada] = useState(null);
  const [periodo, setPeriodo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [tema, setTema] = useState("Todos");
  const [local, setLocal] = useState("");

  const visto = user?.visto || {};

  const todasMetas = (Array.isArray(user?.metas) ? user.metas : [])
    .map((meta) => ({
      ...meta,
      filmesVistosPeriodo: contarFilmesPorPeriodo(visto, meta.periodo),
    }))
    .sort((a, b) => b.filmesVistosPeriodo / b.quantidade - a.filmesVistosPeriodo / a.quantidade);

  const metas = todasMetas.slice(0, 2);

  const selecionarMeta = (meta) => {
    setMetaSelecionada(meta);
    setPeriodo(NORMALIZAR[meta.periodo] ?? meta.periodo);
    setQuantidade(String(meta.quantidade));
    setTema(meta.tema ?? "Todos");
    setLocal(meta.local ?? "");
  };

  const handleAbrirVerTodas = () => {
    if (todasMetas[0]) selecionarMeta(todasMetas[0]);
    setModalTodasAberto(true);
  };

  const handleSalvar = async () => {
    await atualizarMeta({ ...metaSelecionada, periodo, quantidade: Number(quantidade), tema, local });
    setModalTodasAberto(false);
  };

  const handleDeletar = async () => {
    await removerMeta(metaSelecionada.id);
    setPopoverAberto(false);
    const proxima = todasMetas.find((m) => m.id !== metaSelecionada.id);
    if (proxima) selecionarMeta(proxima);
    else setModalTodasAberto(false);
  };

  return (
    <>
      <div className={styles.section}>
        <div className={styles.metas}>
          {metas.map((meta) => (
            <CardMeta
              key={meta.id}
              meta={meta}
              filmesVistos={meta.filmesVistosPeriodo}
            />
          ))}
        </div>

        <div className={styles.botoes}>
          <Button
            variant="outline"
            label="Ver todas"
            border="var(--stroke-submit)"
            arrowColor="var(--stroke-submit)"
            width="100%"
            bg="none"
            onClick={handleAbrirVerTodas}
          />
          <Button
            variant="outline"
            label="Criar meta"
            border="var(--stroke-solid)"
            arrowColor="var(--stroke-solid)"
            width="100%"
            onClick={() => setModalAberto(true)}
            bg="none"
          />
        </div>
      </div>

      {modalAberto && <CriarMeta onClose={() => setModalAberto(false)} />}

      {modalTodasAberto && (() => {
        const metaAtiva = metaSelecionada ?? todasMetas[0] ?? null;
        return (
          <Modal
            title="Metas"
            onClose={() => setModalTodasAberto(false)}
            primaryAction={{ label: "Salvar", onClick: handleSalvar }}
            secondaryAction={metaAtiva ? {
              variant: "ghost",
              label: "Deletar meta",
              icon: <TrashIcon size={16} color="var(--primitive-erro-01)" />,
              color: "var(--primitive-erro-01)",
              onClick: () => setPopoverAberto(true),
            } : undefined}
          >
            <div className={styles.splitLayout}>
              <div className={styles.listaColuna}>
                {todasMetas.map((meta) => (
                  <CardMeta
                    key={meta.id}
                    meta={meta}
                    filmesVistos={meta.filmesVistosPeriodo}
                    onSelect={selecionarMeta}
                    isSelected={metaAtiva?.id === meta.id}
                  />
                ))}
              </div>

              <div className={styles.detalheColuna}>
                {metaAtiva && (
                  <MetaPainel
                    key={metaAtiva.id}
                    meta={metaAtiva}
                    periodo={periodo}
                    setPeriodo={setPeriodo}
                    quantidade={quantidade}
                    setQuantidade={setQuantidade}
                    tema={tema}
                    setTema={setTema}
                    local={local}
                    setLocal={setLocal}
                  />
                )}
              </div>
            </div>
          </Modal>
        );
      })()}

      {popoverAberto && createPortal(
        <div className={styles.popoverOverlay} onClick={() => setPopoverAberto(false)}>
          <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
            <p className={styles.popoverTexto}>
              Tem certeza que deseja deletar esta meta? Esta ação não pode ser desfeita.
            </p>
            <div className={styles.popoverAcoes}>
              <button className={styles.popoverCancelar} onClick={() => setPopoverAberto(false)} type="button">
                Cancelar
              </button>
              <button className={styles.popoverConfirmar} onClick={handleDeletar} type="button">
                <TrashIcon size={14} color="currentColor" />
                Deletar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
