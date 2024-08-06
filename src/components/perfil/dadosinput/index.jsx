import styles from "./index.module.scss";

const InputInfo = ({ infoDados, isEnabled = false }) => {
  return (
    <div className={styles.dadosPessoais}>
      <input
        type={infoDados}
        placeholder={infoDados}
        value={infoDados}
        id={infoDados}
        name={infoDados}
        required
        disabled={isEnabled}
      />
    </div>
  );
};

export default InputInfo;
