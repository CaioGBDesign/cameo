// components/botoes/play/index.jsx
import React from "react";
import styles from "./index.module.scss";
import Link from "next/link";

const BotaoPlay = ({ linkTrailer }) => {
  return (
    <Link target="blank" href={linkTrailer} passHref>
      <div className={styles.contBotaoPlay}>
        <div className={styles.botaoPlay}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fplay.svg?alt=media&token=f7305473-6f1e-4234-964d-d3682c2b77f3"
            alt="Play"
          />
        </div>
      </div>
    </Link>
  );
};

export default BotaoPlay;
