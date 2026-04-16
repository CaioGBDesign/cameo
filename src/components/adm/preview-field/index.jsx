import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import DocumentIcon02 from "@/components/icons/DocumentIcon02";
import styles from "./index.module.scss";

function formatarData(data, exibirDataCompleta) {
  if (!data) return null;
  if (exibirDataCompleta) {
    // data vem como "YYYY-MM-DD" do input type=date
    const [ano, mes, dia] = data.split("-");
    if (!ano) return null;
    return dia && mes ? `${dia}/${mes}/${ano}` : ano;
  }
  return data.split("-")[0] || null;
}

export default function PreviewField({
  icon,
  titulo,
  valor,
  placeholder = "Adicionar",
  data,
  exibirDataCompleta = false,
  itens,
  onClick,
}) {
  const temItens = Array.isArray(itens) && itens.length > 0;
  const temConteudo = temItens || !!valor;
  const dataFormatada = formatarData(data, exibirDataCompleta);

  return (
    <div className={styles.wrapper}>
      <div className={styles.boxTitle}>
        <div className={styles.boxIcon}>{icon}</div>
        <span className={styles.titulo}>{titulo}</span>
      </div>

      <div className={styles.preview} onClick={onClick}>
        <div className={styles.previewRow}>
          <span className={styles.placeholder}>{placeholder}</span>
          <DocumentIcon02 size={24} color="var(--icon-secondary)" />
        </div>
        {temItens
          ? itens.map((item, i) => (
              <div key={i} className={styles.previewConteudo}>
                <ArrowRightIcon size={20} color="var(--text-sub)" />
                <span className={styles.valor}>{item.valor}</span>
                {formatarData(item.data, item.exibirDataCompleta) && (
                  <span className={styles.data}>
                    Desde {formatarData(item.data, item.exibirDataCompleta)}
                  </span>
                )}
              </div>
            ))
          : temConteudo && (
              <div className={styles.previewConteudo}>
                <ArrowRightIcon size={20} color="var(--text-sub)" />
                <span className={styles.valor}>{valor}</span>
                {dataFormatada && (
                  <span className={styles.data}>Desde {dataFormatada}</span>
                )}
              </div>
            )}
      </div>
    </div>
  );
}
