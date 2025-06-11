import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Link from "next/link";

const Miniatura = ({ children }) => {
  const [logoSize, setLogoSize] = useState("normal");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      if (scrollY > 0) {
        setLogoSize("small");
      } else {
        setLogoSize("normal");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Link
      href="/filme-aleatorio"
      className={`${styles.miniatura} ${styles[logoSize]}`}
    >
      <img
        src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/logo%2Fcameo-logo-miniatura.svg?alt=media&token=bb482344-e73f-4cee-ac6f-97a1c003b6e7"
        alt="Cameo logo"
      />
      {children}
    </Link>
  );
};

export default Miniatura;
