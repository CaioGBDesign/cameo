import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import styles from "./teste.module.scss";

export default function Teste() {
  return (
    <>
      <Head>
        <title>Cameo - Testes</title>
      </Head>

      <Header />
      <main className={styles.page}>
        <div className={styles.novoHeader}>
          <ul className={styles.novoMenu}>
            <li className={styles.botão}>Home</li>
            <li className={styles.botão}>Minhas listas</li>
            <li className={styles.botão}>Dublagens</li>
            <li className={styles.botão}>Notícias</li>
            <li className={styles.botão}>Resenhas</li>
            <li className={styles.botão}>Game</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
