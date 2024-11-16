import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { updateDoc, arrayRemove } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import AdicionarMeta from "@/components/modais/adicionar-metas";
import DeletarMetas from "@/components/modais/deletar-metas";
import VerTodas from "@/components/modais/ver-todas";

const GraficoMetasMobile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState("");
  const [metaParaDeletar, setMetaParaDeletar] = useState(null); // Novo estado para armazenar a meta a ser deletada
  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (user) {
          const userId = user.uid;
          const userRef = doc(db, "users", userId);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            setUserData(userSnapshot.data());
          } else {
            console.log("Usuário não encontrado!");
          }
        } else {
          console.log("Nenhum usuário autenticado encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [db, user]);

  // Função para normalizar a data no formato 'DD/MM/YYYY' para o formato 'YYYY-MM-DD'
  const normalizeDateToUTC = (dataStr) => {
    const [day, month, year] = dataStr.split("/"); // Supondo que a data seja no formato "DD/MM/YYYY"
    if (day && month && year) {
      return new Date(Date.UTC(year, month - 1, day)); // Usa UTC para evitar ajuste de fuso horário
    }
    return new Date(dataStr); // Retorna a data original se não puder ser convertida
  };

  const filmesVistosNoPeriodo = (visto, periodo) => {
    if (!visto) return 0; // Se o objeto de filmes vistos estiver vazio, retorna 0

    const hoje = new Date(); // Data de hoje
    const hojeFormatado = new Date(
      Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate())
    ); // "Hoje" em UTC, sem horas

    // Primeiro dia do mês
    const primeiroDiaMes = new Date(
      Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), 1)
    );
    const primeiroDiaAno = new Date(Date.UTC(hoje.getUTCFullYear(), 0, 1));

    // Primeiro dia da semana (Domingo)
    const primeiroDiaSemana = new Date(hoje);
    primeiroDiaSemana.setDate(hoje.getDate() - hoje.getDay()); // Domingo da semana atual

    // Sábado da semana atual
    const ultimoDiaSemana = new Date(primeiroDiaSemana);
    ultimoDiaSemana.setDate(primeiroDiaSemana.getDate() + 6);

    let contagem = 0;

    for (const filmeId in visto) {
      const filme = visto[filmeId];
      const dataFilme = normalizeDateToUTC(filme.data); // Normaliza a data do filme para UTC
      const dataFilmeFormatada = new Date(
        Date.UTC(
          dataFilme.getUTCFullYear(),
          dataFilme.getUTCMonth(),
          dataFilme.getUTCDate()
        )
      ); // Normaliza para o início do dia em UTC

      // Verifica o período
      if (
        periodo === "mes" &&
        dataFilmeFormatada >= primeiroDiaMes &&
        dataFilmeFormatada <= hojeFormatado
      ) {
        contagem++;
      }

      if (
        periodo === "ano" &&
        dataFilmeFormatada >= primeiroDiaAno &&
        dataFilmeFormatada <= hojeFormatado
      ) {
        contagem++;
      }

      if (
        periodo === "semana" &&
        dataFilmeFormatada >= primeiroDiaSemana &&
        dataFilmeFormatada <= ultimoDiaSemana
      ) {
        contagem++;
      }

      if (
        periodo === "dia" &&
        dataFilmeFormatada.getUTCFullYear() ===
          hojeFormatado.getUTCFullYear() &&
        dataFilmeFormatada.getUTCMonth() === hojeFormatado.getUTCMonth() &&
        dataFilmeFormatada.getUTCDate() === hojeFormatado.getUTCDate()
      ) {
        contagem++;
      }
    }

    return contagem;
  };

  // Calcula os filmes vistos no período
  const filmesVistosCountMes = userData
    ? filmesVistosNoPeriodo(userData.visto, "mes")
    : 0;
  const filmesVistosCountAno = userData
    ? filmesVistosNoPeriodo(userData.visto, "ano")
    : 0;
  const filmesVistosCountSemana = userData
    ? filmesVistosNoPeriodo(userData.visto, "semana")
    : 0;
  const filmesVistosCountDia = userData
    ? filmesVistosNoPeriodo(userData.visto, "dia")
    : 0;

  // Função para calcular a porcentagem
  const calcularPorcentagem = (metaQuantidade, filmesVistosCount) => {
    if (!metaQuantidade || metaQuantidade === 0) return 0; // Evita divisão por zero
    return Math.min((filmesVistosCount / metaQuantidade) * 100, 100); // Limita a 100% no caso de ultrapassar
  };

  // Paleta de cores
  const colorPalette = [
    "#7D7AFF",
    "#70D7FF",
    "#2BA8E2",
    "#DA8FFF",
    "#FAFAFA",
    "#39C65D",
    "#F2C71C",
    "#FF6961",
    "#9694FF",
    "#8ADEFF",
    "#5CAAFF",
    "#E2A8FF",
    "#EDEDED",
    "#8B8B8E",
    "#4DCB6D",
    "#F4D03E",
    "#FF817A",
    "#AFADFF",
    "#A3E5FF",
    "#75B8FF",
    "#EBC2FF",
    "#E0E0E0",
    "#98989A",
    "#61D17D",
    "#F7DC6E",
    "#FF9994",
  ];

  // Função de remover meta
  const removerMeta = async (metaId) => {
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      // Filtra as metas localmente antes de atualizar no Firebase
      const novasMetas = userData.metas.filter((meta) => meta.id !== metaId);

      // Atualiza o Firestore
      await updateDoc(userRef, { metas: novasMetas });

      // Atualiza o estado local
      setUserData((prevData) => ({
        ...prevData,
        metas: novasMetas,
      }));

      console.log(`Meta com ID ${metaId} removida com sucesso!`);
      setModalAberto(""); // Fecha o modal após excluir
    } catch (error) {
      console.error("Erro ao remover meta do Firebase:", error);
    }
  };

  // Função para abrir o modal de exclusão
  const abrirModalDeletar = (metaId) => {
    setMetaParaDeletar(metaId); // Armazena o ID da meta
    setModalAberto("deletar-metas"); // Abre o modal
  };

  const ordenaMetasPorPeriodo = (metas) => {
    const ordem = ["ano", "mes", "semana", "dia"]; // Define a ordem desejada

    return metas.sort((a, b) => {
      return ordem.indexOf(a.periodo) - ordem.indexOf(b.periodo);
    });
  };

  // Dentro da renderização, antes de mapear as metas:
  const metasOrdenadas = userData?.metas
    ? ordenaMetasPorPeriodo(userData.metas)
    : [];

  // Função para calcular a porcentagem de cada meta
  const metasComPorcentagem = metasOrdenadas.map((meta) => {
    const filmesVistosCount =
      meta.periodo === "mes"
        ? filmesVistosCountMes
        : meta.periodo === "ano"
        ? filmesVistosCountAno
        : meta.periodo === "semana"
        ? filmesVistosCountSemana
        : meta.periodo === "dia"
        ? filmesVistosCountDia
        : 0;

    const porcentagem = calcularPorcentagem(meta.quantidade, filmesVistosCount);
    return { ...meta, porcentagem };
  });

  // Ordena as metas por porcentagem (maior para menor)
  const metasMaisProximas = metasComPorcentagem
    .sort((a, b) => b.porcentagem - a.porcentagem)
    .slice(0, 3);

  if (loading || !userData) return <div>Carregando...</div>;

  return (
    <div className={styles.ContGraficosDatas}>
      <div className={styles.GraficosDatas}>
        <div className={styles.headerMetas}>
          <div className={styles.contMetas}>
            <div className={styles.tituloMetas}>
              <h1>Metas</h1>
              <p>
                {userData && userData.metas
                  ? `${userData.metas.length} criada(s)`
                  : "0 criada(s)"}
              </p>
            </div>

            <div className={styles.headerGrafico}>
              {userData && userData.metas && userData.metas.length > 0 && (
                <div className={styles.verTodas}>
                  <button onClick={() => setModalAberto("ver-todas")}>
                    <p>Ver todas</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        {metasMaisProximas.length > 0 ? (
          <div className={styles.RelacaoMes}>
            <ul>
              {metasMaisProximas.map((meta, index) => {
                const filmesVistosCount =
                  meta.periodo === "mes"
                    ? filmesVistosCountMes
                    : meta.periodo === "ano"
                    ? filmesVistosCountAno
                    : meta.periodo === "semana"
                    ? filmesVistosCountSemana
                    : meta.periodo === "dia"
                    ? filmesVistosCountDia
                    : 0;

                const porcentagem = meta.porcentagem;

                // Verifica se a meta foi concluída
                const backgroundColor =
                  filmesVistosCount >= meta.quantidade
                    ? "#33FF88" // Cor preta para metas concluídas
                    : colorPalette[index % colorPalette.length]; // Cor normal da paleta

                return (
                  <li key={index}>
                    <div className={styles.GraficoMetas}>
                      <div className={styles.periodoHeader}>
                        <div className={styles.iconeDescricao}>
                          <div className={styles.descricaoMeta}>
                            <span>{meta.periodo}</span>
                          </div>
                        </div>
                        <div className={styles.contQuantidade}>
                          <div className={styles.quantidadeComparador}>
                            {meta.quantidade && <span>{meta.quantidade}</span>}
                            <span>de</span>
                            <span>{filmesVistosCount}</span>
                            <span>vistos</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={styles.graficoVertical}
                        style={{
                          backgroundColor: `${backgroundColor}50`, // "50" é a opacidade em hexadecimal (meio transparente)
                        }}
                      >
                        <div
                          className={styles.graficoPreenchido}
                          style={{
                            width: `${porcentagem}%`, // Aplica a porcentagem no width
                            backgroundColor: backgroundColor, // Aplica a cor de fundo dinâmica
                          }}
                        >
                          <div className={styles.estrado}>
                            <img src="/icones/estrado-vertical.svg" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.botaoDeletar}>
                      <button onClick={() => abrirModalDeletar(meta.id)}>
                        <img src="icones/deletar.svg" alt="Deletar" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className={styles.metasControle}>
              <button onClick={() => setModalAberto("adicionar-metas")}>
                <img src="icones/add-mobile.svg" alt="Adicionar" />
                <p>Adicionar meta</p>
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.blankMetas}>
            <p>Bora adicionar algumas metas?</p>
            <button onClick={() => setModalAberto("adicionar-metas")}>
              <img src="icones/add-mobile.svg" alt="Adicionar" />
              <p>Adicionar meta</p>
            </button>
          </div>
        )}
      </div>

      {modalAberto === "adicionar-metas" && (
        <AdicionarMeta
          onClose={() => setModalAberto(null)}
          nomeBotao={"Adicionar Meta"}
        />
      )}

      {modalAberto === "deletar-metas" && (
        <DeletarMetas
          meta={userData.metas.find((meta) => meta.id === metaParaDeletar)}
          onClose={() => setModalAberto(null)}
          onConfirmar={() => removerMeta(metaParaDeletar)}
        />
      )}

      {modalAberto === "ver-todas" && (
        <VerTodas
          metas={metasOrdenadas}
          filmesVistosCountDia={filmesVistosCountDia}
          filmesVistosCountSemana={filmesVistosCountSemana}
          filmesVistosCountMes={filmesVistosCountMes}
          filmesVistosCountAno={filmesVistosCountAno}
          colorPalette={colorPalette} // Passando a colorPalette como prop
          onClose={() => setModalAberto(null)}
        />
      )}
    </div>
  );
};

export default GraficoMetasMobile;
