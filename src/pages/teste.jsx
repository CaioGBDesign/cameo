import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/button";
import NewsIcon from "@/components/icons/NewsIcon";
import styles from "./teste.module.scss";

export default function Teste() {
  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.titulo}>Botões</h1>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Variantes base</h2>
          <div className={styles.secaoItens}>
            <Button variant="gradiente" label="Gradiente" />
            <Button variant="solid" label="Solid" />
            <Button variant="submit" label="Submit" />
            <Button variant="outline" label="Outline" />
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Outline — cores de borda</h2>
          <div className={styles.secaoItens}>
            <Button
              variant="outline"
              label="Roxo 01"
              border="var(--primitive-roxo-01)"
              arrowColor="var(--primitive-roxo-01)"
            />
            <Button
              variant="outline"
              label="Roxo 02"
              border="var(--primitive-roxo-02)"
              arrowColor="var(--primitive-roxo-02)"
            />
            <Button
              variant="outline"
              label="Rosa"
              border="var(--primitive-rosa-01)"
              arrowColor="var(--primitive-rosa-01)"
            />
            <Button
              variant="outline"
              label="Azul"
              border="var(--primitive-azul-01)"
              arrowColor="var(--primitive-azul-01)"
            />
            <Button
              variant="outline"
              label="Amarelo"
              border="var(--primitive-amarelo-01)"
              arrowColor="var(--primitive-amarelo-01)"
            />
            <Button
              variant="outline"
              label="Verde"
              border="var(--primitive-verde-01)"
              arrowColor="var(--primitive-verde-01)"
            />
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Outline — largura customizada</h2>
          <div className={styles.secaoItens}>
            <Button variant="outline" label="220px de largura" width="220px" />
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Outline — com ícone / estrelas</h2>
          <div className={styles.secaoItens}>
            <Button
              variant="outline"
              label="Com ícone"
              icon={<NewsIcon size={16} color="currentColor" />}
            />
            <Button variant="outline" stars={1} />
            <Button variant="outline" stars={2} />
            <Button variant="outline" stars={3} />
            <Button variant="outline" stars={4} />
            <Button variant="outline" stars={5} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
