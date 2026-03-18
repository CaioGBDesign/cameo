export const calcularDiasRestantes = (periodo) => {
  const hoje = new Date();
  let fim;

  switch (periodo) {
    case "dia":
      fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 23, 59, 59);
      break;
    case "semana": {
      const diaSemana = hoje.getDay();
      const diasAteDomingo = diaSemana === 0 ? 0 : 7 - diaSemana;
      fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + diasAteDomingo, 23, 59, 59);
      break;
    }
    case "mes":
      fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59);
      break;
    case "ano":
      fim = new Date(hoje.getFullYear(), 11, 31, 23, 59, 59);
      break;
    default:
      return null;
  }

  return Math.max(0, Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24)));
};

export const formatarTempoRestante = (dias) => {
  if (dias <= 0) return "Meta encerrada";
  if (dias === 1) return "Resta 1 dia";
  if (dias < 7) return `Restam ${dias} dias`;
  if (dias < 14) return "Resta 1 semana";
  if (dias < 30) return `Restam ${Math.floor(dias / 7)} semanas`;
  if (dias < 60) return "Resta 1 mês";
  return `Restam ${Math.floor(dias / 30)} meses`;
};

const parseData = (dataStr) => {
  const [dia, mes, ano] = dataStr.split("/").map(Number);
  return new Date(ano, mes - 1, dia);
};

export const contarFilmesPorPeriodo = (visto = {}, periodo) => {
  const hoje = new Date();
  const entries = Object.values(visto);

  return entries.filter(({ data }) => {
    if (!data) return false;
    const dataFilme = parseData(data);

    switch (periodo) {
      case "dia":
        return (
          dataFilme.getDate() === hoje.getDate() &&
          dataFilme.getMonth() === hoje.getMonth() &&
          dataFilme.getFullYear() === hoje.getFullYear()
        );
      case "semana": {
        const umaSemanaAtras = new Date(hoje);
        umaSemanaAtras.setDate(hoje.getDate() - 7);
        return dataFilme >= umaSemanaAtras;
      }
      case "mes":
        return (
          dataFilme.getMonth() === hoje.getMonth() &&
          dataFilme.getFullYear() === hoje.getFullYear()
        );
      case "ano":
        return dataFilme.getFullYear() === hoje.getFullYear();
      default:
        return false;
    }
  }).length;
};
