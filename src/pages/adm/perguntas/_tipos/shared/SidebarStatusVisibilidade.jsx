import Switch from "@/components/inputs/switch";
import Select from "@/components/inputs/select";
import styles from "../../criar/index.module.scss";

const VISIBILIDADES = [
  { value: "quiz", label: "Exclusiva para Quiz" },
  { value: "evento", label: "Exclusiva para eventos" },
  { value: "ambos", label: "Ambos" },
];

export default function SidebarStatusVisibilidade({
  idSuffix = "",
  ativo, setAtivo,
  visibilidade, setVisibilidade,
}) {
  return (
    <div className={styles.row}>
      <div className={styles.statusField}>
        <label className={styles.fieldLabel}>Status da pergunta</label>
        <div className={styles.statusRow}>
          <span className={styles.statusLabel}>{ativo ? "Ativo" : "Inativo"}</span>
          <Switch id={`pergunta-ativo${idSuffix}`} checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
        </div>
      </div>
      <Select
        label="Selecione a visibilidade"
        options={VISIBILIDADES}
        value={visibilidade}
        onChange={(e) => setVisibilidade(e.target.value)}
      />
    </div>
  );
}
