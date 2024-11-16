import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/components/DeviceProvider";

const GraficoVistos = ({ filmesVistos }) => {
  const [generoCounts, setGeneroCounts] = useState([]);
  const [heights, setHeights] = useState({});
  const [totalCounts, setTotalCounts] = useState(0);
  const [colors, setColors] = useState({});

  // define se desktop ou mobile
  const isMobile = useIsMobile();

  const colorPalette = [
    "#7D7AFF",
    "#70D7FF",
    "#2BA8E2",
    "#DA8FFF",
    "#FAFAFA",
    "#39C65D",
    "#F2C71C",
    "#FF6961",
    "#9694FF",
    "#8ADEFF",
    "#5CAAFF",
    "#E2A8FF",
    "#EDEDED",
    "#8B8B8E",
    "#4DCB6D",
    "#F4D03E",
    "#FF817A",
    "#AFADFF",
    "#A3E5FF",
    "#75B8FF",
    "#EBC2FF",
    "#E0E0E0",
    "#98989A",
    "#61D17D",
    "#F7DC6E",
    "#FF9994",
  ];

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
    const newColors = {};

    // Definir o primeiro gênero com 94px de altura (100%)
    const firstGenero = generosOrdenados[0][0];
    const firstGeneroCount = generosOrdenados[0][1];
    const maxHeight = 94; // altura máxima em pixels
    newHeights[firstGenero] = `${maxHeight}px`;
    newColors[firstGenero] = colorPalette[0]; // Cor do primeiro gênero

    // Para os outros gêneros, calculamos a altura proporcional em pixels
    generosOrdenados.slice(1).forEach(([genero, quantidade], index) => {
      // Calcular o percentual em relação ao primeiro gênero
      const percentualEmRelacaoAoPrimeiro =
        (quantidade / firstGeneroCount) * 100;

      // Converter o percentual para pixels
      const heightInPixels = (percentualEmRelacaoAoPrimeiro / 100) * maxHeight;
      newHeights[genero] = `${heightInPixels.toFixed(2)}px`; // Arredondando a altura para 2 casas decimais
      newColors[genero] = colorPalette[(index + 1) % colorPalette.length]; // Atribui cor sequencialmente
    });

    setHeights(newHeights);
    setColors(newColors);
  }, [filmesVistos]);

  return (
    <div className={styles.ContGraficosGeneros}>
      <div className={styles.GraficosGeneros}>
        {isMobile ? null : (
          <div className={styles.headerGrafico}>
            <h1>Gêneros mais assistidos</h1>
          </div>
        )}

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
                style={{
                  height: heights[genero] || "0%", // Definindo a altura convertida para pixels
                  backgroundColor: colors[genero] || "#FAFAFA", // Aplica a cor para o gênero
                }}
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
