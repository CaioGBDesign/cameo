import styles from "./index.module.scss";
import { useRef } from "react";
import CornerArrowIcon from "@/components/icons/CornerArrowIcon";

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
            <div className={styles.uploadIcon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 13V21M12 13C11.2998 13 9.99153 14.9943 9.5 15.5M12 13C12.7002 13 14.0085 14.9943 14.5 15.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={styles.textos}>
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
