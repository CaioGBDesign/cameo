import { useState } from "react";
import Head from "next/head";
import { db } from "@/services/firebaseConection";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DesafioButton from "@/components/desafio/button";
import BoxPergunta from "@/components/desafio/box-pergunta";
import BoxPatente from "@/components/desafio/box-patente";
import ParticlesCanvas from "@/components/desafio/particles-canvas";
import DesafioRegras from "@/components/desafio/regras";
import ModalJogar from "@/components/desafio/modal-jogar";
import CartasIcon from "@/components/icons/CartasIcon";
import styles from "./index.module.scss";

export async function getServerSideProps() {
  const [configSnap, desafioSnap] = await Promise.all([
    getDoc(doc(db, "configuracoes", "site")),
    getDoc(doc(db, "configuracoes", "desafio")),
  ]);

  const config = configSnap.exists() ? configSnap.data() : {};
  if (config.gameHabilitado === false) return { notFound: true };

  const desafio = desafioSnap.exists() ? desafioSnap.data() : {};

  return {
    props: {
      logoDesafio: desafio.logoDesafio ?? null,
      heroBannerDesktop: desafio.heroBannerDesktop ?? null,
      heroBannerMobile: desafio.heroBannerMobile ?? null,
      sessaoPerguntasDesktop: desafio.sessaoPerguntasDesktop ?? null,
      sessaoPerguntasMobile: desafio.sessaoPerguntasMobile ?? null,
      bannersTipo: desafio.bannersTipo ?? [],
      titulosTipo: desafio.titulosTipo ?? [],
      descricoesTipo: desafio.descricoesTipo ?? [],
      tiposPergunta: desafio.tiposPergunta ?? [],
    },
  };
}

export default function DesafioPage({
  logoDesafio,
  heroBannerDesktop,
  heroBannerMobile,
  sessaoPerguntasDesktop,
  sessaoPerguntasMobile,
  bannersTipo,
  titulosTipo,
  descricoesTipo,
  tiposPergunta,
}) {
  const [modalRegras, setModalRegras] = useState(false);
  const [modalJogar, setModalJogar] = useState(false);
  const [tipoFiltroModal, setTipoFiltroModal] = useState(null);

  const abrirModalJogar = (tipo = null) => {
    setTipoFiltroModal(tipo || null);
    setModalJogar(true);
  };
  return (
    <>
      <Head>
        <title>Desafio — Cameo</title>
      </Head>
      <Header />
      <main className={styles.page}>
        <div className={styles.heroBanner}>
          <div className={styles.heroContent}>
            {logoDesafio && (
              <img
                src={logoDesafio}
                alt="Logo Desafio"
                className={styles.logoDesafio}
                unoptimized
              />
            )}

            <h1>
              Prove que você <span>manja de cinema</span>
            </h1>

            <p>
              Entre no quiz rápido, escolha seu modo do dia e suba no ranking
              com uma home mais competitiva, imersiva e orientada por cards —
              puxando a energia visual de fantasy game, sem perder a identidade
              da Cameo.
            </p>

            <div className={styles.heroBotoes}>
              <div className={styles.botaoSolid}>
                <DesafioButton
                  variant="solid"
                  label="Jogar agora"
                  icon={<CartasIcon size={20} color="currentColor" />}
                  width={"100%"}
                  onClick={() => abrirModalJogar()}
                />
              </div>

              <div className={styles.botaoOutline}>
                <DesafioButton
                  variant="outline"
                  label="Regras do desafio"
                  width={"100%"}
                  onClick={() => setModalRegras(true)}
                />
              </div>
            </div>
          </div>

          <div className={styles.heroBannerImagens}>
            {heroBannerDesktop && (
              <img
                src={heroBannerDesktop}
                alt="Hero banner"
                className={styles.bannerDesktop}
                unoptimized
              />
            )}
            {heroBannerMobile && (
              <img
                src={heroBannerMobile}
                alt="Hero banner"
                className={styles.bannerMobile}
                unoptimized
              />
            )}
          </div>
        </div>

        <div className={styles.pergntasSection}>
          <div className={styles.perguntasConteudo}>
            <div className={styles.perguntasResumo}>
              <div className={styles.perguntasResumoBox}>
                <p>Perguntas respondidas</p>
                <span>125</span>
              </div>

              <div className={styles.perguntasResumoBox}>
                <p>Patentes liberadas</p>
                <span>10</span>
              </div>

              <div className={styles.perguntasResumoBox}>
                <p>Melhor tema</p>
                <span>Terror</span>
              </div>

              <div className={styles.perguntasResumoBox}>
                <p>Eventos concluídos</p>
                <span>6</span>
              </div>
            </div>

            <div className={styles.perguntasBotao}>
              <DesafioButton
                variant="solid"
                label="Jogar agora"
                icon={<CartasIcon size={20} color="currentColor" />}
                width={"100%"}
                onClick={() => abrirModalJogar()}
              />
            </div>

            <div className={styles.perguntasTemadoDia}>
              <p>
                O tema do dia é <span>Terror</span>
              </p>

              <div className={styles.perguntasTrocaDoTema}>
                <p>Troca de tema em</p> <span>00:00:00</span>
              </div>
            </div>

            <div className={styles.perguntas}>
              <div className={styles.perguntasScroll}>
                {Array.from({ length: 5 }, (_, i) => (
                  <BoxPergunta
                    key={i}
                    index={i}
                    titulo={titulosTipo[i] || ""}
                    descricao={descricoesTipo[i] || ""}
                    imagemUrl={bannersTipo[i] || null}
                    onJogar={() => abrirModalJogar(tiposPergunta[i])}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={styles.pergntasSectionBackground}>
            {sessaoPerguntasDesktop && (
              <img
                src={sessaoPerguntasDesktop}
                alt="Sessão de perguntas"
                className={styles.bannerDesktop}
                unoptimized
              />
            )}
            {sessaoPerguntasMobile && (
              <img
                src={sessaoPerguntasMobile}
                alt="Sessão de perguntas"
                className={styles.bannerMobile}
                unoptimized
              />
            )}
          </div>
        </div>

        <div
          className={styles.patentesSection}
          style={{ position: "relative" }}
        >
          <div className={styles.tituloPatentes}>
            <div className={styles.divisor}></div>
            <p>
              Minhas <span>patentes</span>
            </p>
          </div>

          <div className={styles.contentPatentesBorda}>
            <div className={styles.contentPatentes}>
              <div className={styles.ultimasPatentes}>
                <p>Últimas patentes</p>
              </div>

              <div className={styles.exibirPatentes}>
                <div className={styles.patentesScroll}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <BoxPatente
                      key={i}
                      imagemSrc="/background/cameo-patentes-slot.png"
                      nome="Aspirante"
                      tema="Terror"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <ParticlesCanvas count={60} />
        </div>
      </main>
      <Footer />
      <DesafioRegras isOpen={modalRegras} onClose={() => setModalRegras(false)} />
      <ModalJogar isOpen={modalJogar} onClose={() => setModalJogar(false)} tipoFiltro={tipoFiltroModal} />
    </>
  );
}
