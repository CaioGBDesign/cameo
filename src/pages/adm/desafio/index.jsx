import { useState, useEffect } from "react";
import Head from "next/head";
import { db, storage } from "@/services/firebaseConection";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useToast } from "@/contexts/toast";
import AdmLayout from "@/components/adm/layout";
import AdmModal, { AdmModalFooter } from "@/components/adm/modal";
import DiagonalArrowIcon from "@/components/icons/DiagonalArrowIcon";
import DocumentIcon from "@/components/icons/DocumentIcon";
import UploadImagem from "@/components/upload-imagem";
import ListCard from "@/components/adm/list-card";
import Button from "@/components/button";
import TextInput from "@/components/inputs/text-input";
import Select from "@/components/inputs/select";
import styles from "./index.module.scss";
import modalStyles from "./modal.module.scss";
import Link from "next/link";

const TIPOS_PERGUNTA = [
  { value: "1", label: "Completar a fala" },
  { value: "2", label: "Identificar filme pelo elenco" },
  { value: "3", label: "Identificar filme pelo ano de lançamento" },
  { value: "4", label: "Identificar filme por emoji" },
  { value: "5", label: "Relacionar elementos" },
  { value: "6", label: "Identificar filme por imagem" },
  { value: "7", label: "A definir", disabled: true },
  { value: "8", label: "A definir", disabled: true },
  { value: "9", label: "Identificar diretor" },
  { value: "10", label: "Identificar ator/atriz" },
  { value: "11", label: "Verdadeiro ou falso" },
  { value: "12", label: "Ordem cronológica" },
  { value: "13", label: "A definir", disabled: true },
  { value: "14", label: "Identificar personagem" },
  { value: "15", label: "Identificar gênero do filme" },
  { value: "16", label: "Identificar filme por sinopse" },
  { value: "17", label: "Identificar franquia" },
  { value: "18", label: "Identificar dublador" },
];


export default function AdmDesafio() {
  const [heroBannerDesktop, setHeroBannerDesktop] = useState(null);
  const [heroBannerMobile, setHeroBannerMobile] = useState(null);
  const [rankingGeralDesktop, setRankingGeralDesktop] = useState(null);
  const [rankingGeralMobile, setRankingGeralMobile] = useState(null);
  const [sessaoPerguntasDesktop, setSessaoPerguntasDesktop] = useState(null);
  const [sessaoPerguntasMobile, setSessaoPerguntasMobile] = useState(null);
  const [bannersTipo, setBannersTipo] = useState(Array(5).fill(null));
  const [titulosTipo, setTitulosTipo] = useState(Array(5).fill(""));
  const [tiposPergunta, setTiposPergunta] = useState(Array(5).fill(""));
  const [descricoesTipo, setDescricoesTipo] = useState(Array(5).fill(""));
  const [modalTipoIdx, setModalTipoIdx] = useState(null);
  const [modalImagem, setModalImagem] = useState(null);
  const [modalTitulo, setModalTitulo] = useState("");
  const [modalTipo, setModalTipo] = useState("");
  const [modalDescricao, setModalDescricao] = useState("");
  const [logoDesafio, setLogoDesafio] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getDoc(doc(db, "configuracoes", "desafio")).then((snap) => {
      if (!snap.exists()) return;
      const d = snap.data();
      const toImg = (url) => (url ? { file: null, preview: url } : null);
      if (d.heroBannerDesktop) setHeroBannerDesktop(toImg(d.heroBannerDesktop));
      if (d.heroBannerMobile) setHeroBannerMobile(toImg(d.heroBannerMobile));
      if (d.rankingGeralDesktop)
        setRankingGeralDesktop(toImg(d.rankingGeralDesktop));
      if (d.rankingGeralMobile)
        setRankingGeralMobile(toImg(d.rankingGeralMobile));
      if (d.sessaoPerguntasDesktop)
        setSessaoPerguntasDesktop(toImg(d.sessaoPerguntasDesktop));
      if (d.sessaoPerguntasMobile)
        setSessaoPerguntasMobile(toImg(d.sessaoPerguntasMobile));
      if (d.logoDesafio) setLogoDesafio(toImg(d.logoDesafio));
      if (Array.isArray(d.bannersTipo)) {
        setBannersTipo(d.bannersTipo.slice(0, 5).map((url) => toImg(url)));
      }
      if (Array.isArray(d.titulosTipo)) setTitulosTipo(d.titulosTipo.slice(0, 5));
      if (Array.isArray(d.tiposPergunta)) setTiposPergunta(d.tiposPergunta.slice(0, 5));
      if (Array.isArray(d.descricoesTipo)) setDescricoesTipo(d.descricoesTipo.slice(0, 5));
    });
  }, []);

  const abrirModal = (i) => {
    setModalTipoIdx(i);
    setModalImagem(bannersTipo[i]);
    setModalTitulo(titulosTipo[i] ?? "");
    setModalTipo(tiposPergunta[i] ?? "");
    setModalDescricao(descricoesTipo[i] ?? "");
  };

  const fecharModal = () => setModalTipoIdx(null);

  const confirmarModal = () => {
    const i = modalTipoIdx;
    setBannersTipo((prev) =>
      prev.map((b, idx) => (idx === i ? modalImagem : b)),
    );
    setTitulosTipo((prev) =>
      prev.map((t, idx) => (idx === i ? modalTitulo : t)),
    );
    setTiposPergunta((prev) =>
      prev.map((t, idx) => (idx === i ? modalTipo : t)),
    );
    setDescricoesTipo((prev) =>
      prev.map((t, idx) => (idx === i ? modalDescricao : t)),
    );
    fecharModal();
  };


  const uploadImagem = async (path, file) => {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const getUrl = async (imagem, path) => {
    if (!imagem) return null;
    if (imagem.file) return uploadImagem(path, imagem.file);
    return imagem.preview;
  };

  const handlePublicar = async () => {
    setLoading(true);
    try {
      const [
        logoDesafioUrl,
        heroBannerDesktopUrl,
        heroBannerMobileUrl,
        rankingGeralDesktopUrl,
        rankingGeralMobileUrl,
        sessaoPerguntasDesktopUrl,
        sessaoPerguntasMobileUrl,
      ] = await Promise.all([
        getUrl(logoDesafio, "desafio/logoDesafio"),
        getUrl(heroBannerDesktop, "desafio/heroBannerDesktop"),
        getUrl(heroBannerMobile, "desafio/heroBannerMobile"),
        getUrl(rankingGeralDesktop, "desafio/rankingGeralDesktop"),
        getUrl(rankingGeralMobile, "desafio/rankingGeralMobile"),
        getUrl(sessaoPerguntasDesktop, "desafio/sessaoPerguntasDesktop"),
        getUrl(sessaoPerguntasMobile, "desafio/sessaoPerguntasMobile"),
      ]);

      const bannersTipoUrls = await Promise.all(
        bannersTipo.map((b, i) =>
          getUrl(b, `desafio/bannerTipo_${String(i + 1).padStart(2, "0")}`),
        ),
      );

      await setDoc(
        doc(db, "configuracoes", "desafio"),
        {
          logoDesafio: logoDesafioUrl,
          heroBannerDesktop: heroBannerDesktopUrl,
          heroBannerMobile: heroBannerMobileUrl,
          rankingGeralDesktop: rankingGeralDesktopUrl,
          rankingGeralMobile: rankingGeralMobileUrl,
          sessaoPerguntasDesktop: sessaoPerguntasDesktopUrl,
          sessaoPerguntasMobile: sessaoPerguntasMobileUrl,
          bannersTipo: bannersTipoUrls,
          titulosTipo,
          tiposPergunta,
          descricoesTipo,
          dataAtualizacao: serverTimestamp(),
        },
        { merge: true },
      );
      toast.success("Alterações publicadas com sucesso!", {
        duration: 3000,
        buttons: [{ label: "Fechar" }],
        bg: "var(--primitive-verde-01)",
      });
    } finally {
      setLoading(false);
    }
  };

  const headerActions = (
    <Button
      variant="ghost"
      label={loading ? "Publicando..." : "Publicar alterações"}
      border="var(--stroke-base)"
      disabled={loading}
      onClick={handlePublicar}
    />
  );

  return (
    <AdmLayout headerActions={headerActions}>
      <Head>
        <title>Desafio — Cameo ADM</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.titulo}>
          <div className={styles.tituloContent}>
            <h1>Editar desafio</h1>
            <Link
              href={"/desafio"}
              target="_blank"
              className={styles.linkDesafio}
            >
              <span>cameo.fun/desafio</span>
              <DiagonalArrowIcon size={16} color="var(--icon-secondary)" />
            </Link>
          </div>
        </div>

        <div className={styles.contentArticle}>
          <div className={styles.heroBanner} style={{ width: "49%" }}>
            <div className={styles.tituloContent}>
              <div className={styles.boxIcon}>
                <DocumentIcon size={24} color="var(--stroke-solid)" />
              </div>
              <span>Hero banner</span>
            </div>
            <div className={styles.uploadImages}>
              <div className={styles.desktopImage}>
                <UploadImagem
                  imagem={heroBannerDesktop}
                  onImagemChange={(file) =>
                    setHeroBannerDesktop(
                      file
                        ? { file, preview: URL.createObjectURL(file) }
                        : null,
                    )
                  }
                  dimensoes="Dimensões recomendadas 1924x600"
                  className={styles.uploadFull}
                />
              </div>
              <div className={styles.mobileImage}>
                <UploadImagem
                  imagem={heroBannerMobile}
                  onImagemChange={(file) =>
                    setHeroBannerMobile(
                      file
                        ? { file, preview: URL.createObjectURL(file) }
                        : null,
                    )
                  }
                  dimensoes="Dimensões recomendadas 430x595"
                />
              </div>
            </div>
          </div>

          <div className={styles.heroBanner} style={{ width: "20%" }}>
            <div className={styles.tituloContent}>
              <div className={styles.boxIcon}>
                <DocumentIcon size={24} color="var(--stroke-solid)" />
              </div>
              <span>Logo Cameo Desafio</span>
            </div>
            <div className={styles.uploadImages}>
              <div className={styles.desktopImage}>
                <UploadImagem
                  imagem={logoDesafio}
                  onImagemChange={(file) =>
                    setLogoDesafio(
                      file
                        ? { file, preview: URL.createObjectURL(file) }
                        : null,
                    )
                  }
                  accept="image/svg+xml,image/*"
                  dimensoes="SVG recomendado"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.contentArticle}>
          <div className={styles.heroBanner}>
            <div className={styles.tituloContent}>
              <div className={styles.boxIcon}>
                <DocumentIcon size={24} color="var(--stroke-solid)" />
              </div>
              <span>Sessão de perguntas</span>
            </div>
            <div className={styles.uploadImages}>
              <div className={styles.desktopImage}>
                <UploadImagem
                  imagem={sessaoPerguntasDesktop}
                  onImagemChange={(file) =>
                    setSessaoPerguntasDesktop(
                      file
                        ? { file, preview: URL.createObjectURL(file) }
                        : null,
                    )
                  }
                  dimensoes="Dimensões recomendadas 1924x600"
                  className={styles.uploadFull}
                />
              </div>
              <div className={styles.mobileImage}>
                <UploadImagem
                  imagem={sessaoPerguntasMobile}
                  onImagemChange={(file) =>
                    setSessaoPerguntasMobile(
                      file
                        ? { file, preview: URL.createObjectURL(file) }
                        : null,
                    )
                  }
                  dimensoes="Dimensões recomendadas 430x595"
                />
              </div>
            </div>
          </div>

          <div className={styles.heroBanner}>
            <div className={styles.tituloContent}>
              <div className={styles.boxIcon}>
                <DocumentIcon size={24} color="var(--stroke-solid)" />
              </div>
              <span>Ranking geral</span>
            </div>
            <div className={styles.uploadImages}>
              <div className={styles.desktopImage}>
                <UploadImagem
                  imagem={rankingGeralDesktop}
                  onImagemChange={(file) =>
                    setRankingGeralDesktop(
                      file
                        ? { file, preview: URL.createObjectURL(file) }
                        : null,
                    )
                  }
                  dimensoes="Dimensões recomendadas 1924x600"
                  className={styles.uploadFull}
                />
              </div>
              <div className={styles.mobileImage}>
                <UploadImagem
                  imagem={rankingGeralMobile}
                  onImagemChange={(file) =>
                    setRankingGeralMobile(
                      file
                        ? { file, preview: URL.createObjectURL(file) }
                        : null,
                    )
                  }
                  dimensoes="Dimensões recomendadas 430x595"
                />
              </div>
            </div>
          </div>
        </div>

        <h2>Banners por tipo</h2>

        <div className={styles.bannersPorTipo}>
          {Array.from({ length: 5 }, (_, i) => (
            <ListCard
              key={i}
              placeholder={
                tiposPergunta[i]
                  ? (TIPOS_PERGUNTA.find((t) => t.value === tiposPergunta[i])?.label ?? "Configurar exibição")
                  : "Configurar exibição"
              }
              onAdicionar={() => abrirModal(i)}
            >
              {bannersTipo[i] && (
                <img
                  src={bannersTipo[i].preview}
                  alt={`Banner tipo ${i + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "var(--space-lg)",
                    border: "1px solid var(--stroke-base)",
                  }}
                />
              )}
              {descricoesTipo[i] && (
                <span style={{
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                  color: "var(--text-sub)",
                  lineHeight: "1.4",
                }}>
                  {descricoesTipo[i]}
                </span>
              )}
            </ListCard>
          ))}
        </div>
      </div>

      <AdmModal
        isOpen={modalTipoIdx !== null}
        onClose={fecharModal}
        title="Tipo de pergunta"
      >
        <div className={modalStyles.modalBody}>
          <UploadImagem
            imagem={modalImagem}
            onImagemChange={(file) =>
              setModalImagem(
                file ? { file, preview: URL.createObjectURL(file) } : null,
              )
            }
            dimensoes="Dimensões recomendadas 250x140"
            className={modalStyles.uploadFull}
          />
          <TextInput
            label="Título da pergunta"
            placeholder="Digite o título"
            value={modalTitulo}
            onChange={(e) => setModalTitulo(e.target.value)}
          />
          <Select
            label="Selecione o tipo de pergunta"
            placeholder="Selecione"
            options={TIPOS_PERGUNTA}
            value={modalTipo}
            onChange={(e) => setModalTipo(e.target.value)}
          />
          <TextInput
            label="Descrição"
            placeholder="Digite a descrição"
            value={modalDescricao}
            onChange={(e) => setModalDescricao(e.target.value)}
          />
        </div>
        <AdmModalFooter onCancel={fecharModal} onConfirm={confirmarModal} />
      </AdmModal>
    </AdmLayout>
  );
}
