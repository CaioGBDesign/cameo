import { useState } from "react"; // Importando useState
import styles from "./index.module.scss";
import Head from "next/head";
import { useIsMobile } from "@/components/DeviceProvider";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeaderDesktop from "@/components/HeaderDesktop";

const Sobre = () => {
  const isMobile = useIsMobile();

  return (
    <main>
      <div className={styles.ContSobre}>
        <Head>
          <title>Cameo - Apresentação</title>
          <meta
            name="description"
            content="Descubra o filme perfeito com a Cameo! Oferecemos sugestões aleatórias e personalizadas, filtradas por gênero, classificação indicativa, serviços de streaming e muito mais. Crie listas de filmes, avalie suas escolhas e compartilhe com amigos. Mergulhe no mundo do cinema e nunca fique sem o que assistir. Cadastre-se agora e transforme sua experiência cinematográfica!"
          />
        </Head>

        {isMobile ? <Header /> : <HeaderDesktop />}

        <section className={styles.SobreHero}>
          <div className={styles.SobreHeroBox}>
            <div className={styles.Headline}>
              <h1>Sobre a Cameo</h1>
              <div className={styles.Separador}></div>
            </div>

            <div className={styles.SobreVaral}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/sobre%2Fcameo-varal.png?alt=media&token=3652affe-a311-4448-a357-7082fa2dcca0"
                alt="Cameo Varal"
              />
            </div>
          </div>
        </section>

        <section className={styles.Historia}>
          <div className={styles.HistoriaBox}>
            <div className={styles.Titulo}>
              <h1>Nossa história</h1>
              <div className={styles.Separador}></div>
            </div>

            <div className={styles.SobreParagrafo}>
              <p>
                A{" "}
                <span>
                  <strong>Cameo</strong>
                </span>{" "}
                nasceu de uma ideia simples, mas cheia de paixão:
                <span>
                  <strong>facilitar a escolha de qual filme assistir</strong>
                </span>
                . Tudo começou em uma noite comum, quando alguém perguntou:
                "Vamos ver um filme, mas qual?" Foi aí que a luz se acendeu!
              </p>
            </div>
          </div>
        </section>

        <section className={styles.Fotos}>
          <div className={styles.FotosBox}>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/sobre%2Fcameo-sobre-nos.jpg?alt=media&token=1ef77647-01e0-4ab7-b481-1221eb063485"
              alt="Cameo Sobre Nós"
            />

            {isMobile ? null : (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/sobre%2Fcameo-sobre-nos-02.jpg?alt=media&token=670ae8f3-de1b-43f0-ac34-9d93da84e15f"
                alt="Cameo Sobre Nós"
              />
            )}
          </div>
        </section>

        <section className={styles.ComoComecou}>
          <div className={styles.ComoComecouBox}>
            <div className={styles.ComoComecouParagrafo}>
              <p>
                A ideia inicial era criar um{" "}
                <span>
                  <strong>sistema pessoal</strong>
                </span>{" "}
                para sugerir filmes e ajudar a cumprir a meta de{" "}
                <span>
                  <strong>um filme novo por dia</strong>
                </span>
                . Mas, quando amigos e familiares viram o projeto, a pergunta
                foi inevitável: "Posso usar também?" E assim, o que era um
                projeto caseiro virou uma plataforma para todos que amam cinema
                tanto quanto a gente! 🎥❤️
              </p>
            </div>

            <div className={styles.Titulo}>
              <h1>Como tudo começou</h1>
              <div className={styles.Separador}></div>
            </div>

            {isMobile ? (
              <div className={styles.ImagemTime}>
                <img src="sobre/cameo-sobre-nos-02.jpg" alt="Cameo Sobre Nós" />
              </div>
            ) : null}
          </div>
        </section>

        <section className={styles.Historia}>
          <div className={styles.HistoriaBox}>
            <div className={styles.Titulo}>
              <h1>A evolução da Cameo</h1>
              <div className={styles.Separador}></div>
            </div>

            <div className={styles.SobreParagrafo}>
              <p>
                Com o tempo, ouvimos os usuários e fomos adicionando
                funcionalidades que fazem a Cameo ser o que é hoje:
              </p>
            </div>
          </div>
        </section>

        <section className={styles.Evolucao}>
          <div className={styles.EvolucaoBox}>
            {isMobile ? (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/sobre%2Fcameo-evolucao-mobile.png?alt=media&token=5f223e7d-5351-4c22-b2cf-9e0d15697f73"
                alt="Cameo Evolução"
              />
            ) : (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/sobre%2Fcameo-evolucao.png?alt=media&token=44f16079-56de-401f-8733-894b897b080f"
                alt="Cameo Evolução"
              />
            )}

            <div className={styles.EvolucaoParagrafo}>
              <p>
                E, claro, tudo isso com uma identidade visual linda e um design
                que faz você se sentir em casa (ou numa sala de cinema).
              </p>
            </div>
          </div>
        </section>

        <section className={styles.Missao}>
          <div className={styles.MissaoBox}>
            {isMobile ? null : (
              <div className={styles.MissaoImagem}>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/sobre%2Fcameo-palavras.png?alt=media&token=c03df023-8ae4-4ea6-95e0-2f0da9b9d661"
                  alt="Cameo Palavras"
                />
              </div>
            )}

            <div className={styles.MissaoParagrafo}>
              <div className={styles.Titulo}>
                <h1>Nossa missão</h1>
                <div className={styles.Separador}></div>
              </div>

              <div className={styles.MissaoTexto}>
                <p>
                  Na Cameo, acreditamos que o cinema é mais do que
                  entretenimento. É emoção, conexão e descoberta.
                </p>

                <p>
                  Queremos ser o seu parceiro nessa jornada, ajudando você a
                  explorar novos mundos, relembrar clássicos e transformar cada
                  filme em uma experiência única.
                </p>

                <hr />

                <p>
                  <span>
                    <strong>Vem pra Cameo e faça parte dessa história!</strong>
                  </span>
                </p>

                <p>
                  <i>Porque aqui, o cinema é seu.</i>
                </p>
              </div>
            </div>
          </div>
        </section>

        {isMobile ? (
          <div className={styles.MissaoImagemMobile}>
            <img src="sobre/cameo-palavras.png" alt="Cameo Palavras" />
          </div>
        ) : null}

        <section className={styles.ParagrafoSobre}>
          <div className={styles.ParagrafoSobreBox}>
            <p>
              Pronto pra começar sua aventura cinematográfica? No{" "}
              <span>
                <strong>Cameo.fun</strong>
              </span>
              , até o Oscar daria like! 🏆✨
            </p>
          </div>
        </section>

        <section className={styles.NossoTime}>
          <div className={styles.NossoTimeBox}>
            <div className={styles.NossoTimeTitulo}>
              <h1>Nosso time</h1>
              <div className={styles.Separador}></div>
            </div>

            <div className={styles.NossoTimeEquipe}>
              <div className={styles.NossoTimeEquipeBox}>
                <div className={styles.TentaculoA}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/sobre%2Ftentaculo-01.svg?alt=media&token=4a022320-fdae-42f9-8dc8-e346e83dc3a0"
                    alt="Tentaculo"
                  />
                </div>
                <div className={styles.DetalhesEquipe}>
                  <div className={styles.FotoGradiente}>
                    <div className={styles.Foto}>
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/sobre%2Fcaio-goulart.jpg?alt=media&token=2518c1a8-3ec3-4e18-ba96-3c580ae2ff84"
                        alt="Cameo Caio Goulart"
                      />
                    </div>
                  </div>
                  <div className={styles.Nome}>
                    <h3>Caio Goulart</h3>
                    <span>Fundador e apresentador</span>
                  </div>
                </div>
                <div className={styles.TentaculoB}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/sobre%2Ftentaculo-02.svg?alt=media&token=d3eb62be-df5b-494b-a053-c2c3fa5c2b8e"
                    alt="Tentaculo"
                  />
                </div>
              </div>

              <div className={styles.NossoTimeEquipeBox}>
                <div className={styles.TentaculoA}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/sobre%2Ftentaculo-01.svg?alt=media&token=4a022320-fdae-42f9-8dc8-e346e83dc3a0"
                    alt="Tentaculo"
                  />
                </div>
                <div className={styles.DetalhesEquipe}>
                  <div className={styles.FotoGradiente}>
                    <div className={styles.Foto}>
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/sobre%2Fdenis-silva.jpg?alt=media&token=4b49a84d-df03-40c5-ae4a-23eafe7e048b"
                        alt="Cameo Denis Silva"
                      />
                    </div>
                  </div>
                  <div className={styles.Nome}>
                    <h3>Denis Silva</h3>
                    <span>Apresentador</span>
                  </div>
                </div>
                <div className={styles.TentaculoB}>
                  <img
                    src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/sobre%2Ftentaculo-02.svg?alt=media&token=d3eb62be-df5b-494b-a053-c2c3fa5c2b8e"
                    alt="Tentaculo"
                  />
                </div>
              </div>
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

export default Sobre;
