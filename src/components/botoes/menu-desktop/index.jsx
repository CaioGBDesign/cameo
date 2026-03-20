import { useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/auth";
import styles from "./index.module.scss";
import Link from "next/link";
import Select from "@/components/inputs/select";

const LISTAS = [
  { value: "/filmesassisti", label: "Já assisti" },
  { value: "/filmesparaver", label: "Quero ver" },
  { value: "/favoritos", label: "Favoritos" },
];

const DUBLAGEM = [
  { value: "/dubladores", label: "Dubladores" },
  { value: "/estudios", label: "Estúdios" },
];

const MenuDesktop = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const isActive = (path) => router.pathname === path ? styles.active : "";

  const navegar = (e) => {
    if (e.target.value) router.push(e.target.value);
  };

  return (
    <nav className={styles.menuBotoes}>
      <ul>
        <li>
          <Link href="/filme-aleatorio" className={isActive("/filme-aleatorio")}>Home</Link>
        </li>

        {user && (
          <li>
            <div className={styles.menuSelect}>
              <Select
                placeholder="Minhas listas"
                options={LISTAS}
                value=""
                onChange={navegar}
                variant="ghost"
              />
            </div>
          </li>
        )}

        <li>
          <div className={styles.menuSelect}>
            <Select
              placeholder="Dublagem"
              options={DUBLAGEM}
              value=""
              onChange={navegar}
              variant="ghost"
            />
          </div>
        </li>

        <li>
          <Link href="/noticias" className={isActive("/noticias")}>Notícias</Link>
        </li>
        <li>
          <Link href="/resenhas" className={isActive("/resenhas")}>Resenhas</Link>
        </li>
        <li>
          <Link href="/game" className={isActive("/game")}>Game</Link>
        </li>
      </ul>
    </nav>
  );
};

export default MenuDesktop;
