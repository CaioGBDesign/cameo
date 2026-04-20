import { useState } from "react";
import { useIsMobile } from "@/components/DeviceProvider";
import Head from "next/head";
import { db } from "@/services/firebaseConection";
import { collection, getDocs } from "firebase/firestore";
import { toSlug } from "@/utils/slug";
import Header from "@/components/Header";
import Breadcrumb from "@/components/breadcrumb";
import Badge from "@/components/badge";
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
import { gerarUrlRede } from "@/utils/redes";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import SectionCard from "@/components/section-card";
import CardPersonagem from "@/components/card-personagem";
import Footer from "@/components/Footer";
import ModalDetalhesFilme from "@/components/modais/modal-detalhes-filme";
import DubladorBg from "@/components/dublador-bg";
import ModalViews from "@/components/modais/modal-views";
import AvatarDublador from "@/components/avatar-dublador";
import styles from "./perfil.module.scss";

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

export async function getServerSideProps({ params }) {
  const { slug } = params;

  try {
    const snap = await getDocs(collection(db, "dubladores"));
    const dubDoc = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .find((d) => toSlug(d.nomeArtistico ?? d.nomeCompleto ?? d.id) === slug);

    if (!dubDoc) return { notFound: true };

    const serializable = JSON.parse(JSON.stringify(dubDoc));

    // ── Dublagens em que este dublador participa ───────────────────────
    const filmesSnap = await getDocs(collection(db, "filmes"));
    const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    const dublagens = (
      await Promise.all(
        filmesSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter(
            (f) =>
              Array.isArray(f.dubladores) &&
              f.dubladores.some((e) => e.idDublador === dubDoc.id),
          )
          .map(async (f) => {
            const entrada = f.dubladores.find(
              (e) => e.idDublador === dubDoc.id,
            );
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
              personagem: entrada?.personagem ?? "",
              atorOriginal: entrada?.atorOriginal ?? "",
              posterPath,
              backdropPath,
              anoLancamento,
            };
          }),
      )
    ).sort((a, b) =>
      (b.anoLancamento ?? "0").localeCompare(a.anoLancamento ?? "0"),
    );

    // ── Equipe técnica em que este dublador participa ──────────────────
    const filmes = filmesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const equipeTecnicaFilmes = (
      await Promise.all(
        filmes
          .filter(
            (f) =>
              Array.isArray(f.equipeTecnica) &&
              f.equipeTecnica.some((et) =>
                et.profissionais?.some((p) => p.idPessoa === dubDoc.id),
              ),
          )
          .map(async (f) => {
            const funcoes = f.equipeTecnica
              .filter((et) =>
                et.profissionais?.some((p) => p.idPessoa === dubDoc.id),
              )
              .map((et) => et.funcao);
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
              funcoes,
              posterPath,
              backdropPath,
              anoLancamento,
            };
          }),
      )
    ).sort((a, b) =>
      (b.anoLancamento ?? "0").localeCompare(a.anoLancamento ?? "0"),
    );

    return {
      props: { dublador: serializable, dublagens, equipeTecnicaFilmes },
    };
  } catch (err) {
    console.error(err);
    return { notFound: true };
  }
}

export default function DubladorPage({
  dublador,
  dublagens = [],
  equipeTecnicaFilmes = [],
}) {
  const isMobile = useIsMobile();
  const [modalDetalhes, setModalDetalhes] = useState({
    aberto: false,
    index: 0,
  });
  const [modalAvatar, setModalAvatar] = useState(false);

  const bgAleatorio = useState(() => {
    const com = [...dublagens, ...equipeTecnicaFilmes].filter(
      (d) => d.backdropPath || d.posterPath,
    );
    if (!com.length) return null;
    return com[Math.floor(Math.random() * com.length)];
  })[0];

  const filmesModal = dublagens.map((d) => ({
    id: d.idFilme,
    title: d.nomeFilme,
    poster_path: d.posterPath,
    backdrop_path: d.backdropPath,
  }));
  const {
    nomeCompleto,
    nomeArtistico,
    imagemUrl,
    dataNascimento,
    anoInicioDublagem,
    nacionalidade,
    estadoNatal,
    ondeAtua = [],
    ativoNaDublagem,
    bio,
    ocupacoes = [],
    familiares = [],
    links = [],
  } = dublador;

  function formatarDataNascimento(dataIso) {
    if (!dataIso) return null;
    const [ano, mes, dia] = dataIso.split("-");
    const meses = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ];
    return `${parseInt(dia)} de ${meses[parseInt(mes) - 1]} ${ano}`;
  }

  function anosDesde(dataIso) {
    if (!dataIso) return null;
    return Math.floor(
      (new Date() - new Date(dataIso)) / (1000 * 60 * 60 * 24 * 365.25),
    );
  }

  const idade = anosDesde(dataNascimento);
  const anosAtividade = anosDesde(anoInicioDublagem);

  return (
    <>
      <Head>
        <title>{nomeArtistico || nomeCompleto} — Cameo</title>
        <meta
          name="description"
          content={`Conheça ${nomeArtistico || nomeCompleto}, dublador(a) no Cameo.`}
        />
      </Head>
      <Header />

      {bgAleatorio && (
        <DubladorBg
          backdrop={bgAleatorio.backdropPath}
          poster={bgAleatorio.posterPath}
          alt={nomeArtistico || nomeCompleto}
        />
      )}

      <main className={styles.page}>
        <Breadcrumb
          items={[
            { href: "/dubladores", label: "Dubladores" },
            { href: null, label: nomeArtistico || nomeCompleto },
          ]}
        />

        <div className={styles.container}>
          {/* ── Foto Status ─────────────────────────────────── */}
          <div className={styles.sectionPage}>
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
                  alt={nomeArtistico}
                  size={100}
                  onClick={imagemUrl ? () => setModalAvatar(true) : undefined}
                />

                <div className={styles.nomeArtisticoStatus}>
                  {isMobile && (
                    <div className={styles.nomeArtistico}>
                      <h1>{nomeArtistico}</h1>
                    </div>
                  )}

                  {ativoNaDublagem && (
                    <Badge
                      label={ativoNaDublagem}
                      variant="outline"
                      width="100%"
                      borda={
                        ativoNaDublagem === "Falecido"
                          ? "--primitive-roxo-07"
                          : ativoNaDublagem === "Ativo"
                            ? "--primitive-azul-01"
                            : "--primitive-erro-01"
                      }
                      color={
                        ativoNaDublagem === "Falecido"
                          ? "--primitive-roxo-07"
                          : ativoNaDublagem === "Ativo"
                            ? "--primitive-azul-01"
                            : "--primitive-erro-01"
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* ── Identidade ─────────────────────────────────── */}

            <div
              className={styles.article}
              style={{
                alignSelf: "stretch",
                background:
                  "linear-gradient(117deg, rgba(243, 20, 251, 0.05) 0%, rgba(22, 18, 22, 0.10) 40.47%), rgba(22, 18, 22, 0.20)",
              }}
            >
              <div className={styles.containerColumn}>
                <div className={styles.nomeArtisticoRedes}>
                  {!isMobile && (
                    <div className={styles.nomeArtistico}>
                      <h1>{nomeArtistico}</h1>
                    </div>
                  )}

                  <div className={styles.nomeRedes}>
                    {links.filter((l) =>
                      (l.url || gerarUrlRede(l.tipo, l.usuario))?.trim(),
                    ).length > 0 && (
                      <ul>
                        {links
                          .filter((l) =>
                            (l.url || gerarUrlRede(l.tipo, l.usuario))?.trim(),
                          )
                          .map((l, i) => (
                            <li key={i} data-rede={l.tipo?.toLowerCase()}>
                              <a
                                href={l.url || gerarUrlRede(l.tipo, l.usuario)}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {redeIcone(l.tipo)}
                              </a>
                            </li>
                          ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* ── Identidade completa ─────────────────────────────────── */}

                <div className={styles.detalhesDublador}>
                  {nomeCompleto && (
                    <div className={styles.detalhesItem}>
                      <span>Nome completo</span>
                      <p>{nomeCompleto}</p>
                    </div>
                  )}

                  {ondeAtua.length > 0 && (
                    <div className={styles.detalhesItem}>
                      <span>Onde atua</span>
                      <ul>
                        {ondeAtua.map((e, i) => (
                          <li key={i}>
                            {e}
                            {i < ondeAtua.length - 1 ? "," : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {idade !== null && ativoNaDublagem !== "Falecido" && (
                    <div className={styles.detalhesItem}>
                      <span>Idade</span>
                      <p>{idade} anos</p>
                    </div>
                  )}

                  {dataNascimento && (
                    <div className={styles.detalhesItem}>
                      <span>Data de nascimento</span>
                      <p>{formatarDataNascimento(dataNascimento)}</p>
                    </div>
                  )}

                  {anosAtividade !== null && (
                    <div className={styles.detalhesItem}>
                      <span>Anos em atividade</span>
                      <p>{anosAtividade} anos</p>
                    </div>
                  )}

                  {anoInicioDublagem && (
                    <div className={styles.detalhesItem}>
                      <span>Dublando desde</span>
                      <p>{anoInicioDublagem}</p>
                    </div>
                  )}

                  {nacionalidade && (
                    <div className={styles.detalhesItem}>
                      <span>Nacionalidade</span>
                      <p>{nacionalidade}</p>
                    </div>
                  )}

                  {estadoNatal && (
                    <div className={styles.detalhesItem}>
                      <span>Estado natal</span>
                      <p>{estadoNatal}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Ocupações e familiares ──────────────────────────────────── */}

          <div className={styles.sectionPage}>
            <div className={styles.article} style={{ alignSelf: "stretch" }}>
              <div
                className={styles.containerColumn}
                style={{ gap: "var(--space-lg)", alignItems: "start" }}
              >
                <span>Ocupações</span>

                {/* ── Ocupações ──────────────────────────────────── */}
                {ocupacoes.length > 0 && (
                  <div className={styles.ocupacoes}>
                    {ocupacoes.map((o, i) => (
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

            {/* ── Familiares ─────────────────────────────────── */}
            {familiares.filter((f) => f.nome?.trim()).length > 0 && (
              <div className={styles.article}>
                <div
                  className={styles.containerColumn}
                  style={{ gap: "var(--space-lg)", alignItems: "start" }}
                >
                  <span>Familiares</span>

                  <div className={styles.contentFamiliares}>
                    <ul>
                      {familiares
                        .filter((f) => f.nome?.trim())
                        .sort((a, b) => {
                          if (!!b.idDublador - !!a.idDublador)
                            return !!b.idDublador - !!a.idDublador;
                          return a.nome.localeCompare(b.nome, "pt-BR");
                        })
                        .map((f, i) => (
                          <li
                            key={i}
                            className={
                              f.idDublador ? styles.familiarComLink : undefined
                            }
                          >
                            {f.idDublador && (
                              <a
                                href={`/dubladores/${toSlug(f.nome)}`}
                                aria-label={f.nome}
                              />
                            )}
                            <span>{f.parentesco}</span>
                            <p>{f.nome}</p>
                            {f.idDublador && (
                              <ArrowRightIcon size={16} color="currentColor" />
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Dublagens ──────────────────────────────────────── */}
          {dublagens.length > 0 && (
            <SectionCard
              title="Dublagens"
              count={dublagens.length}
              bg="#16121612"
              style={{
                background: "rgba(22, 18, 22, 0.20)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className={styles.dublagensGrid}>
                {dublagens.map((d, idx) => (
                  <CardPersonagem
                    key={d.id}
                    posterPath={d.posterPath}
                    nomeFilme={d.nomeFilme}
                    personagem={d.personagem}
                    onClick={() =>
                      setModalDetalhes({ aberto: true, index: idx })
                    }
                  />
                ))}
              </div>
            </SectionCard>
          )}
          {equipeTecnicaFilmes.length > 0 && (
            <SectionCard
              title="Equipe técnica"
              count={equipeTecnicaFilmes.length}
              style={{
                background: "rgba(22, 18, 22, 0.20)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className={styles.dublagensGrid}>
                {equipeTecnicaFilmes.map((d) => (
                  <CardPersonagem
                    key={d.id}
                    posterPath={d.posterPath}
                    nomeFilme={d.nomeFilme}
                    personagem={d.funcoes.join(", ")}
                  />
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        {modalAvatar && imagemUrl && (
          <ModalViews
            title={nomeArtistico || nomeCompleto}
            onClose={() => setModalAvatar(false)}
            activeView={0}
            views={[
              {
                content: (
                  <div className={styles.contentImg}>
                    <div className={styles.boxImg}>
                      <img src={imagemUrl} alt={nomeArtistico} unoptimized />
                    </div>
                  </div>
                ),
              },
            ]}
          />
        )}

        {modalDetalhes.aberto && (
          <ModalDetalhesFilme
            filmes={filmesModal}
            indexInicial={modalDetalhes.index}
            onClose={() => setModalDetalhes({ aberto: false, index: 0 })}
          />
        )}
      </main>
      <Footer />
    </>
  );
}
