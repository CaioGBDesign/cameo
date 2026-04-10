import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "@/contexts/auth";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import TextInput from "@/components/inputs/text-input";
import PlusIcon from "@/components/icons/PlusIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import styles from "./index.module.scss";

const ENTRADA_VAZIA = { idDublador: "", nomeDublador: "", dubladorValido: null, personagem: "", atorOriginal: "" };

export default function CriarDublagem({ id = null, initialData = null }) {
  const router = useRouter();
  const { user } = useAuth();
  const isEdit = !!id;

  // ── Filme ──────────────────────────────────────────────────────────────────
  const [idFilme, setIdFilme] = useState(initialData?.idFilme ? String(initialData.idFilme) : "");
  const [nomeFilme, setNomeFilme] = useState(initialData?.nomeFilme ?? "");

  // ── Elenco ─────────────────────────────────────────────────────────────────
  const [entradas, setEntradas] = useState(
    initialData?.dubladores?.length
      ? initialData.dubladores.map((e) => ({ ...ENTRADA_VAZIA, ...e, nomeDublador: "" }))
      : [{ ...ENTRADA_VAZIA }],
  );

  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({});

  // ── Em modo edição, busca os nomes dos dubladores ao montar ───────────────
  useEffect(() => {
    if (!isEdit) return;
    entradas.forEach((entrada, i) => {
      if (entrada.idDublador) buscarNomeDublador(i, entrada.idDublador);
    });
  }, [isEdit]);

  // ── Auto-fetch nome do filme via TMDB ──────────────────────────────────────
  useEffect(() => {
    if (!idFilme) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${idFilme}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=pt-BR`,
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.title && !nomeFilme) setNomeFilme(data.title);
      } catch {}
    }, 600);
    return () => clearTimeout(timer);
  }, [idFilme]);

  // ── Auto-fetch nome do dublador via Firestore ──────────────────────────────
  const buscarNomeDublador = async (index, idDublador) => {
    if (!idDublador.trim()) {
      setEntradas((prev) => {
        const nova = [...prev];
        nova[index] = { ...nova[index], nomeDublador: "", dubladorValido: null };
        return nova;
      });
      return;
    }
    try {
      const snap = await getDoc(doc(db, "dubladores", idDublador.trim().toUpperCase()));
      setEntradas((prev) => {
        const nova = [...prev];
        nova[index] = {
          ...nova[index],
          nomeDublador: snap.exists()
            ? (snap.data().nomeArtistico ?? snap.data().nomeCompleto ?? "")
            : "Não encontrado",
          dubladorValido: snap.exists(),
        };
        return nova;
      });
    } catch {
      setEntradas((prev) => {
        const nova = [...prev];
        nova[index] = { ...nova[index], nomeDublador: "", dubladorValido: null };
        return nova;
      });
    }
  };

  // ── Entradas ───────────────────────────────────────────────────────────────
  const atualizarEntrada = (index, campo, valor) => {
    setEntradas((prev) => {
      const nova = [...prev];
      nova[index] = { ...nova[index], [campo]: valor };
      return nova;
    });
  };

  const adicionarEntrada = () => setEntradas((prev) => [...prev, { ...ENTRADA_VAZIA }]);

  const removerEntrada = (index) =>
    setEntradas((prev) => prev.filter((_, i) => i !== index));

  // ── Gerar ID ───────────────────────────────────────────────────────────────
  const gerarId = async () => {
    const snap = await getDocs(collection(db, "filmes"));
    const ids = snap.docs.map((d) => {
      const m = d.id.match(/^DU(\d+)$/);
      return m ? parseInt(m[1]) : 0;
    });
    return `DU${String(Math.max(0, ...ids) + 1).padStart(4, "0")}`;
  };

  // ── Salvar ─────────────────────────────────────────────────────────────────
  const handleSalvar = async () => {
    setLoading(true);
    try {
      // Verifica todos os IDs de dublador antes de qualquer coisa
      const snaps = await Promise.all(
        entradas.map((e) =>
          e.idDublador.trim()
            ? getDoc(doc(db, "dubladores", e.idDublador.trim().toUpperCase()))
            : Promise.resolve(null),
        ),
      );

      // Atualiza estado visual com resultados
      setEntradas((prev) =>
        prev.map((e, i) => {
          const snap = snaps[i];
          if (!snap) return { ...e, nomeDublador: "", dubladorValido: null };
          return {
            ...e,
            nomeDublador: snap.exists()
              ? (snap.data().nomeArtistico ?? snap.data().nomeCompleto ?? "")
              : "Não encontrado",
            dubladorValido: snap.exists(),
          };
        }),
      );

      // Valida campos básicos + existência dos dubladores
      const e = {};
      if (!idFilme.trim()) e.idFilme = true;
      if (!nomeFilme.trim()) e.nomeFilme = true;
      entradas.forEach((entrada, i) => {
        if (!entrada.idDublador.trim() || !snaps[i]?.exists()) e[`idDublador_${i}`] = true;
        if (!entrada.personagem.trim()) e[`personagem_${i}`] = true;
        if (!entrada.atorOriginal.trim()) e[`atorOriginal_${i}`] = true;
      });
      setErros(e);
      if (Object.keys(e).length > 0) return;

      const dados = {
        idFilme: parseInt(idFilme) || idFilme.trim(),
        nomeFilme: nomeFilme.trim(),
        dubladores: entradas.map((e) => ({
          idDublador: e.idDublador.trim().toUpperCase(),
          personagem: e.personagem.trim(),
          atorOriginal: e.atorOriginal.trim(),
        })),
        dataEdicao: serverTimestamp(),
      };

      if (isEdit) {
        await updateDoc(doc(db, "filmes", id), dados);
      } else {
        const newId = await gerarId();
        dados.autorId = user?.uid ?? null;
        dados.autorNome = user?.nome ?? null;
        dados.dataCadastro = serverTimestamp();
        await setDoc(doc(db, "filmes", newId), dados);
      }
      router.push("/adm/dublagens");
    } finally {
      setLoading(false);
    }
  };

  // ── Sidebar ────────────────────────────────────────────────────────────────
  const sidebar = (
    <div className={styles.sidebarContent}>
      <TextInput
        label="ID do filme (TMDB)"
        placeholder="Ex: 550"
        type="number"
        min="1"
        value={idFilme}
        onChange={(e) => {
          setIdFilme(e.target.value);
          setErros((p) => ({ ...p, idFilme: false }));
        }}
        error={!!erros.idFilme}
      />

      <TextInput
        label="Nome do filme"
        placeholder='Ex: "Fight Club"'
        value={nomeFilme}
        onChange={(e) => {
          setNomeFilme(e.target.value);
          setErros((p) => ({ ...p, nomeFilme: false }));
        }}
        error={!!erros.nomeFilme}
      />
    </div>
  );

  // ── Header ─────────────────────────────────────────────────────────────────
  const headerActions = (
    <Button
      variant="ghost"
      label={loading ? "Salvando..." : "Salvar"}
      onClick={handleSalvar}
      disabled={loading}
      border="var(--stroke-base)"
    />
  );

  const breadcrumb = isEdit
    ? [{ href: "/adm/dublagens", label: "Dublagens" }, { href: null, label: nomeFilme || id }]
    : [{ href: "/adm/dublagens", label: "Dublagens" }, { href: null, label: "Criar" }];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Head>
        <title>{isEdit ? "Editar" : "Criar"} dublagem — Cameo ADM</title>
      </Head>
      <AdmLayout headerActions={headerActions} breadcrumb={breadcrumb} rightSidebar={sidebar}>
        <div className={styles.central}>

          <div className={styles.card}>
            <h2 className={styles.cardTitulo}>Elenco de dublagem</h2>

            <div className={styles.elencoHeader}>
              <span className={styles.colLabel}>ID Dublador</span>
              <span className={styles.colLabel}>Personagem</span>
              <span className={styles.colLabel}>Ator original</span>
              <span style={{ width: 36 }} />
            </div>

            {entradas.map((entrada, i) => (
              <div key={i} className={styles.elencoRow}>
                <div className={styles.elencoField}>
                  <TextInput
                    placeholder="Ex: DB0001"
                    value={entrada.idDublador}
                    onChange={(e) => {
                      atualizarEntrada(i, "idDublador", e.target.value);
                      setErros((p) => ({ ...p, [`idDublador_${i}`]: false }));
                    }}
                    onBlur={() => buscarNomeDublador(i, entrada.idDublador)}
                    error={!!erros[`idDublador_${i}`]}
                  />
                  {entrada.nomeDublador && (
                    <span className={`${styles.nomeDublador} ${entrada.nomeDublador === "Não encontrado" ? styles.nomeDubladorErro : ""}`}>
                      {entrada.nomeDublador}
                    </span>
                  )}
                </div>

                <TextInput
                  placeholder="Ex: Tyler Durden"
                  value={entrada.personagem}
                  onChange={(e) => {
                    atualizarEntrada(i, "personagem", e.target.value);
                    setErros((p) => ({ ...p, [`personagem_${i}`]: false }));
                  }}
                  error={!!erros[`personagem_${i}`]}
                />

                <TextInput
                  placeholder="Ex: Brad Pitt"
                  value={entrada.atorOriginal}
                  onChange={(e) => {
                    atualizarEntrada(i, "atorOriginal", e.target.value);
                    setErros((p) => ({ ...p, [`atorOriginal_${i}`]: false }));
                  }}
                  error={!!erros[`atorOriginal_${i}`]}
                />

                <button
                  type="button"
                  className={styles.btnRemover}
                  onClick={() => removerEntrada(i)}
                  disabled={entradas.length === 1}
                  title="Remover"
                >
                  <TrashIcon size={14} color="currentColor" />
                </button>
              </div>
            ))}

            <div className={styles.btnAdicionarWrapper}>
              <Button
                variant="ghost"
                label="Adicionar dublador"
                icon={<PlusIcon size={16} color="currentColor" />}
                border="var(--stroke-base)"
                onClick={adicionarEntrada}
              />
            </div>
          </div>
        </div>
      </AdmLayout>
    </>
  );
}
