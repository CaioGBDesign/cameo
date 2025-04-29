import React, { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";
import empresas from "@/components/listas/tags/empresas.json";
import generos from "@/components/listas/tags/generos.json";

function FiltroNoticias({ noticias, onFilter }) {
  const [open, setOpen] = useState(false);
  const [filtroSelecionado, setFiltroSelecionado] = useState("");
  const containerRef = useRef(null);

  const opcoesSelect = [
    {
      label: "Empresas",
      options: empresas.map((e) => ({
        value: `empresa:${e.name}`,
        label: e.name,
      })),
    },
    {
      label: "Gêneros",
      options: generos.map((g) => ({
        value: `genero:${g.name}`,
        label: g.name,
      })),
    },
  ];

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Aplica filtro sempre que mudar seleção
  useEffect(() => {
    if (!filtroSelecionado) {
      onFilter(noticias);
      return;
    }
    const [tipo, valor] = filtroSelecionado.split(":");
    const filtradas = noticias.filter((n) => {
      if (tipo === "empresa") {
        return n.empresas?.some((x) => x.toLowerCase() === valor.toLowerCase());
      }
      if (tipo === "genero") {
        return n.generos?.some((x) => x.toLowerCase() === valor.toLowerCase());
      }
      return false;
    });
    onFilter(filtradas);
  }, [filtroSelecionado, noticias, onFilter]);

  // Limpa filtro
  const clearFilter = () => {
    setFiltroSelecionado("");
    onFilter(noticias);
  };

  // Rótulo exibido no botão
  const label = filtroSelecionado
    ? opcoesSelect
        .flatMap((g) => g.options)
        .find((opt) => opt.value === filtroSelecionado)?.label
    : "Todas os filtros";

  return (
    <div className={styles.filtroContainer} ref={containerRef}>
      <button
        type="button"
        className={styles.triggerButton}
        onClick={() => setOpen((o) => !o)}
      >
        <div className={styles.tituloSelect}>
          <img src="/icones/filtros.svg" alt="Filtros" />
          <span>{label}</span>
        </div>
        {/* Se há filtro selecionado, mostra 'x' para limpar, senão seta */}
        {filtroSelecionado ? (
          <span className={styles.clear} onClick={clearFilter}>
            &times;
          </span>
        ) : null}
      </button>

      {open && (
        <div className={styles.dropdown}>
          {opcoesSelect.map((grupo) => (
            <div key={grupo.label} className={styles.group}>
              <div className={styles.groupLabel}>{grupo.label}</div>
              {grupo.options.map((opt) => (
                <div
                  key={opt.value}
                  className={`${styles.option} ${
                    filtroSelecionado === opt.value ? styles.selected : ""
                  }`}
                  onClick={() => {
                    setFiltroSelecionado(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FiltroNoticias;
