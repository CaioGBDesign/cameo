import { useState, useEffect } from "react";
import Link from "next/link";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import ClockIcon from "@/components/icons/ClockIcon";
import materiaPadrao from "@/components/background/materia-padrao.jpg";
import styles from "./index.module.scss";

const BannerNoticias = ({ noticias, tagLabel = "Notícia", tagCor }) => {
  const [ativo, setAtivo] = useState(0);
  const total = noticias.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setAtivo((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(interval);
  }, [total]);

  const anterior = () => setAtivo((prev) => (prev - 1 + total) % total);
  const proximo = () => setAtivo((prev) => (prev + 1) % total);

  const encontrarImagem = (noticia) =>
    noticia.imagem ||
    noticia.elementos?.find((el) => el.tipo === "imagem")?.conteudo ||
    materiaPadrao.src;

  return (
    <div className={styles.banner}>
      <div className={styles.slides}>
        {noticias.map((noticia, index) => (
          <Link
            key={noticia.id}
            href={`/noticias/detalhes/${noticia.id}`}
            className={`${styles.slide} ${index === ativo ? styles.ativo : ""}`}
          >
            <img
              src={encontrarImagem(noticia)}
              alt={noticia.titulo}
              className={styles.imagem}
              onError={(e) => { e.target.src = materiaPadrao.src; }}
            />
            <div className={styles.gradiente} />

            <div className={styles.info}>
              <span className={styles.tag} style={tagCor ? { background: tagCor } : undefined}>{tagLabel}</span>
              <h2 className={styles.titulo}>{noticia.titulo}</h2>
              {noticia.numero && (
                <p className={styles.leitura}>
                  <ClockIcon size={16} color="var(--primitive-roxo-02)" />
                  {noticia.numero} minutos de leitura
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={anterior} aria-label="Anterior">
        <ChevronDownIcon size={18} color="var(--icon-base)" className={styles.chevronEsquerda} />
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={proximo} aria-label="Próximo">
        <ChevronDownIcon size={18} color="var(--icon-base)" className={styles.chevronDireita} />
      </button>

      <div className={styles.dots}>
        {noticias.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === ativo ? styles.dotAtivo : ""}`}
            onClick={() => setAtivo(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerNoticias;
