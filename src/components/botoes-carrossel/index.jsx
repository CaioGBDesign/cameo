import { useState, useRef } from "react";
import styles from "./index.module.scss";
import { useIsMobile } from "@/components/DeviceProvider";

function GrupoBotoesFiltro({ opcoesBotoes, onFilterChange }) {
  const isMobile = useIsMobile();
  const [filtroSelecionado, setFiltroSelecionado] = useState(null);
  const botoesRef = useRef(null);

  const handleScroll = (direction) => {
    if (botoesRef.current) {
      const scrollAmount = 300;
      const current = botoesRef.current.scrollLeft;
      botoesRef.current.scrollLeft =
        direction === "next" ? current + scrollAmount : current - scrollAmount;
    }
  };

  const toggleFilter = (opcao) => {
    const novo = filtroSelecionado?.value === opcao.value ? null : opcao;
    setFiltroSelecionado(novo);
    onFilterChange(novo);
  };

  return (
    <div
      className={`${styles.contBotoes} ${
        isMobile ? styles.mobile : styles.desktop
      }`}
    >
      <div className={styles.botoes} ref={botoesRef}>
        {opcoesBotoes.map((grupo) => (
          <div key={grupo.label} className={styles.grupoFiltro}>
            <span className={styles.grupoLabel}>{grupo.label}:</span>
            <div className={styles.grupoBotoes}>
              {grupo.options.map((opcao) => (
                <button
                  key={opcao.value}
                  onClick={() => toggleFilter(opcao)}
                  className={`${styles.botaoFiltro} ${
                    filtroSelecionado?.value === opcao.value ? styles.ativo : ""
                  }`}
                >
                  {opcao.label}
                  {filtroSelecionado?.value === opcao.value && (
                    <span className={styles.iconeFechar}>×</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!isMobile && (
        <div className={styles.navBotoes}>
          <button onClick={() => handleScroll("next")}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fproximo.svg?alt=media&token=dc8fe2b3-ead3-49b4-aa1e-926b16f4a3fc"
              alt="Próximo"
            />
          </button>
          <button onClick={() => handleScroll("prev")}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fanterior.svg?alt=media&token=9564b079-3d4f-4b07-922d-1275ef619523"
              alt="Anterior"
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default GrupoBotoesFiltro;
