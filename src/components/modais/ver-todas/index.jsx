import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import HeaderModal from "@/components/modais/header-modais";
import { getAuth } from "firebase/auth"; // Importando o Firebase Auth
import { doc, updateDoc } from "firebase/firestore";
import { db } from "firebase/firestore";

const VerTodas = ({
  metas,
  filmesVistosCountDia,
  filmesVistosCountSemana,
  filmesVistosCountMes,
  filmesVistosCountAno,
  colorPalette, // Recebendo a colorPalette via props
  onClose,
}) => {
  const [userData, setUserData] = useState(null); // Estado do usuário
  const [user, setUser] = useState(null); // Estado para armazenar o usuário autenticado

  useEffect(() => {
    const auth = getAuth(); // Obter a instância de autenticação
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Usuário autenticado, obtendo os dados do usuário
        setUser(user);
        // Aqui você pode buscar os dados do usuário no Firestore, se necessário
        // Exemplo: const userDoc = await getDoc(doc(db, "users", user.uid));
      } else {
        // Usuário não autenticado
        setUser(null);
      }
    });

    // Limpar o listener quando o componente for desmontado
    return () => unsubscribe();
  }, []);

  // Função de remover meta
  const removerMeta = async (metaId) => {
    if (!user) {
      console.error("Usuário não autenticado");
      return;
    }

    try {
      // A referência correta para o documento do usuário
      const userRef = doc(db, "users", user.uid);

      // Obter as metas atuais do usuário do estado local
      const novasMetas = userData.metas.filter((meta) => meta.id !== metaId);

      // Atualizar as metas no Firestore
      await updateDoc(userRef, { metas: novasMetas });

      // Atualizar o estado local
      setUserData((prevData) => ({
        ...prevData,
        metas: novasMetas,
      }));

      console.log(`Meta com ID ${metaId} removida com sucesso!`);
    } catch (error) {
      console.error("Erro ao remover meta do Firebase:", error);
    }
  };

  const metasCount = metas.length; // Conta o número de metas
  let height = 50; // Valor padrão de altura para 1 meta
  if (metasCount === 2) {
    height = 120;
  } else if (metasCount === 3) {
    height = 240;
  } else if (metasCount >= 4) {
    height = 350; // Limite máximo
  }

  return (
    <div className={styles.verTodas}>
      <div className={styles.contVerTodas}>
        <div className={styles.GraficosDatas}>
          <HeaderModal onClose={onClose} titulo={"Todas as metas"} />

          <div className={styles.RelacaoMes}>
            <ul>
              {metas.map((meta, index) => {
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

                // Verifica se a meta foi concluída
                const backgroundColor =
                  filmesVistosCount >= meta.quantidade
                    ? "#33FF88" // Cor para metas concluídas
                    : colorPalette[index % colorPalette.length]; // Usando a paleta de cores

                return (
                  <li key={meta.id}>
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
                          backgroundColor: `${backgroundColor}50`, // Opacidade de 50%
                        }}
                      >
                        <div
                          className={styles.graficoPreenchido}
                          style={{
                            width: `${
                              (filmesVistosCount / meta.quantidade) * 100
                            }%`,
                            backgroundColor: backgroundColor,
                          }}
                        >
                          <div className={styles.estrado}>
                            <img
                              src="/icones/estrado-vertical.svg"
                              alt="Estrado"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.botaoDeletar}>
                      <button onClick={() => removerMeta(meta.id)}>
                        <img src="icones/deletar.svg" alt="Deletar" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerTodas;
