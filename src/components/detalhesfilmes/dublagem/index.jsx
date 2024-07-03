import styles from "./index.module.scss";
import Dubladores from "@/components/detalhesfilmes/dubladores";

const Dublagem = () => {
  const simulacaoBack = [
    {
      url: "/usuario/usuario.jpeg",
      nome: "Caio Goulart",
      personagem: "Personagem",
    },
    {
      url: "/usuario/usuario.jpeg",
      nome: "Caio Goulart",
      personagem: "Personagem",
    },
  ];

  return (
    <div className={styles.dublagemCameo}>
      <div className={styles.contDublagem}>
        <h3>Dublagem</h3>

        <div className={styles.dublagem}>
          {simulacaoBack.map((dobladores) => (
            <Dubladores
              fotoDublador={dobladores.url}
              NomeDublador={dobladores.nome}
              Personagem={dobladores.personagem}
            ></Dubladores>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dublagem;
