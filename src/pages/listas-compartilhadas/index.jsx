import styles from "./index.module.scss";
import Header from "@/components/Header";
import ListaCriada from "@/components/listas/lista-criada";
import BotaoSecundario from "@/components/botoes/secundarios";
import Private from "@/components/Private";

const ListasCompartilhadas = () => {
  return (
    <Private>
      <div className={styles.contListas}>
        <Header />

        <div className={styles.todasAsListas}>
          <div className={styles.tituloLiastas}>
            <h3>Listas compartilhadas</h3>
          </div>

          <div className={styles.listas}>
            <ListaCriada />
          </div>
        </div>

        <div className={styles.baseBotoes}>
          <div className={styles.contBotaoSecundario}>
            <BotaoSecundario
              textoBotaoSecundario={"Criar nova lista"}
              idBsecundario={"add-lista"}
            />
          </div>
        </div>
      </div>
    </Private>
  );
};

export default ListasCompartilhadas;
