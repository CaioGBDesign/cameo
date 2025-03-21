import { useState } from "react"; // Importando useState
import styles from "./index.module.scss";
import Head from "next/head";
import { useIsMobile } from "@/components/DeviceProvider";
import Link from "next/link";

const Apresentacao = () => {
  const [activeTab, setActiveTab] = useState("filme");
  const [activeTabB, setActiveTabB] = useState("personalidade"); // Estado para controlar a aba ativa
  const isMobile = useIsMobile();

  // Função para mudar a aba ativa
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Função para mudar a aba ativa
  const handleTabChangeB = (tab) => {
    setActiveTabB(tab);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [commentsPerPage, setCommentsPerPage] = useState(2); // Número de comentários por vez

  const comentarios = [
    {
      usuario: "Igor Oliveira",
      comentario:
        "A Cameo veio para facilitar nossa vida na hora de escolher os filmes. Adoro assistir filmes sugeridos, e pela Cameo vai ser ainda melhor!! 🤩",
      estrelas: 5,
      imagem: "/usuario/igor.png",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem: "/usuario/usuario.png",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem: "/usuario/igor.png",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem: "/usuario/igor.png",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem: "/usuario/igor.png",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem: "/usuario/igor.png",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem: "/usuario/igor.png",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem: "/usuario/igor.png",
    },
  ];

  const totalPages = Math.ceil(comentarios.length / commentsPerPage);
  const currentPage = Math.floor(currentIndex / commentsPerPage);

  const startIndex = currentPage * commentsPerPage;
  const endIndex = startIndex + commentsPerPage;
  const commentsToDisplay = comentarios.slice(startIndex, endIndex);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <main>
      <div className={styles.ContApresentacao}>
        <Head>
          <title>Cameo - Apresentação</title>
          <meta
            name="description"
            content="Descubra o filme perfeito com a Cameo! Oferecemos sugestões aleatórias e personalizadas, filtradas por gênero, classificação indicativa, serviços de streaming e muito mais. Crie listas de filmes, avalie suas escolhas e compartilhe com amigos. Mergulhe no mundo do cinema e nunca fique sem o que assistir. Cadastre-se agora e transforme sua experiência cinematográfica!"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
        </Head>

        <section className={styles.ApresentacaoHeader}>
          <img src="/logo/cameo-logo-miniatura.svg" alt="Cameo logo" />
        </section>

        <section className={styles.ApresentacaoMergulho}>
          <div className={styles.Headline}>
            <h1>Hora de mergulhar no universo da cinefilia</h1>
            <p>Descubra, organize e viva o cinema do seu jeito</p>
            <Link href="/">
              <button>Comece Agora </button>
            </Link>

            <p>
              e Transforme Sua Paixão por Cinema em Uma Jornada Inesquecível!
            </p>
          </div>
          <div className={styles.HeroMascote}>
            <img
              src="/mascote/cameo-astronauta-mergulho.png"
              alt="Cameo Astronauta mergulhando"
            />
          </div>
        </section>

        <section className={styles.ApresentacaoOqueRola}>
          <div className={styles.Headline}>
            <h1>O que rola na Cameo.fun?</h1>
            <p>
              O Cameo.fun é o seu parceiro para descobrir filmes, organizar suas
              maratonas e virar o crítico mais sagaz da galera. Aqui, a gente
              não te deixa na mão:
            </p>
          </div>

          <div className={styles.BotoesCont}>
            <div className={styles.BotoesBox}>
              <div className={styles.BotoesRotate}>
                <ul>
                  <li>
                    <label
                      className={
                        activeTab === "filme" ? styles.selecionado : ""
                      }
                    >
                      <input
                        type="radio"
                        name="filme"
                        checked={activeTab === "filme"}
                        onChange={() => handleTabChange("filme")}
                        aria-checked={activeTab === "filme"}
                      />
                      <div className={styles.BotaoIcone}>
                        <img
                          src="/icones/lp-filme-aleatorio.svg"
                          alt="filme aleatorio"
                        />
                      </div>
                      <h3>Filme aleatório</h3>
                    </label>
                  </li>
                  <li>
                    <label
                      className={
                        activeTab === "filtros" ? styles.selecionado : ""
                      }
                    >
                      <input
                        type="radio"
                        name="filtros"
                        checked={activeTab === "filtros"}
                        onChange={() => handleTabChange("filtros")}
                        aria-checked={activeTab === "filtros"}
                      />
                      <div className={styles.BotaoIcone}>
                        <img src="/icones/lp-filtros.svg" alt="filtros" />
                      </div>
                      <h3>Filtros</h3>
                    </label>
                  </li>
                  <li>
                    <label
                      className={
                        activeTab === "avaliacao" ? styles.selecionado : ""
                      }
                    >
                      <input
                        type="radio"
                        name="avaliacao"
                        checked={activeTab === "avaliacao"}
                        onChange={() => handleTabChange("avaliacao")}
                        aria-checked={activeTab === "avaliacao"}
                      />
                      <div className={styles.BotaoIcone}>
                        <img src="/icones/lp-avaliacoes.svg" alt="avaliaçoes" />
                      </div>
                      <h3>Avalie do seu jeito</h3>
                    </label>
                  </li>
                  <li>
                    <label
                      className={
                        activeTab === "dados" ? styles.selecionado : ""
                      }
                    >
                      <input
                        type="radio"
                        name="dados"
                        checked={activeTab === "dados"}
                        onChange={() => handleTabChange("dados")}
                        aria-checked={activeTab === "dados"}
                      />
                      <div className={styles.BotaoIcone}>
                        <img src="/icones/lp-dados.svg" alt="Seus Dados" />
                      </div>
                      <h3>Seus dados</h3>
                    </label>
                  </li>
                </ul>

                <div
                  className={styles.FilmeAleatorio}
                  style={{ display: activeTab === "filme" ? "flex" : "none" }}
                >
                  <h2>
                    Um{" "}
                    <span>
                      <strong>filme aleatório</strong>
                    </span>{" "}
                    bombástico pra você. Não curtiu? Clica de novo até achar
                    aquele que faz seu coração pipocar!
                  </h2>

                  <div className={styles.BoxMascote}>
                    <img
                      src="/mascote/cameo-thanos.png"
                      alt="Cameo Astronauta Thanos"
                    />
                  </div>

                  <div className={styles.BotaoApresentacao}>
                    <Link href="/">
                      <button>Bora explorar?</button>
                    </Link>
                    <p>É grátis e não precisa nem de pipoca! 🍿</p>
                  </div>
                </div>

                <div
                  className={styles.Filtros}
                  style={{ display: activeTab === "filtros" ? "flex" : "none" }}
                >
                  <h2>
                    Quer algo do cinema, da Netflix ou daquele streaming indie?
                    Nós te damos a dica e ainda{" "}
                    <span>
                      <strong>falamos onde assistir.</strong>
                    </span>
                  </h2>

                  <div className={styles.BoxMascote}>
                    <img
                      src="/mascote/cameo-filtros.png"
                      alt="Cameo Astronauta Thanos"
                    />
                  </div>

                  <div className={styles.BotaoApresentacao}>
                    <Link href="/">
                      <button>Bora explorar?</button>
                    </Link>
                    <p>É grátis e não precisa nem de pipoca! 🍿</p>
                  </div>
                </div>

                <div
                  className={styles.AvalieDoSeuJeito}
                  style={{
                    display: activeTab === "avaliacao" ? "flex" : "none",
                  }}
                >
                  <h2>
                    <span>
                      <strong>De 0 a 5 estrelas</strong>
                    </span>{" "}
                    + reviews sarcásticas (ou poéticas). Sua opinião vira
                    história na sua galeria de filmes já vistos.
                  </h2>

                  <div className={styles.BoxMascote}>
                    <img
                      src="/mascote/cameo-avaliacoes.png"
                      alt="Cameo Astronauta Thanos"
                    />
                  </div>

                  <div className={styles.BotaoApresentacao}>
                    <Link href="/">
                      <button>Bora explorar?</button>
                    </Link>
                    <p>É grátis e não precisa nem de pipoca! 🍿</p>
                  </div>
                </div>

                <div
                  className={styles.SeusDados}
                  style={{ display: activeTab === "dados" ? "flex" : "none" }}
                >
                  <h2>
                    <span>
                      <strong>Gráficos dos gêneros</strong>
                    </span>
                    que você mais devora e metas pra virar um machine de
                    maratona (sim, dá pra competir consigo mesmo).
                  </h2>

                  <div className={styles.BoxMascote}>
                    <img
                      src="/mascote/cameo-dados.png"
                      alt="Cameo Astronauta Thanos"
                    />
                  </div>

                  <div className={styles.BotaoApresentacao}>
                    <Link href="/">
                      <button>Bora explorar?</button>
                    </Link>
                    <p>É grátis e não precisa nem de pipoca! 🍿</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.Particulas}>
            <img src="/background/particulas.png" alt="particulas" />
          </div>
        </section>

        <section className={styles.ApresentacaoPorQueCameo}>
          <div className={styles.BotoesCont}>
            <div className={styles.BoxInformacoes}>
              <div className={styles.Headline}>
                <h1>Por que o Cameo.fun é a sua nova obsessão?</h1>
                <p>Aqui, você é o diretor da sua própria sessão!</p>
              </div>
              <ul>
                <li>
                  <label
                    className={
                      activeTabB === "personalidade"
                        ? styles.selecionado
                        : styles.naoselecionado
                    }
                  >
                    <input
                      type="radio"
                      name="personalidade"
                      checked={activeTabB === "personalidade"}
                      onChange={() => handleTabChangeB("personalidade")}
                      aria-checked={activeTabB === "personalidade"}
                    />
                    <div className={styles.tituloBotao}>
                      <div className={styles.BotaoIcone}>
                        <img
                          src="/icones/personalidade-icone.svg"
                          alt="personalidade"
                        />
                      </div>
                      <h3>Personalidade:</h3>
                    </div>
                    <div className={styles.descricaoBotao}>
                      <p>
                        Suas listas, seus favoritos, suas metas - tudo no seu
                        estilo.
                      </p>
                    </div>
                  </label>

                  {isMobile ? (
                    <div className={styles.Ilustracao}>
                      <div
                        className={styles.FilmeAleatorio}
                        style={{
                          display:
                            activeTabB === "personalidade" ? "flex" : "none",
                        }}
                      >
                        <img
                          src="/icones/lp-personalidade.png"
                          alt="Suas listas, seus favoritos, suas metas - tudo no seu estilo."
                        />
                      </div>
                    </div>
                  ) : null}
                </li>

                <li>
                  <label
                    className={
                      activeTabB === "credibilidade"
                        ? styles.selecionado
                        : styles.naoselecionado
                    }
                  >
                    <input
                      type="radio"
                      name="credibilidade"
                      checked={activeTabB === "credibilidade"}
                      onChange={() => handleTabChangeB("credibilidade")}
                      aria-checked={activeTabB === "credibilidade"}
                    />
                    <div className={styles.tituloBotao}>
                      <div className={styles.BotaoIcone}>
                        <img
                          src="/icones/lp-filme-aleatorio.svg"
                          alt="filme aleatorio"
                        />
                      </div>
                      <h3>Credibilidade sem chatice::</h3>
                    </div>
                    <div className={styles.descricaoBotao}>
                      <p>
                        Sinopse, elenco, streaming... Tudo checado pra você não
                        cair em furada.
                      </p>
                    </div>
                  </label>
                  {isMobile ? (
                    <div className={styles.Ilustracao}>
                      <div
                        className={styles.FilmeAleatorio}
                        style={{
                          display:
                            activeTabB === "credibilidade" ? "flex" : "none",
                        }}
                      >
                        <img
                          src="/icones/lp-esqueceram-de-mim.png"
                          alt="Cameo Esqueceram de mim"
                        />
                      </div>
                    </div>
                  ) : null}
                </li>

                <li>
                  <label
                    className={
                      activeTabB === "maratona"
                        ? styles.selecionado
                        : styles.naoselecionado
                    }
                  >
                    <input
                      type="radio"
                      name="maratona"
                      checked={activeTabB === "maratona"}
                      onChange={() => handleTabChangeB("maratona")}
                      aria-checked={activeTabB === "maratona"}
                    />
                    <div className={styles.tituloBotao}>
                      <div className={styles.BotaoIcone}>
                        <img
                          src="/icones/lp-filme-aleatorio.svg"
                          alt="filme aleatorio"
                        />
                      </div>
                      <h3>Zero julgamento:</h3>
                    </div>
                    <div className={styles.descricaoBotao}>
                      <p>
                        Quer maratonar 50 filmes de terror em uma semana? Nós só
                        damos os troféus (virtuais, mas estilosos).
                      </p>
                    </div>
                  </label>
                  {isMobile ? (
                    <div className={styles.Ilustracao}>
                      <div
                        className={styles.FilmeAleatorio}
                        style={{
                          display: activeTabB === "maratona" ? "flex" : "none",
                        }}
                      >
                        <img src="/icones/lp-samara.png" alt="Cameo Samara" />
                      </div>
                    </div>
                  ) : null}
                </li>

                <li className={styles.botao}>
                  <Link href="/">
                    <button>Seja o(a) protagonista dessa história!</button>
                  </Link>
                </li>
              </ul>
            </div>

            {isMobile ? null : (
              <div className={styles.Ilustracao}>
                <div
                  className={styles.FilmeAleatorio}
                  style={{
                    display: activeTabB === "personalidade" ? "flex" : "none",
                  }}
                >
                  <img
                    src="/icones/lp-personalidade.png"
                    alt="Suas listas, seus favoritos, suas metas - tudo no seu estilo."
                  />
                </div>

                <div
                  className={styles.FilmeAleatorio}
                  style={{
                    display: activeTabB === "credibilidade" ? "flex" : "none",
                  }}
                >
                  <img
                    src="/icones/lp-esqueceram-de-mim.png"
                    alt="Cameo Esqueceram de mim"
                  />
                </div>

                <div
                  className={styles.FilmeAleatorio}
                  style={{
                    display: activeTabB === "maratona" ? "flex" : "none",
                  }}
                >
                  <img src="/icones/lp-samara.png" alt="Cameo Samara" />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className={styles.ApresentacaoComentarios}>
          <div className={styles.ComentariosCont}>
            <div className={styles.MascoteTodoPoderoso}>
              <img src="/icones/lp-todo-poderoso.png" alt="Cameo Comentarios" />
            </div>

            <div className={styles.Comentarios}>
              <div className={styles.Headline}>
                <h1>O que tão falando por aí?</h1>
                <p>A galera já tá viciada (e você vai ficar também!)</p>
              </div>

              <div className={styles.ComentariosContainer}>
                <div className={styles.ConjuntoComentarios}>
                  {commentsToDisplay.map((comentario, index) => (
                    <div key={index} className={styles.BoxComentarios}>
                      <div className={styles.Estrelas}>
                        {Array.from({ length: comentario.estrelas }).map(
                          (_, i) => (
                            <img
                              key={i}
                              src="/icones/estrela-preenchida.svg"
                              alt="estrela preenchida"
                            />
                          )
                        )}
                      </div>

                      <div className={styles.Usuario}>
                        <div className={styles.ImagemUsuario}>
                          <img src={comentario.imagem} alt="usuario" />
                        </div>
                        <span>{comentario.usuario}</span>
                      </div>

                      <div className={styles.UsuarioComentario}>
                        <span>{comentario.comentario}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.DotsContainer}>
                  {Array.from({ length: totalPages }).map((_, pageIndex) => (
                    <div
                      key={pageIndex}
                      className={`${styles.Dot} ${
                        currentPage === pageIndex ? styles.active : ""
                      }`}
                      onClick={() =>
                        setCurrentIndex(pageIndex * commentsPerPage)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.ApresentacaoCameoLover}>
          <div className={styles.CameoLoverCont}>
            <div className={styles.CameoLoverInformacoes}>
              <div className={styles.Headline}>
                <h1>
                  Pronto pra virar um{" "}
                  <span>
                    <strong>Cameo lover</strong>
                  </span>
                  ?
                </h1>
              </div>

              <div className={styles.Avaliacao}>
                <img
                  src="/icones/estrela-preenchida.svg"
                  alt="estrela preenchida"
                />
                <img
                  src="/icones/estrela-preenchida.svg"
                  alt="estrela preenchida"
                />
                <img
                  src="/icones/estrela-preenchida.svg"
                  alt="estrela preenchida"
                />
                <img
                  src="/icones/estrela-preenchida.svg"
                  alt="estrela preenchida"
                />
                <img
                  src="/icones/estrela-preenchida.svg"
                  alt="estrela preenchida"
                />
              </div>

              <div className={styles.Headline}>
                <p>
                  Sua{" "}
                  <span>
                    <strong>aventura cinematográfica</strong>
                  </span>{" "}
                  começa agora...
                </p>

                <p>
                  Não importa se você é o nerd dos clássicos ou o viciado em
                  blockbuster: no{" "}
                  <span>
                    <strong>Cameo.fun</strong>
                  </span>
                  , você descobre, organiza e celebra o cinema como um
                  verdadeiro fã. E o melhor?{" "}
                  <span>
                    <strong>Sem precisar levantar do sofá</strong>
                  </span>
                  .
                </p>

                <Link href="/">
                  <button>Aperta play na sua jornada</button>
                </Link>

                <div className={styles.subline}>
                  <p>
                    Ah, e não se preocupe: aqui ninguém vai dar spoiler do final
                  </p>
                  😉
                </div>
              </div>
            </div>

            <div className={styles.MascoteLover}>
              <img src="/icones/lp-cameo-lover.png" alt="Cameo lover" />
            </div>
          </div>
        </section>

        <footer className={styles.ApresentacaoFooter}>
          <div className={styles.FooterCont}>
            <div className={styles.FooterInformacoes}>
              <div className={styles.TodosOsBotoes}>
                <div className={styles.SobreSocial}>
                  <div className={styles.BotaoSobre}>
                    <h3>Quem somos</h3>

                    <Link href="/sobre">
                      <div className={styles.BotaoSobreBox}>
                        <span>Sobre a Cameo</span>
                        <img src="/icones/arrow.svg" />
                      </div>
                    </Link>
                  </div>
                </div>
                <div className={styles.socialMedia}>
                  <a
                    href="https://www.instagram.com/cameo.fun"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/icones/instagram.svg" alt="Instagram" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@cameo.fun"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/icones/tiktok.svg" alt="TikTok" />
                  </a>
                  <a
                    href="https://www.youtube.com/@cameo_fun"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/icones/youtube.svg" alt="YouTube" />
                  </a>
                </div>
              </div>

              <div className={styles.TodosOsBotoes}>
                <div className={styles.SobreSocial}>
                  <div className={styles.BotaoSobre}>
                    <h3>Contato</h3>

                    <div className={styles.Cta}>
                      <Link href="mailto:contato@cameo.fun">
                        <div className={styles.BotaoSobreBox}>
                          <span>Entrar em contato</span>
                          <img src="/icones/arrow.svg" />
                        </div>
                      </Link>

                      <Link href="/">
                        <button>Começar</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.MascoteDeadpool}>
              <span>Você ainda está aqui?... Já acabou!!!</span>
              <img src="/icones/lp-deadpool.png" alt="Mascote Deadpool" />
            </div>
          </div>

          <div className={styles.FooterLogo}>
            <img src="/logo/cameo-logo-miniatura.svg" alt="Cameo logo" />
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Apresentacao;
