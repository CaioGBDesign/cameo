import Header from "@/components/Header";
import FundoTitulos from "@/components/fundotitulos";
import { Inter } from "next/font/google";
import styles from "@/styles/index.module.scss";
import TitulosFilmes from "@/components/titulosfilmes";
import NotasFilmes from "@/components/botoes/notas";
import Sinopse from "@/components/detalhesfilmes/sinopse";
import NotasCameo from "@/components/detalhesfilmes/notascameo";
import Servicos from "@/components/detalhesfilmes/servicos";
import Dublagem from "@/components/detalhesfilmes/dublagem";
import Elenco from "@/components/detalhesfilmes/elenco";
import Direcao from "@/components/detalhesfilmes/direcao";
import Avaliacao from "@/components/detalhesfilmes/avaliacao";
import BaseBotoes from "@/components/botoes/base";
import FavoritarFilme from "@/components/detalhesfilmes/favoritarfilme";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      {/* Header */}
      <Header></Header>

      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.detalhesFilmes}>
          <div className={styles.informacoes}>
            <div className={styles.tituloFilmes}>
              <div className={styles.contTitulos}>
                <TitulosFilmes
                  titulofilme="Super Mario Bros"
                  generofilme="Fantasia / animação"
                  duracaofilme="2h"
                ></TitulosFilmes>

                <div className={styles.NotasFavoritos}>
                  <NotasFilmes estrelas="3" />
                  <FavoritarFilme />
                </div>
              </div>
            </div>

            <div className={styles.infoFilmes}>
              <Sinopse />
              <NotasCameo />
              <Servicos />
            </div>

            <div className={styles.elencoGeral}>
              <Dublagem />
              <hr></hr>
              <Elenco />
              <hr></hr>
              <Direcao />
            </div>

            <div className={styles.infoFilmes}>
              <div className={styles.detalhes}>
                <h3>Produção</h3>
                <p>Illumination Entertainment</p>
              </div>

              <div className={styles.detalhes}>
                <h3>Lançamento</h3>
                <p>2023</p>
              </div>

              <div className={styles.detalhes}>
                <h3>Classificação</h3>
                <div className={styles.livre}>
                  <p>Livre</p>
                </div>
              </div>

              <div className={styles.detalhes}>
                <h3>Bilheteria</h3>
                <p>US$ 377 milhões</p>
              </div>

              <div className={styles.detalhes}>
                <h3>País de origem</h3>
                <p>Estados unidos</p>
              </div>

              <Avaliacao avaliador={"Caio Goulart"} />

              <BaseBotoes TextoBotao={"Sugerir filme"} />
            </div>
          </div>
        </div>

        <FundoTitulos
          capaAssistidos={"/background/super-mario-bros.jpg"}
          tituloAssistidos={"Super Mario Bros"}
        ></FundoTitulos>
      </main>
    </>
  );
}
