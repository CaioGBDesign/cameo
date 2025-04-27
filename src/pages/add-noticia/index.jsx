import styles from "./index.module.scss";
import { useState, useEffect, useRef } from "react";
import { db, storage } from "@/services/firebaseConection";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/contexts/auth";
import BotaoPrimario from "@/components/botoes/primarios";
import Loading from "@/components/loading";
import { useRouter } from "next/router";
import UploadImagem from "@/components/upload-imagem";
import ElementoParagrafo from "@/components/elemento-paragrafo";
import ElementoInstagramEmbed from "@/components/elemento-instagram-embed";
import generosList from "@/components/listas/tags/generos.json";
import empresasList from "@/components/listas/tags/empresas.json";
import MultiSelectCheckbox from "@/components/multi-select-checkbox";
import { useIsMobile } from "@/components/DeviceProvider";
import Head from "next/head";
import Header from "@/components/Header";
import HeaderDesktop from "@/components/HeaderDesktop";

const AddNoticias = ({ onClose }) => {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [elementos, setElementos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [numero, setNumero] = useState("");
  const [userData, setUserData] = useState(null);
  const textareaRefs = useRef([]);
  const isMobile = useIsMobile();

  const generoOptions = generosList.map((g) => ({
    value: g.name,
    label: g.name,
  }));

  const empresaOptions = empresasList.map((e) => ({
    value: e.name,
    label: e.name,
  }));

  const [empresas, setEmpresas] = useState([]);
  const [generos, setGeneros] = useState([]);

  const TIPO_ELEMENTO = {
    PARAGRAFO: "paragrafo",
    IMAGEM: "imagem",
    INSTAGRAM: "instagram",
  };

  const imagemElemento = elementos.find(
    (el) => el.tipo === TIPO_ELEMENTO.IMAGEM
  );

  const gerarSlug = (titulo) => {
    return titulo
      .toLowerCase()
      .normalize("NFD") // Remove acentos
      .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
      .replace(/[^a-z0-9 ]/g, "") // Mantém apenas letras, números e espaços
      .replace(/\s+/g, "-") // Substitui espaços por hifens
      .replace(/-+/g, "-") // Remove hifens consecutivos
      .trim() // Remove espaços extras no início e fim
      .replace(/^-+|-+$/g, ""); // Remove hifens no início e fim
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserData(data); // Armazena os dados no state
            console.log("Dados do usuário:", data);
          } else {
            console.log("Documento do usuário não encontrado!");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      }
    };

    if (!user) {
      router.push("/login");
    } else {
      setLoading(false);
      fetchUserData();
    }
  }, [user, router]);

  const limparFormulario = () => {
    elementos.forEach((elemento) => {
      if (elemento.tipo === TIPO_ELEMENTO.IMAGEM && elemento.preview) {
        URL.revokeObjectURL(elemento.preview);
      }
    });

    setTitulo("");
    setSubtitulo("");
    setElementos([]);
    setNumero("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    return () => {
      elementos.forEach((elemento) => {
        if (elemento.tipo === TIPO_ELEMENTO.IMAGEM && elemento.preview) {
          URL.revokeObjectURL(elemento.preview);
        }
      });
    };
  }, [elementos]);

  const adicionarElemento = (tipo) => {
    setElementos([
      ...elementos,
      { tipo, conteudo: "", preview: null, file: null },
    ]);
  };

  const handleParagrafoChange = (index, valor) => {
    const novosElementos = [...elementos];
    novosElementos[index].conteudo = valor;
    setElementos(novosElementos);
  };

  const handleImagemChange = (file) => {
    const novosElementos = elementos.filter(
      (el) => el.tipo !== TIPO_ELEMENTO.IMAGEM
    );

    if (file) {
      const preview = URL.createObjectURL(file);
      novosElementos.push({
        tipo: TIPO_ELEMENTO.IMAGEM,
        conteudo: "uploading",
        preview,
        file,
      });
    }

    setElementos(novosElementos);

    // Limpa o input se remover a imagem
    if (!file && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!user || !userData) {
        throw new Error("Dados do usuário não disponíveis");
      }

      const slug = gerarSlug(titulo);
      if (!slug) throw new Error("Título inválido para gerar URL");

      // Verifica se o documento já existe
      const docRef = doc(db, "noticias", slug);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        throw new Error("Já existe uma notícia com este título");
      }

      const elementosProcessados = await Promise.all(
        elementos.map(async (elemento) => {
          if (elemento.tipo === TIPO_ELEMENTO.IMAGEM && elemento.file) {
            const storageRef = ref(
              storage,
              `noticias/${Date.now()}_${elemento.file.name}`
            );
            await uploadBytes(storageRef, elemento.file);
            const url = await getDownloadURL(storageRef);
            return { tipo: elemento.tipo, conteudo: url };
          }
          return elemento;
        })
      );

      // Cria o documento com ID customizado
      await setDoc(docRef, {
        titulo,
        subtitulo,
        numero: Number(numero),
        empresas,
        generos,
        elementos: elementosProcessados,
        autor: {
          id: user.uid,
          nome: userData.nome,
          avatarUrl: userData.avatarUrl,
        },
        dataPublicacao: serverTimestamp(),
        slug,
      });

      limparFormulario();
      window.location.reload();
    } catch (err) {
      console.error("Erro ao publicar:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // função para adicionar o embed
  const adicionarInstagramEmbed = () => {
    const url = prompt("Cole a URL do post do Instagram:");
    if (url) {
      setElementos([
        ...elementos,
        {
          tipo: TIPO_ELEMENTO.INSTAGRAM,
          conteudo: url,
        },
      ]);
    }
  };

  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    } else {
      const script = document.createElement("script");
      script.src = "//www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [elementos]);

  // No mapa de estilos, adicione o link
  const tagMap = {
    bold: {
      abertura: '<strong class="boldtext">',
      fechamento: "</strong>",
    },
    italic: {
      abertura: '<em class="italictext">',
      fechamento: "</em>",
    },
    link: {
      abertura: (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">`,
      fechamento: "</a>",
    },
  };

  // Modifique a função aplicarEstilo
  const aplicarEstilo = (index, tipo) => {
    const textarea = textareaRefs.current[index];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end && tipo === "link") {
      alert("Selecione um texto para adicionar o link");
      return;
    }

    const textoAtual = elementos[index].conteudo;
    const selectedText = textoAtual.substring(start, end);

    let novoTexto = "";

    if (tipo === "link") {
      const url = prompt("Insira a URL do link:");
      if (!url) return;

      novoTexto =
        textoAtual.substring(0, start) +
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText}</a>` +
        textoAtual.substring(end);
    } else {
      const estilo = tagMap[tipo];
      novoTexto =
        textoAtual.substring(0, start) +
        `${estilo.abertura}${selectedText}${estilo.fechamento}` +
        textoAtual.substring(end);
    }

    const novosElementos = [...elementos];
    novosElementos[index].conteudo = novoTexto;
    setElementos(novosElementos);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(end, end);
    }, 0);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main className={styles.ContNoticias}>
      {isMobile ? <Header /> : <HeaderDesktop />}
      <Head>
        <title>Cameo - Home</title>
        <meta
          name="description"
          content="Descubra o filme perfeito com o Cameo! Oferecemos sugestões aleatórias e personalizadas, filtradas por gênero, classificação indicativa, serviços de streaming e muito mais. Crie listas de filmes, avalie suas escolhas e compartilhe com amigos. Mergulhe no mundo do cinema e nunca fique sem o que assistir. Cadastre-se agora e transforme sua experiência cinematográfica!"
        />
      </Head>
      <div className={styles.noticiasForm}>
        <div className={styles.AddNoticia}>
          <form onSubmit={handleSubmit} className={styles.FormNoticia}>
            <div className={styles.scrollNoticia}>
              <div className={styles.conteudoNoticia}>
                <div className={styles.tituloNoticia}>
                  <h1>Adicionar notícia</h1>
                </div>
                <UploadImagem
                  imagem={imagemElemento}
                  onImagemChange={handleImagemChange}
                />

                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  placeholder="Título da notícia"
                  maxLength="120"
                />

                <input
                  type="text"
                  value={subtitulo}
                  onChange={(e) => setSubtitulo(e.target.value)}
                  placeholder="Subtítulo da notícia"
                  maxLength="200"
                />

                <div className={styles.FormGroup}>
                  <input
                    type="number"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    required
                    placeholder="Tempo de leitura"
                    min="0"
                    max={new Date().getFullYear()}
                  />

                  <MultiSelectCheckbox
                    options={generoOptions}
                    selected={generos}
                    onChange={setGeneros}
                    placeholder="Selecione gêneros…"
                  />

                  <MultiSelectCheckbox
                    options={empresaOptions}
                    selected={empresas}
                    onChange={setEmpresas}
                    placeholder="Selecione empresas…"
                  />
                </div>

                {elementos.map((elemento, index) => {
                  if (elemento.tipo === TIPO_ELEMENTO.PARAGRAFO) {
                    return (
                      <ElementoParagrafo
                        key={index}
                        index={index}
                        elemento={elemento}
                        aplicarEstilo={aplicarEstilo}
                        handleParagrafoChange={handleParagrafoChange}
                        textareaRefs={textareaRefs}
                      />
                    );
                  }

                  if (elemento.tipo === TIPO_ELEMENTO.INSTAGRAM) {
                    return (
                      <ElementoInstagramEmbed
                        key={index}
                        index={index}
                        elemento={elemento}
                      />
                    );
                  }

                  return null;
                })}

                <div className={styles.BotoesAcao}>
                  <button
                    type="button"
                    onClick={() => adicionarElemento(TIPO_ELEMENTO.PARAGRAFO)}
                    className={styles.BotaoAdicionar}
                    disabled={loading}
                  >
                    + Parágrafo
                  </button>

                  <button
                    type="button"
                    onClick={adicionarInstagramEmbed}
                    className={styles.BotaoAdicionar}
                    disabled={loading}
                  >
                    + Embed do Instagram
                  </button>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}
              </div>
            </div>

            <BotaoPrimario
              textoBotaoPrimario={
                loading ? "Publicando..." : "Publicar Notícia"
              }
              type="submit"
              disabled={loading}
            />
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddNoticias;
