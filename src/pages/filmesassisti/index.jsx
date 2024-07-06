import styles from "./index.module.scss";
import Header from "@/components/Header";
import NotasFilmes from "@/components/botoes/notas";
import TitulosFilmes from "@/components/titulosfilmes";
import FundoTitulos from "@/components/fundotitulos";
import Search from "@/components/busca";
import Titulolistagem from "@/components/titulolistagem";
import Miniaturafilmes from "@/components/miniaturafilmes";
import BotaoPlay from "@/components/botoes/play";
import FavoritarFilme from "@/components/detalhesfilmes/favoritarfilme";

const FilmesAssisti = () => {
  const simulacaoBack = [
    {
      url: "/background/jogador-numero-1.jpg",
    },
    {
      url: "/background/duna.jpg",
    },
    {
      url: "/background/homem-aranha-longe-de-casa.jpg",
    },
    {
      url: "/background/malcolm-e-marie.jpg",
    },
    {
      url: "/background/oito-mulheres-e-um-segredo.jpg",
    },
    {
      url: "/background/o-rei-do-show.jpg",
    },
    {
      url: "/background/homem-aranha-sem-volta-para-casa.jpg",
    },
    {
      url: "/background/super-mario-bros.jpg",
    },
    {
      url: "/background/era-uma-vez-em-hollywood.jpg",
    },
    {
      url: "/background/o-protetor.jpg",
    },
    {
      url: "/background/adoraveis-mulheres.jpg",
    },
    {
      url: "/background/oppenheimer.jpg",
    },
  ];

  return (
    <div className={styles.filmesAssisti}>
      {/* Header */}
      <Header />

      <div className={styles.contFilmes}>
        <div className={styles.tituloFilmes}>
          <div className={styles.contTitulos}>
            <BotaoPlay linkTrailer={"#"}></BotaoPlay>
            <TitulosFilmes
              titulofilme="Jogador N° 1"
              generofilme="Ficção científica / Ação"
              duracaofilme="2h20m"
            ></TitulosFilmes>

            <div className={styles.NotasFavoritos}>
              <NotasFilmes estrelas="3" />
              <FavoritarFilme />
            </div>
          </div>
        </div>

        <div className={styles.todosOsTitulos}>
          <div className={styles.contlista}>
            <Search></Search>

            <Titulolistagem
              quantidadeFilmes={"12"}
              titulolistagem={"Filmes que já assisti"}
            ></Titulolistagem>

            <div className={styles.listaFilmes}>
              {simulacaoBack.map((miniatura) => (
                <Miniaturafilmes
                  capaminiatura={miniatura.url}
                ></Miniaturafilmes>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FundoTitulos
        exibirPlay={false}
        capaAssistidos={"/background/jogador-numero-1.jpg"}
        tituloAssistidos={"Jogador N° 1"}
      ></FundoTitulos>
    </div>
  );
};

export default FilmesAssisti;
