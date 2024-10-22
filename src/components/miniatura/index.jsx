import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import Link from "next/link";
import { toast } from "react-toastify";

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
    <Link href="/" className={`${styles.miniatura} ${styles[logoSize]}`}>
      <img src="/logo/cameo-logo-miniatura.svg" alt="Cameo logo" />
      {children}
    </Link>
  );
};

export default Miniatura;
