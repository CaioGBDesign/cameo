import styles from "./index.module.scss";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import SkipIcon from "@/components/icons/SkipIcon";
import { useIsMobile } from "@/components/DeviceProvider";

const Pagination = ({ page, totalPages, onChange }) => {
  const isMobile = useIsMobile();

  if (totalPages <= 1) return null;

  const getPages = () => {
    const count = isMobile ? 2 : 3;
    let start = page - Math.floor((count - 1) / 2);
    let end = start + count - 1;

    if (start < 1) {
      start = 1;
      end = Math.min(totalPages, count);
    }
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - count + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className={styles.pagination}>
      {/* Ir para página 1 */}
      <button
        className={styles.skip}
        onClick={() => onChange(1)}
        disabled={page === 1}
      >
        <SkipIcon size={20} color="currentColor" />
      </button>

      {/* Anterior */}
      <button
        className={styles.arrow}
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        <span style={{ display: "flex", transform: "rotate(90deg)" }}>
          <ChevronDownIcon size={16} color="currentColor" />
        </span>
        <span className={styles.label}>Anterior</span>
      </button>

      {/* Botões numerados */}
      {getPages().map((p) => (
        <button
          key={p}
          className={`${styles.pageBtn} ${p === page ? styles.active : ""}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}

      {/* Próximo */}
      <button
        className={styles.arrow}
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        <span className={styles.label}>Próximo</span>
        <span style={{ display: "flex", transform: "rotate(-90deg)" }}>
          <ChevronDownIcon size={16} color="currentColor" />
        </span>
      </button>

      {/* Ir para última página */}
      <button
        className={styles.skip}
        onClick={() => onChange(totalPages)}
        disabled={page === totalPages}
        style={{ transform: "rotate(180deg)" }}
      >
        <SkipIcon size={20} color="currentColor" />
      </button>
    </div>
  );
};

export default Pagination;
