import React from "react";
import styles from "./index.module.scss";
import FundoTitulosDesktop from "@/components/fotoPrincipalDesktop";

const NewComponent = (props) => {
  // TODO: implement component logic
  return (
    <div className={styles.container}>
      <FundoTitulosDesktop
        capaAssistidos={`https://image.tmdb.org/t/p/original/${
          filme ? filme.backdrop_path : ""
        }`}
      />
    </div>
  );
};

export default NewComponent;
