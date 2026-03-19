import Button from "@/components/button";
import styles from "./index.module.scss";

export default function BlankstateMetas({ onCriar }) {
  return (
    <div className={styles.container}>
      <div className={styles.blankslate}>
        <h2>Adicione metas</h2>
        <p>e desbloqueie recursos da cameo.fun</p>

        {[0, 1, 2].map((i) => (
          <div key={i} className={styles.contentCheck}>
            <div className={styles.chackBars}>
              <div className={styles.allBars}>
                <div className={styles.barGray} />
                <div className={styles.barGray} />
              </div>
              <div className={styles.iconCheck}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3.3335 9.33325L5.66683 11.6666L12.6668 4.33325"
                    stroke="#21D48C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          label="Criar primeira meta"
          border="var(--stroke-solid)"
          arrowColor="var(--stroke-solid)"
          width="100%"
          onClick={onCriar}
          bg="none"
        />
      </div>
    </div>
  );
}
