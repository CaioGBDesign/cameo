import styles from "./index.module.scss";

const ElementoInstagramEmbed = ({ index, elemento }) => {
  return (
    <div key={index} className={styles.FormGroup}>
      <div className={styles.instagramEmbed}>
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink={elemento.conteudo}
          data-instgrm-version="14"
        >
          {/* O conteúdo mockado que simula um embed */}
          <div style={{ padding: "16px" }}>
            <a
              href={elemento.conteudo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "#FFFFFF",
                lineHeight: 0,
                padding: "0 0",
                textAlign: "center",
                textDecoration: "none",
                width: "100%",
              }}
            >
              {/* O conteúdo visual é mantido aqui */}
              {/* ... (o resto do SVG e estilizações) */}
              <div style={{ paddingTop: 8 }}>
                <div
                  style={{
                    color: "#3897f0",
                    fontFamily: "Arial,sans-serif",
                    fontSize: 14,
                    fontStyle: "normal",
                    fontWeight: 550,
                    lineHeight: 18,
                  }}
                >
                  Ver essa foto no Instagram
                </div>
              </div>
            </a>
          </div>
        </blockquote>
      </div>
    </div>
  );
};

export default ElementoInstagramEmbed;
