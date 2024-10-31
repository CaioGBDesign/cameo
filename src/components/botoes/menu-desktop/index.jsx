import React from "react";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import Link from "next/link";

const MenuDesktop = () => {
  const router = useRouter();

  return (
    <div className={styles.menuBotoes}>
      <Link href="/" passHref>
        <span className={router.pathname === "/" ? styles.active : ""}>
          Home
        </span>
      </Link>
      <Link href="/filmesassisti" passHref>
        <span
          className={router.pathname === "/filmesassisti" ? styles.active : ""}
        >
          Já assisti
        </span>
      </Link>
      <Link href="/filmesparaver" passHref>
        <span
          className={router.pathname === "/filmesparaver" ? styles.active : ""}
        >
          Quero ver
        </span>
      </Link>
      <Link href="/favoritos" passHref>
        <span className={router.pathname === "/favoritos" ? styles.active : ""}>
          Meus favoritos
        </span>
      </Link>
    </div>
  );
};

export default MenuDesktop;
