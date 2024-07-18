// components/botoes/play/index.jsx
import React from "react";
import styles from "./index.module.scss";
import Link from "next/link";

const BotaoPlay = ({ linkTrailer }) => {
  return (
    <Link target="blank" href={linkTrailer} passHref>
      <div className={styles.contBotaoPlay}>
        <div className={styles.botaoPlay}>
          <img src="/icones/play.svg" alt="Play" />
        </div>
      </div>
    </Link>
  );
};

export default BotaoPlay;
