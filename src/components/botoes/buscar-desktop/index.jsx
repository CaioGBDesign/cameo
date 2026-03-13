import styles from "./index.module.scss";
import Link from "next/link";
import SearchIcon from "@/components/icons/SearchIcon";

const BotaoBuscarDesktop = ({ children }) => {
  return (
    <Link href="/busca" className={styles.miniatura}>
      <SearchIcon size={20} color="currentColor" />
      {children}
    </Link>
  );
};

export default BotaoBuscarDesktop;
