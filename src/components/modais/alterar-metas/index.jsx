import styles from "./index.module.scss";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import HeaderModal from "@/components/modais/header-modais";
import { useRouter } from "next/router";

const AlterarMeta = ({ onClose, meta = {}, onAlterarMeta }) => {
  const router = useRouter();
  const { atualizarMeta, user } = useAuth();
  const isMobile = useIsMobile();
  const modalRef = useRef(null);
  const [periodo, setPeriodo] = useState(meta?.periodo || "");
  const [quantidade, setQuantidade] = useState(meta?.quantidade || "");
  const [erroQuantidade, setErroQuantidade] = useState("");
  const [filmesPeriodo, setFilmesPeriodo] = useState([]);
  const [filmesDetalhes, setFilmesDetalhes] = useState({});

  // Função para filtrar filmes por período
  const filtrarFilmesPorPeriodo = (periodoSelecionado) => {
    const hoje = new Date();
    const filmesVistos = user?.visto ? Object.entries(user.visto) : [];

    return filmesVistos.filter(([filmeId, dadosFilme]) => {
      const [dia, mes, ano] = dadosFilme.data.split("/").map(Number);
      const dataFilme = new Date(ano, mes - 1, dia);

      switch (periodoSelecionado) {
        case "ano":
          return dataFilme.getFullYear() === hoje.getFullYear();
        case "mes":
          return (
            dataFilme.getMonth() === hoje.getMonth() &&
            dataFilme.getFullYear() === hoje.getFullYear()
          );
        case "semana":
          const semanaInicio = new Date(
            hoje.setDate(hoje.getDate() - hoje.getDay())
          );
          const semanaFim = new Date(semanaInicio);
          semanaFim.setDate(semanaInicio.getDate() + 6);
          return dataFilme >= semanaInicio && dataFilme <= semanaFim;
        case "dia":
          return dataFilme.toDateString() === hoje.toDateString();
        default:
          return false;
      }
    });
  };

  // Novo useEffect para buscar os backdrops
  useEffect(() => {
    const buscarDetalhesFilmes = async () => {
      const detalhes = {};

      for (const [filmeId] of filmesPeriodo) {
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/movie/${filmeId}?api_key=c95de8d6070dbf1b821185d759532f05&language=pt-BR`
          );
          const data = await response.json();
          detalhes[filmeId] = {
            titulo: data.title,
            poster_path: data.poster_path,
          };
        } catch (error) {
          console.error("Erro ao buscar detalhes do filme:", error);
          detalhes[filmeId] = { erro: true };
        }
      }

      setFilmesDetalhes(detalhes);
    };

    if (filmesPeriodo.length > 0) {
      buscarDetalhesFilmes();
    }
  }, [filmesPeriodo]);

  // Atualizar filmes quando o período mudar
  useEffect(() => {
    if (periodo) {
      const filmesFiltrados = filtrarFilmesPorPeriodo(periodo);
      setFilmesPeriodo(filmesFiltrados);
    }
  }, [periodo]);

  useEffect(() => {
    if (!meta.id) {
      console.error("A meta fornecida está indefinida ou incompleta.");
    }
  }, [meta]);

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose(); // Fecha o modal ao clicar fora
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantidade || quantidade <= 0) {
      setErroQuantidade("A quantidade deve ser maior que zero.");
      return;
    }

    setErroQuantidade("");

    const metaAtualizada = {
      id: meta.id,
      periodo: periodo || meta.periodo,
      quantidade: Number(quantidade),
    };

    try {
      await atualizarMeta(metaAtualizada);
      onAlterarMeta(metaAtualizada);
      onClose(); // Fecha o modal após sucesso
    } catch (error) {
      console.error("Erro ao atualizar meta:", error);
    }
  };

  return (
    <div className={styles.contMetas}>
      <div className={styles.modalContent} ref={modalRef}>
        <HeaderModal
          onClose={onClose}
          titulo="Detalhes da Meta"
          icone={
            "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Falterar-metas-cameo-02.png?alt=media&token=f9e015bd-5d21-4d47-83aa-55c01751f94d"
          }
          iconeMobile={
            "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Falterar-metas-cameo-02.png?alt=media&token=f9e015bd-5d21-4d47-83aa-55c01751f94d"
          }
          altIcone={"Metas Cameo"}
        />

        <form onSubmit={handleSubmit}>
          <div className={styles.detalhesDaMeta}>
            <div className={styles.criacaoMeta}>
              <div className={styles.separador}>
                <h3>Selecione o período</h3>
                <div className={styles.metasPeriodo}>
                  <input
                    type="radio"
                    id="ano"
                    name="periodo"
                    checked={periodo === "ano"}
                    onChange={() => setPeriodo("ano")}
                  />
                  <label htmlFor="ano">Ano</label>
                  <input
                    type="radio"
                    id="mes"
                    name="periodo"
                    checked={periodo === "mes"}
                    onChange={() => setPeriodo("mes")}
                  />
                  <label htmlFor="mes">Mês</label>
                  <input
                    type="radio"
                    id="semana"
                    name="periodo"
                    checked={periodo === "semana"}
                    onChange={() => setPeriodo("semana")}
                  />
                  <label htmlFor="semana">Semana</label>
                  <input
                    type="radio"
                    id="dia"
                    name="periodo"
                    checked={periodo === "dia"}
                    onChange={() => setPeriodo("dia")}
                  />
                  <label htmlFor="dia">Dia</label>
                </div>
              </div>

              <div className={styles.separador}>
                <div className={styles.metasQuantidade}>
                  <input
                    id="quantidade"
                    type="number"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    min="1"
                    placeholder="Adicione a quantidade de filmes"
                  />
                </div>
                {erroQuantidade && (
                  <p className={styles.erroMensagem}>{erroQuantidade}</p>
                )}
              </div>
            </div>

            {isMobile ? (
              <div className={styles.filmesPeriodoTitulo}>
                <h3>Filmes vistos nesse período</h3>
              </div>
            ) : null}

            <div className={styles.filmesRegistradosNessePeriodo}>
              {filmesPeriodo.map(([filmeId, filme]) => {
                const detalhes = filmesDetalhes[filmeId] || {};

                return (
                  <div
                    key={filmeId}
                    className={styles.filmeItem}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push({
                        pathname: "/",
                        query: { filmeId: filmeId },
                      });
                    }}
                  >
                    {detalhes.poster_path && (
                      <div className={styles.imagemFilmeMeta}>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${detalhes.poster_path}`}
                          alt={detalhes.titulo || "Filme desconhecido"}
                          className={styles.backdrop}
                        />
                      </div>
                    )}
                    <div className={styles.filmeInfo}>
                      <div className={styles.filmeTitulo}>
                        <span className={styles.titulo}>
                          {detalhes.titulo || "Carregando título..."}
                        </span>
                      </div>
                      <div className={styles.filmeData}>
                        <span>Assisti em</span>
                        <div className={styles.dataRegistroFilme}>
                          <span>{filme.data || "Carregando data..."}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.botoesFooter}>
            <div className={styles.cancelar} onClick={onClose}>
              <span>Cancelar</span>
            </div>
            <button type="submit">
              <span>Alterar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlterarMeta;
