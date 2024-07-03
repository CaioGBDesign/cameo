import Header from "@/components/Header";
import FundoTitulos from "@/components/fundotitulos";
import { Inter } from "next/font/google";
import styles from "@/styles/index.module.scss";
import BotaoPlay from "@/components/botoes/play";
import TitulosFilmes from "@/components/titulosfilmes";
import NotasFilmes from "@/components/botoes/notas";
import Sinopse from "@/components/detalhesfilmes/sinopse";
import NotasCameo from "@/components/detalhesfilmes/notascameo";
import Servicos from "@/components/detalhesfilmes/Servicos";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>

      {/* Header */}
      <Header></Header>
      
      <main className={`${styles.main} ${inter.className}`}>

        <div className={styles.detalhesFilmes}>
          <div className={styles.play}>
            <BotaoPlay linkTrailer={"#"}></BotaoPlay>
          </div>

          <div className={styles.informacoes}>

            <div className={styles.tituloFilmes}>
                <div className={styles.contTitulos}>
                    <TitulosFilmes titulofilme="Jogador N° 1" generofilme="Ficção científica / Ação" duracaofilme="2h20m"></TitulosFilmes>
                    <NotasFilmes estrelas="3"/>
                </div>
            </div>

            

            <div className={styles.infoFilmes}>
              <Sinopse></Sinopse>
              <NotasCameo></NotasCameo>
              <Servicos></Servicos>
              
            </div>

          </div>
        </div>

        <FundoTitulos capaAssistidos={"/background/super-mario-bros.jpg"} tituloAssistidos={"Super Mario Bros"}></FundoTitulos>
      </main>
    </>
  );
}
