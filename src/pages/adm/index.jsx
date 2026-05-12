import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import { collection, getDocs } from "firebase/firestore";
import AdmLayout from "@/components/adm/layout";
import AdmNewsIcon from "@/components/icons/AdmNewsIcon";
import AdmResenhasIcon from "@/components/icons/AdmResenhasIcon";
import PerguntasIcon from "@/components/icons/PerguntasIcon";
import DubladoresIcon from "@/components/icons/DubladoresIcon";
import DublagensIcon from "@/components/icons/DublagensIcon";
import EstudioIcon from "@/components/icons/EstudioIcon";
import styles from "./index.module.scss";

const PERIODOS = [
  { label: "1 dia", dias: 1 },
  { label: "1 semana", dias: 7 },
  { label: "30 dias", dias: 30 },
  { label: "3 meses", dias: 90 },
  { label: "6 meses", dias: 180 },
  { label: "1 ano", dias: 365 },
];

const CARDS = [
  {
    key: "noticias",
    label: "Notícias",
    colecao: "noticias",
    campoData: "dataPublicacao",
    href: "/adm/noticias",
    criarLabel: "Criar notícia",
    criarHref: "/adm/noticias/criar",
    Icon: AdmNewsIcon,
  },
  {
    key: "resenhas",
    label: "Resenhas",
    colecao: "criticas",
    campoData: "dataPublicacao",
    href: "/adm/resenhas",
    criarLabel: "Criar resenha",
    criarHref: "/adm/resenhas/criar",
    Icon: AdmResenhasIcon,
  },
  {
    key: "perguntas",
    label: "Perguntas",
    colecao: "perguntas",
    campoData: "dataCadastro",
    href: "/adm/perguntas",
    criarLabel: "Criar pergunta",
    criarHref: "/adm/perguntas/criar",
    Icon: PerguntasIcon,
  },
  {
    key: "dubladores",
    label: "Dubladores",
    colecao: "dubladores",
    campoData: "dataCadastro",
    href: "/adm/dubladores",
    criarLabel: "Criar dublador",
    criarHref: "/adm/dubladores/criar",
    Icon: DubladoresIcon,
  },
  {
    key: "elencos",
    label: "Elencos",
    colecao: "filmes",
    campoData: "dataCadastro",
    href: "/adm/dublagens",
    criarLabel: "Criar elenco",
    criarHref: "/adm/dublagens/criar",
    Icon: DublagensIcon,
  },
  {
    key: "estudios",
    label: "Estúdios",
    colecao: "estudios",
    campoData: ["dataRascunho", "dataPublicacao"],
    href: "/adm/estudios",
    criarLabel: "Criar estúdio",
    criarHref: "/adm/estudios/criar",
    Icon: EstudioIcon,
  },
];

const calcularPrioridade = (item) => {
  const status = item.status?.toLowerCase();
  if (!status || status === "publicado") return { label: "S/P", nivel: 0 };
  const ref = item.dataRascunho || item.dataPublicacao;
  if (!ref) return { label: "S/P", nivel: 0 };
  const dias = Math.floor((Date.now() - ref.toDate().getTime()) / 86400000);
  if (dias >= 4) return { label: "Alta", nivel: 3 };
  if (dias >= 3) return { label: "Média", nivel: 2 };
  if (dias >= 2) return { label: "Baixa", nivel: 1 };
  return { label: "S/P", nivel: 0 };
};

const PrioridadeBars = ({ nivel }) => (
  <span className={styles.bars} data-nivel={nivel}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <span
        key={i}
        className={`${styles.bar} ${
          (nivel === 1 && i <= 2) ||
          (nivel === 2 && i <= 4) ||
          (nivel === 3 && i <= 6)
            ? styles.barAtivo
            : ""
        }`}
      />
    ))}
  </span>
);

const SECOES_RECENTES = [
  {
    key: "noticias",
    titulo: "Notícias",
    colecao: "noticias",
    criarLabel: "Criar notícia",
    criarHref: "/adm/noticias/criar",
    editarHref: (id) => `/adm/noticias/editar/${id}`,
  },
  {
    key: "resenhas",
    titulo: "Resenhas",
    colecao: "criticas",
    criarLabel: "Criar resenha",
    criarHref: "/adm/resenhas/criar",
    editarHref: (id) => `/adm/resenhas/editar/${id}`,
  },
];

function resolverTimestamp(doc, campoData) {
  const campos = Array.isArray(campoData) ? campoData : [campoData];
  for (const campo of campos) {
    const ts = doc[campo];
    if (!ts) continue;
    return typeof ts.toMillis === "function"
      ? ts.toMillis()
      : new Date(ts).getTime();
  }
  return null;
}

function calcularVariacao(docs, campoData, dias) {
  const agora = Date.now();
  const msperiodo = dias * 86400000;
  const inicioAtual = agora - msperiodo;
  const inicioPrev = inicioAtual - msperiodo;

  let atual = 0;
  let anterior = 0;

  for (const d of docs) {
    const ms = resolverTimestamp(d, campoData);
    if (ms === null) continue;
    if (ms >= inicioAtual) atual++;
    else if (ms >= inicioPrev) anterior++;
  }

  const variacao =
    anterior > 0
      ? Math.round(((atual - anterior) / anterior) * 100)
      : atual > 0
        ? 100
        : 0;

  return { total: docs.length, atual, anterior, variacao };
}

const SetaCima = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M6 9.5V2.5M6 2.5L2.5 6M6 2.5L9.5 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SetaBaixo = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M6 2.5V9.5M6 9.5L9.5 6M6 9.5L2.5 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function AdmDashboard() {
  const router = useRouter();
  const [periodo, setPeriodo] = useState(30);
  const [dados, setDados] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentes, setRecentes] = useState({});

  useEffect(() => {
    const fetchTudo = async () => {
      setLoading(true);
      try {
        const resultados = await Promise.all(
          CARDS.map(async ({ key, colecao, campoData }) => {
            const snap = await getDocs(collection(db, colecao));
            const docs = snap.docs.map((d) => d.data());
            return { key, docs, campoData };
          }),
        );
        const novo = {};
        for (const { key, docs, campoData } of resultados) {
          novo[key] = { docs, campoData };
        }
        setDados(novo);

        const recentesResultados = await Promise.all(
          SECOES_RECENTES.map(async ({ key, colecao }) => {
            const snap = await getDocs(collection(db, colecao));
            const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            const ordenar = (lista) =>
              [...lista]
                .sort((a, b) => {
                  const tA =
                    (a.dataRascunho || a.dataPublicacao)?.toMillis?.() ?? 0;
                  const tB =
                    (b.dataRascunho || b.dataPublicacao)?.toMillis?.() ?? 0;
                  return tB - tA;
                })
                .slice(0, 10);
            return {
              key,
              rascunhos: ordenar(
                docs.filter((d) => d.status?.toLowerCase() === "rascunho"),
              ),
              agendadas: ordenar(
                docs.filter((d) => d.status?.toLowerCase() === "agendado"),
              ),
            };
          }),
        );
        const novoRecentes = {};
        for (const r of recentesResultados) novoRecentes[r.key] = r;
        setRecentes(novoRecentes);
      } finally {
        setLoading(false);
      }
    };
    fetchTudo();
  }, []);

  const periodoLabel =
    PERIODOS.find((p) => p.dias === periodo)?.label ?? "30 dias";

  return (
    <AdmLayout>
      <Head>
        <title>Dashboard — Cameo ADM</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.cabecalho}>
          <h1 className={styles.titulo}>Dashboard</h1>
          <div className={styles.filtros}>
            {PERIODOS.map((p) => (
              <button
                key={p.dias}
                type="button"
                className={`${styles.filtroBtnItem} ${periodo === p.dias ? styles.filtroBtnAtivo : ""}`}
                onClick={() => setPeriodo(p.dias)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {CARDS.map(({ key, label, criarLabel, criarHref, Icon }) => {
            const info = dados[key];
            const stats =
              info && !loading
                ? calcularVariacao(info.docs, info.campoData, periodo)
                : null;

            const positivo = !stats || stats.variacao >= 0;

            return (
              <div key={key} className={styles.card}>
                <div className={styles.cardTopo}>
                  <div className={styles.cardNomeWrapper}>
                    <span className={styles.cardIcone}>
                      <Icon size={18} color="var(--text-sub)" />
                    </span>
                    <span className={styles.cardNome}>{label}</span>
                    <span className={styles.cardInfo}>ⓘ</span>
                  </div>
                  <span className={styles.cardPeriodo}>
                    Últimos {periodoLabel}
                  </span>
                </div>

                <div className={styles.cardCorpo}>
                  <div className={styles.cardEsquerda}>
                    <span className={styles.cardNumero}>
                      {loading ? "—" : (stats?.atual ?? 0)}
                    </span>
                    <span
                      className={`${styles.badge} ${positivo ? styles.badgePositivo : styles.badgeNegativo}`}
                    >
                      {loading
                        ? "—"
                        : `${positivo ? "+" : ""}${stats?.variacao ?? 0}%`}
                      {!loading && (positivo ? <SetaCima /> : <SetaBaixo />)}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.cardBtn}
                    onClick={() => router.push(criarHref)}
                  >
                    {criarLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.secoes}>
          {SECOES_RECENTES.map(
            ({ key, titulo, criarLabel, criarHref, editarHref }) => {
              const info = recentes[key];
              return (
                <div key={key} className={styles.secao}>
                  <h2 className={styles.secaoTitulo}>{titulo}</h2>
                  <div className={styles.secaoGrid}>
                    {[
                      { label: "Rascunhos", itens: info?.rascunhos ?? [] },
                      { label: "Agendadas", itens: info?.agendadas ?? [] },
                    ].map(({ label, itens }) => (
                      <div key={label} className={styles.secaoColuna}>
                        <div className={styles.secaoCabecalho}>
                          <div className={styles.topoSubtitulo}>
                            <span className={styles.secaoSubtitulo}>
                              {titulo}
                            </span>
                            <span className={styles.secaoSubtituloQuantidade}>
                              {label} ({itens.length})
                            </span>
                          </div>
                          <button
                            type="button"
                            className={styles.cardBtn}
                            onClick={() => router.push(criarHref)}
                          >
                            {criarLabel}
                          </button>
                        </div>
                        <div className={styles.secaoTabela}>
                          <div className={styles.secaoTabelaHeader}>
                            <span>Título</span>
                            <span>Prioridade</span>
                          </div>
                          {loading ? (
                            <span className={styles.secaoVazio}>
                              Carregando...
                            </span>
                          ) : itens.length === 0 ? (
                            <span className={styles.secaoVazio}>
                              Nenhum item
                            </span>
                          ) : (
                            itens.map((item) => {
                              const { label: pLabel, nivel } =
                                calcularPrioridade(item);
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  className={styles.secaoItem}
                                  onClick={() =>
                                    router.push(editarHref(item.id))
                                  }
                                >
                                  <span className={styles.secaoItemTitulo}>
                                    {item.titulo || "—"}
                                  </span>
                                  {nivel > 0 && (
                                    <span
                                      className={styles.secaoItemPrioridade}
                                    >
                                      <PrioridadeBars nivel={nivel} />
                                      <span>{pLabel}</span>
                                    </span>
                                  )}
                                </button>
                              );
                            })
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>
    </AdmLayout>
  );
}
