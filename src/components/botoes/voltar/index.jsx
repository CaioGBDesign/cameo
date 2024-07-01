import styles from "./index.module.scss"
import { useRouter } from "next/navigation";

const Botaovoltar = ({ children }) => {

    const router = useRouter ()

    function RouterBack () {
        router.back()
    }

    return (
        <button onClick={RouterBack} className={styles['botao-voltar']}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 19.9999L8.48 13.4799C7.71 12.7099 7.71 11.4499 8.48 10.6799L15 4.15991" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {children}
        </button>
    );
};

export default Botaovoltar