import styles from "./index.module.scss";
import Atores from "@/components/detalhesfilmes/atores";

const Elenco = () => {
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
    <div className={styles.elencoCameo}>
      <div className={styles.contElenco}>
        <h3>Elenco</h3>

        <div className={styles.elenco}>
          {simulacaoBack.map((elenco) => (
            <Atores
              fotoAtor={elenco.url}
              NomeAtor={elenco.nome}
              Personagem={elenco.personagem}
            ></Atores>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Elenco;
