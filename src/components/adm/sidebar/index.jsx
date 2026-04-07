import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/auth";
import LogOutIcon from "@/components/icons/LogOutIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import SidebarToggleIcon from "@/components/icons/SidebarToggleIcon";
import DashboardIcon from "@/components/icons/DashboardIcon";
import AdmNewsIcon from "@/components/icons/AdmNewsIcon";
import AdmResenhasIcon from "@/components/icons/AdmResenhasIcon";
import DubladoresIcon from "@/components/icons/DubladoresIcon";
import DublagensIcon from "@/components/icons/DublagensIcon";
import EstudioIcon from "@/components/icons/EstudioIcon";
import PerguntasIcon from "@/components/icons/PerguntasIcon";
import PatentesIcon from "@/components/icons/PatentesIcon";
import PermissoesIcon from "@/components/icons/PermissoesIcon";
import styles from "./index.module.scss";

const NAV = [
  {
    items: [{ href: "/adm", label: "Dashboard", icon: DashboardIcon }],
  },
  {
    group: "Editoriais",
    items: [
      {
        label: "Notícias",
        icon: AdmNewsIcon,
        base: "/adm/noticias",
        children: [
          { href: "/adm/noticias/criar", label: "Criar notícia" },
          { href: "/adm/noticias", label: "Todas as notícias" },
        ],
      },
      {
        label: "Resenhas",
        icon: AdmResenhasIcon,
        base: "/adm/resenhas",
        children: [
          { href: "/adm/resenhas/criar", label: "Criar resenha" },
          { href: "/adm/resenhas", label: "Todas as resenhas" },
        ],
      },
    ],
  },
  {
    group: "Dublagens",
    items: [
      {
        label: "Dubladores",
        icon: DubladoresIcon,
        base: "/adm/dubladores",
        children: [
          { href: "/adm/dubladores/criar", label: "Criar dublador" },
          { href: "/adm/dubladores", label: "Todos os dubladores" },
        ],
      },
      {
        label: "Dublagens",
        icon: DublagensIcon,
        base: "/adm/dublagens",
        children: [
          { href: "/adm/dublagens/criar", label: "Criar dublagem" },
          { href: "/adm/dublagens", label: "Todas as dublagens" },
        ],
      },
      {
        label: "Estúdios de dublagem",
        icon: EstudioIcon,
        base: "/adm/estudios",
        children: [
          { href: "/adm/estudios/criar", label: "Criar estúdio" },
          { href: "/adm/estudios", label: "Todos os estúdios" },
        ],
      },
    ],
  },
  {
    group: "Cameo Game",
    items: [
      {
        label: "Perguntas",
        icon: PerguntasIcon,
        base: "/adm/perguntas",
        children: [
          { href: "/adm/perguntas/criar", label: "Criar pergunta" },
          { href: "/adm/perguntas", label: "Todas as perguntas" },
        ],
      },
      {
        label: "Patentes",
        icon: PatentesIcon,
        base: "/adm/patentes",
        children: [
          { href: "/adm/patentes/criar", label: "Criar patente" },
          { href: "/adm/patentes", label: "Todas as patentes" },
        ],
      },
    ],
  },
  {
    group: "Usuários",
    items: [
      { href: "/adm/permissoes", label: "Permissões", icon: PermissoesIcon },
    ],
  },
];

export default function AdmSidebar({ collapsed, onCollapse }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [openItems, setOpenItems] = useState({});
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const toggleItem = (label) =>
    setOpenItems((prev) => ({ ...prev, [label]: !prev[label] }));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href) =>
    href === "/adm"
      ? router.pathname === "/adm"
      : router.pathname.startsWith(href);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div
        className={`${styles.brand} ${collapsed ? styles.brandCollapsed : ""}`}
      >
        {!collapsed && (
          <>
            <div className={styles.brandIcon}>
              <span>C</span>
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>Cameo</span>
              <span className={styles.brandSub}>ADM</span>
            </div>
          </>
        )}
        <button
          className={styles.toggleBtn}
          onClick={() => {
            onCollapse((prev) => !prev);
            setUserMenuOpen(false);
          }}
          title={collapsed ? "Expandir" : "Recolher"}
        >
          <SidebarToggleIcon size={16} color="var(--icon-secondary)" />
        </button>
      </div>

      <nav className={styles.nav}>
        {NAV.map((section, i) => (
          <div key={i} className={styles.section}>
            {section.group && !collapsed && (
              <div className={styles.groupTitle}>
                <span className={styles.groupLabel}>{section.group}</span>
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;

              // Item com sub-itens (colapsável)
              if (item.children) {
                const isOpen = openItems[item.label] ?? false;
                const isActive = router.pathname.startsWith(item.base);
                return (
                  <div key={item.label} className={styles.botoesCategoria}>
                    <button
                      className={`${styles.navItem} ${isActive ? styles.active : ""} ${collapsed ? styles.navItemCollapsed : ""}`}
                      onClick={() => !collapsed && toggleItem(item.label)}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon size={18} color="var(--icon-secondary)" />
                      {!collapsed && (
                        <>
                          <span className={styles.navLabel}>{item.label}</span>
                          <ChevronDownIcon
                            size={14}
                            color="currentColor"
                            className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
                          />
                        </>
                      )}
                    </button>
                    {isOpen && !collapsed && (
                      <div className={styles.subItems}>
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`${styles.subItem} ${router.pathname === child.href ? styles.subItemActive : ""}`}
                          >
                            <div className={styles.subBotao}>{child.label}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Item simples (sem sub-itens)
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${active ? styles.active : ""} ${collapsed ? styles.navItemCollapsed : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} color="var(--icon-secondary)" />
                  {!collapsed && (
                    <span className={styles.navLabel}>{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className={styles.userWrapper} ref={userMenuRef}>
        {userMenuOpen && (
          <div className={styles.userPopover}>
            <div className={styles.popoverInfo}>
              <div className={styles.userAvatar}>
                {user?.avatarUrl ? (
                  <Image
                    unoptimized
                    src={user.avatarUrl}
                    alt={user.nome ?? "Avatar"}
                    fill
                    objectFit="cover"
                  />
                ) : (
                  <div className={styles.avatarPlaceholder} />
                )}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.nome}</span>
                <span className={styles.userEmail}>{user?.email}</span>
              </div>
            </div>
            <Link
              href="/adm/configuracoes"
              className={styles.popoverBotao}
              onClick={() => setUserMenuOpen(false)}
            >
              <SettingsIcon size={16} color="currentColor" />
              <span>Configurações</span>
            </Link>
            <button
              className={styles.popoverSair}
              onClick={() => {
                logout();
                setUserMenuOpen(false);
              }}
            >
              <LogOutIcon size={18} color="currentColor" />
              <span>Sair</span>
            </button>
          </div>
        )}

        <div
          className={styles.userRow}
          onClick={() => setUserMenuOpen((prev) => !prev)}
          title={collapsed ? user?.nome : undefined}
        >
          <div className={styles.userAvatar}>
            {user?.avatarUrl ? (
              <Image
                unoptimized
                src={user.avatarUrl}
                alt={user.nome ?? "Avatar"}
                fill
                objectFit="cover"
              />
            ) : (
              <div className={styles.avatarPlaceholder} />
            )}
          </div>
          {!collapsed && (
            <>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.nome}</span>
                <span className={styles.userEmail}>{user?.email}</span>
              </div>
              <ChevronDownIcon
                size={16}
                color="currentColor"
                className={`${styles.userChevron} ${userMenuOpen ? styles.userChevronOpen : ""}`}
              />
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
