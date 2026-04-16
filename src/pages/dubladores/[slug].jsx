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
    const doc = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .find((d) => toSlug(d.nomeArtistico ?? d.nomeCompleto ?? d.id) === slug);

    if (!doc) return { notFound: true };

    // Firestore Timestamps não são serializáveis — converte para string
    const serializable = JSON.parse(JSON.stringify(doc));

    return { props: { dublador: serializable } };
  } catch (err) {
    console.error(err);
    return { notFound: true };
  }
}

export default function DubladorPage({ dublador }) {
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

      <main className={styles.container}>
        <Breadcrumb
          items={[
            { href: "/dubladores", label: "Dubladores" },
            { href: null, label: nomeArtistico || nomeCompleto },
          ]}
        />

        {/* ── Foto Status ─────────────────────────────────── */}
        <div className={styles.sectionPage}>
          <div className={styles.article} style={{ alignSelf: "stretch" }}>
            <div className={styles.containerColumn}>
              <div className={styles.imageDublador}>
                {imagemUrl && (
                  <img
                    src={imagemUrl}
                    alt={nomeArtistico}
                    width={120}
                    height={120}
                    unoptimized
                  />
                )}
              </div>
              {ativoNaDublagem && (
                <Badge
                  label={ativoNaDublagem}
                  variant="outline"
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

          {/* ── Identidade ─────────────────────────────────── */}

          <div
            className={styles.article}
            style={{ width: "100%", alignSelf: "stretch" }}
          >
            <div className={styles.containerColumn}>
              <div className={styles.nomeArtisticoRedes}>
                <div className={styles.nomeArtistico}>
                  <h1>{nomeArtistico}</h1>
                </div>

                <div className={styles.nomeRedes}>
                  {links.filter((l) => l.url?.trim()).length > 0 && (
                    <ul>
                      {links
                        .filter((l) => l.url?.trim())
                        .map((l, i) => (
                          <li key={i}>
                            <a
                              href={l.url}
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
                {nomeCompleto && nomeCompleto !== nomeArtistico && (
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
              <span>Estado natal</span>

              {/* ── Ocupações ──────────────────────────────────── */}
              {ocupacoes.length > 0 && (
                <div className={styles.ocupacoes}>
                  {ocupacoes.map((o, i) => (
                    <Badge key={i} label={o} variant="soft" bg="--bg-base" />
                  ))}
                </div>
              )}
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

        {/* ── Familiares ─────────────────────────────────── */}
        {familiares.filter((f) => f.nome?.trim()).length > 0 && (
          <section>
            <h2>Familiares</h2>
            <ul>
              {familiares
                .filter((f) => f.nome?.trim())
                .map((f, i) => (
                  <li key={i}>
                    {f.nome} ({f.parentesco})
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* ── Links ──────────────────────────────────────── */}
      </main>
    </>
  );
}
