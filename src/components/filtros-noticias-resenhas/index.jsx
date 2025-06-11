import React, { useState, useRef, useEffect } from "react";
import styles from "./index.module.scss";
import empresas from "@/components/listas/tags/empresas.json";
import generos from "@/components/listas/tags/generos.json";

function FiltroNoticias({ noticias, onFilter, filtroInicial = "" }) {
  const [open, setOpen] = useState(false);
  const [filtroSelecionado, setFiltroSelecionado] = useState(filtroInicial);
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
      const lista =
        tipo === "empresa" ? n.empresas : tipo === "genero" ? n.generos : [];
      return lista?.some(
        (x) => x.trim().toLowerCase() === valor.trim().toLowerCase()
      );
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
    : "Todos os filtros";

  return (
    <div className={styles.filtroContainer} ref={containerRef}>
      <button
        type="button"
        className={styles.triggerButton}
        onClick={() => setOpen((o) => !o)}
      >
        <div className={styles.tituloSelect}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Ffiltros.svg?alt=media&token=ead1e1eb-f88b-48ba-b2e6-26b3ef5c2e56"
            alt="Filtros"
          />
          <span>{label}</span>
        </div>
        {filtroSelecionado && (
          <span className={styles.clear} onClick={clearFilter}>
            &times;
          </span>
        )}
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
