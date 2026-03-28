import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db, storage } from "@/services/firebaseConection";
import {
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/contexts/toast";
import AdmLayout from "@/components/adm/layout";
import UploadImagem from "@/components/upload-imagem";
import MultiSelect from "@/components/inputs/multi-select";
import generosList from "@/components/listas/tags/generos.json";
import empresasList from "@/components/listas/tags/empresas.json";
import Button from "@/components/button";
import TextInput from "@/components/inputs/text-input";
import AdmEditor from "@/components/adm/editor";
import TagInput from "@/components/adm/tag-input";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import styles from "../../criar/index.module.scss";

const IcoVisualizar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M14.3627 7.36325C14.5654 7.64745 14.6667 7.78959 14.6667 7.99992C14.6667 8.21025 14.5654 8.35238 14.3627 8.63658C13.452 9.91365 11.1262 12.6666 8.00004 12.6666C4.87389 12.6666 2.54811 9.91365 1.6374 8.63658C1.43471 8.35238 1.33337 8.21025 1.33337 7.99992C1.33337 7.78959 1.43471 7.64745 1.6374 7.36325C2.54811 6.08621 4.87389 3.33325 8.00004 3.33325C11.1262 3.33325 13.452 6.08621 14.3627 7.36325Z"
      stroke="currentColor"
    />
    <path
      d="M10 8C10 6.8954 9.1046 6 8 6C6.8954 6 6 6.8954 6 8C6 9.1046 6.8954 10 8 10C9.1046 10 10 9.1046 10 8Z"
      stroke="currentColor"
    />
  </svg>
);

const IcoPublicar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#pub-ed)">
      <path
        d="M9.98706 4.677C9.98706 4.677 10.3204 5.01034 10.6537 5.677C10.6537 5.677 11.7125 4.01034 12.6537 3.677"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66327 1.3476C4.99763 1.27708 3.71079 1.46896 3.71079 1.46896C2.89822 1.52706 1.34101 1.98261 1.34103 4.64307C1.34104 7.28091 1.3238 10.5329 1.34103 11.8293C1.34103 12.6214 1.83144 14.4689 3.52888 14.5679C5.59211 14.6883 9.30853 14.7139 11.0137 14.5679C11.4701 14.5422 12.9898 14.1838 13.1821 12.5304C13.3814 10.8176 13.3417 9.62718 13.3417 9.34384"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.6666 4.67708C14.6666 6.51803 13.1728 8.01044 11.3301 8.01044C9.48733 8.01044 7.99353 6.51803 7.99353 4.67708C7.99353 2.83614 9.48733 1.34375 11.3301 1.34375C13.1728 1.34375 14.6666 2.83614 14.6666 4.67708Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.65369 8.677H7.32033"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.65369 11.3438H9.987"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="pub-ed">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const IcoCancelarAgendamento = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M10.6667 1.33325V3.99992M5.33337 1.33325V3.99992"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 9.33341V8.00008C14 5.48592 14 4.22885 13.2189 3.44779C12.4379 2.66675 11.1808 2.66675 8.66667 2.66675H7.33333C4.81917 2.66675 3.5621 2.66675 2.78105 3.44779C2 4.22885 2 5.48592 2 8.00008V9.33341C2 11.8475 2 13.1047 2.78105 13.8857C3.5621 14.6667 4.81917 14.6667 7.33333 14.6667H8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 6.66675H14"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.1854 10.8147L10.1616 13.8384M14 12.3333C14 13.622 12.9554 14.6667 11.6667 14.6667C10.378 14.6667 9.33337 13.622 9.33337 12.3333C9.33337 11.0447 10.378 10 11.6667 10C12.9554 10 14 11.0447 14 12.3333Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IcoArquivar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2.66663 8.00019V9.69632C2.66663 11.8597 2.66663 12.9413 3.25734 13.674C3.37668 13.822 3.5115 13.9569 3.65951 14.0762C4.39217 14.6669 5.47384 14.6669 7.63716 14.6669C8.10756 14.6669 8.34269 14.6669 8.55809 14.5909C8.60289 14.5751 8.64676 14.5569 8.68963 14.5364C8.89569 14.4379 9.06196 14.2715 9.39456 13.9389L12.5522 10.7813C12.9376 10.3959 13.1303 10.2032 13.2318 9.95819C13.3333 9.71312 13.3333 9.44066 13.3333 8.89566V6.66686C13.3333 4.15271 13.3333 2.89564 12.5522 2.11459C11.8462 1.40848 10.751 1.34074 8.68963 1.33423M8.66663 14.3335V14.0002C8.66663 12.1146 8.66663 11.1718 9.25243 10.586C9.83823 10.0002 10.781 10.0002 12.6666 10.0002H13"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.66663 5.48685V3.6407C2.66663 2.36619 3.71129 1.33301 4.99996 1.33301C6.28863 1.33301 7.33329 2.36619 7.33329 3.6407V6.17916C7.33329 6.8164 6.81096 7.333 6.16663 7.333C5.52229 7.333 4.99996 6.8164 4.99996 6.17916V3.6407"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IcoRascunho = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M5.33337 4.66675H10.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.33337 7.33325H8.00004"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.66663 14.3333V13.9999C8.66663 12.1143 8.66663 11.1715 9.25243 10.5857C9.83823 9.99992 10.781 9.99992 12.6666 9.99992H13M13.3333 8.89532V6.66658C13.3333 4.15243 13.3333 2.89535 12.5522 2.1143C11.7712 1.33325 10.5141 1.33325 7.99996 1.33325C5.48581 1.33325 4.22873 1.33325 3.44767 2.1143C2.66663 2.89535 2.66663 4.15243 2.66663 6.66658V9.69605C2.66663 11.8594 2.66663 12.9411 3.25734 13.6737C3.37668 13.8217 3.5115 13.9565 3.65951 14.0759C4.39217 14.6666 5.47384 14.6666 7.63716 14.6666C8.10756 14.6666 8.34269 14.6666 8.55809 14.5906C8.60289 14.5748 8.64676 14.5566 8.68963 14.5361C8.89569 14.4375 9.06196 14.2713 9.39456 13.9387L12.5522 10.781C12.9376 10.3956 13.1303 10.2029 13.2318 9.95785C13.3333 9.71285 13.3333 9.44032 13.3333 8.89532Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IcoDeletar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13 3.66675L12.5869 10.3501C12.4813 12.0577 12.4285 12.9115 12.0005 13.5253C11.7889 13.8288 11.5165 14.0849 11.2005 14.2774C10.5614 14.6667 9.706 14.6667 7.99513 14.6667C6.28208 14.6667 5.42553 14.6667 4.78603 14.2767C4.46987 14.0839 4.19733 13.8273 3.98579 13.5233C3.55792 12.9085 3.5063 12.0535 3.40307 10.3435L3 3.66675"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path
      d="M2 3.66659H14M10.7038 3.66659L10.2487 2.72774C9.9464 2.10409 9.7952 1.79227 9.53447 1.59779C9.47667 1.55465 9.4154 1.51628 9.35133 1.48305C9.0626 1.33325 8.71607 1.33325 8.023 1.33325C7.31253 1.33325 6.95733 1.33325 6.66379 1.48933C6.59873 1.52393 6.53665 1.56385 6.47819 1.6087C6.21443 1.81105 6.06709 2.13429 5.77241 2.78076L5.36861 3.66659"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path d="M6.33337 11V7" stroke="currentColor" strokeLinecap="round" />
    <path d="M9.66663 11V7" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

const generoOptions = generosList.map((g) => ({
  value: g.name,
  label: g.name,
}));
const empresaOptions = empresasList.map((e) => ({
  value: e.name,
  label: e.name,
}));

export default function AdmEditarNoticia() {
  useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const { slug } = router.query;

  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [numero, setNumero] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagemElemento, setImagemElemento] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [tags, setTags] = useState([]);
  const [slugValue, setSlugValue] = useState("");
  const [statusAtual, setStatusAtual] = useState("rascunho");
  const [loading, setLoading] = useState(false);
  const [loadingRascunho, setLoadingRascunho] = useState(false);
  const [loadingAlteracoes, setLoadingAlteracoes] = useState(false);
  const [loadingDados, setLoadingDados] = useState(true);
  const [menuAberto, setMenuAberto] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const menuBtnRef = useRef(null);

  const [hasChanges, setHasChanges] = useState(false);
  const loadedRef = useRef(false);
  useUnsavedChanges(hasChanges);

  const [agendarAberto, setAgendarAberto] = useState(false);
  const [dataAgendado, setDataAgendado] = useState("");
  const [horaAgendado, setHoraAgendado] = useState("");

  useEffect(() => {
    if (!slug) return;
    setSlugValue(slug);

    const carregar = async () => {
      try {
        const docSnap = await getDoc(doc(db, "noticias", slug));
        if (!docSnap.exists()) {
          router.push("/adm/noticias");
          return;
        }

        const data = docSnap.data();
        setTitulo(data.titulo || "");
        setSubtitulo(data.subtitulo || "");
        setNumero(data.numero?.toString() || "");
        setConteudo(data.conteudo || "");
        setGeneros(data.generos || []);
        setEmpresas(data.empresas || []);
        const inferirStatus = () => {
          if (data.status) return data.status.toLowerCase();
          if (data.dataPublicacao) return "publicado";
          if (data.dataAgendamento) return "agendado";
          return "rascunho";
        };
        setStatusAtual(inferirStatus());

        if (data.imagem) {
          setImagemElemento({ preview: data.imagem, file: null });
        }

        if (data.tagIds?.length) {
          const tagsSnap = await getDocs(collection(db, "tags"));
          const todasTags = tagsSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setTags(todasTags.filter((t) => data.tagIds.includes(t.id)));
        }
      } catch (err) {
        console.error("Erro ao carregar notícia:", err);
      } finally {
        setLoadingDados(false);
        loadedRef.current = true;
      }
    };

    carregar();
  }, [slug]);

  useEffect(() => {
    if (!loadedRef.current) return;
    setHasChanges(true);
  }, [titulo, subtitulo, numero, conteudo, imagemElemento, empresas, generos, tags, slugValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const abrirMenu = () => {
    if (menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 8, left: rect.left });
    }
    setMenuAberto((prev) => !prev);
  };

  const contarPalavras = (html) => {
    const texto = html.replace(/<[^>]*>/g, " ").trim();
    return texto ? texto.split(/\s+/).filter(Boolean).length : 0;
  };

  const handleImagemChange = (file) => {
    if (file) {
      setImagemElemento({ preview: URL.createObjectURL(file), file });
    } else {
      setImagemElemento(null);
    }
  };

  const uploadImagem = async () => {
    if (!imagemElemento?.file) return imagemElemento?.preview || null;
    const storageRef = ref(
      storage,
      `noticias/${Date.now()}_${imagemElemento.file.name}`,
    );
    await uploadBytes(storageRef, imagemElemento.file);
    return getDownloadURL(storageRef);
  };

  const getCamposBase = async () => {
    const imagemUrl = await uploadImagem();
    return {
      titulo,
      subtitulo,
      numero: Number(numero),
      empresas,
      generos,
      conteudo,
      tagIds: tags.map((t) => t.id),
      imagem: imagemUrl,
    };
  };

  const salvarComSlug = async (campos) => {
    const novoSlug = slugValue.trim();
    if (!novoSlug) throw new Error("Slug não pode ser vazio");
    if (novoSlug === slug) {
      await updateDoc(doc(db, "noticias", slug), campos);
      return slug;
    }
    const novoDocRef = doc(db, "noticias", novoSlug);
    const novoSnap = await getDoc(novoDocRef);
    if (novoSnap.exists()) {
      throw new Error(`Já existe uma notícia com o slug "${novoSlug}"`);
    }
    const atualSnap = await getDoc(doc(db, "noticias", slug));
    const atualData = atualSnap.data();
    await setDoc(novoDocRef, { ...atualData, ...campos });
    await deleteDoc(doc(db, "noticias", slug));
    return novoSlug;
  };

  const salvarRascunho = async () => {
    if (!titulo.trim()) {
      toast.warn("Adicione um título antes de salvar", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-amarelo-02)",
      });
      return;
    }
    setLoadingRascunho(true);
    try {
      const campos = await getCamposBase();
      const novoSlug = await salvarComSlug({
        ...campos,
        status: "rascunho",
        dataRascunho: serverTimestamp(),
      });
      if (novoSlug !== slug) {
        router.replace(`/adm/noticias/editar/${novoSlug}`);
        return;
      }
      setHasChanges(false);
      toast.success("Rascunho salvo com sucesso", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-verde-01)",
      });
    } catch (err) {
      console.error("Erro ao salvar rascunho:", err);
      toast.error("Erro ao salvar rascunho", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-erro-01)",
      });
    } finally {
      setLoadingRascunho(false);
    }
  };

  const publicar = async (e) => {
    e?.preventDefault();
    if (!titulo.trim() || !numero) {
      toast.warn("Complete as informações para publicar", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-amarelo-02)",
      });
      return;
    }
    setLoading(true);
    try {
      const campos = await getCamposBase();
      await salvarComSlug({
        ...campos,
        status: "publicado",
        dataPublicacao: serverTimestamp(),
      });
      router.push("/adm/noticias");
    } catch (err) {
      console.error("Erro ao publicar:", err);
      toast.error("Erro ao publicar a notícia", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-erro-01)",
      });
    } finally {
      setLoading(false);
    }
  };

  const salvarAlteracoes = async () => {
    if (!titulo.trim()) {
      toast.warn("Adicione um título antes de salvar");
      return;
    }
    setLoadingAlteracoes(true);
    try {
      const campos = await getCamposBase();
      const novoSlug = await salvarComSlug({
        ...campos,
        dataEditado: serverTimestamp(),
      });
      if (novoSlug !== slug) {
        router.replace(`/adm/noticias/editar/${novoSlug}`);
        return;
      }
      setHasChanges(false);
      toast.success("Alterações salvas com sucesso", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-verde-01)",
      });
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
      toast.error("Erro ao salvar as alterações", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-erro-01)",
      });
    } finally {
      setLoadingAlteracoes(false);
    }
  };

  const confirmarAgendamento = async () => {
    if (!dataAgendado || !horaAgendado) {
      toast.warn("Informe a data e hora para agendar", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-amarelo-02)",
      });
      return;
    }
    try {
      const dataAgendamento = new Date(`${dataAgendado}T${horaAgendado}`);
      await updateDoc(doc(db, "noticias", slug), {
        status: "agendado",
        dataAgendamento: dataAgendamento.toISOString(),
      });
      setStatusAtual("agendado");
      setAgendarAberto(false);
      toast.success("Notícia agendada com sucesso", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-verde-01)",
      });
    } catch (err) {
      console.error("Erro ao agendar:", err);
      toast.error("Erro ao agendar a notícia", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-erro-01)",
      });
    }
  };

  const cancelarAgendamento = async () => {
    try {
      await updateDoc(doc(db, "noticias", slug), {
        status: "rascunho",
        dataAgendamento: null,
      });
      setStatusAtual("rascunho");
      setMenuAberto(false);
      toast.success("Agendamento cancelado", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-verde-01)",
      });
    } catch (err) {
      console.error("Erro ao cancelar agendamento:", err);
      toast.error("Erro ao cancelar o agendamento", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-erro-01)",
      });
    }
  };

  const retornarRascunho = async () => {
    try {
      await updateDoc(doc(db, "noticias", slug), { status: "rascunho" });
      setStatusAtual("rascunho");
      setMenuAberto(false);
      toast.success("Notícia retornada para rascunho", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-verde-01)",
      });
    } catch (err) {
      console.error("Erro ao retornar para rascunho:", err);
      toast.error("Erro ao retornar para rascunho", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-erro-01)",
      });
    }
  };

  const arquivar = async () => {
    try {
      await updateDoc(doc(db, "noticias", slug), { status: "arquivado" });
      setStatusAtual("arquivado");
      setMenuAberto(false);
      toast.success("Notícia arquivada com sucesso", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-verde-01)",
      });
    } catch (err) {
      console.error("Erro ao arquivar:", err);
      toast.error("Erro ao arquivar a notícia", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-erro-01)",
      });
    }
  };

  const deletar = async () => {
    try {
      await deleteDoc(doc(db, "noticias", slug));
      router.push("/adm/noticias");
    } catch (err) {
      console.error("Erro ao deletar:", err);
      toast.error("Erro ao deletar a notícia", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-erro-01)",
      });
    }
  };

  if (loadingDados) return null;

  const renderMenu = (itens) => (
    <div className={styles.menuWrapper} ref={menuRef}>
      <div ref={menuBtnRef}>
        <Button
          variant="ghost"
          label="•••"
          type="button"
          onClick={abrirMenu}
          border="var(--stroke-base)"
        />
      </div>
      {menuAberto && (
        <div
          className={styles.menuDropdown}
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {itens}
        </div>
      )}
    </div>
  );

  const itemMenu = (label, onClick, Icon, danger = false) => (
    <button
      key={label}
      type="button"
      className={`${styles.menuItem} ${danger ? styles.menuItemDanger : ""}`}
      onClick={() => {
        onClick();
        setMenuAberto(false);
      }}
    >
      {Icon && (
        <span className={styles.menuItemIcon}>
          <Icon />
        </span>
      )}
      {label}
    </button>
  );

  const visualizarItem = itemMenu(
    "Visualizar",
    () => window.open(`/noticias/detalhes/${slug}?preview=true`, "_blank"),
    IcoVisualizar,
  );

  let headerActions;
  switch (statusAtual) {
    case "rascunho":
      headerActions = (
        <>
          {renderMenu(
            <>
              {visualizarItem}
              {itemMenu("Deletar", deletar, IcoDeletar, true)}
            </>,
          )}
          <Button
            variant="ghost"
            label="Agendar"
            type="button"
            onClick={() => setAgendarAberto(true)}
            border="var(--stroke-base)"
          />
          <Button
            variant="ghost"
            label={loadingRascunho ? "Salvando..." : "Salvar rascunho"}
            type="button"
            disabled={loadingRascunho}
            onClick={salvarRascunho}
            border="var(--stroke-base)"
          />
          <Button
            variant="ghost"
            label={loading ? "Publicando..." : "Publicar"}
            type="button"
            onClick={publicar}
            disabled={loading}
            border="var(--stroke-base)"
          />
        </>
      );
      break;

    case "agendado":
      headerActions = (
        <>
          {renderMenu(
            <>
              {itemMenu("Publicar", publicar, IcoPublicar)}
              {itemMenu(
                "Cancelar agendamento",
                cancelarAgendamento,
                IcoCancelarAgendamento,
              )}
              {itemMenu("Arquivar", arquivar, IcoArquivar)}
            </>,
          )}
          <Button
            variant="ghost"
            label="Editar agendamento"
            type="button"
            onClick={() => setAgendarAberto(true)}
            border="var(--stroke-base)"
          />
          <Button
            variant="ghost"
            label={loadingAlteracoes ? "Salvando..." : "Salvar alterações"}
            type="button"
            disabled={loadingAlteracoes}
            onClick={salvarAlteracoes}
            border="var(--stroke-base)"
          />
        </>
      );
      break;

    case "publicado":
      headerActions = (
        <>
          {renderMenu(
            <>
              {visualizarItem}
              {itemMenu(
                "Retornar para rascunho",
                retornarRascunho,
                IcoRascunho,
              )}
              {itemMenu("Arquivar", arquivar, IcoArquivar)}
            </>,
          )}
          <Button
            variant="ghost"
            label={loadingAlteracoes ? "Salvando..." : "Salvar alterações"}
            type="button"
            disabled={loadingAlteracoes}
            onClick={salvarAlteracoes}
            border="var(--stroke-base)"
          />
        </>
      );
      break;

    case "arquivado":
      headerActions = (
        <>
          {renderMenu(<>{itemMenu("Deletar", deletar, IcoDeletar, true)}</>)}
          <Button
            variant="ghost"
            label="Retornar para rascunho"
            type="button"
            onClick={retornarRascunho}
            border="var(--stroke-base)"
          />
        </>
      );
      break;

    default:
      headerActions = null;
  }

  const breadcrumb = [
    { href: "/adm/noticias", label: "Notícias" },
    { href: null, label: titulo || slug },
  ];

  const sidebar = (
    <>
      <UploadImagem
        imagem={imagemElemento}
        onImagemChange={handleImagemChange}
        dimensoes="Dimensões recomendadas 1440x480. Arquivos aceitos, JPG e PNG"
      />
      <TextInput
        label="Título"
        placeholder="Título da notícia"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        maxLength={120}
        required
        width="100%"
      />
      <TextInput
        label="Subtítulo"
        placeholder="Subtítulo da notícia"
        value={subtitulo}
        onChange={(e) => setSubtitulo(e.target.value)}
        maxLength={200}
        width="100%"
      />
      <div className={styles.row}>
        <TextInput
          label="Slug (URL)"
          placeholder="url-da-noticia"
          value={slugValue}
          onChange={(e) => {
            const sanitized = e.target.value
              .toLowerCase()
              .replace(/[^a-z0-9-]/g, "");
            setSlugValue(sanitized);
          }}
          width="100%"
        />
        <TextInput
          label="Tempo de leitura (min)"
          tooltip="O tempo de leitura pode ser definido manualmente ou de forma automática com base na quantidade de palavras"
          placeholder="Ex: 5"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          type="number"
          required
          width="100%"
        />
      </div>
      <div className={styles.row}>
        <MultiSelect
          options={generoOptions}
          selected={generos}
          onChange={setGeneros}
          placeholder="Selecione gêneros…"
          width="100%"
        />
        <MultiSelect
          options={empresaOptions}
          selected={empresas}
          onChange={setEmpresas}
          placeholder="Selecione empresas…"
          width="100%"
        />
      </div>
      <div className={styles.row}>
        <TagInput
          label="Tags"
          selected={tags}
          onChange={setTags}
          width="100%"
        />
      </div>
    </>
  );

  return (
    <AdmLayout
      headerActions={headerActions}
      breadcrumb={breadcrumb}
      rightSidebar={sidebar}
    >
      <Head>
        <title>Cameo ADM — Editar notícia</title>
      </Head>
      <form id="form-noticia-editar" className={styles.form}>
        <AdmEditor
          value={conteudo}
          onChange={(v) => {
            setConteudo(v);
            const mins = Math.max(1, Math.ceil(contarPalavras(v) / 200));
            setNumero(String(mins));
          }}
        />
      </form>

      {agendarAberto && (
        <div className={styles.agendarOverlay}>
          <div className={styles.agendarModal}>
            <h3 className={styles.agendarTitulo}>Agendar publicação</h3>
            <div className={styles.agendarCampos}>
              <label className={styles.agendarLabel}>
                Data
                <input
                  type="date"
                  className={styles.agendarInput}
                  value={dataAgendado}
                  onChange={(e) => setDataAgendado(e.target.value)}
                />
              </label>
              <label className={styles.agendarLabel}>
                Hora
                <input
                  type="time"
                  className={styles.agendarInput}
                  value={horaAgendado}
                  onChange={(e) => setHoraAgendado(e.target.value)}
                />
              </label>
            </div>
            <div className={styles.agendarAcoes}>
              <Button
                variant="ghost"
                label="Cancelar"
                type="button"
                onClick={() => setAgendarAberto(false)}
                border="var(--stroke-base)"
              />
              <Button
                variant="ghost"
                label="Confirmar"
                type="button"
                onClick={confirmarAgendamento}
                border="var(--stroke-base)"
              />
            </div>
          </div>
        </div>
      )}
    </AdmLayout>
  );
}
