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
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Ftrailer-play.svg?alt=media&token=93fb10a4-121d-480f-9e62-b14d43cd28b5"
            alt="Play"
          />
        </div>
      </div>
    </Link>
  );
};

export default Trailer;
