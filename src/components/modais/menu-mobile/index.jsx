import { useState, useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { AuthContext } from "@/contexts/auth";
import styles from "./index.module.scss";
import SearchIcon from "@/components/icons/SearchIcon";
import HomeIcon from "@/components/icons/HomeIcon";
import AddToListIcon from "@/components/icons/AddToListIcon";
import MicIcon from "@/components/icons/MicIcon";
import NewsIcon from "@/components/icons/NewsIcon";
import StarIcon from "@/components/icons/StarIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import LogOutIcon from "@/components/icons/LogOutIcon";
import PopoverConfirmar from "@/components/popover-confirmar";

const LISTAS_BASE = [
  { value: "/filmesassisti", label: "Já assisti" },
  { value: "/filmesparaver", label: "Quero ver" },
  { value: "/favoritos", label: "Favoritos" },
];

const DUBLAGEM = [
  { value: "/dubladores", label: "Dubladores" },
  { value: "/estudios", label: "Estúdios" },
];

const MenuMobile = ({ open, onClose }) => {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const [listasOpen, setListasOpen] = useState(false);

  const listas = [
    ...LISTAS_BASE,
    ...(user?.listasQueroVer ?? []).map((l) => ({
      value: `/filmesparaver?lista=${l.id}`,
      label: l.nome,
    })),
  ];
  const [dublagemOpen, setDublagemOpen] = useState(false);
  const [confirmarSaida, setConfirmarSaida] = useState(false);

  const navegar = (path) => {
    router.push(path);
    onClose();
  };

  const isActive = (path) => (router.pathname === path ? styles.active : "");

  return (
    <>
      {open && <div className={styles.overlay} onClick={onClose} />}
      <nav className={`${styles.menu} ${open ? styles.open : ""}`}>
        <div className={styles.header}>
          <Link href="/perfil" className={styles.perfilBtn} onClick={onClose}>
            <div className={styles.avatarWrapper}>
              {user?.avatarUrl ? (
                <Image
                  unoptimized
                  src={user.avatarUrl}
                  alt={user.nome ?? "Avatar"}
                  fill
                  objectFit="cover"
                  quality={50}
                />
              ) : (
                <div className={styles.avatarPlaceholder} />
              )}
            </div>
            <div className={styles.perfilInfo}>
              <span className={styles.perfilNome}>
                {user?.nome ?? "Visitante"}
              </span>
              <span className={styles.perfilEmail}>
                {user?.email ?? "Faça login"}
              </span>
            </div>
          </Link>
        </div>

        <div className={styles.conteudo}>
          <Link
            href="/busca"
            className={`${styles.item} ${isActive("/busca")}`}
            onClick={onClose}
          >
            <SearchIcon size={20} color="currentColor" />
            <span>Busca</span>
          </Link>

          <Link
            href="/filme-aleatorio"
            className={`${styles.item} ${isActive("/filme-aleatorio")}`}
            onClick={onClose}
          >
            <HomeIcon size={20} color="currentColor" />
            <span>Home</span>
          </Link>

          {user && (
            <div className={styles.colapsavel}>
              <button
                className={`${styles.item} ${styles.colapsavelBtn}`}
                onClick={() => setListasOpen((prev) => !prev)}
              >
                <AddToListIcon size={20} color="currentColor" />
                <span>Minhas listas</span>
                <ChevronDownIcon
                  size={16}
                  color="currentColor"
                  className={`${styles.chevron} ${listasOpen ? styles.chevronOpen : ""}`}
                />
              </button>
              {listasOpen && (
                <ul className={styles.subMenu}>
                  {listas.map((item) => (
                    <li key={item.value} className={styles.BtnSubMenu}>
                      <button
                        className={styles.subItem}
                        onClick={() => navegar(item.value)}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className={styles.colapsavel}>
            <button
              className={`${styles.item} ${styles.colapsavelBtn}`}
              onClick={() => setDublagemOpen((prev) => !prev)}
            >
              <MicIcon size={20} color="currentColor" />
              <span>Dublagem</span>
              <ChevronDownIcon
                size={16}
                color="currentColor"
                className={`${styles.chevron} ${dublagemOpen ? styles.chevronOpen : ""}`}
              />
            </button>
            {dublagemOpen && (
              <ul className={styles.subMenu}>
                {DUBLAGEM.map((item) => (
                  <li key={item.value} className={styles.BtnSubMenu}>
                    <button
                      className={styles.subItem}
                      onClick={() => navegar(item.value)}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            href="/noticias"
            className={`${styles.item} ${isActive("/noticias")}`}
            onClick={onClose}
          >
            <NewsIcon size={20} color="currentColor" />
            <span>Notícias</span>
          </Link>

          <Link
            href="/resenhas"
            className={`${styles.item} ${isActive("/resenhas")}`}
            onClick={onClose}
          >
            <StarIcon size={20} color="currentColor" />
            <span>Resenhas</span>
          </Link>
        </div>

        {user && (
          <div className={styles.rodape}>
            <button
              className={styles.item}
              onClick={() => setConfirmarSaida(true)}
            >
              <LogOutIcon size={20} color="currentColor" />
              <span>Sair</span>
            </button>
          </div>
        )}

        {confirmarSaida && (
          <PopoverConfirmar
            mensagem="Tem certeza que deseja sair?"
            labelConfirmar="Sair"
            onConfirmar={() => {
              logout();
              onClose();
            }}
            onCancelar={() => setConfirmarSaida(false)}
          />
        )}
      </nav>
    </>
  );
};

export default MenuMobile;
