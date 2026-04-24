import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db, storage } from "@/services/firebaseConection";
import {
  collection,
  query,
  where,
  limit,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/auth";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import VisualizarIcon from "@/components/icons/VisualizarIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import UploadImagem from "@/components/upload-imagem";
import DocumentIcon from "@/components/icons/DocumentIcon";
import PreviewField from "@/components/adm/preview-field";
import AdmModal, { AdmModalFooter } from "@/components/adm/modal";
import TextInput from "@/components/inputs/text-input";
import Switch from "@/components/inputs/switch";
import Select from "@/components/inputs/select";
import CalendarIcon from "@/components/icons/CalendarIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";
import CloseIcon from "@/components/icons/CloseIcon";
import ListCard, { ListCardItem } from "@/components/adm/list-card";
import InstagramIcon from "@/components/icons/InstagramIcon";
import YoutubeIcon from "@/components/icons/YoutubeIcon";
import TiktokIcon from "@/components/icons/TiktokIcon";
import XIcon from "@/components/icons/XIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import BlueSkyIcon from "@/components/icons/BlueSkyIcon";
import TwitchIcon from "@/components/icons/TwitchIcon";
import LinktreeIcon from "@/components/icons/LinktreeIcon";
import ThreadsIcon from "@/components/icons/ThreadsIcon";
import IMDBIcon from "@/components/icons/IMDBIcon";
import GlobeIcon from "@/components/icons/GlobeIcon";
import AdmEditor from "@/components/adm/editor";
import styles from "./index.module.scss";
import modalStyles from "./modal.module.scss";

const ESTADOS_BR = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
].map((s) => ({ value: s, label: s }));

const PAISES = [
  "Brasil",
  "Estados Unidos",
  "Argentina",
  "Portugal",
  "Japão",
  "França",
  "Espanha",
  "México",
  "Itália",
  "Reino Unido",
  "Alemanha",
  "Canadá",
  "Chile",
  "Colômbia",
  "Austrália",
  "Outro",
].map((p) => ({ value: p, label: p }));

const REDES_OPCOES = [
  { value: "Instagram", label: "Instagram" },
  { value: "YouTube", label: "YouTube" },
  { value: "TikTok", label: "TikTok" },
  { value: "Twitter", label: "Twitter" },
  { value: "Facebook", label: "Facebook" },
  { value: "BlueSky", label: "BlueSky" },
  { value: "Twitch", label: "Twitch" },
  { value: "Linktree", label: "Linktree" },
  { value: "Threads", label: "Threads" },
  { value: "IMDB", label: "IMDB" },
  { value: "Site", label: "Site" },
];

const REDE_ICONES = {
  Instagram: InstagramIcon,
  YouTube: YoutubeIcon,
  TikTok: TiktokIcon,
  Twitter: XIcon,
  Facebook: FacebookIcon,
  BlueSky: BlueSkyIcon,
  Twitch: TwitchIcon,
  Linktree: LinktreeIcon,
  Threads: ThreadsIcon,
  IMDB: IMDBIcon,
  Site: GlobeIcon,
};

async function gerarProximoId() {
  const snap = await getDocs(collection(db, "estudios"));
  let max = 0;
  snap.docs.forEach((d) => {
    const match = d.id.match(/^ES(\d+)$/i);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  });
  return `ES${String(max + 1).padStart(4, "0")}`;
}

function ServicosInput({ value = [], onChange }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const adicionar = () => {
    const v = input.trim();
    if (!v || value.includes(v)) {
      setInput("");
      return;
    }
    onChange([...value, v]);
    setInput("");
  };
  const remover = (item) => onChange(value.filter((v) => v !== item));
  return (
    <div className={styles.fieldWrapper}>
      <label className={styles.label}>Serviços</label>
      <div
        className={styles.pillsField}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((item) => (
          <span key={item} className={styles.pill}>
            {item}
            <button
              type="button"
              className={styles.pillRemove}
              onClick={(e) => {
                e.stopPropagation();
                remover(item);
              }}
            >
              <CloseIcon size={15} color="currentColor" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className={styles.pillInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              adicionar();
            }
            if (e.key === "Backspace" && !input && value.length > 0)
              remover(value[value.length - 1]);
          }}
          placeholder={value.length === 0 ? "Digite e pressione Enter…" : ""}
        />
      </div>
    </div>
  );
}

function RedeIcon({ rede, size = 24, color = "var(--icon-secondary)" }) {
  const Icon = REDE_ICONES[rede];
  return Icon ? <Icon size={size} color={color} /> : null;
}

function formatarDataCard(data, exibirDataCompleta) {
  if (!data) return "";
  if (exibirDataCompleta) {
    const [a, m, d] = data.split("-");
    return d && m ? `${d}/${m}/${a}` : a;
  }
  return data.split("-")[0] ?? "";
}

export default function CriarEstudio({ id = null, initialData = null }) {
  const isEdit = !!id;
  const router = useRouter();
  const { user } = useAuth();
  const [loadingRascunho, setLoadingRascunho] = useState(false);
  const [loadingPublicar, setLoadingPublicar] = useState(false);

  const [imagem, setImagem] = useState(
    initialData?.imagemUrl
      ? { preview: initialData.imagemUrl, file: null }
      : null,
  );
  const [modalNome, setModalNome] = useState(false);

  // ── Modal: Nome ───────────────────────────────────────────────────────────
  const [nome, setNome] = useState(initialData?.nome ?? "");
  const [nomePopular, setNomePopular] = useState(
    initialData?.nomePopular ?? "",
  );
  const [dataNomeacao, setDataNomeacao] = useState(
    initialData?.dataNomeacao ?? "",
  );
  const [exibirDataCompleta, setExibirDataCompleta] = useState(
    initialData?.exibirDataCompleta ?? false,
  );

  // ── Modal: Slogan ─────────────────────────────────────────────────────────
  const [modalSlogan, setModalSlogan] = useState(false);
  const [viewSlogan, setViewSlogan] = useState("lista");
  const [slogans, setSlogans] = useState(initialData?.slogans ?? []);
  const [novoSloganTexto, setNovoSloganTexto] = useState("");
  const [novoSloganData, setNovoSloganData] = useState("");
  const [novoSloganExibirDataCompleta, setNovoSloganExibirDataCompleta] =
    useState(false);
  const [editandoSloganIndex, setEditandoSloganIndex] = useState(null);
  const sloganCloseRef = useRef(null);

  // ── Modal: Fundação ───────────────────────────────────────────────────────
  const [modalFundacao, setModalFundacao] = useState(false);
  const [viewFundacao, setViewFundacao] = useState("lista");
  const [fundacoes, setFundacoes] = useState(initialData?.fundacoes ?? []);
  const [novaFundacaoNome, setNovaFundacaoNome] = useState("");
  const [novaFundacaoData, setNovaFundacaoData] = useState("");
  const [novaFundacaoExibirDataCompleta, setNovaFundacaoExibirDataCompleta] =
    useState(false);
  const [editandoFundacaoIndex, setEditandoFundacaoIndex] = useState(null);
  const fundacaoCloseRef = useRef(null);

  // ── Modal: Fundadores ─────────────────────────────────────────────────────
  const ENTRADA_FUNDADOR_VAZIA = {
    busca: "",
    selecionado: null,
    sugestoes: [],
  };
  const [modalFundadores, setModalFundadores] = useState(false);
  const [fundadores, setFundadores] = useState(initialData?.fundadores ?? []);
  const [entradasFundador, setEntradasFundador] = useState([
    { ...ENTRADA_FUNDADOR_VAZIA },
  ]);
  const searchTimersRef = useRef({});

  const handleBuscaFundadorChange = (index, value) => {
    setEntradasFundador((prev) =>
      prev.map((e, i) =>
        i === index
          ? { ...e, busca: value, selecionado: null, sugestoes: [] }
          : e,
      ),
    );
    if (searchTimersRef.current[index])
      clearTimeout(searchTimersRef.current[index]);
    if (!value.trim()) return;
    searchTimersRef.current[index] = setTimeout(async () => {
      try {
        const termo = value.trim();
        const [snapNome, snapId] = await Promise.all([
          getDocs(
            query(
              collection(db, "dubladores"),
              where("nomeArtistico", ">=", termo),
              where("nomeArtistico", "<=", termo + "\uf8ff"),
              limit(5),
            ),
          ),
          getDoc(doc(db, "dubladores", termo.toUpperCase())),
        ]);
        const vistos = new Set();
        const resultados = [];
        if (snapId.exists()) {
          vistos.add(snapId.id);
          resultados.push({
            id: snapId.id,
            nome:
              snapId.data().nomeArtistico ??
              snapId.data().nomeCompleto ??
              snapId.id,
          });
        }
        snapNome.docs.forEach((d) => {
          if (!vistos.has(d.id)) {
            vistos.add(d.id);
            resultados.push({
              id: d.id,
              nome: d.data().nomeArtistico ?? d.data().nomeCompleto ?? d.id,
            });
          }
        });
        setEntradasFundador((prev) =>
          prev.map((e, i) =>
            i === index ? { ...e, sugestoes: resultados } : e,
          ),
        );
      } catch {
        setEntradasFundador((prev) =>
          prev.map((e, i) => (i === index ? { ...e, sugestoes: [] } : e)),
        );
      }
    }, 350);
  };

  const handleSelecionarFundador = (index, sugestao) => {
    setEntradasFundador((prev) =>
      prev.map((e, i) =>
        i === index
          ? { ...e, busca: sugestao.nome, selecionado: sugestao, sugestoes: [] }
          : e,
      ),
    );
  };

  const handleAdicionarEntradaFundador = () => {
    setEntradasFundador((prev) => [...prev, { ...ENTRADA_FUNDADOR_VAZIA }]);
  };

  const handleConfirmarFundadores = () => {
    setFundadores(
      entradasFundador
        .filter((e) => e.busca.trim())
        .map((e) => ({ nome: e.busca.trim(), id: e.selecionado?.id ?? null })),
    );
    setModalFundadores(false);
  };

  // ── Modal: Proprietários ──────────────────────────────────────────────────
  const [modalProprietarios, setModalProprietarios] = useState(false);
  const [viewProprietario, setViewProprietario] = useState("lista");
  const [proprietarios, setProprietarios] = useState(
    initialData?.proprietarios ?? [],
  );
  const [editandoProprietarioIndex, setEditandoProprietarioIndex] =
    useState(null);
  const proprietarioCloseRef = useRef(null);
  const [novoProprietarioTipo, setNovoProprietarioTipo] = useState("");
  const [novoProprietarioBusca, setNovoProprietarioBusca] = useState("");
  const [novoProprietarioSugestoes, setNovoProprietarioSugestoes] = useState(
    [],
  );
  const [novoProprietarioSelecionado, setNovoProprietarioSelecionado] =
    useState(null);
  const [novoProprietarioNome, setNovoProprietarioNome] = useState("");
  const [novoProprietarioData, setNovoProprietarioData] = useState("");
  const [
    novoProprietarioExibirDataCompleta,
    setNovoProprietarioExibirDataCompleta,
  ] = useState(false);
  const [novoProprietarioImagem, setNovoProprietarioImagem] = useState(null);
  const proprietarioSearchTimerRef = useRef(null);

  useEffect(() => {
    if (!novoProprietarioBusca.trim() || novoProprietarioSelecionado) {
      setNovoProprietarioSugestoes([]);
      return;
    }
    if (proprietarioSearchTimerRef.current)
      clearTimeout(proprietarioSearchTimerRef.current);
    proprietarioSearchTimerRef.current = setTimeout(async () => {
      try {
        const termo = novoProprietarioBusca.trim();
        const [snapNome, snapId] = await Promise.all([
          getDocs(
            query(
              collection(db, "dubladores"),
              where("nomeArtistico", ">=", termo),
              where("nomeArtistico", "<=", termo + "\uf8ff"),
              limit(5),
            ),
          ),
          getDoc(doc(db, "dubladores", termo.toUpperCase())),
        ]);
        const vistos = new Set();
        const resultados = [];
        if (snapId.exists()) {
          vistos.add(snapId.id);
          resultados.push({
            id: snapId.id,
            nome:
              snapId.data().nomeArtistico ??
              snapId.data().nomeCompleto ??
              snapId.id,
          });
        }
        snapNome.docs.forEach((d) => {
          if (!vistos.has(d.id)) {
            vistos.add(d.id);
            resultados.push({
              id: d.id,
              nome: d.data().nomeArtistico ?? d.data().nomeCompleto ?? d.id,
            });
          }
        });
        setNovoProprietarioSugestoes(resultados);
      } catch {
        setNovoProprietarioSugestoes([]);
      }
    }, 350);
    return () => {
      if (proprietarioSearchTimerRef.current)
        clearTimeout(proprietarioSearchTimerRef.current);
    };
  }, [novoProprietarioBusca, novoProprietarioSelecionado]);

  const resetFormProprietario = () => {
    setNovoProprietarioTipo("");
    setNovoProprietarioBusca("");
    setNovoProprietarioSugestoes([]);
    setNovoProprietarioSelecionado(null);
    setNovoProprietarioNome("");
    setNovoProprietarioData("");
    setNovoProprietarioExibirDataCompleta(false);
    setNovoProprietarioImagem(null);
    setEditandoProprietarioIndex(null);
  };

  const abrirEdicaoProprietario = (index) => {
    const p = proprietarios[index];
    setEditandoProprietarioIndex(index);
    setNovoProprietarioTipo(p.tipo);
    if (p.tipo === "Pessoa") {
      setNovoProprietarioBusca(p.nome);
      setNovoProprietarioSelecionado(p.id ? { id: p.id, nome: p.nome } : null);
    } else {
      setNovoProprietarioNome(p.nome);
      setNovoProprietarioImagem(
        typeof p.imagem === "string"
          ? { preview: p.imagem, file: null }
          : (p.imagem ?? null),
      );
    }
    setNovoProprietarioData(p.data);
    setNovoProprietarioExibirDataCompleta(p.exibirDataCompleta);
    setViewProprietario("novo");
  };

  const handleConfirmarProprietario = () => {
    const nome =
      novoProprietarioTipo === "Pessoa"
        ? novoProprietarioBusca.trim()
        : novoProprietarioNome.trim();
    if (!nome || !novoProprietarioTipo) {
      setViewProprietario("lista");
      return;
    }
    const item = {
      tipo: novoProprietarioTipo,
      nome,
      id:
        novoProprietarioTipo === "Pessoa"
          ? (novoProprietarioSelecionado?.id ?? null)
          : null,
      data: novoProprietarioData,
      exibirDataCompleta: novoProprietarioExibirDataCompleta,
      imagem:
        novoProprietarioTipo === "Empresa" ? novoProprietarioImagem : null,
    };
    if (editandoProprietarioIndex !== null) {
      setProprietarios((prev) =>
        prev.map((p, i) => (i === editandoProprietarioIndex ? item : p)),
      );
    } else {
      setProprietarios((prev) => [...prev, item]);
    }
    resetFormProprietario();
    setViewProprietario("lista");
  };

  const proprietarioHeader =
    viewProprietario === "novo" ? (
      <div className={modalStyles.customHeader}>
        <button
          type="button"
          className={modalStyles.customHeaderBack}
          onClick={() => {
            resetFormProprietario();
            setViewProprietario("lista");
          }}
        >
          <ChevronDownIcon
            size={16}
            color="currentColor"
            style={{ transform: "rotate(90deg)" }}
          />
        </button>
        <span className={modalStyles.customHeaderTitle}>
          {editandoProprietarioIndex !== null
            ? "Editar proprietário"
            : "Novo proprietário"}
        </span>
        <button
          type="button"
          className={modalStyles.customHeaderClose}
          onClick={() => proprietarioCloseRef.current?.()}
        >
          <CloseIcon size={16} color="currentColor" />
        </button>
      </div>
    ) : undefined;

  // ── Bio ───────────────────────────────────────────────────────────────────
  const [bio, setBio] = useState(initialData?.bio ?? "");

  // ── Serviços + Localização ────────────────────────────────────────────────
  const [servicos, setServicos] = useState(initialData?.servicos ?? []);
  const [ativo, setAtivo] = useState(initialData?.ativo ?? true);
  const [endereco, setEndereco] = useState(initialData?.endereco ?? [""]);
  const [pais, setPais] = useState(initialData?.pais ?? "");
  const [estado, setEstado] = useState(initialData?.estado ?? "");
  const [cidade, setCidade] = useState(initialData?.cidade ?? "");

  // ── Modal: Redes sociais ──────────────────────────────────────────────────
  const [modalRedes, setModalRedes] = useState(false);
  const [viewRede, setViewRede] = useState("lista");
  const [redes, setRedes] = useState(initialData?.redes ?? []);
  const [editandoRedeIndex, setEditandoRedeIndex] = useState(null);
  const redesCloseRef = useRef(null);
  const [novaRedeTipo, setNovaRedeTipo] = useState("");
  const [novaRedeUsuario, setNovaRedeUsuario] = useState("");

  const resetFormRede = () => {
    setNovaRedeTipo("");
    setNovaRedeUsuario("");
    setEditandoRedeIndex(null);
  };

  const abrirEdicaoRede = (index) => {
    const r = redes[index];
    setEditandoRedeIndex(index);
    setNovaRedeTipo(r.rede);
    setNovaRedeUsuario(r.usuario);
    setViewRede("novo");
  };

  const handleConfirmarRede = () => {
    if (!novaRedeTipo || !novaRedeUsuario.trim()) {
      setViewRede("lista");
      return;
    }
    const item = { rede: novaRedeTipo, usuario: novaRedeUsuario.trim() };
    if (editandoRedeIndex !== null) {
      setRedes((prev) =>
        prev.map((r, i) => (i === editandoRedeIndex ? item : r)),
      );
    } else {
      setRedes((prev) => [...prev, item]);
    }
    resetFormRede();
    setViewRede("lista");
  };

  const redesHeader =
    viewRede === "novo" ? (
      <div className={modalStyles.customHeader}>
        <button
          type="button"
          className={modalStyles.customHeaderBack}
          onClick={() => {
            resetFormRede();
            setViewRede("lista");
          }}
        >
          <ChevronDownIcon
            size={16}
            color="currentColor"
            style={{ transform: "rotate(90deg)" }}
          />
        </button>
        <span className={modalStyles.customHeaderTitle}>
          {editandoRedeIndex !== null ? "Editar rede" : "Nova rede"}
        </span>
        <button
          type="button"
          className={modalStyles.customHeaderClose}
          onClick={() => redesCloseRef.current?.()}
        >
          <CloseIcon size={16} color="currentColor" />
        </button>
      </div>
    ) : undefined;

  // ── Salvar (rascunho ou publicado) ───────────────────────────────────────
  const salvar = async (statusPublicacao) => {
    const isPublicar = statusPublicacao === "publicado";
    if (isPublicar) setLoadingPublicar(true);
    else setLoadingRascunho(true);
    try {
      const docId = isEdit ? id : await gerarProximoId();
      const imagemUrl = imagem?.file
        ? await (async () => {
            const storageRef = ref(
              storage,
              `estudios/${docId}_${imagem.file.name}`,
            );
            await uploadBytes(storageRef, imagem.file);
            return getDownloadURL(storageRef);
          })()
        : (imagem?.preview ?? null);

      const proprietariosParaSalvar = await Promise.all(
        proprietarios.map(async (p) => {
          if (p.imagem?.file) {
            const storageRef = ref(
              storage,
              `estudios/${docId}_prop_${p.imagem.file.name}`,
            );
            await uploadBytes(storageRef, p.imagem.file);
            const url = await getDownloadURL(storageRef);
            return { ...p, imagem: url };
          }
          if (p.imagem?.preview) return { ...p, imagem: p.imagem.preview };
          return p;
        }),
      );

      await setDoc(
        doc(db, "estudios", docId),
        {
          nome,
          nomePopular,
          dataNomeacao,
          exibirDataCompleta,
          slogans,
          fundacoes,
          fundadores,
          proprietarios: proprietariosParaSalvar,
          redes,
          servicos,
          ativo,
          endereco,
          pais,
          estado,
          cidade,
          bio,
          imagemUrl,
          ...(!isEdit && { statusPublicacao }),
          autor: user
            ? {
                id: user.uid,
                nome: user.nome || user.displayName || "",
                avatarUrl: user.avatarUrl || "",
              }
            : null,
          ...(isPublicar
            ? { dataPublicacao: serverTimestamp() }
            : { dataRascunho: serverTimestamp() }),
        },
        { merge: true },
      );
      router.push("/adm/estudios");
    } catch (err) {
      console.error(err);
      alert(`Erro ao salvar: ${err.message}`);
    } finally {
      setLoadingRascunho(false);
      setLoadingPublicar(false);
    }
  };

  const salvarRascunho = () => salvar("rascunho");
  const publicar = () => salvar("publicado");

  // ── Menu "•••" ────────────────────────────────────────────────────────────
  const [menuAberto, setMenuAberto] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  const abrirMenu = () => {
    if (menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 8, left: rect.left });
    }
    setMenuAberto((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirmar = () => {
    setModalNome(false);
  };

  const abrirEdicaoSlogan = (index) => {
    const s = slogans[index];
    setEditandoSloganIndex(index);
    setNovoSloganTexto(s.texto);
    setNovoSloganData(s.data);
    setNovoSloganExibirDataCompleta(s.exibirDataCompleta);
    setViewSlogan("novo");
  };

  const resetFormSlogan = () => {
    setNovoSloganTexto("");
    setNovoSloganData("");
    setNovoSloganExibirDataCompleta(false);
    setEditandoSloganIndex(null);
  };

  const handleConfirmarSlogan = () => {
    if (!novoSloganTexto.trim()) {
      setViewSlogan("lista");
      return;
    }
    if (editandoSloganIndex !== null) {
      setSlogans((prev) =>
        prev.map((s, i) =>
          i === editandoSloganIndex
            ? {
                texto: novoSloganTexto,
                data: novoSloganData,
                exibirDataCompleta: novoSloganExibirDataCompleta,
              }
            : s,
        ),
      );
    } else {
      setSlogans((prev) => [
        ...prev,
        {
          texto: novoSloganTexto,
          data: novoSloganData,
          exibirDataCompleta: novoSloganExibirDataCompleta,
        },
      ]);
    }
    resetFormSlogan();
    setViewSlogan("lista");
  };

  const abrirEdicaoFundacao = (index) => {
    const f = fundacoes[index];
    setEditandoFundacaoIndex(index);
    setNovaFundacaoNome(f.texto);
    setNovaFundacaoData(f.data);
    setNovaFundacaoExibirDataCompleta(f.exibirDataCompleta);
    setViewFundacao("novo");
  };

  const resetFormFundacao = () => {
    setNovaFundacaoNome("");
    setNovaFundacaoData("");
    setNovaFundacaoExibirDataCompleta(false);
    setEditandoFundacaoIndex(null);
  };

  const handleConfirmarFundacao = () => {
    if (!novaFundacaoNome.trim()) {
      setViewFundacao("lista");
      return;
    }
    if (editandoFundacaoIndex !== null) {
      setFundacoes((prev) =>
        prev.map((f, i) =>
          i === editandoFundacaoIndex
            ? {
                texto: novaFundacaoNome,
                data: novaFundacaoData,
                exibirDataCompleta: novaFundacaoExibirDataCompleta,
              }
            : f,
        ),
      );
    } else {
      setFundacoes((prev) => [
        ...prev,
        {
          texto: novaFundacaoNome,
          data: novaFundacaoData,
          exibirDataCompleta: novaFundacaoExibirDataCompleta,
        },
      ]);
    }
    resetFormFundacao();
    setViewFundacao("lista");
  };

  const fundacaoHeader =
    viewFundacao === "novo" ? (
      <div className={modalStyles.customHeader}>
        <button
          type="button"
          className={modalStyles.customHeaderBack}
          onClick={() => {
            resetFormFundacao();
            setViewFundacao("lista");
          }}
        >
          <ChevronDownIcon
            size={16}
            color="currentColor"
            style={{ transform: "rotate(90deg)" }}
          />
        </button>
        <span className={modalStyles.customHeaderTitle}>
          {editandoFundacaoIndex !== null ? "Editar fundação" : "Nova fundação"}
        </span>
        <button
          type="button"
          className={modalStyles.customHeaderClose}
          onClick={() => fundacaoCloseRef.current?.()}
        >
          <CloseIcon size={16} color="currentColor" />
        </button>
      </div>
    ) : undefined;

  const sloganHeader =
    viewSlogan === "novo" ? (
      <div className={modalStyles.customHeader}>
        <button
          type="button"
          className={modalStyles.customHeaderBack}
          onClick={() => {
            resetFormSlogan();
            setViewSlogan("lista");
          }}
        >
          <ChevronDownIcon
            size={16}
            color="currentColor"
            style={{ transform: "rotate(90deg)" }}
          />
        </button>
        <span className={modalStyles.customHeaderTitle}>
          {editandoSloganIndex !== null ? "Editar slogan" : "Novo slogan"}
        </span>
        <button
          type="button"
          className={modalStyles.customHeaderClose}
          onClick={() => sloganCloseRef.current?.()}
        >
          <CloseIcon size={16} color="currentColor" />
        </button>
      </div>
    ) : undefined;

  const headerActions = (
    <>
      <div className={styles.menuWrapper} ref={menuRef}>
        <div ref={menuBtnRef}>
          <Button
            variant="ghost"
            label="•••"
            type="button"
            onClick={abrirMenu}
          />
        </div>
        {menuAberto && (
          <div
            className={styles.menuDropdown}
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            <button
              type="button"
              className={`${styles.menuItem} ${!isEdit ? styles.menuItemDisabled : ""}`}
              onClick={() => {
                if (isEdit) window.open(`/estudios/${id}`, "_blank");
                setMenuAberto(false);
              }}
            >
              <VisualizarIcon size={16} color="currentColor" />
              Visualizar
            </button>
            {isEdit && (
              <button
                type="button"
                className={styles.menuItem}
                style={{ color: "var(--primitive-erro-01)" }}
                onClick={() => setMenuAberto(false)}
              >
                <TrashIcon size={16} color="var(--primitive-erro-01)" />
                Deletar
              </button>
            )}
          </div>
        )}
      </div>
      {isEdit ? (
        <Button
          variant="ghost"
          label={loadingRascunho ? "Salvando..." : "Salvar alterações"}
          type="button"
          border="var(--stroke-base)"
          onClick={salvarRascunho}
        />
      ) : (
        <>
          <Button
            variant="ghost"
            label={loadingRascunho ? "Salvando..." : "Salvar rascunho"}
            type="button"
            border="var(--stroke-base)"
            onClick={salvarRascunho}
          />
          <Button
            variant="ghost"
            label={loadingPublicar ? "Publicando..." : "Publicar"}
            type="button"
            border="var(--stroke-base)"
            onClick={publicar}
          />
        </>
      )}
    </>
  );

  return (
    <>
      <Head>
        <title>{isEdit ? "Editar" : "Criar"} estúdio — Cameo ADM</title>
      </Head>
      <AdmLayout
        headerActions={headerActions}
        breadcrumb={
          isEdit
            ? [
                { href: "/adm/estudios", label: "Estúdios de dublagem" },
                { href: null, label: initialData?.nome || id },
              ]
            : undefined
        }
      >
        <div className={styles.central}>
          <div className={styles.titulo}>
            <h1>Criar estúdio</h1>
          </div>
          <div className={styles.contentArticle}>
            <div className={styles.uploadImage}>
              <UploadImagem
                imagem={imagem}
                onImagemChange={(file) =>
                  setImagem(
                    file ? { file, preview: URL.createObjectURL(file) } : null,
                  )
                }
                dimensoes="Recomendado 500x500. JPG e PNG"
              />
            </div>

            <PreviewField
              icon={<DocumentIcon size={24} color="var(--stroke-solid)" />}
              titulo="Nome do estúdio"
              valor={nome}
              placeholder="Adicione o nome"
              data={dataNomeacao}
              exibirDataCompleta={exibirDataCompleta}
              onClick={() => setModalNome(true)}
            />

            <PreviewField
              icon={<DocumentIcon size={24} color="var(--stroke-solid)" />}
              titulo="Slogan"
              placeholder="Adicione o slogan"
              itens={slogans.map((s) => ({
                valor: s.texto,
                data: s.data,
                exibirDataCompleta: s.exibirDataCompleta,
              }))}
              onClick={() => setModalSlogan(true)}
            />
          </div>

          <div className={styles.listCardsGrid}>
            <ListCard
              icon={<DocumentIcon size={24} color="var(--stroke-solid)" />}
              titulo="Fundação"
              tooltip
              placeholder="Adicione a fundação"
              onAdicionar={() => setModalFundacao(true)}
            >
              {fundacoes.map((f, i) => (
                <ListCardItem
                  key={i}
                  icon={
                    <ArrowRightIcon
                      size={14}
                      color="var(--text-sub)"
                      style={{ transform: "rotate(-90deg)" }}
                    />
                  }
                  date={formatarDataCard(f.data, f.exibirDataCompleta)}
                  name={f.texto}
                />
              ))}
            </ListCard>
            <ListCard
              icon={<DocumentIcon size={24} color="var(--stroke-solid)" />}
              titulo="Fundador(es)"
              placeholder="Adicione os fundadores"
              onAdicionar={() => setModalFundadores(true)}
            >
              {fundadores.map((f, i) => (
                <ListCardItem
                  key={i}
                  icon={
                    <ChevronDownIcon
                      size={14}
                      color="var(--text-sub)"
                      style={{ transform: "rotate(-90deg)" }}
                    />
                  }
                  date={f.id ?? ""}
                  name={f.nome}
                />
              ))}
            </ListCard>
            <ListCard
              icon={<DocumentIcon size={24} color="var(--stroke-solid)" />}
              titulo="Proprietário(s)"
              placeholder="Adicione os proprietários"
              onAdicionar={() => setModalProprietarios(true)}
            >
              {proprietarios.map((p, i) => (
                <ListCardItem
                  key={i}
                  icon={
                    <ChevronDownIcon
                      size={14}
                      color="var(--text-sub)"
                      style={{ transform: "rotate(-90deg)" }}
                    />
                  }
                  date={formatarDataCard(p.data, p.exibirDataCompleta)}
                  name={p.nome}
                />
              ))}
            </ListCard>
            <ListCard
              icon={<DocumentIcon size={24} color="var(--stroke-solid)" />}
              titulo="Redes sociais"
              placeholder="Adicione as redes sociais"
              onAdicionar={() => setModalRedes(true)}
            >
              {redes.map((r, i) => (
                <ListCardItem
                  key={i}
                  icon={
                    <div
                      style={{
                        width: 35,
                        display: "flex",
                        justifyContent: "start",
                      }}
                    >
                      <RedeIcon rede={r.rede} size={14} />
                    </div>
                  }
                  date={r.rede}
                />
              ))}
            </ListCard>
          </div>

          <div className={styles.bioSection}>
            <AdmEditor value={bio} onChange={setBio} />
          </div>

          <div className={styles.servicosLocalizacaoRow}>
            <div className={styles.servicosCol}>
              <ServicosInput value={servicos} onChange={setServicos} />
              <div className={styles.ativoRow}>
                <label className={styles.ativoLabel} htmlFor="estudio-ativo">
                  Estúdio ativo?
                </label>
                <Switch
                  id="estudio-ativo"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                />
              </div>
            </div>

            <div className={styles.localizacaoCol}>
              <TextInput
                label="Endereço"
                placeholder='Ex: "Rua das Flores, 123"'
                value={endereco[0]}
                onChange={(e) => setEndereco([e.target.value])}
              />
              <div className={styles.paisEstadoRow}>
                <Select
                  label="País"
                  placeholder="Selecione o país"
                  options={PAISES}
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  width="100%"
                />
                <Select
                  label="Estado"
                  placeholder="Selecione o estado"
                  options={ESTADOS_BR}
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                  width="100%"
                />
              </div>
              <TextInput
                label="Cidade"
                placeholder='Ex: "São Paulo"'
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>
          </div>
        </div>
      </AdmLayout>

      <AdmModal
        isOpen={modalSlogan}
        onClose={() => {
          setModalSlogan(false);
          setViewSlogan("lista");
          resetFormSlogan();
        }}
        title="Slogan"
        header={sloganHeader}
        closeRef={sloganCloseRef}
      >
        <div className={modalStyles.sloganDrawer}>
          <div
            className={modalStyles.sloganDrawerInner}
            data-view={viewSlogan === "novo" ? "novo" : undefined}
          >
            {/* View 1: Lista de slogans */}
            <div className={modalStyles.sloganView}>
              <div className={modalStyles.sloganTimelineHeader}>
                <span>Linha do tempo</span>
              </div>
              <div className={modalStyles.sloganTimeline}>
                {slogans.map((s, i) => (
                  <div
                    key={i}
                    className={modalStyles.timelineItem}
                    onClick={() => abrirEdicaoSlogan(i)}
                  >
                    <div className={modalStyles.timelineLeft}>
                      <div className={modalStyles.timelineDot} />
                      {i < slogans.length - 1 && (
                        <div className={modalStyles.timelineLine} />
                      )}
                    </div>
                    <div className={modalStyles.timelineContent}>
                      <span className={modalStyles.timelineTexto}>
                        {s.texto}
                      </span>
                      {s.data && (
                        <span className={modalStyles.timelineData}>
                          Desde {s.data.split("-")[0]}
                        </span>
                      )}
                      <ChevronDownIcon
                        size={16}
                        color="var(--text-sub)"
                        style={{ transform: "rotate(-90deg)" }}
                      />
                    </div>
                  </div>
                ))}
                {slogans.length > 0 && (
                  <div className={modalStyles.timelineSeparator} />
                )}
                <Button
                  variant="ghost"
                  label="+ Adicionar slogan"
                  type="button"
                  onClick={() => setViewSlogan("novo")}
                  width="220px"
                />
              </div>
            </div>

            {/* View 2: Novo slogan */}
            <div className={modalStyles.sloganView}>
              <div className={modalStyles.modalBody}>
                <TextInput
                  label="Slogan"
                  placeholder='Ex: "A melhor dublagem do Brasil"'
                  value={novoSloganTexto}
                  onChange={(e) => setNovoSloganTexto(e.target.value)}
                />
                <TextInput
                  label="Data da nomeação"
                  placeholder="DD/MM/AAAA"
                  value={novoSloganData}
                  onChange={(e) => setNovoSloganData(e.target.value)}
                  type="date"
                  suffix={
                    <CalendarIcon size={18} color="var(--icon-secondary)" />
                  }
                />
                <div className={modalStyles.toggleRow}>
                  <label
                    className={modalStyles.toggleLabel}
                    htmlFor="exibir-data-slogan"
                  >
                    Exibir data completa?
                  </label>
                  <Switch
                    id="exibir-data-slogan"
                    checked={novoSloganExibirDataCompleta}
                    onChange={(e) =>
                      setNovoSloganExibirDataCompleta(e.target.checked)
                    }
                  />
                </div>
              </div>
              <AdmModalFooter
                onCancel={() => {
                  resetFormSlogan();
                  setViewSlogan("lista");
                }}
                onConfirm={handleConfirmarSlogan}
              />
            </div>
          </div>
        </div>
      </AdmModal>

      <AdmModal
        isOpen={modalFundacao}
        onClose={() => {
          setModalFundacao(false);
          setViewFundacao("lista");
          resetFormFundacao();
        }}
        title="Fundação"
        header={fundacaoHeader}
        closeRef={fundacaoCloseRef}
      >
        <div className={modalStyles.sloganDrawer}>
          <div
            className={modalStyles.sloganDrawerInner}
            data-view={viewFundacao === "novo" ? "novo" : undefined}
          >
            {/* View 1: Lista */}
            <div className={modalStyles.sloganView}>
              <div className={modalStyles.sloganTimelineHeader}>
                <span>Linha do tempo</span>
              </div>
              <div className={modalStyles.sloganTimeline}>
                {fundacoes.map((f, i) => (
                  <div
                    key={i}
                    className={modalStyles.timelineItem}
                    onClick={() => abrirEdicaoFundacao(i)}
                  >
                    <div className={modalStyles.timelineLeft}>
                      <div className={modalStyles.timelineDot} />
                      {i < fundacoes.length - 1 && (
                        <div className={modalStyles.timelineLine} />
                      )}
                    </div>
                    <div className={modalStyles.timelineContent}>
                      <span className={modalStyles.timelineTexto}>
                        {f.texto}
                      </span>
                      {f.data && (
                        <span className={modalStyles.timelineData}>
                          Desde {f.data.split("-")[0]}
                        </span>
                      )}
                      <ChevronDownIcon
                        size={16}
                        color="var(--text-sub)"
                        style={{ transform: "rotate(-90deg)" }}
                      />
                    </div>
                  </div>
                ))}
                {fundacoes.length > 0 && (
                  <div className={modalStyles.timelineSeparator} />
                )}
                <Button
                  variant="ghost"
                  label="+ Adicionar fundação"
                  type="button"
                  width="220px"
                  onClick={() => setViewFundacao("novo")}
                />
              </div>
            </div>

            {/* View 2: Nova / Editar */}
            <div className={modalStyles.sloganView}>
              <div className={modalStyles.modalBody}>
                <TextInput
                  label="Nome da empresa"
                  placeholder='Ex: "Rivaton Filmes"'
                  value={novaFundacaoNome}
                  onChange={(e) => setNovaFundacaoNome(e.target.value)}
                />
                <TextInput
                  label="Data da fundação"
                  placeholder="DD/MM/AAAA"
                  value={novaFundacaoData}
                  onChange={(e) => setNovaFundacaoData(e.target.value)}
                  type="date"
                  suffix={
                    <CalendarIcon size={18} color="var(--icon-secondary)" />
                  }
                />
                <div className={modalStyles.toggleRow}>
                  <label
                    className={modalStyles.toggleLabel}
                    htmlFor="exibir-data-fundacao"
                  >
                    Exibir data completa?
                  </label>
                  <Switch
                    id="exibir-data-fundacao"
                    checked={novaFundacaoExibirDataCompleta}
                    onChange={(e) =>
                      setNovaFundacaoExibirDataCompleta(e.target.checked)
                    }
                  />
                </div>
              </div>
              <AdmModalFooter
                onCancel={() => {
                  resetFormFundacao();
                  setViewFundacao("lista");
                }}
                onConfirm={handleConfirmarFundacao}
              />
            </div>
          </div>
        </div>
      </AdmModal>

      <AdmModal
        isOpen={modalFundadores}
        onClose={() => {
          setEntradasFundador([{ ...ENTRADA_FUNDADOR_VAZIA }]);
          setModalFundadores(false);
        }}
        title="Fundador(es)"
      >
        <div className={modalStyles.modalBody}>
          {entradasFundador.map((entrada, i) => (
            <div key={i} className={modalStyles.autocompleteWrapper}>
              <TextInput
                label="Nome do fundador"
                placeholder='Ex: "Carlos Silveira"'
                value={entrada.busca}
                onChange={(e) => handleBuscaFundadorChange(i, e.target.value)}
              />
              {entrada.sugestoes.length > 0 && (
                <div className={modalStyles.autocompleteDropdown}>
                  {entrada.sugestoes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={modalStyles.autocompleteItem}
                      onClick={() => handleSelecionarFundador(i, s)}
                    >
                      <span className={modalStyles.autocompleteItemNome}>
                        {s.nome}
                      </span>
                      <span className={modalStyles.autocompleteItemId}>
                        {s.id}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className={modalStyles.separador} />

          <Button
            variant="ghost"
            label="+ Adicionar fundador"
            type="button"
            width="220px"
            onClick={handleAdicionarEntradaFundador}
          />
        </div>
        <AdmModalFooter
          onCancel={() => {
            setEntradasFundador([{ ...ENTRADA_FUNDADOR_VAZIA }]);
            setModalFundadores(false);
          }}
          onConfirm={handleConfirmarFundadores}
        />
      </AdmModal>

      <AdmModal
        isOpen={modalProprietarios}
        onClose={() => {
          setModalProprietarios(false);
          setViewProprietario("lista");
          resetFormProprietario();
        }}
        title="Proprietário(s)"
        header={proprietarioHeader}
        closeRef={proprietarioCloseRef}
      >
        <div className={modalStyles.sloganDrawer}>
          <div
            className={modalStyles.sloganDrawerInner}
            data-view={viewProprietario === "novo" ? "novo" : undefined}
          >
            {/* View 1: Timeline */}
            <div className={modalStyles.sloganView}>
              <div className={modalStyles.sloganTimelineHeader}>
                <span>Linha do tempo</span>
              </div>
              <div className={modalStyles.sloganTimeline}>
                {proprietarios.map((p, i) => (
                  <div
                    key={i}
                    className={modalStyles.timelineItem}
                    onClick={() => abrirEdicaoProprietario(i)}
                  >
                    <div className={modalStyles.timelineLeft}>
                      <div className={modalStyles.timelineDot} />
                      {i < proprietarios.length - 1 && (
                        <div className={modalStyles.timelineLine} />
                      )}
                    </div>
                    <div className={modalStyles.timelineContent}>
                      <span className={modalStyles.timelineTexto}>
                        {p.nome}
                      </span>
                      {p.data && (
                        <span className={modalStyles.timelineData}>
                          Desde {p.data.split("-")[0]}
                        </span>
                      )}
                      <ChevronDownIcon
                        size={16}
                        color="var(--text-sub)"
                        style={{ transform: "rotate(-90deg)" }}
                      />
                    </div>
                  </div>
                ))}
                {proprietarios.length > 0 && (
                  <div className={modalStyles.timelineSeparator} />
                )}
                <Button
                  variant="ghost"
                  label="+ Adicionar proprietário"
                  type="button"
                  width="220px"
                  onClick={() => setViewProprietario("novo")}
                />
              </div>
            </div>

            {/* View 2: Formulário */}
            <div className={modalStyles.sloganView}>
              <div className={modalStyles.modalBody}>
                <Select
                  label="Selecione o tipo"
                  placeholder="Tipo de proprietário"
                  options={[
                    { value: "Pessoa", label: "Pessoa" },
                    { value: "Empresa", label: "Empresa" },
                  ]}
                  value={novoProprietarioTipo}
                  onChange={(e) => {
                    setNovoProprietarioTipo(e.target.value);
                    setNovoProprietarioBusca("");
                    setNovoProprietarioNome("");
                    setNovoProprietarioSelecionado(null);
                    setNovoProprietarioSugestoes([]);
                  }}
                />

                {novoProprietarioTipo === "Pessoa" && (
                  <div className={modalStyles.autocompleteWrapper}>
                    <TextInput
                      label="Nome do proprietário"
                      placeholder='Ex: "Carlos Silveira"'
                      value={novoProprietarioBusca}
                      onChange={(e) => {
                        setNovoProprietarioBusca(e.target.value);
                        setNovoProprietarioSelecionado(null);
                      }}
                    />
                    {novoProprietarioSugestoes.length > 0 && (
                      <div className={modalStyles.autocompleteDropdown}>
                        {novoProprietarioSugestoes.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            className={modalStyles.autocompleteItem}
                            onClick={() => {
                              setNovoProprietarioSelecionado(s);
                              setNovoProprietarioBusca(s.nome);
                              setNovoProprietarioSugestoes([]);
                            }}
                          >
                            <span className={modalStyles.autocompleteItemNome}>
                              {s.nome}
                            </span>
                            <span className={modalStyles.autocompleteItemId}>
                              {s.id}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {novoProprietarioTipo === "Empresa" && (
                  <TextInput
                    label="Nome da empresa"
                    placeholder='Ex: "Rivaton Filmes"'
                    value={novoProprietarioNome}
                    onChange={(e) => setNovoProprietarioNome(e.target.value)}
                  />
                )}

                <div
                  className={
                    novoProprietarioTipo === "Empresa"
                      ? modalStyles.dataComImagemRow
                      : undefined
                  }
                >
                  {novoProprietarioTipo === "Empresa" && (
                    <div className={modalStyles.uploadCompact}>
                      <UploadImagem
                        imagem={novoProprietarioImagem}
                        onImagemChange={(file) =>
                          setNovoProprietarioImagem(
                            file
                              ? { file, preview: URL.createObjectURL(file) }
                              : null,
                          )
                        }
                        dimensoes={false}
                      />
                    </div>
                  )}

                  <TextInput
                    label="Data da nomeação"
                    placeholder="DD/MM/AAAA"
                    value={novoProprietarioData}
                    onChange={(e) => setNovoProprietarioData(e.target.value)}
                    type="date"
                    suffix={
                      <CalendarIcon size={18} color="var(--icon-secondary)" />
                    }
                    width="100%"
                  />
                </div>

                <div className={modalStyles.toggleRow}>
                  <label
                    className={modalStyles.toggleLabel}
                    htmlFor="exibir-data-proprietario"
                  >
                    Exibir data completa?
                  </label>
                  <Switch
                    id="exibir-data-proprietario"
                    checked={novoProprietarioExibirDataCompleta}
                    onChange={(e) =>
                      setNovoProprietarioExibirDataCompleta(e.target.checked)
                    }
                  />
                </div>
              </div>
              <AdmModalFooter
                onCancel={() => {
                  resetFormProprietario();
                  setViewProprietario("lista");
                }}
                onConfirm={handleConfirmarProprietario}
              />
            </div>
          </div>
        </div>
      </AdmModal>

      <AdmModal
        isOpen={modalRedes}
        onClose={() => {
          setModalRedes(false);
          setViewRede("lista");
          resetFormRede();
        }}
        title="Redes sociais"
        header={redesHeader}
        closeRef={redesCloseRef}
      >
        <div className={modalStyles.sloganDrawer}>
          <div
            className={modalStyles.sloganDrawerInner}
            data-view={viewRede === "novo" ? "novo" : undefined}
          >
            {/* View 1: Lista de redes */}
            <div className={modalStyles.sloganView}>
              <div className={modalStyles.redesList}>
                {redes.map((r, i) => (
                  <button
                    key={i}
                    type="button"
                    className={modalStyles.redesItem}
                    onClick={() => abrirEdicaoRede(i)}
                  >
                    <div
                      style={{
                        width: 35,
                        display: "flex",
                        justifyContent: "start",
                        flexShrink: 0,
                      }}
                    >
                      <RedeIcon rede={r.rede} size={20} />
                    </div>
                    <span className={modalStyles.redesItemUsuario}>
                      {r.usuario}
                    </span>
                    <span className={modalStyles.redesItemRede}>{r.rede}</span>
                    <ChevronDownIcon
                      size={16}
                      color="var(--text-sub)"
                      style={{ transform: "rotate(-90deg)" }}
                    />
                  </button>
                ))}
              </div>
              {redes.length > 0 && (
                <div
                  className={modalStyles.timelineSeparator}
                  style={{ margin: "0 var(--space-2xl)" }}
                />
              )}
              <div style={{ padding: "var(--space-lg) var(--space-2xl)" }}>
                <Button
                  variant="ghost"
                  label="+ Adicionar rede"
                  type="button"
                  width="220px"
                  onClick={() => setViewRede("novo")}
                />
              </div>
            </div>

            {/* View 2: Nova / Editar rede */}
            <div className={modalStyles.sloganView}>
              <div className={modalStyles.modalBody}>
                <Select
                  label="Selecione a rede"
                  placeholder="Tipo de rede social"
                  options={REDES_OPCOES}
                  value={novaRedeTipo}
                  onChange={(e) => setNovaRedeTipo(e.target.value)}
                />
                <TextInput
                  label="Usuário"
                  placeholder='Ex: "@cameo_adm"'
                  value={novaRedeUsuario}
                  onChange={(e) => setNovaRedeUsuario(e.target.value)}
                />
              </div>
              <AdmModalFooter
                onCancel={() => {
                  resetFormRede();
                  setViewRede("lista");
                }}
                onConfirm={handleConfirmarRede}
              />
            </div>
          </div>
        </div>
      </AdmModal>

      <AdmModal
        isOpen={modalNome}
        onClose={() => setModalNome(false)}
        title="Nome do estúdio"
      >
        <div className={modalStyles.modalBody}>
          <TextInput
            label="Nome do estúdio"
            placeholder='Ex: "Herbert Richers S.A."'
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextInput
            label="Nome popular"
            placeholder='Ex: "Herbert Richers"'
            value={nomePopular}
            onChange={(e) => setNomePopular(e.target.value)}
          />
          <TextInput
            label="Data da nomeação"
            placeholder="DD/MM/AAAA"
            value={dataNomeacao}
            onChange={(e) => setDataNomeacao(e.target.value)}
            type="date"
            suffix={<CalendarIcon size={18} color="var(--icon-secondary)" />}
          />
          <div className={modalStyles.toggleRow}>
            <label
              className={modalStyles.toggleLabel}
              htmlFor="exibir-data-completa"
            >
              Exibir data completa?
            </label>
            <Switch
              id="exibir-data-completa"
              checked={exibirDataCompleta}
              onChange={(e) => setExibirDataCompleta(e.target.checked)}
            />
          </div>
        </div>
        <AdmModalFooter
          onCancel={() => setModalNome(false)}
          onConfirm={handleConfirmar}
        />
      </AdmModal>
    </>
  );
}
