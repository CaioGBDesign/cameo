import styles from "./index.module.scss";

const Titulolistagem = ({
  quantidadeFilmes,
  titulolistagem,
  configuracoes = true,
}) => {
  return (
    <div className={styles.titulolistagem}>
      <div className={styles.quantidade}>
        <span className={styles.contagem}>{quantidadeFilmes}</span>
        <span className={styles.tituloPagina}>{titulolistagem}</span>
      </div>

      {configuracoes && (
        <div className={configuracoes}>
          <img src="/icones/configuracoes.svg" />
        </div>
      )}
    </div>
  );
};

export default Titulolistagem;
