import Switch from "@/components/inputs/switch";
import styles from "../../criar/index.module.scss";

export default function SidebarCronometros({
  idSuffix = "",
  cronometroAtivo, setCronometroAtivo,
  cronometroVisivel, setCronometroVisivel,
  cronometroRegressivoAtivo, setCronometroRegressivoAtivo,
  cronometroRegressivoVisivel, setCronometroRegressivoVisivel,
  cronometroTempo, setCronometroTempo,
}) {
  return (
    <div className={styles.cronometroCard}>
      <div className={styles.cronometroHeader}>
        <span />
        <div className={styles.cronometroHeaderLabels}>
          <span className={styles.toggleLabel}>Ativo</span>
          <span className={styles.toggleLabel}>Visível</span>
        </div>
      </div>
      <div className={styles.cronometroRow}>
        <span className={styles.cronometroLabel}>Cronômetro</span>
        <div className={styles.cronometroToggles}>
          <Switch id={`cron-ativo${idSuffix}`} checked={cronometroAtivo} onChange={(e) => setCronometroAtivo(e.target.checked)} />
          <Switch id={`cron-visivel${idSuffix}`} checked={cronometroVisivel} onChange={(e) => setCronometroVisivel(e.target.checked)} />
        </div>
      </div>
      <div className={styles.cronometroRow}>
        <input
          type="text"
          className={styles.cronometroTempoInput}
          value={cronometroTempo}
          onChange={(e) => setCronometroTempo(e.target.value)}
          placeholder="00:10:00"
        />
        <div className={styles.cronometroToggles}>
          <Switch id={`cronreg-ativo${idSuffix}`} checked={cronometroRegressivoAtivo} onChange={(e) => setCronometroRegressivoAtivo(e.target.checked)} />
          <Switch id={`cronreg-visivel${idSuffix}`} checked={cronometroRegressivoVisivel} onChange={(e) => setCronometroRegressivoVisivel(e.target.checked)} />
        </div>
      </div>
    </div>
  );
}
