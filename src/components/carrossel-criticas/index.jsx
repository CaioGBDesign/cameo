import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { useRouter } from "next/router";

const CarrosselCriticas = ({ criticas = [], tipo }) => {
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % criticas.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [criticas.length]);

  const encontrarImagem = (critica) => {
    return (
      critica.elementos.find((el) => el.tipo === "imagem")?.conteudo ||
      "https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/background%2Fplaceholder.jpg?alt=media&token=1b8dfa35-bcaa-487c-8ddc-8dec7482cfe5"
    );
  };

  return (
    <article
      className={`${styles.ultimasNoticiasECriticas} ${
        tipo === "criticas" ? styles.larguraNoticias : styles.larguraPadrao
      }`}
    >
      <div className={styles.ultimasCriticas}>
        <div className={styles.dotsCarrossel}>
          {criticas.map((_, index) => (
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
            {criticas.map((critica) => (
              <div
                key={critica.id}
                className={styles.resumoCritica}
                onClick={() => router.push(`/resenhas/detalhes/${critica.id}`)}
              >
                <div className={styles.tagCritica}>
                  <span>{tipo === "criticas" ? "Resenha" : "Notícia"}</span>
                </div>

                <div className={styles.informacoesCritica}>
                  <h1>{critica.titulo}</h1>
                  <div className={styles.numeroCritica}>
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/cameo-67dc1.appspot.com/o/icones%2Frelogio.svg?alt=media&token=5ca19f7c-5421-408d-ae41-15b351db2c38"
                      alt="Tempo de leitura"
                    />
                    {critica.numero} min de leitura
                  </div>
                </div>

                <div className={styles.imagemCritica}>
                  <img
                    src={encontrarImagem(critica)}
                    alt="Capa Crítica"
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

export default CarrosselCriticas;
