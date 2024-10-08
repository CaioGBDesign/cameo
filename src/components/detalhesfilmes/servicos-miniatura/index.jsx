// components/detalhesfilmes/servicos/index.jsx
import React from "react";
import styles from "./index.module.scss";
import NomeServicoMiniatura from "../nomeservico-miniatura";

const ServicosMiniatura = ({ servicos }) => {
  // Lista de serviços a serem excluídos
  const servicosExcluidos = ["Max Amazon Channel", "Netflix basic with Ads"];

  // Filtra os serviços excluindo os serviços na lista servicosExcluidos
  const servicosFiltrados = servicos.filter(
    (servico) => !servicosExcluidos.includes(servico.provider_name)
  );

  return (
    <div className={styles.servicos}>
      <div className={styles.todosServicos}>
        {servicosFiltrados.map((servico, index) => (
          <NomeServicoMiniatura
            key={index}
            streaming={servico.logo_path}
            NomeServicoMiniatura={servico.provider_name} // passa o nome do serviço como propriedade
          />
        ))}
      </div>
    </div>
  );
};

export default ServicosMiniatura;
