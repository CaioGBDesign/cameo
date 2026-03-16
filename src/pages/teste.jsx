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
            <Button variant="soft" label="Soft" icon={<NewsIcon size={16} color="currentColor" />} />
            <Button variant="ghost" label="Ghost" />
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Com ícone</h2>
          <div className={styles.secaoItens}>
            <Button variant="gradiente" label="Com ícone" icon={<NewsIcon size={16} color="currentColor" />} />
            <Button variant="solid" label="Com ícone" icon={<NewsIcon size={16} color="currentColor" />} />
            <Button variant="outline" label="Com ícone" icon={<NewsIcon size={16} color="currentColor" />} />
            <Button variant="soft" label="Com ícone" icon={<NewsIcon size={16} color="currentColor" />} />
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Soft — cores customizadas</h2>
          <div className={styles.secaoItens}>
            <Button variant="soft" label="Default" icon={<NewsIcon size={16} color="currentColor" />} />
            <Button variant="soft" label="Roxo" icon={<NewsIcon size={16} color="var(--primitive-roxo-01)" />} bg="var(--primitive-roxo-01)" color="white" />
            <Button variant="soft" label="Azul" icon={<NewsIcon size={16} color="var(--primitive-azul-01)" />} bg="var(--primitive-azul-01)" color="white" />
            <Button variant="soft" label="Rosa" icon={<NewsIcon size={16} color="var(--primitive-rosa-01)" />} bg="var(--primitive-rosa-01)" color="white" />
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Apenas ícone</h2>
          <div className={styles.secaoItens}>
            <Button variant="solid" icon={<NewsIcon size={20} color="currentColor" />} />
            <Button variant="outline" icon={<NewsIcon size={20} color="currentColor" />} />
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Com estrelas</h2>
          <div className={styles.secaoItens}>
            <Button variant="outline" stars={1} />
            <Button variant="outline" stars={2} />
            <Button variant="outline" stars={3} />
            <Button variant="outline" stars={4} />
            <Button variant="outline" stars={5} />
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Outline — cores de borda</h2>
          <div className={styles.secaoItens}>
            <Button variant="outline" label="Roxo 01" border="var(--primitive-roxo-01)" arrowColor="var(--primitive-roxo-01)" />
            <Button variant="outline" label="Roxo 02" border="var(--primitive-roxo-02)" arrowColor="var(--primitive-roxo-02)" />
            <Button variant="outline" label="Rosa" border="var(--primitive-rosa-01)" arrowColor="var(--primitive-rosa-01)" />
            <Button variant="outline" label="Azul" border="var(--primitive-azul-01)" arrowColor="var(--primitive-azul-01)" />
            <Button variant="outline" label="Amarelo" border="var(--primitive-amarelo-01)" arrowColor="var(--primitive-amarelo-01)" />
            <Button variant="outline" label="Verde" border="var(--primitive-verde-01)" arrowColor="var(--primitive-verde-01)" />
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Largura customizada</h2>
          <div className={styles.secaoItens}>
            <Button variant="outline" label="220px" width="220px" />
            <Button variant="solid" label="100%" width="100%" />
          </div>
        </section>

        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Desabilitado</h2>
          <div className={styles.secaoItens}>
            <Button variant="gradiente" label="Gradiente" disabled />
            <Button variant="solid" label="Solid" disabled />
            <Button variant="outline" label="Outline" disabled />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
