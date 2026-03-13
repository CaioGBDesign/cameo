import { useState, useRef } from "react";
import Header from "@/components/Header";
import Button from "@/components/button";
import Modal from "@/components/modal";
import Checkbox from "@/components/inputs/checkbox";
import CheckboxCard from "@/components/inputs/checkbox-card";
import Switch from "@/components/inputs/switch";
import SectionCard from "@/components/section-card";
import ArrowButton from "@/components/arrow-button";
import NewsIcon from "@/components/icons/NewsIcon";
import ListIcon from "@/components/icons/ListIcon";
import styles from "./teste.module.scss";

const Secao = ({ titulo, children }) => (
  <section className={styles.secao}>
    <h2 className={styles.secaoTitulo}>{titulo}</h2>
    <div className={styles.secaoItens}>{children}</div>
  </section>
);

export default function Teste() {
  const [modalAberto, setModalAberto] = useState(false);
  const [cb1, setCb1] = useState(false);
  const [cb2, setCb2] = useState(true);
  const [cc1, setCc1] = useState(false);
  const [cc2, setCc2] = useState(true);
  const [cc3, setCc3] = useState(false);
  const [cc4, setCc4] = useState(true);
  const [cb5, setCb5] = useState(false);
  const [cb6, setCb6] = useState(true);
  const [cb7, setCb7] = useState(false);
  const [cb8, setCb8] = useState(true);
  const [sw1, setSw1] = useState(false);
  const [sw2, setSw2] = useState(true);
  const carrosselRef = useRef(null);

  return (
    <div className={styles.page}>
      <Header />

      <h1 className={styles.titulo}>Componentes — Página de Teste</h1>

      <h1 className={styles.titulo}>Checkbox</h1>

      <Secao titulo="Primitivo — sem label / com label / com link">
        <Checkbox
          id="cb-bare"
          checked={cb1}
          onChange={(e) => setCb1(e.target.checked)}
        />
        <Checkbox
          id="cb-label"
          label="Com label"
          checked={cb2}
          onChange={(e) => setCb2(e.target.checked)}
        />
        <Checkbox
          id="cb-link"
          checked={cb1}
          onChange={(e) => setCb1(e.target.checked)}
          label={
            <>
              Aceito os{" "}
              <a href="#" style={{ color: "var(--text-header)" }}>
                termos e condições
              </a>
            </>
          }
        />
      </Secao>

      <h1 className={styles.titulo}>CheckboxCard — variant card</h1>

      <Secao titulo="Com subtexto">
        <CheckboxCard
          id="cc1"
          variant="card"
          label="Label"
          sublabel="Subtexto descritivo"
          checked={cc1}
          onChange={(e) => setCc1(e.target.checked)}
        />
        <CheckboxCard
          id="cc2"
          variant="card"
          label="Label"
          sublabel="Subtexto descritivo"
          checked={cc2}
          onChange={(e) => setCc2(e.target.checked)}
        />
      </Secao>

      <Secao titulo="Sem subtexto">
        <CheckboxCard
          id="cc3"
          variant="card"
          label="Label"
          checked={cc3}
          onChange={(e) => setCc3(e.target.checked)}
        />
        <CheckboxCard
          id="cc4"
          variant="card"
          label="Label"
          checked={cc4}
          onChange={(e) => setCc4(e.target.checked)}
        />
      </Secao>

      <h1 className={styles.titulo}>CheckboxCard — variant bare</h1>

      <Secao titulo="Com subtexto">
        <CheckboxCard
          id="cb5"
          variant="bare"
          label="Label"
          sublabel="Subtexto descritivo"
          checked={cb5}
          onChange={(e) => setCb5(e.target.checked)}
        />
        <CheckboxCard
          id="cb6"
          variant="bare"
          label="Label"
          sublabel="Subtexto descritivo"
          checked={cb6}
          onChange={(e) => setCb6(e.target.checked)}
        />
      </Secao>

      <Secao titulo="Sem subtexto">
        <CheckboxCard
          id="cb7"
          variant="bare"
          label="Label"
          checked={cb7}
          onChange={(e) => setCb7(e.target.checked)}
        />
        <CheckboxCard
          id="cb8"
          variant="bare"
          label="Label"
          checked={cb8}
          onChange={(e) => setCb8(e.target.checked)}
        />
      </Secao>

      <h1 className={styles.titulo}>Switch</h1>

      <Secao titulo="Off / On">
        <Switch
          id="sw1"
          checked={sw1}
          onChange={(e) => setSw1(e.target.checked)}
        />
        <Switch
          id="sw2"
          checked={sw2}
          onChange={(e) => setSw2(e.target.checked)}
        />
      </Secao>

      <h1 className={styles.titulo}>SectionCard</h1>

      <Secao titulo="Com título + ícone de lista + count + verTodos">
        <SectionCard
          title="Resenhas"
          showListIcon
          count={42}
          verTodos={{ label: "Ver todas", href: "/resenhas" }}
        >
          <p style={{ padding: "var(--space-2xl)", color: "var(--text-sub)" }}>
            Conteúdo da seção aqui.
          </p>
        </SectionCard>
      </Secao>

      <Secao titulo="Com título + ícone info + actions">
        <SectionCard
          title="Dubladores"
          showInfoIcon
          actions={[
            {
              label: "Filtrar",
              icon: <ListIcon size={16} color="currentColor" />,
            },
            { label: "Adicionar" },
          ]}
        >
          <p style={{ padding: "var(--space-2xl)", color: "var(--text-sub)" }}>
            Conteúdo da seção aqui.
          </p>
        </SectionCard>
      </Secao>

      <h1 className={styles.titulo}>ArrowButton</h1>

      <Secao titulo="Carrossel com setas de navegação">
        <ArrowButton scrollRef={carrosselRef} />
        <div
          ref={carrosselRef}
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            width: "100%",
            scrollbarWidth: "none",
          }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              style={{
                minWidth: "120px",
                height: "80px",
                background: "var(--bg-overlay)",
                border: "1px solid var(--stroke-base)",
                borderRadius: "var(--space-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-base)",
                flexShrink: 0,
              }}
            >
              Item {i + 1}
            </div>
          ))}
        </div>
      </Secao>

      <h1 className={styles.titulo}>Modal</h1>

      <Secao titulo="Abrir modal">
        <Button
          variant="outline"
          label="Ler resenhas"
          icon={<NewsIcon size={16} color="currentColor" />}
          onClick={() => setModalAberto(true)}
        />
      </Secao>

      {modalAberto && (
        <Modal
          title="Resenhas"
          onClose={() => setModalAberto(false)}
          primaryAction={{
            label: "Confirmar",
            onClick: () => setModalAberto(false),
          }}
          secondaryAction={{
            variant: "ghost",
            mobileVariant: "outline",
            label: "Limpar filtros",
            onClick: () => setModalAberto(false),
          }}
        >
          <p style={{ color: "var(--text-base)" }}>Conteúdo do modal aqui.</p>
        </Modal>
      )}
    </div>
  );
}
