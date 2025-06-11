import styles from "./index.module.scss";
import { useRef } from "react";

const UploadImagem = ({ imagem, onImagemChange, dimensoes }) => {
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
              src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fupload.svg?alt=media&token=2f137f1e-ff02-4400-9096-4812704df4b6"
              alt="Ícone upload"
              className={styles.uploadIcon}
            />
            <div className={styles.textos}>
              <span className={styles.textoLabel}>Selecionar imagem</span>
              <span className={styles.subTextoLabel}>{dimensoes}</span>
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
                  src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Feditar.svg?alt=media&token=d70d85da-fe9d-4df9-8276-0da123d876a1"
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
        />
      </label>
    </div>
  );
};

export default UploadImagem;
