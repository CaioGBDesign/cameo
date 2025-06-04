import styles from "./index.module.scss";

const ElementoParagrafo = ({
  index,
  elemento,
  aplicarEstilo,
  handleParagrafoChange,
  textareaRefs,
  tituloPlaceholder,
}) => {
  return (
    <div className={styles.paragrafoBox}>
      <div className={styles.contTools}>
        <div className={styles.tituloEControles}>
          <span>{tituloPlaceholder}</span>
          <div className={styles.editorTools}>
            <button
              type="button"
              onClick={() => aplicarEstilo(index, "bold")}
              className={styles.botaoEstilo}
            >
              B
            </button>
            <button
              type="button"
              onClick={() => aplicarEstilo(index, "italic")}
              className={styles.botaoEstilo}
            >
              I
            </button>
            <button
              type="button"
              onClick={() => aplicarEstilo(index, "link")}
              className={styles.botaoEstilo}
            >
              Link
            </button>
          </div>
        </div>
      </div>
      <textarea
        value={elemento.conteudo}
        onChange={(e) => handleParagrafoChange(index, e.target.value)}
        rows="4"
        placeholder={`Parágrafo ${index + 1}`}
        required
        ref={(el) => (textareaRefs.current[index] = el)}
      />
    </div>
  );
};

export default ElementoParagrafo;
