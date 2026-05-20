import { useEffect } from "react";
import CloseIcon from "@/components/icons/CloseIcon";
import JoiaRosaIcon from "@/components/icons/JoiaRosaIcon";
import JoiaAmarelaIcon from "@/components/icons/JoiaAmarelaIcon";
import JoiaAzulIcon from "@/components/icons/JoiaAzulIcon";
import styles from "./index.module.scss";

export default function DesafioRegras({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} type="button" onClick={onClose}>
          <CloseIcon size={16} color="currentColor" />
        </button>

        <div className={styles.contentModal}>
          <div className={styles.guiaCompleto}>
            <div className={styles.pontoGuia}></div>
            <span>Guia completo</span>
          </div>

          <div className={styles.topoRegras}>
            <h1>Regras da <span>Cameo desafio</span></h1>
            <p>Tudo o que você precisa saber para jogar, evoluir e se tornar uma referência no universo do cinema, das séries e da dublagem.</p>
          </div>

          <div className={styles.sectionRegras}>
            <div className={styles.tituloRegra}>
              <div className={styles.numeroRegra}><span>1</span></div>
              <h2>O que é a Cameo Desafio?</h2>
            </div>
            <p>A Cameo Desafio é o espaço da Cameo feito para quem leva cinema a sério — ou quer levar. Aqui você responde perguntas, participa de desafios temáticos, cumpre metas e acumula XP para evoluir na plataforma.</p>
            <p>Cada desafio é uma chance de testar o quanto você realmente sabe sobre os temas que ama. Quanto mais você joga, mais você avança.</p>
          </div>

          <div className={styles.separador}></div>

          <div className={styles.sectionRegras}>
            <div className={styles.tituloRegra}>
              <div className={styles.numeroRegra}><span>2</span></div>
              <h2>Como jogar</h2>
            </div>
            <p>Escolha um desafio disponível e responda às perguntas. Cada pergunta pertence a um tema e tem um nível de dificuldade.</p>
            <p>Os desafios podem envolver os seguintes temas:</p>

            <div className={styles.contentBoxes}>
              {["Filmes", "Séries", "Dublagem", "Notícias", "Direção", "Personagens", "Elenco"].map((tema) => (
                <div key={tema} className={styles.boxRegra}>
                  <span>{tema}</span>
                </div>
              ))}
            </div>

            <p>As perguntas da Cameo Desafio podem ter três níveis de dificuldade:</p>

            <div className={styles.contentBoxes}>
              <div className={styles.boxRegra}>
                <div className={styles.conteudoDificuldade}>
                  <span>Fácil</span>
                  <div className={styles.boxJoia}><JoiaRosaIcon width={24} height={33} /></div>
                </div>
              </div>
              <div className={styles.boxRegra}>
                <div className={styles.conteudoDificuldade}>
                  <span>Médio</span>
                  <div className={styles.boxJoia}>
                    <JoiaAmarelaIcon width={24} height={33} />
                    <JoiaAmarelaIcon width={24} height={33} />
                  </div>
                </div>
              </div>
              <div className={styles.boxRegra}>
                <div className={styles.conteudoDificuldade}>
                  <span>Difícil</span>
                  <div className={styles.boxJoia}>
                    <JoiaAzulIcon width={24} height={33} />
                    <JoiaAzulIcon width={24} height={33} />
                    <JoiaAzulIcon width={24} height={33} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.separador}></div>

          <div className={styles.sectionRegras}>
            <div className={styles.tituloRegra}>
              <div className={styles.numeroRegra}><span>3</span></div>
              <h2>Como ganhar XP</h2>
            </div>
            <p>O XP é a moeda da sua evolução na Cameo. Existem quatro formas principais de acumulá-lo.</p>

            <div className={styles.contentXP}>
              <div className={styles.contentXPBox}>
                <div className={styles.boxIconRegras}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17C10.3264 17 8.86971 18.265 8.11766 20.1312C7.75846 21.0225 8.27389 22 8.95877 22H15.0412C15.7261 22 16.2415 21.0225 15.8823 20.1312C15.1303 18.265 13.6736 17 12 17Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M18.5 5H19.7022C20.9031 5 21.5035 5 21.8168 5.37736C22.13 5.75472 21.9998 6.32113 21.7393 7.45395L21.3485 9.15307C20.7609 11.7086 18.6109 13.6088 16 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.5 5H4.29779C3.09692 5 2.49649 5 2.18324 5.37736C1.86999 5.75472 2.00024 6.32113 2.26075 7.45395L2.65148 9.15307C3.23914 11.7086 5.38912 13.6088 8 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 17C15.0208 17 17.565 12.3379 18.3297 5.99089C18.5412 4.23558 18.647 3.35793 18.0868 2.67896C17.5267 2 16.6223 2 14.8134 2H9.18658C7.37775 2 6.47333 2 5.91317 2.67896C5.35301 3.35793 5.45875 4.23558 5.67025 5.99089C6.435 12.3379 8.97923 17 12 17Z" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className={styles.boxXPDescricao}>
                  <p>Respondendo desafios</p>
                  <p>Cada pergunta correta vale XP de acordo com a dificuldade. Perguntas difíceis rendem mais — mas exigem mais conhecimento.</p>
                </div>
              </div>

              <div className={styles.contentXPBox}>
                <div className={styles.boxIconRegras}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 22V2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M22 22V2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M7 18L10.6534 7.48635C10.9447 6.81279 11.4878 5.99657 11.9467 6.00001C12.6263 6.00511 12.9827 6.70758 13.3774 7.48635C13.7721 8.26513 17 18 17 18M9.01312 12.9912L14.8945 12.9293" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.boxXPDescricao}>
                  <p>Encontrando palavras secretas</p>
                  <p>De vez em quando, palavras secretas são escondidas pela plataforma. Quem as encontra é recompensado com XP bônus — vale prestar atenção nos detalhes.</p>
                </div>
              </div>

              <div className={styles.contentXPBox}>
                <div className={styles.boxIconRegras}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.1312 2.5C14.1462 2.17555 13.0936 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.9548 21.8396 9.94704 21.5422 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19.5 4.5L12 12M19.5 4.5V2M19.5 4.5H22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className={styles.boxXPDescricao}>
                  <p>Cumprindo metas</p>
                  <p>A Cameo oferece metas diárias, semanais, mensais e anuais. Completá-las garante XP extras e mantém sua jornada ativa.</p>
                </div>
              </div>

              <div className={styles.contentXPBox}>
                <div className={styles.boxIconRegras}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 2V6M8 2V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 14V12C21 8.22876 21 6.34315 19.8284 5.17157C18.6569 4 16.7712 4 13 4H11C7.22876 4 5.34315 4 4.17157 5.17157C3 6.34315 3 8.22876 3 12V14C3 17.7712 3 19.6569 4.17157 20.8284C5.34315 22 7.22876 22 11 22H12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 10H21" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.1047 15.5055L18.7206 16.7475C18.8046 16.9204 19.0286 17.0862 19.2175 17.118L20.3339 17.305C21.0478 17.425 21.2158 17.9472 20.7014 18.4624L19.8335 19.3374C19.6865 19.4856 19.606 19.7715 19.6515 19.9761L19.9 21.0594C20.096 21.9168 19.6445 22.2485 18.8921 21.8004L17.8457 21.1758C17.6567 21.0629 17.3453 21.0629 17.1528 21.1758L16.1064 21.8004C15.3575 22.2485 14.9025 21.9133 15.0985 21.0594L15.347 19.9761C15.3925 19.7715 15.312 19.4856 15.165 19.3374L14.2971 18.4624C13.7861 17.9472 13.9506 17.425 14.6646 17.305L15.7809 17.118C15.9664 17.0862 16.1904 16.9204 16.2744 16.7475L16.8903 15.5055C17.2263 14.8315 17.7722 14.8315 18.1047 15.5055Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className={styles.boxXPDescricao}>
                  <p>Participando de eventos especiais</p>
                  <p>Eventos temáticos por tempo limitado trazem desafios exclusivos, missões especiais e recompensas únicas que não aparecem no modo comum.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.separador}></div>

          <div className={styles.sectionRegras}>
            <div className={styles.tituloRegra}>
              <div className={styles.numeroRegra}><span>4</span></div>
              <h2>O que são patentes?</h2>
            </div>
            <p>As patentes mostram o quanto você conhece cada tema — e cada tema tem sua própria jornada.</p>

            <div className={styles.containerPatentes}>
              <h2>Como funciona</h2>
              <p>Todo jogador começa sem nenhuma patente. Você não entra na Cameo com um título. Sua primeira patente aparece quando você joga o primeiro desafio de um tema específico — a partir daí, você se torna Aspirante daquele tema e sua progressão começa.</p>
              <p>As patentes são independentes por tema. Isso significa que você pode ser Lenda do Terror e ainda ser Aspirante de Comédia ao mesmo tempo. Progredir em um tema não interfere nos outros. Cada um tem seu próprio XP e sua própria escala.</p>
            </div>

            <p>A progressão é sempre a mesma sequência de 10 níveis, com o nome do tema acrescentado ao título:</p>

            <div className={styles.contentPatentesRegras}>
              {["Aspirante", "Entusiasta", "Apreciador", "Conhecedor", "Colecionador", "Especialista", "Referência", "Mestre", "Ícone", "Lenda"].map((nivel) => (
                <div key={nivel} className={styles.BoxPatenteRegras}>
                  <svg width="52" height="58" viewBox="0 0 52 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 16.9768V40.8152C0 42.6226 0.967859 44.2923 2.53899 45.1956L23.2614 57.1145C24.8325 58.0178 26.7675 58.0178 28.3386 57.1145L49.061 45.1956C50.6321 44.2923 51.6 42.6219 51.6 40.8152V16.9768C51.6 15.1694 50.6321 13.4997 49.061 12.5964L28.3386 0.677505C26.7675 -0.225835 24.8325 -0.225835 23.2614 0.677505L2.53899 12.5964C0.967859 13.4997 0 15.1701 0 16.9768Z" fill="#161216"/>
                    <path d="M25.7997 55.6893C25.2794 55.6893 24.7664 55.5523 24.3159 55.2935L3.59355 43.3746C2.67881 42.8483 2.10974 41.8674 2.10974 40.8147V16.9762C2.10974 15.9235 2.67809 14.9426 3.59355 14.4163L24.3159 2.49741C24.7664 2.23859 25.2794 2.10156 25.7997 2.10156C26.3201 2.10156 26.8331 2.23859 27.2835 2.49741L48.0059 14.4163C48.9207 14.9426 49.4897 15.9235 49.4897 16.9762V40.8147C49.4897 41.8674 48.9214 42.8483 48.0059 43.3746L27.2835 55.2935C26.8331 55.5523 26.3201 55.6893 25.7997 55.6893ZM25.7997 2.24584C25.3049 2.24584 24.8173 2.37634 24.3887 2.62211L3.66632 14.541C2.79598 15.0412 2.25528 15.9743 2.25528 16.9755V40.814C2.25528 41.8152 2.79598 42.7475 3.66632 43.2485L24.3887 55.1673C24.8173 55.4138 25.3049 55.5436 25.7997 55.5436C26.2946 55.5436 26.7822 55.4131 27.2108 55.1673L47.9332 43.2485C48.8035 42.7482 49.3442 41.8152 49.3442 40.814V16.9755C49.3442 15.9743 48.8035 15.0419 47.9332 14.541L27.2108 2.62211C26.7822 2.37561 26.2946 2.24584 25.7997 2.24584Z" fill="#2F2B2F"/>
                    <path d="M22.7601 54.314L24.3531 55.2304C24.7926 55.4834 25.2926 55.6168 25.8005 55.6168C26.3085 55.6168 26.8084 55.4834 27.2479 55.2304L28.8409 54.314H22.7609H22.7601Z" fill="#2F2B2F"/>
                    <path d="M28.9042 3.51361L27.2472 2.56025C26.8076 2.30723 26.3077 2.17383 25.7997 2.17383C25.2918 2.17383 24.7919 2.30723 24.3523 2.56025L22.6953 3.51361H28.9034H28.9042Z" fill="#2F2B2F"/>
                  </svg>
                  <span>{nivel}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.sectionIdeia}>
            <div className={styles.sectionIdeiaSVG}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.08938 15C5.71097 14.1494 5.5 13.2031 5.5 12.2059C5.5 8.50233 8.41015 5.5 12 5.5C15.5899 5.5 18.5 8.50233 18.5 12.2059C18.5 13.2031 18.289 14.1494 17.9106 15" stroke="#1AF5EB" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 2V3" stroke="#1AF5EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 12H21" stroke="#1AF5EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12H2" stroke="#1AF5EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.0703 4.92871L18.3632 5.63582" stroke="#1AF5EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.63668 5.6368L4.92957 4.92969" stroke="#1AF5EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.5161 19.3064C15.5264 18.9796 15.9316 18.0548 16.0456 17.1246C16.0797 16.8467 15.851 16.6162 15.571 16.6162L8.47587 16.6164C8.18627 16.6164 7.95369 16.8622 7.98827 17.1497C8.09992 18.0781 8.38173 18.7562 9.45247 19.3064M14.5161 19.3064C14.5161 19.3064 9.62874 19.3064 9.45247 19.3064M14.5161 19.3064C14.3946 21.2514 13.8328 22.0217 12.0058 22.0001C10.0516 22.0362 9.60206 21.0841 9.45247 19.3064" stroke="#1AF5EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>O nome do tema sempre faz parte do título. Por exemplo: <strong>Conhecedor de Drama, Mestre da Dublagem, Lenda do Terror.</strong> Sua patente é o reflexo direto da sua dedicação a cada universo.</span>
          </div>

          <div className={styles.sectionRegras}>
            <div className={styles.tituloRegra}>
              <div className={styles.numeroRegra}><span>5</span></div>
              <h2>Eventos especiais</h2>
            </div>
            <p>Além dos desafios comuns, a Cameo lança eventos por tempo limitado com temas, missões e recompensas exclusivas.</p>
            <p>Cada evento tem regras, perguntas e recompensas próprias. Fique de olho nas novidades da plataforma para não perder nenhum.</p>
          </div>

          <div className={styles.sectionFinal}>
            <h2>
              Pronto para jogar?
              <br />
              <span>Sua jornada começa agora.</span>
            </h2>
            <p>Escolha um tema, responda seu primeiro desafio e desbloqueie sua primeira patente. A Cameo Desafio espera por você.</p>
          </div>
        </div>
      </div>
    </div>
  );
}