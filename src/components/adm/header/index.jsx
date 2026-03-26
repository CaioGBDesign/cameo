import Link from "next/link";
import { useRouter } from "next/router";
import DashboardIcon from "@/components/icons/DashboardIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import styles from "./index.module.scss";

const LABELS = {
  adm: "Dashboard",
  noticias: "Notícias",
  resenhas: "Resenhas",
  dubladores: "Dubladores",
  dublagens: "Dublagens",
  estudios: "Estúdios de dublagem",
  perguntas: "Perguntas",
  patentes: "Patentes",
  permissoes: "Permissões",
};

// Labels para rotas completas (sobrescrevem o padrão por segmento)
const PATH_LABELS = {
  "/adm/noticias/criar": "Criar notícia",
  "/adm/resenhas/criar": "Criar resenha",
  "/adm/dubladores/criar": "Criar dublador",
  "/adm/dublagens/criar": "Criar dublagem",
  "/adm/estudios/criar": "Criar estúdio",
  "/adm/perguntas/criar": "Criar pergunta",
  "/adm/patentes/criar": "Criar patente",
};

// Segmentos que devem ser pulados quando há um filho na rota
const SKIP_WITH_CHILD = new Set(["noticias", "resenhas", "dubladores", "dublagens", "estudios", "perguntas", "patentes"]);

export default function AdmHeader({ actions, collapsed }) {
  const router = useRouter();

  // ["", "adm", "noticias", ...]
  const segments = router.pathname.split("/").filter(Boolean);

  const fullPath = "/" + segments.join("/");
  const lastSeg = segments[segments.length - 1];
  const isCreating = lastSeg === "criar";

  // Se rota termina em "criar", pula o segmento pai e usa o PATH_LABELS
  const relevantSegments = isCreating
    ? segments.slice(1).filter((seg) => !SKIP_WITH_CHILD.has(seg))
    : segments.slice(1);

  const items = relevantSegments.map((seg, i) => {
    const href = "/" + segments.slice(0, segments.indexOf(seg) + 1).join("/");
    const label = isCreating && seg === "criar"
      ? (PATH_LABELS[fullPath] ?? "Criar")
      : (LABELS[seg] ?? seg);
    const isLast = i === relevantSegments.length - 1;
    return { href: isLast ? null : href, label };
  });

  return (
    <header className={`${styles.header} ${collapsed ? styles.headerCollapsed : ""}`}>
      <nav className={styles.breadcrumb}>
        <Link href="/adm" className={styles.home}>
          <DashboardIcon size={18} color="var(--icon-breadcrumb)" />
        </Link>
        {items.map((item, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.separator}>
              <ChevronDownIcon
                size={14}
                color="var(--icon-breadcrumb)"
                style={{ transform: "rotate(-90deg)" }}
              />
            </span>
            {item.href ? (
              <Link href={item.href} className={styles.link}>{item.label}</Link>
            ) : (
              <span className={styles.current}>{item.label}</span>
            )}
          </span>
        ))}
      </nav>
      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
