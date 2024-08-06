import styles from "./index.module.scss";

const EntrarCadastrar = ({ children, onClick }) => {
  return (
    <button type="button" onClick={onClick} className={styles["submit-button"]}>
      {children}
    </button>
  );
};

export default EntrarCadastrar;
