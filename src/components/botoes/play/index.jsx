import styles from "./index.module.scss";
import Link from "next/link";
import PlayIcon from "@/components/icons/PlayIcon";

const BotaoPlay = ({ linkTrailer }) => {
  return (
    <Link target="_blank" href={linkTrailer} passHref rel="noopener noreferrer">
      <div className={styles.contBotaoPlay}>
        <div className={styles.botaoPlay}>
          <PlayIcon size={32} color="currentColor" />
        </div>
      </div>
    </Link>
  );
};

export default BotaoPlay;
