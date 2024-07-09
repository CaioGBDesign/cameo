import styles from "./index.module.scss";
import Link from "next/link";
import Miniaturafilmes from "@/components/miniaturafilmes";
import MiniaturasUsuarios from "@/components/listas/miniaturas-usuarios";

const ListaCriada = () => {
  const simulacaoBack = [
    {
      url: "/background/jogador-numero-1.jpg",
      tituloLista: "Filmes da Pixar",
    },
    {
      url: "/background/homem-aranha-sem-volta-para-casa.jpg",
      tituloLista: "Filmes da Marvel",
    },
  ];

  return (
    <div className={styles.contListas}>
      {simulacaoBack.map((miniatura, index) => (
        <div key={index} className={styles.todasAsListas}>
          <Link href={`/lista/${encodeURIComponent(miniatura.tituloLista)}`}>
            <div className={styles.link}>
              <div className={styles.miniatura}>
                <Miniaturafilmes
                  capaminiatura={miniatura.url}
                  mostrarEstrelas={false}
                />
              </div>
              <div className={styles.tituloeUsuarios}>
                <span>{miniatura.tituloLista}</span>
                <MiniaturasUsuarios />
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ListaCriada;
