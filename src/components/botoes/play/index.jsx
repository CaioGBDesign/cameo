import styles from "./index.module.scss";
import Link from "next/link"; 

const BotaoPlay = ({ linkTrailer }) => {

    return (
        <Link href={linkTrailer} className={styles.contBotaoPlay}>

            <div className={styles.botaoPlay}>
                <img src="/icones/play.svg" />
            </div>

        </Link>
    );
};

export default BotaoPlay;