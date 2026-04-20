import { useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/auth";
import { useConfiguracoes } from "@/contexts/configuracoes";
import styles from "./index.module.scss";
import Link from "next/link";
import Select from "@/components/inputs/select";

const LISTAS_BASE = [
  { value: "/filmesassisti", label: "Já assisti" },
  { value: "/filmesparaver", label: "Quero ver" },
  { value: "/favoritos", label: "Favoritos" },
];

const DUBLAGEM_BASE = [
  { value: "/dubladores", label: "Dubladores", key: "dubladoresHabilitado" },
  { value: "/estudios", label: "Estúdios", key: "estudiosHabilitado" },
];

const MenuDesktop = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const {
    noticiasHabilitado,
    resenhasHabilitado,
    dubladoresHabilitado,
    estudiosHabilitado,
    gameHabilitado,
  } = useConfiguracoes();

  const isActive = (path) => (router.pathname === path ? styles.active : "");

  const navegar = (e) => {
    if (e.target.value) router.push(e.target.value);
  };

  const listas = [
    ...LISTAS_BASE,
    ...(user?.listasQueroVer ?? []).map((l) => ({
      value: `/filmesparaver?lista=${l.id}`,
      label: l.nome,
    })),
  ];

  const dublagem = DUBLAGEM_BASE.filter((item) => {
    if (item.key === "dubladoresHabilitado") return dubladoresHabilitado;
    if (item.key === "estudiosHabilitado") return estudiosHabilitado;
    return true;
  });

  return (
    <nav className={styles.menuBotoes}>
      <ul>
        <li>
          <Link
            href="/filme-aleatorio"
            className={isActive("/filme-aleatorio")}
          >
            Home
          </Link>
        </li>

        {user && (
          <li>
            <div className={styles.menuSelect}>
              <Select
                placeholder="Minhas listas"
                options={listas}
                value=""
                onChange={navegar}
                variant="ghost"
              />
            </div>
          </li>
        )}

        {dublagem.length > 0 && (
          <li>
            <div className={styles.menuSelect}>
              <Select
                placeholder="Dublagem"
                options={dublagem}
                value=""
                onChange={navegar}
                variant="ghost"
              />
            </div>
          </li>
        )}

        {noticiasHabilitado && (
          <li>
            <Link href="/noticias" className={isActive("/noticias")}>
              Notícias
            </Link>
          </li>
        )}
        {resenhasHabilitado && (
          <li>
            <Link href="/resenhas" className={isActive("/resenhas")}>
              Resenhas
            </Link>
          </li>
        )}
        {gameHabilitado && (
          <li>
            <Link href="/desafio" className={isActive("/desafio")}>
              Desafio
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default MenuDesktop;
