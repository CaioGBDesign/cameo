import styles from "./index.module.scss"

const EntrarCadastrar = ({ children, onClick }) => {
    return (
        <button onClick={onClick} type="submit" className={styles['submit-button']}>
            {children}
        </button>
    );
};

export default EntrarCadastrar