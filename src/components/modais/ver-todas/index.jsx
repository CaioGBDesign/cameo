import { useState } from "react";
import styles from "./index.module.scss";
import HeaderModal from "@/components/modais/header-modais";
import DeletarMetas from "@/components/modais/deletar-metas";

const VerTodas = ({
  metas,
  filmesVistosCountDia,
  filmesVistosCountSemana,
  filmesVistosCountMes,
  filmesVistosCountAno,
  colorPalette, // Recebendo a colorPalette via props
  onClose,
}) => {
  const [modalAberto, setModalAberto] = useState(null); // Estado para gerenciar o modal aberto
  const [metaParaDeletar, setMetaParaDeletar] = useState(null); // Meta específica para exclusão

  const abrirModalDeletar = (id) => {
    setMetaParaDeletar(id); // Define a meta a ser deletada
    setModalAberto("deletar-metas"); // Define o modal atual como aberto
  };

  const removerMeta = (id) => {
    console.log("Remover meta:", id); // Substitua pela lógica de remoção real
    setModalAberto(null); // Fecha o modal após a remoção
    setMetaParaDeletar(null); // Reseta a meta
  };

  return (
    <div className={styles.verTodas}>
      <div className={styles.contVerTodas}>
        <div className={styles.GraficosDatas}>
          <HeaderModal onClose={onClose} titulo={"Todas as metas"} />

          <div className={styles.RelacaoMes}>
            <ul>
              {metas.map((meta, index) => {
                const filmesVistosCount =
                  meta.periodo === "mes"
                    ? filmesVistosCountMes
                    : meta.periodo === "ano"
                    ? filmesVistosCountAno
                    : meta.periodo === "semana"
                    ? filmesVistosCountSemana
                    : meta.periodo === "dia"
                    ? filmesVistosCountDia
                    : 0;

                // Verifica se a meta foi concluída
                const backgroundColor =
                  filmesVistosCount >= meta.quantidade
                    ? "#33FF88" // Cor para metas concluídas
                    : colorPalette[index % colorPalette.length]; // Usando a paleta de cores

                return (
                  <li key={meta.id}>
                    <div className={styles.GraficoMetas}>
                      <div className={styles.periodoHeader}>
                        <div className={styles.iconeDescricao}>
                          <div className={styles.descricaoMeta}>
                            <span>{meta.periodo}</span>
                          </div>
                        </div>
                        <div className={styles.contQuantidade}>
                          <div className={styles.quantidadeComparador}>
                            {meta.quantidade && <span>{meta.quantidade}</span>}
                            <span>de</span>
                            <span>{filmesVistosCount}</span>
                            <span>vistos</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={styles.graficoVertical}
                        style={{
                          backgroundColor: `${backgroundColor}50`, // Opacidade de 50%
                        }}
                      >
                        <div
                          className={styles.graficoPreenchido}
                          style={{
                            width: `${
                              (filmesVistosCount / meta.quantidade) * 100
                            }%`,
                            backgroundColor: backgroundColor,
                          }}
                        >
                          <div className={styles.estrado}>
                            <img
                              src="/icones/estrado-vertical.svg"
                              alt="Estrado"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.botaoDeletar}>
                      <button onClick={() => abrirModalDeletar(meta.id)}>
                        <img src="icones/deletar.svg" alt="Deletar" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {modalAberto === "deletar-metas" && (
        <DeletarMetas
          meta={metas.find((meta) => meta.id === metaParaDeletar)} // Busca a meta específica
          onClose={() => {
            setModalAberto(null);
            setMetaParaDeletar(null);
          }}
          onConfirmar={() => removerMeta(metaParaDeletar)}
        />
      )}
    </div>
  );
};

export default VerTodas;
