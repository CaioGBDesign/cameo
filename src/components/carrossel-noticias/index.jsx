import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { useRouter } from "next/router";

const CarrosselNoticias = ({ noticias, tipo }) => {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % noticias.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [noticias.length]);

  const encontrarImagem = (noticia) => {
    return (
      noticia.elementos.find((el) => el.tipo === "imagem")?.conteudo ||
      "/background/placeholder.jpg"
    );
  };

  return (
    <article
      className={`${styles.ultimasNoticiasECriticas} ${
        tipo === "noticias" ? styles.larguraNoticias : styles.larguraPadrao
      }`}
    >
      <div className={styles.ultimasNoticias}>
        <div className={styles.dotsCarrossel}>
          {noticias.map((_, index) => (
            <button
              key={index}
              className={`${styles.dots} ${
                index === activeSlide ? styles.dotsAtivo : ""
              }`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>

        <div className={styles.carrossel}>
          <div
            className={styles.slidesContainer}
            style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          >
            {noticias.map((noticia) => (
              <div
                key={noticia.id}
                className={styles.resumoNoticia}
                onClick={() => router.push(`/noticias/detalhes/${noticia.id}`)}
              >
                <div className={styles.tagNoticia}>
                  <span>Notícia</span>
                </div>

                <div className={styles.informacoesNoticia}>
                  <h1>{noticia.titulo}</h1>
                  <div className={styles.numeroNoticia}>
                    <img src="icones/relogio.svg" alt="Tempo de leitura" />
                    {noticia.numero} min de leitura
                  </div>
                </div>

                <div className={styles.imagemNoticia}>
                  <img
                    src={encontrarImagem(noticia)}
                    alt="Capa Noticia"
                    onError={(e) => {
                      e.target.src = "/background/placeholder.jpg";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

export default CarrosselNoticias;
