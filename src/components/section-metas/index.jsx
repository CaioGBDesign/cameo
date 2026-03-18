import { useState } from "react";
import styles from "./index.module.scss";
import CardMeta from "@/components/card-meta";
import Button from "@/components/button";
import CriarMeta from "@/components/modais/criar-meta";
import { useAuth } from "@/contexts/auth";
import { contarFilmesPorPeriodo } from "@/utils/metas";

export default function SectionMetas() {
  const { user } = useAuth();
  const [modalAberto, setModalAberto] = useState(false);

  const visto = user?.visto || {};

  const metas = (Array.isArray(user?.metas) ? user.metas : [])
    .map((meta) => ({
      ...meta,
      filmesVistos: contarFilmesPorPeriodo(visto, meta.periodo),
    }))
    .sort((a, b) => {
      const percA = b.filmesVistos / b.quantidade;
      const percB = a.filmesVistos / a.quantidade;
      return percA - percB;
    })
    .slice(0, 2);

  return (
    <>
      <div className={styles.section}>
        <div className={styles.metas}>
          {metas.map((meta) => (
            <CardMeta
              key={meta.id}
              meta={meta}
              filmesVistos={meta.filmesVistos}
            />
          ))}
        </div>

        <div className={styles.botoes}>
          <Button
            variant="outline"
            label="Ver todas"
            border="var(--stroke-submit)"
            arrowColor="var(--stroke-submit)"
            width="100%"
            bg="none"
          />
          <Button
            variant="outline"
            label="Criar meta"
            border="var(--stroke-solid)"
            arrowColor="var(--stroke-solid)"
            width="100%"
            onClick={() => setModalAberto(true)}
            bg="none"
          />
        </div>
      </div>

      {modalAberto && <CriarMeta onClose={() => setModalAberto(false)} />}
    </>
  );
}
