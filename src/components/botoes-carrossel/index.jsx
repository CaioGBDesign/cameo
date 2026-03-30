import { useState, useRef } from "react";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import styles from "./index.module.scss";

function BotoesCarrossel({ opcoesBotoes, onFilterChange }) {
  const [filtroSelecionado, setFiltroSelecionado] = useState(null);
  const scrollRef = useRef(null);

  const todasOpcoes = Array.isArray(opcoesBotoes[0]?.options)
    ? opcoesBotoes.flatMap((grupo) => grupo.options)
    : opcoesBotoes;

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollLeft += direction === "next" ? 300 : -300;
  };

  const toggleFilter = (opcao) => {
    const novo = filtroSelecionado?.value === opcao.value ? null : opcao;
    setFiltroSelecionado(novo);
    onFilterChange(novo);
  };

  const limparFiltro = () => {
    setFiltroSelecionado(null);
    onFilterChange(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.pills} ref={scrollRef}>
        <button
          className={`${styles.pill} ${!filtroSelecionado ? styles.ativo : ""}`}
          onClick={limparFiltro}
        >
          Todos
        </button>

        {todasOpcoes.map((opcao) => (
          <button
            key={opcao.value}
            className={`${styles.pill} ${filtroSelecionado?.value === opcao.value ? styles.ativo : ""}`}
            onClick={() => toggleFilter(opcao)}
          >
            {opcao.label}
          </button>
        ))}
      </div>

      <div className={styles.arrows}>
        <button
          className={`${styles.arrow} ${styles.arrowInativo}`}
          onClick={() => handleScroll("prev")}
          aria-label="Anterior"
        >
          <ChevronDownIcon size={18} color="var(--icon-base)" className={styles.chevronEsquerda} />
        </button>
        <button
          className={`${styles.arrow} ${styles.arrowAtivo}`}
          onClick={() => handleScroll("next")}
          aria-label="Próximo"
        >
          <ChevronDownIcon size={18} color="var(--icon-base)" className={styles.chevronDireita} />
        </button>
      </div>
    </div>
  );
}

export default BotoesCarrossel;
