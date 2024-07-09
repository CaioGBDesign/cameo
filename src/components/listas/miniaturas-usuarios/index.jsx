import styles from "./index.module.scss";

const MiniaturasUsuarios = () => {
  const simulacaoBack = [
    {
      url: "/usuario/usuario.jpeg",
    },
    {
      url: "/usuario/usuario.jpeg",
    },
  ];

  return (
    <div className={styles.usuariosLista}>
      {simulacaoBack.map((miniatura) => (
        <img src={miniatura.url} />
      ))}
    </div>
  );
};

export default MiniaturasUsuarios;
