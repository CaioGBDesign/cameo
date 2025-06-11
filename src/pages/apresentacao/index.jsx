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
      imagem:
        "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/usuario%2Figor.png?alt=media&token=2632eec1-11e7-463b-ad7e-4099abe348a6",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem:
        "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/usuario%2Fusuario.png?alt=media&token=5387b6a9-0625-4cbb-b855-8e2e096cf223",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem:
        "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/usuario%2Figor.png?alt=media&token=2632eec1-11e7-463b-ad7e-4099abe348a6",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem:
        "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/usuario%2Figor.png?alt=media&token=2632eec1-11e7-463b-ad7e-4099abe348a6",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem:
        "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/usuario%2Figor.png?alt=media&token=2632eec1-11e7-463b-ad7e-4099abe348a6",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem:
        "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/usuario%2Figor.png?alt=media&token=2632eec1-11e7-463b-ad7e-4099abe348a6",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem:
        "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/usuario%2Figor.png?alt=media&token=2632eec1-11e7-463b-ad7e-4099abe348a6",
    },
    {
      usuario: "Pedro Oliveira",
      comentario:
        "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
      estrelas: 3,
      imagem:
        "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/usuario%2Figor.png?alt=media&token=2632eec1-11e7-463b-ad7e-4099abe348a6",
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
        </Head>

        <section className={styles.ApresentacaoHeader}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/logo%2Fcameo-logo-miniatura.svg?alt=media&token=bb482344-e73f-4cee-ac6f-97a1c003b6e7"
            alt="Cameo logo"
          />
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
              src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/mascote%2Fcameo-astronauta-mergulho.png?alt=media&token=ccb6c09f-3761-46cd-b747-f0b7197ec946"
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
                          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-filme-aleatorio.svg?alt=media&token=8241ab0e-db7b-4c2a-bf0a-c01cb7259092"
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
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Ffiltros.svg?alt=media&token=ead1e1eb-f88b-48ba-b2e6-26b3ef5c2e56"
                          alt="filtros"
                        />
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
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Favaliacoes.svg?alt=media&token=8eda5b25-2f65-4dec-8ae0-a2e4a5cf68b0"
                          alt="avaliaçoes"
                        />
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
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-dados.svg?alt=media&token=25aa3d30-2667-4289-a6bd-293abf8be873"
                          alt="Seus Dados"
                        />
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
                      src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/mascote%2Fcameo-thanos.png?alt=media&token=2afc577a-fc65-419a-90f0-e0bc949275ef"
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
                      src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/mascote%2Fcameo-filtros.png?alt=media&token=10f4b491-3af0-417c-8f45-683e2c2ef3ab"
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
                      src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/mascote%2Fcameo-avaliacoes.png?alt=media&token=047d4256-f391-4586-9eca-40e184558a49"
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
                      src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/mascote%2Fcameo-dados.png?alt=media&token=4449b62b-0dd8-40cb-afa5-44baef7c778a"
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
            <img
              src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fparticulas.png?alt=media&token=9f77e5fd-de62-4b1f-a59b-c69beac8e0fa"
              alt="particulas"
            />
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
                          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fpersonalidade-icone.svg?alt=media&token=4b93b6d4-59e7-4230-9690-67866a83f4ce"
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
                          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-personalidade.png?alt=media&token=417c9034-abc2-4808-9443-608aae8fef54"
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
                          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-filme-aleatorio.svg?alt=media&token=8241ab0e-db7b-4c2a-bf0a-c01cb7259092"
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
                          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-esqueceram-de-mim.png?alt=media&token=d8779970-8a75-4932-b8e2-4809e1cc1a72"
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
                          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-filme-aleatorio.svg?alt=media&token=8241ab0e-db7b-4c2a-bf0a-c01cb7259092"
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
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-samara.png?alt=media&token=88c0c759-97ff-4a11-9902-5a1c79e8b1d3"
                          alt="Cameo Samara"
                        />
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
                    src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-personalidade.png?alt=media&token=417c9034-abc2-4808-9443-608aae8fef54"
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
                    src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-esqueceram-de-mim.png?alt=media&token=d8779970-8a75-4932-b8e2-4809e1cc1a72"
                    alt="Cameo Esqueceram de mim"
                  />
                </div>

                <div
                  className={styles.FilmeAleatorio}
                  style={{
                    display: activeTabB === "maratona" ? "flex" : "none",
                  }}
                >
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-samara.png?alt=media&token=88c0c759-97ff-4a11-9902-5a1c79e8b1d3"
                    alt="Cameo Samara"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <section className={styles.ApresentacaoComentarios}>
          <div className={styles.ComentariosCont}>
            <div className={styles.MascoteTodoPoderoso}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-todo-poderoso.png?alt=media&token=eceadd16-b599-4e07-9b3e-0bdd421dd9e9"
                alt="Cameo Comentarios"
              />
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
                              src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrela-preenchida.svg?alt=media&token=d59fbabb-c1bf-498f-adad-8a9dc4a88062"
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
                  src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrela-preenchida.svg?alt=media&token=d59fbabb-c1bf-498f-adad-8a9dc4a88062"
                  alt="estrela preenchida"
                />
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrela-preenchida.svg?alt=media&token=d59fbabb-c1bf-498f-adad-8a9dc4a88062"
                  alt="estrela preenchida"
                />
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrela-preenchida.svg?alt=media&token=d59fbabb-c1bf-498f-adad-8a9dc4a88062"
                  alt="estrela preenchida"
                />
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrela-preenchida.svg?alt=media&token=d59fbabb-c1bf-498f-adad-8a9dc4a88062"
                  alt="estrela preenchida"
                />
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrela-preenchida.svg?alt=media&token=d59fbabb-c1bf-498f-adad-8a9dc4a88062"
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
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-cameo-lover.png?alt=media&token=fa71a812-4f00-460c-87f8-426c713ca2fc"
                alt="Cameo lover"
              />
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
                        <img src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Farrow.svg?alt=media&token=0ea58b26-50c2-4ba7-b125-4a07e26f5926" />
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
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Finstagram.svg?alt=media&token=f7cec9d2-fcc7-4fc1-971d-f3b3235ec12f"
                      alt="Instagram"
                    />
                  </a>
                  <a
                    href="https://www.tiktok.com/@cameo.fun"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Ftiktok.svg?alt=media&token=438263b9-26ef-4628-bdbe-635b26e41122"
                      alt="TikTok"
                    />
                  </a>
                  <a
                    href="https://www.youtube.com/@cameo_fun"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fyoutube.svg?alt=media&token=f18edca3-ab54-4387-a388-d13fe22f87fc"
                      alt="YouTube"
                    />
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
                          <img src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Farrow.svg?alt=media&token=0ea58b26-50c2-4ba7-b125-4a07e26f5926" />
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
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Flp-deadpool.png?alt=media&token=1c720245-b49e-4346-9ce1-f1135a1e7446"
                alt="Mascote Deadpool"
              />
            </div>
          </div>

          <div className={styles.FooterLogo}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/logo%2Fcameo-logo-miniatura.svg?alt=media&token=bb482344-e73f-4cee-ac6f-97a1c003b6e7"
              alt="Cameo logo"
            />
          </div>
        </footer>
      </div>
    </main>
  );
};

export default Apresentacao;
