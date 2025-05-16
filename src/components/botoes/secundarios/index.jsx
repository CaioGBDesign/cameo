import React, { useState, useEffect, useCallback } from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import styles from "./index.module.scss";

const BotaoSecundario = ({
  fonteSecundaria,
  idBsecundario,
  typeBsecundario,
  textoBotaoSecundario,
  onClick,
}) => {
  const isMobile = useIsMobile();

  const countFilters = useCallback(() => {
    const keys = [
      "filterCert",
      "filterCountry",
      "filterGenre",
      "filterProvider",
      "filterStatus",
      "filterYear",
    ];
    return keys.reduce((acc, key) => {
      const val = localStorage.getItem(key);
      return acc + (val && val !== "null" ? 1 : 0);
    }, 0);
  }, []);

  const [filledCount, setFilledCount] = useState(countFilters);

  useEffect(() => {
    // Handler p/ custom event
    const onFiltersChanged = () => {
      setFilledCount(countFilters());
    };
    // escuta tanto 'filtersChanged' quanto o 'storage' padrão (para outros tabs)
    window.addEventListener("filtersChanged", onFiltersChanged);
    window.addEventListener("storage", onFiltersChanged);

    return () => {
      window.removeEventListener("filtersChanged", onFiltersChanged);
      window.removeEventListener("storage", onFiltersChanged);
    };
  }, [countFilters]);

  return (
    <div className={styles.botaoSecundario}>
      {filledCount > 0 && (
        <div className={styles.notificacao}>{filledCount}</div>
      )}
      {isMobile ? (
        <button
          type={typeBsecundario}
          id={idBsecundario}
          className={styles["botao-secundario"]}
          style={{ fontSize: fonteSecundaria }}
          onClick={onClick}
        >
          {textoBotaoSecundario}
        </button>
      ) : (
        <button
          type={typeBsecundario}
          id={idBsecundario}
          className={styles["botao-secundario"]}
          style={{ fontSize: fonteSecundaria }}
          onClick={onClick}
        >
          <img src="/icones/filtros.svg" alt="Filtros" />
        </button>
      )}
    </div>
  );
};

export default BotaoSecundario;
