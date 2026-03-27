import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db, storage } from "@/services/firebaseConection";
import { serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/auth";
import AdmLayout from "@/components/adm/layout";
import UploadImagem from "@/components/upload-imagem";
import MultiSelect from "@/components/inputs/multi-select";
import generosList from "@/components/listas/tags/generos.json";
import empresasList from "@/components/listas/tags/empresas.json";
import Button from "@/components/button";
import TextInput from "@/components/inputs/text-input";
import AdmEditor from "@/components/adm/editor";
import TagInput from "@/components/adm/tag-input";
import styles from "./index.module.scss";

const IcoVisualizar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M14.3627 7.36325C14.5654 7.64745 14.6667 7.78959 14.6667 7.99992C14.6667 8.21025 14.5654 8.35238 14.3627 8.63658C13.452 9.91365 11.1262 12.6666 8.00004 12.6666C4.87389 12.6666 2.54811 9.91365 1.6374 8.63658C1.43471 8.35238 1.33337 8.21025 1.33337 7.99992C1.33337 7.78959 1.43471 7.64745 1.6374 7.36325C2.54811 6.08621 4.87389 3.33325 8.00004 3.33325C11.1262 3.33325 13.452 6.08621 14.3627 7.36325Z" stroke="currentColor"/>
    <path d="M10 8C10 6.8954 9.1046 6 8 6C6.8954 6 6 6.8954 6 8C6 9.1046 6.8954 10 8 10C9.1046 10 10 9.1046 10 8Z" stroke="currentColor"/>
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

const TIPO_IMAGEM = "imagem";

export default function AdmCriarNoticia() {
  const { user } = useAuth();
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [numero, setNumero] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagemElemento, setImagemElemento] = useState(null);
  const [empresas, setEmpresas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRascunho, setLoadingRascunho] = useState(false);
  const [error, setError] = useState("");
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

  const gerarSlug = (titulo) =>
    titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
      .replace(/^-+|-+$/g, "");

  const handleImagemChange = (file) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagemElemento({
        tipo: TIPO_IMAGEM,
        conteudo: "uploading",
        preview,
        file,
      });
    } else {
      setImagemElemento(null);
    }
  };

  const uploadImagem = async () => {
    if (!imagemElemento?.file) return null;
    const storageRef = ref(
      storage,
      `noticias/${Date.now()}_${imagemElemento.file.name}`,
    );
    await uploadBytes(storageRef, imagemElemento.file);
    return getDownloadURL(storageRef);
  };

  const montarPayload = async (status) => {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();
    const slug = gerarSlug(titulo);
    if (!slug) throw new Error("Título inválido para gerar URL");
    const imagemUrl = status === "publicado" ? await uploadImagem() : null;
    return {
      slug,
      payload: {
        titulo,
        subtitulo,
        numero: Number(numero),
        empresas,
        generos,
        conteudo,
        tagIds: tags.map((t) => t.id),
        imagem: imagemUrl,
        autor: { id: user.uid, nome: userData.nome, avatarUrl: userData.avatarUrl },
        status,
        ...(status === "publicado"
          ? { dataPublicacao: serverTimestamp() }
          : { dataRascunho: serverTimestamp() }),
      },
    };
  };

  const salvarRascunho = async () => {
    setLoadingRascunho(true);
    setError("");
    try {
      const { slug, payload } = await montarPayload("rascunho");
      await setDoc(doc(db, "noticias", slug), payload, { merge: true });
    } catch (err) {
      console.error("Erro ao salvar rascunho:", err);
      setError(err.message);
    } finally {
      setLoadingRascunho(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { slug, payload } = await montarPayload("publicado");
      const docRef = doc(db, "noticias", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().status === "publicado")
        throw new Error("Já existe uma notícia publicada com este título");
      await setDoc(docRef, payload, { merge: true });
      router.push("/adm/noticias");
    } catch (err) {
      console.error("Erro ao publicar:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const headerActions = (
    <>
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
            <button
              type="button"
              className={styles.menuItem}
              onClick={() => {
                const slug = gerarSlug(titulo);
                window.open(`/noticias/detalhes/${slug}?preview=true`, "_blank");
                setMenuAberto(false);
              }}
            >
              <span className={styles.menuItemIcon}><IcoVisualizar /></span>
              Visualizar
            </button>
          </div>
        )}
      </div>
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
        type="submit"
        form="form-noticia"
        disabled={loading}
        border="var(--stroke-base)"
      />
    </>
  );

  return (
    <AdmLayout headerActions={headerActions}>
      <Head>
        <title>Cameo ADM — Criar notícia</title>
      </Head>
      <div className={styles.page}>
        <form id="form-noticia" onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.fields}>
            <div className={styles.bloco}>
              <UploadImagem
                imagem={imagemElemento}
                onImagemChange={handleImagemChange}
                dimensoes="Dimensões recomendadas 1440x480. Arquivos aceitos, JPG e PNG"
              />
            </div>

            <div className={styles.bloco}>
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
                  label="Tempo de leitura (min)"
                  placeholder="Ex: 5"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  type="number"
                  required
                  width="100%"
                />
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

              <AdmEditor value={conteudo} onChange={setConteudo} />

              <TagInput
                label="Tags"
                selected={tags}
                onChange={setTags}
                width="100%"
              />

              {error && <p className={styles.error}>{error}</p>}
            </div>
          </div>
        </form>
      </div>
    </AdmLayout>
  );
}
