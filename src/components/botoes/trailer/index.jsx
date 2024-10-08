// components/botoes/play/index.jsx
import React from "react";
import styles from "./index.module.scss";
import Link from "next/link";

const Trailer = ({ linkTrailer }) => {
  return (
    <Link target="blank" href={linkTrailer} passHref className={styles.link}>
      <div className={styles.contBotaoTrailer}>
        <div className={styles.botaoTrailer}>
          <p>Trailer</p>
          <img src="/icones/trailer-play.svg" alt="Play" />
        </div>
      </div>
    </Link>
  );
};

export default Trailer;
