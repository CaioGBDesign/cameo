import styles from "./index.module.scss";
import Header from "@/components/Header";
import NotasFilmes from "@/components/botoes/notas";
import TitulosFilmes from "@/components/titulosfilmes";
import FundoTitulos from "@/components/fundotitulos";
import Search from "@/components/busca";
import Titulolistagem from "@/components/titulolistagem";
import Miniaturafilmes from "@/components/miniaturafilmes";
import BotaoPlay from "@/components/botoes/play";

const FilmesAssisti = () => {

    const simulacaoBack = [
        {
            url:"/background/jogador-numero-1.jpg"
        },
        {
            url:"/background/duna.jpg"
        },
        {
            url:"/background/homem-aranha-longe-de-casa.jpg"
        },
        {
            url:"/background/malcolm-e-marie.jpg"
        },
        {
            url:"/background/oito-mulheres-e-um-segredo.jpg"
        },
        {
            url:"/background/o-rei-do-show.jpg"
        },
        {
            url:"/background/homem-aranha-sem-volta-para-casa.jpg"
        },
        {
            url:"/background/super-mario-bros.jpg"
        },
        {
            url:"/background/era-uma-vez-em-hollywood.jpg"
        },
        {
            url:"/background/o-protetor.jpg"
        },
        {
            url:"/background/adoraveis-mulheres.jpg"
        },
        {
            url:"/background/oppenheimer.jpg"
        }
    ]

    return (
        <div className={styles.filmesAssisti}>
            {/* Header */}
            <Header/>

            <div className={styles.contFilmes}>

                <div className={styles.tituloFilmes}>
                    <div className={styles.contTitulos}>
                        <BotaoPlay linkTrailer={"#"}></BotaoPlay>
                        <TitulosFilmes titulofilme="Homem Aranha longe de casa" generofilme="Ação / Aventura" duracaofilme="2h10m"></TitulosFilmes>
                        <NotasFilmes estrelas="4"/>
                    </div>
                </div>
                
                <div className={styles.todosOsTitulos}>
                    <div className={styles.contlista}>

                        <Search></Search>
                        
                        <Titulolistagem titulolistagem={"Filmes para assistir"} ></Titulolistagem>

                        <div className={styles.listaFilmes}>
                            { simulacaoBack.map((miniatura) => <Miniaturafilmes capaminiatura={miniatura.url} mostrarEstrelas={false}></Miniaturafilmes> )}
                        </div>

                    </div>
                </div>

            </div>

            <FundoTitulos capaAssistidos={"/background/homem-aranha-longe-de-casa.jpg"} tituloAssistidos={"homem aranha longe de casa"}></FundoTitulos>

        </div>
    );
};

export default FilmesAssisti;