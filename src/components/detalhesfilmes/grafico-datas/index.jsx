import styles from "./index.module.scss";
import { useEffect, useState } from "react";

const GraficoDatas = ({ filmesVistos }) => {
  const [dadosMensais, setDadosMensais] = useState([]);

  useEffect(() => {
    const contarFilmesPorMes = () => {
      const meses = {};
      const mesesNome = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];

      const dataFilmes = filmesVistos
        .map((filme) => {
          if (filme.avaliacao && filme.avaliacao.data) {
            const [dia, mes, ano] = filme.avaliacao.data.split("/").map(Number);
            return new Date(ano, mes - 1, dia);
          }
          return null;
        })
        .filter(Boolean);

      const mesAtual = new Date();
      const anoAtual = mesAtual.getFullYear();
      const mesAtualIndex = mesAtual.getMonth();

      // Cria uma lista de meses únicos, incluindo o mês atual
      const mesesUnicos = new Set();

      for (let i = 0; i < 4; i++) {
        const mesKey = `${anoAtual}-${
          mesAtualIndex - i < 0 ? 11 : mesAtualIndex - i
        }`;
        mesesUnicos.add(mesKey);
      }

      mesesUnicos.forEach((mes) => {
        meses[mes] = { quantidade: 0 };
      });

      filmesVistos.forEach((filme) => {
        if (filme.avaliacao && filme.avaliacao.data) {
          const [dia, mes, ano] = filme.avaliacao.data.split("/").map(Number);
          const mesKey = `${ano}-${mes - 1}`;

          if (meses[mesKey]) {
            meses[mesKey].quantidade++;
          }
        }
      });

      const dados = [...mesesUnicos].map((mes) => {
        const quantidade = meses[mes].quantidade || 0;
        const percentual = filmesVistos.length
          ? (quantidade / filmesVistos.length) * 100
          : 0;
        const mesIndex = mes.split("-")[1];
        return {
          mes: mesesNome[mesIndex],
          quantidade,
          percentual,
        };
      });

      setDadosMensais(dados);
    };

    contarFilmesPorMes();
  }, [filmesVistos]);

  return (
    <div className={styles.ContGraficosDatas}>
      <div className={styles.GraficosDatas}>
        <div className={styles.headerGrafico}>
          <h1>Quantidade de filmes vistos nos últimos meses!</h1>
        </div>
        <div className={styles.RelacaoMes}>
          {dadosMensais.map((dado, index) => (
            <div className={styles.mes} key={index}>
              <div className={styles.data}>
                <span>{dado.mes}</span>
              </div>
              <div className={styles.contPercentualGrafico}>
                <div
                  className={styles.percentualGrafico}
                  style={{ width: `${dado.percentual}%` }}
                ></div>
              </div>
              <span>{dado.quantidade}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraficoDatas;
