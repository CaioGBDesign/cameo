import { useRouter } from "next/router";
import { useIsMobile } from "@/components/DeviceProvider";
import { useEffect, useState } from "react";
import Head from "next/head";
import { db } from "@/services/firebaseConection";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import Header from "@/components/Header";
import Breadcrumb from "@/components/breadcrumb";
import SectionCard from "@/components/section-card";
import CardPersonagem from "@/components/card-personagem";
import Badge from "@/components/badge";
import Loading from "@/components/loading";
import AvatarDublador from "@/components/avatar-dublador";
import InstagramIcon from "@/components/icons/InstagramIcon";
import YoutubeIcon from "@/components/icons/YoutubeIcon";
import TiktokIcon from "@/components/icons/TiktokIcon";
import IMDBIcon from "@/components/icons/IMDBIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import XIcon from "@/components/icons/XIcon";
import BlueSkyIcon from "@/components/icons/BlueSkyIcon";
import TwitchIcon from "@/components/icons/TwitchIcon";
import LinktreeIcon from "@/components/icons/LinktreeIcon";
import ThreadsIcon from "@/components/icons/ThreadsIcon";
import GlobeIcon from "@/components/icons/GlobeIcon";
import ModalViews from "@/components/modais/modal-views";
import { gerarUrlRede } from "@/utils/redes";
import styles from "./[id].module.scss";

const REDE_ICONE_MAP = {
  instagram: <InstagramIcon size={24} color="currentColor" />,
  youtube: <YoutubeIcon size={24} color="currentColor" />,
  tiktok: <TiktokIcon size={24} color="currentColor" />,
  imdb: <IMDBIcon size={24} color="currentColor" />,
  facebook: <FacebookIcon size={24} color="currentColor" />,
  x: <XIcon size={24} color="currentColor" />,
  twitter: <XIcon size={24} color="currentColor" />,
  bluesky: <BlueSkyIcon size={24} color="currentColor" />,
  "blue sky": <BlueSkyIcon size={24} color="currentColor" />,
  twitch: <TwitchIcon size={24} color="currentColor" />,
  linktree: <LinktreeIcon size={24} color="currentColor" />,
  threads: <ThreadsIcon size={24} color="currentColor" />,
  site: <GlobeIcon size={24} color="currentColor" />,
};

function redeIcone(tipo) {
  return REDE_ICONE_MAP[tipo?.toLowerCase()] ?? tipo;
}

function formatarData(data, exibirDataCompleta) {
  if (!data) return null;
  if (exibirDataCompleta) {
    const [a, m, d] = data.split("-");
    return d && m ? `${d}/${m}/${a}` : a;
  }
  return data.split("-")[0] ?? null;
}

export default function EstudioPage() {
  const router = useRouter();
  const { id } = router.query;

  const [estudio, setEstudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const isMobile = useIsMobile();
  const [modalAvatar, setModalAvatar] = useState(false);
  const [filmes, setFilmes] = useState([]);

  useEffect(() => {
    if (!id) return;
    const buscar = async () => {
      try {
        const snap = await getDoc(doc(db, "estudios", id));
        if (snap.exists()) {
          setEstudio({ id: snap.id, ...snap.data() });
        } else {
          setErro("Estúdio não encontrado.");
        }
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar estúdio.");
      } finally {
        setLoading(false);
      }
    };
    buscar();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    getDocs(collection(db, "filmes")).then(async (snap) => {
      const encontrados = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((f) => f.estudioId === id);

      const com = await Promise.all(
        encontrados.map(async (f) => {
          let posterPath = null;
          let backdropPath = null;
          let anoLancamento = null;
          if (f.idFilme && TMDB_KEY) {
            try {
              const res = await fetch(
                `https://api.themoviedb.org/3/movie/${f.idFilme}?api_key=${TMDB_KEY}&language=pt-BR`,
              );
              if (res.ok) {
                const data = await res.json();
                posterPath = data.poster_path ?? null;
                backdropPath = data.backdrop_path ?? null;
                anoLancamento = data.release_date?.slice(0, 4) ?? null;
              }
            } catch {}
          }
          return {
            id: f.id,
            idFilme: f.idFilme ?? null,
            nomeFilme: f.nomeFilme ?? "",
            posterPath,
            backdropPath,
            anoLancamento,
          };
        }),
      );

      setFilmes(
        com.sort((a, b) =>
          (b.anoLancamento ?? "0").localeCompare(a.anoLancamento ?? "0"),
        ),
      );
    });
  }, [id]);

  if (loading) return <Loading />;
  if (erro) return <p>{erro}</p>;
  if (!estudio) return null;

  const {
    nome,
    nomePopular,
    dataNomeacao,
    exibirDataCompleta,
    imagemUrl,
    slogans = [],
    fundacoes = [],
    fundadores = [],
    proprietarios = [],
    redes = [],
    servicos = [],
    ativo,
    endereco = [],
    pais,
    estado,
    cidade,
    bio,
  } = estudio;

  return (
    <>
      <Head>
        <title>{nome || id} — Cameo</title>
      </Head>
      <Header />

      <main className={styles.page}>
        <Breadcrumb
          items={[
            { href: "/estudios", label: "Estúdios de dublagem" },
            { href: null, label: nome },
          ]}
        />

        <div className={styles.container}>
          <div className={styles.sectionPage}>
            {/* ── Foto Status ─────────────────────────────────── */}
            <div
              className={styles.article}
              style={{
                width: "auto",
                background:
                  "linear-gradient(203deg, var(--Rosa-01, rgba(243, 20, 251, 0.05)) 0%, var(--Roxo-06, rgba(22, 18, 22, 0.10)) 100%), rgba(22, 18, 22, 0.20)",
              }}
            >
              <div className={styles.containerColumn}>
                <AvatarDublador
                  src={imagemUrl}
                  alt={nome}
                  size={100}
                  onClick={imagemUrl ? () => setModalAvatar(true) : undefined}
                />

                <div className={styles.nomePopularStatus}>
                  {isMobile && (
                    <div className={styles.nomePopular}>
                      <h1>{nomePopular}</h1>
                    </div>
                  )}

                  <Badge
                    label={ativo ? "Ativo" : "Inativo"}
                    variant="outline"
                    width="100%"
                    borda={
                      ativo ? "--primitive-azul-01" : "--primitive-erro-01"
                    }
                    color={
                      ativo ? "--primitive-azul-01" : "--primitive-erro-01"
                    }
                  />
                </div>
              </div>
            </div>

            {/* ── Dados do estúdio ─────────────────────────────────── */}
            <div
              className={styles.article}
              style={{
                alignSelf: "stretch",
                background:
                  "linear-gradient(117deg, rgba(243, 20, 251, 0.05) 0%, rgba(22, 18, 22, 0.10) 40.47%), rgba(22, 18, 22, 0.20)",
              }}
            >
              <div className={styles.containerColumn}>
                <div className={styles.nomePopularRedes}>
                  {!isMobile && (
                    <div className={styles.nomePopular}>
                      <h1>{nomePopular}</h1>
                    </div>
                  )}

                  <div className={styles.nomeRedes}>
                    {redes.filter((l) =>
                      (l.url || gerarUrlRede(l.rede, l.usuario))?.trim(),
                    ).length > 0 && (
                      <ul>
                        {redes
                          .filter((l) =>
                            (l.url || gerarUrlRede(l.rede, l.usuario))?.trim(),
                          )
                          .map((l, i) => (
                            <li key={i} data-rede={l.rede?.toLowerCase()}>
                              <a
                                href={l.url || gerarUrlRede(l.rede, l.usuario)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {redeIcone(l.rede)}
                              </a>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* ── Dados completos ─────────────────────────────────── */}

                <div className={styles.detalhesEstudio}>
                  {nome && (
                    <div className={styles.detalhesItem}>
                      <span>Nome do estúdio</span>
                      <p>{nome}</p>
                    </div>
                  )}

                  {slogans.length > 0 && (
                    <div className={styles.detalhesItem}>
                      <span>Slogans</span>
                      <ul>
                        {slogans.map((s, i) => (
                          <li key={i}>{s.texto}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {fundacoes.length > 0 && (
                    <div className={styles.detalhesItem}>
                      <span>Fundação</span>
                      <ul>
                        {fundacoes.map((f, i) => (
                          <li key={i}>
                            {f.texto}
                            {f.data && (
                              <span>
                                {" "}
                                — {formatarData(f.data, f.exibirDataCompleta)}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {fundadores.length > 0 && (
                    <div className={styles.detalhesItem}>
                      <span>Fundadores</span>
                      <ul>
                        {fundadores.map((f, i) => (
                          <li key={i}>{f.nome}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {proprietarios.length > 0 && (
                    <div className={styles.detalhesItem}>
                      <span>Proprietários</span>
                      <ul>
                        {proprietarios.map((p, i) => (
                          <li key={i}>
                            {p.imagem?.preview && (
                              <img
                                src={p.imagem.preview}
                                alt={p.nome}
                                width={40}
                                height={40}
                              />
                            )}
                            {p.nome} ({p.tipo})
                            {p.data && (
                              <span>
                                {" "}
                                — desde{" "}
                                {formatarData(p.data, p.exibirDataCompleta)}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Ocupações e endereço ─────────────────────────────────── */}

          <div className={styles.sectionPage}>
            <div className={styles.article} style={{ alignSelf: "stretch" }}>
              <div
                className={styles.containerColumn}
                style={{ gap: "var(--space-lg)", alignItems: "start" }}
              >
                <span>Serviços</span>

                {servicos.length > 0 && (
                  <div className={styles.servicos}>
                    {servicos.map((o, i) => (
                      <Badge
                        key={i}
                        label={o}
                        variant="soft"
                        bg="--bg-overlay"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.article} style={{ alignSelf: "stretch" }}>
              <div
                className={styles.containerColumn}
                style={{ gap: "var(--space-lg)", alignItems: "start" }}
              >
                <div className={styles.detalhesEstudioLocalizacao}>
                  {/* ── Localização ────────────────────────────────── */}
                  {(endereco.length > 0 || pais || estado || cidade) && (
                    <div className={styles.detalhesItem}>
                      <span>Localização</span>
                      <div className={styles.itemEndereco}>
                        {endereco.filter(Boolean).map((e, i) => (
                          <p key={i}>{e}</p>
                        ))}
                        {(cidade || estado || pais) && (
                          <p>
                            {[cidade, estado, pais].filter(Boolean).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bio ────────────────────────────────────────── */}
        {bio && (
          <section>
            <h2>Sobre</h2>
            <div dangerouslySetInnerHTML={{ __html: bio }} />
          </section>
        )}

        {/* ── Filmografia ────────────────────────────────────── */}
        {filmes.length > 0 && (
          <SectionCard
            title="Filmografia"
            count={filmes.length}
            bg="#16121612"
            style={{
              background: "rgba(22, 18, 22, 0.20)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className={styles.filmesGrid}>
              {filmes.map((f) => (
                <CardPersonagem
                  key={f.id}
                  posterPath={f.posterPath}
                  nomeFilme={f.nomeFilme}
                  personagem={f.anoLancamento ?? ""}
                />
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── Modal foto estúdio ──────────────────────────────── */}
        {modalAvatar && imagemUrl && (
          <ModalViews
            title={nomePopular || nome}
            onClose={() => setModalAvatar(false)}
            activeView={0}
            views={[
              {
                content: (
                  <div className={styles.contentImg}>
                    <div className={styles.boxImg}>
                      <img src={imagemUrl} alt={nomePopular} unoptimized />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        )}
      </main>
    </>
  );
}
