import StatusRascunhoIcon from "@/components/icons/StatusRascunhoIcon";
import StatusEmRevisaoIcon from "@/components/icons/StatusEmRevisaoIcon";
import StatusAgendadoIcon from "@/components/icons/StatusAgendadoIcon";
import StatusPublicadoIcon from "@/components/icons/StatusPublicadoIcon";
import StatusArquivadoIcon from "@/components/icons/StatusArquivadoIcon";
import styles from "./index.module.scss";

const CONFIG = {
  rascunho:   { label: "Rascunho",   Icon: StatusRascunhoIcon,   className: styles.rascunho   },
  revisao:    { label: "Em revisão", Icon: StatusEmRevisaoIcon,  className: styles.revisao    },
  agendado:   { label: "Agendado",   Icon: StatusAgendadoIcon,   className: styles.agendado   },
  publicado:  { label: "Publicado",  Icon: StatusPublicadoIcon,  className: styles.publicado  },
  arquivado:  { label: "Arquivado",  Icon: StatusArquivadoIcon,  className: styles.arquivado  },
};

export default function StatusBadge({ status }) {
  const key = status?.toLowerCase().trim().replace("em revisão", "revisao").replace("em revisao", "revisao") ?? "rascunho";
  const cfg = CONFIG[key] ?? CONFIG.rascunho;
  const { Icon } = cfg;
  return (
    <span className={`${styles.badge} ${cfg.className}`}>
      <span className={styles.icon}><Icon /></span>
      <span className={styles.label}>{cfg.label}</span>
    </span>
  );
}