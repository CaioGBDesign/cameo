import styles from "./index.module.scss";

const ElementoParagrafo = ({
  index,
  elemento,
  aplicarEstilo,
  handleParagrafoChange,
  textareaRefs,
}) => {
  return (
    <div className={styles.paragrafoBox}>
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
