import styles from "./index.module.scss";
import { useEffect, useState } from "react";

const GraficoVistos = ({ filmesVistos }) => {
  const [generoCounts, setGeneroCounts] = useState([]);
  const [heights, setHeights] = useState({});
  const [totalCounts, setTotalCounts] = useState(0);

  useEffect(() => {
    if (!filmesVistos.length) return;

    const novosGeneroCounts = {};
    filmesVistos.forEach((filme) => {
      filme.genres.forEach((genero) => {
        if (!novosGeneroCounts[genero.name]) {
          novosGeneroCounts[genero.name] = 0;
        }
        novosGeneroCounts[genero.name]++;
      });
    });

    const generosOrdenados = Object.entries(novosGeneroCounts).sort(
      (a, b) => b[1] - a[1]
    );

    setGeneroCounts(generosOrdenados);

    const total = generosOrdenados.reduce(
      (sum, [, quantidade]) => sum + quantidade,
      0
    );
    setTotalCounts(total);

    const newHeights = {};
    let sumOfPercentages = 0;

    generosOrdenados.forEach(([genero, quantidade]) => {
      const percentual = (quantidade / total) * 100;
      newHeights[genero] = `${percentual}%`;
      sumOfPercentages += percentual;

      // Log para verificar os percentuais individuais
      console.log(
        `Gênero: ${genero}, Quantidade: ${quantidade}, Percentual: ${percentual.toFixed(
          2
        )}%`
      );
    });

    // Log para verificar a soma total dos percentuais
    console.log(
      `Soma dos percentuais antes do ajuste: ${sumOfPercentages.toFixed(2)}%`
    );

    // Ajuste final para garantir que a soma seja 100%
    const adjustment = 100 - sumOfPercentages;
    if (adjustment !== 0) {
      const firstGenero = generosOrdenados[0][0]; // Ajuste o primeiro gênero
      newHeights[firstGenero] = `${
        parseFloat(newHeights[firstGenero]) + adjustment
      }%`;
    }

    setHeights(newHeights);

    // Log para verificar a soma total após o ajuste
    const finalSum = Object.values(newHeights).reduce(
      (sum, height) => sum + parseFloat(height),
      0
    );
    console.log(`Soma dos percentuais após o ajuste: ${finalSum.toFixed(2)}%`);
  }, [filmesVistos]);

  return (
    <div className={styles.ContGraficosGeneros}>
      <div className={styles.GraficosGeneros}>
        <div className={styles.ContGraficos}>
          {generoCounts.map(([genero, quantidade]) => (
            <div key={genero} className={styles.BoxtGraficos}>
              <div className={styles.quantidadePercentual}>
                <span>
                  {quantidade} (
                  {totalCounts > 0
                    ? Math.floor((quantidade / totalCounts) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div
                className={styles.BarraGenero}
                style={{ height: heights[genero] || "0%" }}
              >
                <img src="/icones/estrado.svg" alt={`Ícone de ${genero}`} />
              </div>
              <div className={styles.GeneroFilmes}>
                <span>{genero}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GraficoVistos;
