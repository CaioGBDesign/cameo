import styles from "./index.module.scss";
import { useRef } from "react";

const UploadImagem = ({ imagem, onImagemChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onImagemChange(file);
  };

  const abrirSeletor = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.uploadContainer}>
      <label className={styles.customFileLabel}>
        {!imagem && (
          <span className={styles.labelContent}>
            <img
              src="/icones/upload.svg"
              alt="Ícone upload"
              className={styles.uploadIcon}
            />
            <div className={styles.textos}>
              <span className={styles.textoLabel}>Selecionar imagem</span>
              <span className={styles.subTextoLabel}>
                Dimensões recomendadas 1440x480
              </span>
            </div>
          </span>
        )}

        {imagem && (
          <div className={styles.previewContainer}>
            <div className={styles.imagemPreview}>
              <img
                src={imagem.preview}
                alt="Preview"
                className={styles.imagePreview}
              />
            </div>

            <div className={styles.actionsOverlay}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={abrirSeletor}
                title="Alterar imagem"
              >
                <img
                  src="/icones/editar.svg"
                  alt="Alterar"
                  className={styles.actionIcon}
                />
                <span>Alterar imagem</span>
              </button>
            </div>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.hiddenFileInput}
          ref={fileInputRef}
          required
        />
      </label>
    </div>
  );
};

export default UploadImagem;
