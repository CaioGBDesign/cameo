import styles from "./index.module.scss";

const Titulolistagem = ({
  quantidadeFilmes,
  titulolistagem,
  configuracoes = true,
  handleRemoverClick, // Recebe a função para alternar a visibilidade do botão
}) => {
  return (
    <div className={styles.titulolistagem}>
      <div className={styles.quantidade}>
        <span className={styles.contagem}>{quantidadeFilmes}</span>
        <span className={styles.tituloPagina}>{titulolistagem}</span>
      </div>

      {configuracoes && (
        <div className={styles.remover} onClick={handleRemoverClick}>
          <span>Remover filmes</span>
        </div>
      )}
    </div>
  );
};

export default Titulolistagem;
