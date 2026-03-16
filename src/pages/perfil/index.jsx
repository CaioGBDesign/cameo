import styles from "./index.module.scss";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AvatarEdit from "@/components/avatar/edit";
import NomeUsuario from "@/components/perfil/nomeUsuario";
import Handle from "@/components/perfil/handle";
import Private from "@/components/Private";
import Button from "@/components/button";
import EditIcon from "@/components/icons/EditIcon";
import LogOutIcon from "@/components/icons/LogOutIcon";
import ChevronDownIcon from "@/components/icons/ChevronDownIcon";
import capaDesktop from "@/components/background/capa-perfil-default-desktop.jpg";
import capaMobile from "@/components/background/capa-perfil-default-mobile.jpg";
import SectionCard from "@/components/section-card";
import TextInput from "@/components/inputs/text-input";
import Select from "@/components/inputs/select";
import Modal from "@/components/modal";
import RadioButton from "@/components/inputs/radio-button";
import { useAuth } from "@/contexts/auth";
import { useIsMobile } from "@/components/DeviceProvider";
import { useState } from "react";

const ESTILO_OPTIONS = [
  { value: "potterhead", label: "Potterhead" },
  { value: "meio-sangue", label: "Meio Sangue" },
  { value: "tolkienistas", label: "Tolkienistas" },
  { value: "whovians", label: "Whovians" },
  { value: "trekkies", label: "Trekkies" },
  { value: "jedis-padawans", label: "Jedis/Padawans" },
  { value: "jack-sparrows-crew", label: "Jack Sparrow's Crew" },
  { value: "twilighters", label: "Twilighters" },
  { value: "iniciados", label: "Iniciados" },
  { value: "narnianos", label: "Narnianos" },
  { value: "marvelmaniaco", label: "Marvelmaníaco" },
  { value: "dcnautas", label: "DCnautas" },
];

const PerfilUsuario = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const [nome, setNome] = useState(user?.nome ?? "");
  const [handle, setHandle] = useState(user?.handle ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [genero, setGenero] = useState(user?.genero ?? "");
  const [estilo, setEstilo] = useState(user?.estilo ?? "");

  const [estiloModalOpen, setEstiloModalOpen] = useState(false);
  const [pendingEstilo, setPendingEstilo] = useState(estilo);

  const handleOpenEstiloModal = () => {
    setPendingEstilo(estilo);
    setEstiloModalOpen(true);
  };

  const handleConfirmEstilo = () => {
    setEstilo(pendingEstilo);
    setEstiloModalOpen(false);
  };

  const estiloLabel = ESTILO_OPTIONS.find((o) => o.value === estilo)?.label;

  return (
    <Private>
      <Head>
        <title>Cameo - Perfil</title>
        <meta
          name="description"
          content="Gerencie suas informações pessoais e preferências de filmes no seu perfil."
        />
      </Head>
      <div className={styles.container}>
        <Header />
        <div className={styles.TopoInfoPerfil}>
          <div className={styles.alterarCapa}>
            <Button
              variant="outline"
              label="Alterar capa"
              icon={<EditIcon size={16} color="currentColor" />}
              width="100%"
              arrowColor="var(--stroke-base)"
              border="var(--stroke-base)"
              bg="var(--bg-base)"
            />
          </div>
          <div className={styles.infoPrincipal}>
            <AvatarEdit />
            <NomeUsuario />
            <Handle />
          </div>

          <div className={styles.progresso}>
            <div className={styles.perfilStatus}>
              <span>Perfil iniciante</span>
            </div>
            <div className={styles.barProgresso}>
              <div className={styles.percentual}></div>
            </div>
          </div>

          <div className={styles.backgroundPerfil}>
            <img
              src={capaDesktop.src}
              alt="Capa do perfil"
              className={styles.capaDesktop}
            />
          </div>
        </div>

        <div className={styles.sectionsCards}>
          <SectionCard title="Dados pessoais">
            <div className={styles.conteudoSectionCard}>
              <TextInput
                id="nome"
                name="nome"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                width="100%"
              />
              <TextInput
                id="handle"
                name="handle"
                placeholder="seuhandle"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                width="100%"
              />
              <TextInput
                id="email"
                name="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                width="100%"
              />
              <Select
                placeholder={genero || "Selecione o gênero"}
                value={genero}
                onChange={setGenero}
                width="100%"
                options={[
                  { value: "masculino", label: "Masculino" },
                  { value: "feminino", label: "Feminino" },
                  { value: "nao-binario", label: "Não-binário" },
                  {
                    value: "prefiro-nao-informar",
                    label: "Prefiro não informar",
                  },
                ]}
              />
            </div>
          </SectionCard>

          <SectionCard title="Configurações">
            <div className={styles.conteudoSectionCard}>
              {isMobile ? (
                <button
                  className={styles.selectBtn}
                  onClick={handleOpenEstiloModal}
                >
                  <span>{estiloLabel || "Estilo cinéfilo"}</span>
                  <ChevronDownIcon
                    size={16}
                    color="currentColor"
                    className={styles.selectBtnChevron}
                  />
                </button>
              ) : (
                <Select
                  placeholder={estiloLabel || "Estilo cinéfilo"}
                  value={estilo}
                  onChange={setEstilo}
                  width="100%"
                  options={ESTILO_OPTIONS}
                />
              )}
              <Button
                variant="soft"
                label="Sair"
                icon={<LogOutIcon size={16} color="currentColor" />}
                width="100%"
                bg="var(--bg-base)"
              />
              <Button
                variant="outline"
                label="Alterar senha"
                width="100%"
                border="var(--stroke-base)"
                arrowColor="var(--stroke-base)"
              />
              <Button variant="solid" label="Salvar alterações" width="100%" />
            </div>
          </SectionCard>
        </div>
      </div>

      <div className={styles.backgroundPerfilMobile}>
        <img
          src={capaMobile.src}
          alt="Capa do perfil"
          className={styles.capaMobile}
        />
      </div>
      <Footer />

      {estiloModalOpen && (
        <Modal
          title="Estilo cinéfilo"
          onClose={() => setEstiloModalOpen(false)}
          primaryAction={{
            label: "Selecionar",
            onClick: handleConfirmEstilo,
          }}
        >
          <div className={styles.estiloOpcoes}>
            {ESTILO_OPTIONS.map((op) => (
              <RadioButton
                key={op.value}
                label={op.label}
                checked={pendingEstilo === op.value}
                onChange={() => setPendingEstilo(op.value)}
                iconVariant="none"
              />
            ))}
          </div>
        </Modal>
      )}
    </Private>
  );
};

export default PerfilUsuario;
