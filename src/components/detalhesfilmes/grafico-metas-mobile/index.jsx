import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { updateDoc, arrayRemove } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import AdicionarMeta from "@/components/modais/adicionar-metas";
import AlterarMeta from "@/components/modais/alterar-metas";
import DeletarMetas from "@/components/modais/deletar-metas";

const GraficoMetasMobile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState("");
  const [metaParaDeletar, setMetaParaDeletar] = useState(null);
  const [metaSelecionada, setMetaSelecionada] = useState(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);
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
    ? userData.metas.sort((a, b) => {
        const ordem = ["ano", "mes", "semana", "dia"];
        return ordem.indexOf(a.periodo) - ordem.indexOf(b.periodo);
      })
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

  const atualizarMetaLocal = (metaAtualizada) => {
    setUserData((prevData) => {
      const metasAtualizadas = prevData.metas.map((meta) =>
        meta.id === metaAtualizada.id ? metaAtualizada : meta
      );
      return { ...prevData, metas: metasAtualizadas };
    });
  };

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
              <div className={styles.verTodas}>
                {userData && userData.metas && userData.metas.length >= 4 && (
                  <button onClick={() => setMostrarTodas(!mostrarTodas)}>
                    <p>{mostrarTodas ? "Ver menos" : "Ver todas"}</p>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fanterior.svg?alt=media&token=9564b079-3d4f-4b07-922d-1275ef619523"
                      alt="Seta"
                      className={
                        mostrarTodas ? styles.setaRotacionada : styles.seta
                      }
                    />
                  </button>
                )}
              </div>
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
                    <div
                      className={styles.GraficoMetas}
                      onClick={() => {
                        setMetaSelecionada(meta); // Define a meta atual no estado
                        setModalAberto("alterar-metas"); // Abre o modal
                      }}
                    >
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
                            <img src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrado-vertical.svg?alt=media&token=4696e9a1-5624-4682-844a-b74f2b8c2648" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.botaoDeletar}>
                      <button onClick={() => abrirModalDeletar(meta.id)}>
                        <img
                          src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fdeletar.svg?alt=media&token=8542c24b-5124-4c10-91ee-a4918550dc92"
                          alt="Deletar"
                        />
                      </button>
                    </div>
                  </li>
                );
              })}

              {mostrarTodas &&
                metasComPorcentagem.slice(3).map((meta, index) => {
                  // A lógica para calcular 'filmesVistosCount' e 'porcentagem' é a mesma para as metas extras
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
                  const backgroundColor =
                    filmesVistosCount >= meta.quantidade
                      ? "#33FF88" // Cor para metas concluídas
                      : colorPalette[(index + 3) % colorPalette.length]; // Cor das metas não concluídas

                  return (
                    <li key={meta.id}>
                      {" "}
                      {/* Usando 'meta.id' para garantir a unicidade da chave */}
                      <div
                        className={styles.GraficoMetas}
                        onClick={() => {
                          setMetaSelecionada(meta); // Define a meta atual no estado
                          setModalAberto("alterar-metas"); // Abre o modal
                        }}
                      >
                        <div className={styles.periodoHeader}>
                          <div className={styles.iconeDescricao}>
                            <div className={styles.descricaoMeta}>
                              <span>{meta.periodo}</span>
                            </div>
                          </div>
                          <div className={styles.contQuantidade}>
                            <div className={styles.quantidadeComparador}>
                              {meta.quantidade && (
                                <span>{meta.quantidade}</span>
                              )}
                              <span>de</span>
                              <span>{filmesVistosCount}</span>
                              <span>vistos</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={styles.graficoVertical}
                          style={{
                            backgroundColor: `${backgroundColor}50`, // "50" para opacidade
                          }}
                        >
                          <div
                            className={styles.graficoPreenchido}
                            style={{
                              width: `${porcentagem}%`,
                              backgroundColor: backgroundColor,
                            }}
                          >
                            <div className={styles.estrado}>
                              <img src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Festrado-vertical.svg?alt=media&token=4696e9a1-5624-4682-844a-b74f2b8c2648" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.botaoDeletar}>
                        <button onClick={() => abrirModalDeletar(meta.id)}>
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fdeletar.svg?alt=media&token=8542c24b-5124-4c10-91ee-a4918550dc92"
                            alt="Deletar"
                          />
                        </button>
                      </div>
                    </li>
                  );
                })}
            </ul>

            <div className={styles.metasControle}>
              <button onClick={() => setModalAberto("adicionar-metas")}>
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fadd-mobile.svg?alt=media&token=fc2e1d5b-d9db-44ce-b6c0-9166ee2bfd70"
                  alt="Adicionar"
                />
                <p>Adicionar meta</p>
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.blankMetas}>
            <p>Bora adicionar algumas metas?</p>
            <button onClick={() => setModalAberto("adicionar-metas")}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Fadd-mobile.svg?alt=media&token=fc2e1d5b-d9db-44ce-b6c0-9166ee2bfd70"
                alt="Adicionar"
              />
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

      {modalAberto === "alterar-metas" && (
        <AlterarMeta
          onClose={() => setModalAberto(null)}
          meta={metaSelecionada}
          onAlterarMeta={atualizarMetaLocal} // Passa a função corretamente
        />
      )}
    </div>
  );
};

export default GraficoMetasMobile;
