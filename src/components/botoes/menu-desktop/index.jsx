import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebaseConection";
import styles from "./index.module.scss";
import Link from "next/link";

const MenuDesktop = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className={styles.menuBotoes}>
      <ul>
        <li className={styles.botaoHome}>
          <Link href="/filme-aleatorio" passHref>
            <span
              className={
                router.pathname === "/filme-aleatorio" ? styles.active : ""
              }
            >
              Home
            </span>
          </Link>
        </li>

        {isLoggedIn && (
          <>
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
                  className={
                    router.pathname === "/favoritos" ? styles.active : ""
                  }
                >
                  Meus favoritos
                </span>
              </Link>
            </li>
          </>
        )}

        <li>
          <div className={styles.ponto}>
            <span>•</span>
          </div>
        </li>
        <li>
          <Link href="/noticias" passHref>
            <span
              className={router.pathname === "/noticias" ? styles.active : ""}
            >
              Notícias
            </span>
          </Link>
        </li>
        <li>
          <Link href="/resenhas" passHref>
            <span
              className={router.pathname === "/resenhas" ? styles.active : ""}
            >
              Resenhas
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MenuDesktop;
