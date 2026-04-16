import styles from "./index.module.scss";
import { useRef } from "react";
import Button from "@/components/button";
import EditIcon from "@/components/icons/EditIcon";
import CloudUploadIcon from "@/components/icons/CloudUploadIcon";

const UploadImagem = ({ imagem, onImagemChange, dimensoes = true }) => {
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
              <CloudUploadIcon size={24} color="white" />
            </div>
            {dimensoes && (
              <div className={styles.textos}>
                <span className={styles.subTextoLabel}>{dimensoes}</span>
              </div>
            )}
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
              <Button
                variant="outline"
                icon={<EditIcon size={14} color="currentColor" />}
                onClick={abrirSeletor}
              />
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
