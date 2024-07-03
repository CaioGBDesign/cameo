import styles from "./index.module.scss";
import Diretores from "@/components/detalhesfilmes/diretores";

const Direcao = () => {
  const simulacaoBack = [
    {
      url: "/usuario/usuario.jpeg",
      nome: "Caio Goulart",
    },
    {
      url: "/usuario/usuario.jpeg",
      nome: "Caio Goulart",
    },
  ];

  return (
    <div className={styles.diretoresCameo}>
      <div className={styles.contDiretores}>
        <h3>Direção</h3>

        <div className={styles.diretores}>
          {simulacaoBack.map((diretor) => (
            <Diretores
              fotoDiretor={diretor.url}
              NomeDiretor={diretor.nome}
            ></Diretores>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Direcao;
