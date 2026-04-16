import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import { db } from "@/services/firebaseConection";
import { doc, getDoc } from "firebase/firestore";
import Header from "@/components/Header";
import Breadcrumb from "@/components/breadcrumb";
import Loading from "@/components/loading";
import styles from "@/pages/dubladores/perfil.module.scss";

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
      <Breadcrumb
        items={[
          { href: "/estudios", label: "Estúdios de dublagem" },
          { href: null, label: nome },
        ]}
      />

      <main>
        {/* ── Identidade ─────────────────────────────────── */}
        {imagemUrl && <img src={imagemUrl} alt={nome} width={120} height={120} />}
        <h1>{nome}</h1>
        {nomePopular && <p>Nome popular: {nomePopular}</p>}
        {dataNomeacao && (
          <p>Nomeado em: {formatarData(dataNomeacao, exibirDataCompleta)}</p>
        )}
        <p>Status: {ativo ? "Ativo" : "Inativo"}</p>

        {/* ── Slogans ────────────────────────────────────── */}
        {slogans.length > 0 && (
          <section>
            <h2>Slogans</h2>
            <ul>
              {slogans.map((s, i) => (
                <li key={i}>
                  {s.texto}
                  {s.data && (
                    <span> — desde {formatarData(s.data, s.exibirDataCompleta)}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Fundação ───────────────────────────────────── */}
        {fundacoes.length > 0 && (
          <section>
            <h2>Fundação</h2>
            <ul>
              {fundacoes.map((f, i) => (
                <li key={i}>
                  {f.texto}
                  {f.data && (
                    <span> — {formatarData(f.data, f.exibirDataCompleta)}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Fundadores ─────────────────────────────────── */}
        {fundadores.length > 0 && (
          <section>
            <h2>Fundadores</h2>
            <ul>
              {fundadores.map((f, i) => (
                <li key={i}>
                  {f.nome}
                  {f.id && <span> ({f.id})</span>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Proprietários ──────────────────────────────── */}
        {proprietarios.length > 0 && (
          <section>
            <h2>Proprietários</h2>
            <ul>
              {proprietarios.map((p, i) => (
                <li key={i}>
                  {p.imagem?.preview && (
                    <img src={p.imagem.preview} alt={p.nome} width={40} height={40} />
                  )}
                  {p.nome} ({p.tipo})
                  {p.data && (
                    <span> — desde {formatarData(p.data, p.exibirDataCompleta)}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Bio ────────────────────────────────────────── */}
        {bio && (
          <section>
            <h2>Sobre</h2>
            <div dangerouslySetInnerHTML={{ __html: bio }} />
          </section>
        )}

        {/* ── Serviços ───────────────────────────────────── */}
        {servicos.length > 0 && (
          <section>
            <h2>Serviços</h2>
            <ul>
              {servicos.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Localização ────────────────────────────────── */}
        {(endereco.length > 0 || pais || estado || cidade) && (
          <section>
            <h2>Localização</h2>
            {endereco.filter(Boolean).map((e, i) => (
              <p key={i}>{e}</p>
            ))}
            {(cidade || estado || pais) && (
              <p>
                {[cidade, estado, pais].filter(Boolean).join(", ")}
              </p>
            )}
          </section>
        )}

        {/* ── Redes sociais ──────────────────────────────── */}
        {redes.length > 0 && (
          <section>
            <h2>Redes sociais</h2>
            <ul>
              {redes.map((r, i) => (
                <li key={i}>
                  {r.rede}: {r.usuario}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}