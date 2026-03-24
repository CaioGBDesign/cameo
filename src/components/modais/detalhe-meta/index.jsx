import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./index.module.scss";
import Modal from "@/components/modal";
import Button from "@/components/button";
import RadioButton from "@/components/inputs/radio-button";
import Switch from "@/components/inputs/switch";
import TextInput from "@/components/inputs/text-input";
import TrashIcon from "@/components/icons/TrashIcon";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
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

const LOCAIS = ["Em casa", "No cinema", "Em todo canto"];

export default function DetalheMeta({ meta, onClose }) {
  const { atualizarMeta, removerMeta } = useAuth();
  const isMobile = useIsMobile();

  const periodoInicial = NORMALIZAR[meta.periodo] ?? meta.periodo;

  const [periodo, setPeriodo] = useState(periodoInicial);
  const [quantidade, setQuantidade] = useState(String(meta.quantidade));
  const [tema, setTema] = useState(meta.tema ?? "Todos");
  const [local, setLocal] = useState(meta.local ?? "");
  const [deletarAoExpirar, setDeletarAoExpirar] = useState(meta.deletarAoExpirar ?? false);
  const [popoverAberto, setPopoverAberto] = useState(false);

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
      deletarAoExpirar,
    });
    onClose();
  };

  const handleDeletar = async () => {
    await removerMeta(meta.id);
    onClose();
  };

  return (
    <>
      <Modal
        title={meta.nome || PERIODO_LABEL[periodo]}
        onClose={onClose}
        primaryAction={{ label: "Salvar", onClick: handleSalvar }}
        secondaryAction={
          !isMobile
            ? {
                variant: "ghost",
                label: "Deletar meta",
                icon: <TrashIcon size={16} color="var(--primitive-erro-01)" />,
                color: "var(--primitive-erro-01)",
                onClick: () => setPopoverAberto(true),
              }
            : undefined
        }
      >
        <div className={styles.conteudo}>
          <div className={styles.conteudoDetalhes}>
            <div className={styles.infoTextos}>
              <p className={styles.infoTexto}>
                • {quantidade} filmes {PERIODO_SUFFIX[periodo]}
              </p>
              <p className={styles.infoTexto}>
                • {formatarTempoRestante(diasRestantes)} para concluir a meta
              </p>
              {filmesFaltando > 0 && (
                <p className={styles.infoTexto}>
                  • Faltam <strong>{filmesFaltando} filmes</strong> de{" "}
                  {quantidade} para concluir a meta
                </p>
              )}
              {filmesFaltando > 0 &&
                diasRestantes > 0 &&
                Number(quantidade) > 1 && (
                  <p className={styles.infoTexto}>
                    Se assistir a{" "}
                    <strong>
                      {filmesPorDia} filme{filmesPorDia !== 1 ? "s" : ""} por
                      dia
                    </strong>{" "}
                    sua meta será concluída com sucesso
                  </p>
                )}
            </div>

            <div className={styles.separador}></div>

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

            <div className={styles.deletarCard}>
              <div className={styles.deletarTexto}>
                <span>Deletar meta concluída</span>
                <p>Essa ação deleta a meta concluída, mesmo sem atingir a quantidade de filmes definida.</p>
              </div>
              <Switch
                id="det-deletar-ao-expirar"
                checked={deletarAoExpirar}
                onChange={(e) => setDeletarAoExpirar(e.target.checked)}
              />
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

            {isMobile && (
              <div className={styles.btnDeletar}>
                <Button
                  variant="ghost"
                  label="Deletar meta"
                  icon={
                    <TrashIcon size={16} color="var(--primitive-erro-01)" />
                  }
                  color="var(--primitive-erro-01)"
                  onClick={() => setPopoverAberto(true)}
                  width="100%"
                />
              </div>
            )}
          </div>
        </div>
      </Modal>

      {popoverAberto &&
        createPortal(
          <div
            className={styles.popoverOverlay}
            onClick={() => setPopoverAberto(false)}
          >
            <div
              className={styles.popover}
              onClick={(e) => e.stopPropagation()}
            >
              <p className={styles.popoverTexto}>
                Tem certeza que deseja deletar esta meta? Esta ação não pode ser
                desfeita.
              </p>
              <div className={styles.popoverAcoes}>
                <button
                  className={styles.popoverCancelar}
                  onClick={() => setPopoverAberto(false)}
                  type="button"
                >
                  Cancelar
                </button>
                <button
                  className={styles.popoverConfirmar}
                  onClick={handleDeletar}
                  type="button"
                >
                  <TrashIcon size={14} color="currentColor" />
                  Deletar
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
