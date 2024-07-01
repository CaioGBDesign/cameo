 import styles from "./index.module.scss";

const InputInfo = ({ infoDados, isEnabled = false }) => {

    return (
        <div className={styles.dadosPessoais}>

            <input type="name" placeholder={infoDados} id="name" name="name" required disabled={isEnabled} />
            
        </div>
    );
}

export default InputInfo;