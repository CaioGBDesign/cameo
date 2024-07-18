// components/detalhesfilmes/servicos/index.jsx
import React from "react";
import styles from "./index.module.scss";
import NomeServico from "../nomeservico";

const Servicos = ({ servicos }) => {
  // Lista de serviços a serem excluídos
  const servicosExcluidos = ["Max Amazon Channel", "Netflix basic with Ads"];

  // Filtra os serviços excluindo os serviços na lista servicosExcluidos
  const servicosFiltrados = servicos.filter(
    (servico) => !servicosExcluidos.includes(servico.provider_name)
  );

  return (
    <div className={styles.servicos}>
      <div className={styles.contServicos}>
        <h3>Serviços</h3>

        <div className={styles.todosServicos}>
          {servicosFiltrados.map((servico, index) => (
            <NomeServico
              key={index}
              streaming={servico.logo_path}
              nomeServico={servico.provider_name} // passa o nome do serviço como propriedade
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Servicos;
