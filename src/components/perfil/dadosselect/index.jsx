import styles from "./index.module.scss";

const SelectInfo = ({ idSelect, nameSelect, titulo, opcoes }) => {
    return (
        <div className={styles.dadosPessoais}>
            <select id={idSelect} name={nameSelect} className={styles.select} required>
                <option value="">{titulo}</option>
                {opcoes.map((opcao, index) => (
                    <option key={index} value={opcao.value}>
                        {opcao.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectInfo;