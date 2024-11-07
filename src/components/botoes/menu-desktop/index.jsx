import React from "react";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import Link from "next/link";

const MenuDesktop = () => {
  const router = useRouter();

  return (
    <nav className={styles.menuBotoes}>
      <ul>
        <li>
          <Link href="/" passHref>
            <span className={router.pathname === "/" ? styles.active : ""}>
              Home
            </span>
          </Link>
        </li>
        <li>
          <Link href="/filmesassisti" passHref>
            <span
              className={
                router.pathname === "/filmesassisti" ? styles.active : ""
              }
            >
              Já assisti
            </span>
          </Link>
        </li>
        <li>
          <Link href="/filmesparaver" passHref>
            <span
              className={
                router.pathname === "/filmesparaver" ? styles.active : ""
              }
            >
              Quero ver
            </span>
          </Link>
        </li>
        <li>
          <Link href="/favoritos" passHref>
            <span
              className={router.pathname === "/favoritos" ? styles.active : ""}
            >
              Meus favoritos
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MenuDesktop;
