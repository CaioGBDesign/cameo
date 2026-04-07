import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { db } from "@/services/firebaseConection";
import {
  collection, getDocs, doc, updateDoc, deleteDoc, setDoc, serverTimestamp,
} from "firebase/firestore";
import { createPortal } from "react-dom";
import AdmLayout from "@/components/adm/layout";
import Button from "@/components/button";
import TrashIcon from "@/components/icons/TrashIcon";
import EditIcon from "@/components/icons/EditIcon";
import styles from "./index.module.scss";

const IcoVisualizar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M14.3627 7.36325C14.5654 7.64745 14.6667 7.78959 14.6667 7.99992C14.6667 8.21025 14.5654 8.35238 14.3627 8.63658C13.452 9.91365 11.1262 12.6666 8.00004 12.6666C4.87389 12.6666 2.54811 9.91365 1.6374 8.63658C1.43471 8.35238 1.33337 8.21025 1.33337 7.99992C1.33337 7.78959 1.43471 7.64745 1.6374 7.36325C2.54811 6.08621 4.87389 3.33325 8.00004 3.33325C11.1262 3.33325 13.452 6.08621 14.3627 7.36325Z" stroke="currentColor"/>
    <path d="M10 8C10 6.8954 9.1046 6 8 6C6.8954 6 6 6.8954 6 8C6 9.1046 6.8954 10 8 10C9.1046 10 10 9.1046 10 8Z" stroke="currentColor"/>
  </svg>
);

const IcoDuplicar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#dup)">
      <path d="M11.3092 5.98798C11.3076 4.02121 11.2778 3.00248 10.7052 2.30494C10.5947 2.17022 10.4712 2.04671 10.3365 1.93616C9.60057 1.33228 8.5073 1.33228 6.32062 1.33228C4.13396 1.33228 3.04064 1.33228 2.30476 1.93616C2.17004 2.0467 2.04651 2.17022 1.93595 2.30494C1.33203 3.04077 1.33203 4.13402 1.33203 6.32052C1.33203 8.50705 1.33203 9.60025 1.93595 10.3361C2.0465 10.4708 2.17004 10.5943 2.30476 10.7048C3.00234 11.2774 4.02115 11.3071 5.98804 11.3087" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.35224 6.01645L11.3294 5.98804M9.34291 14.6676L11.32 14.6392M14.6478 9.34815L14.6291 11.3213M6.00693 9.35722L5.98828 11.3303M7.65824 6.01645C7.10304 6.11589 6.21191 6.21817 6.00693 7.36595M12.9964 14.6392C13.5531 14.5483 14.4457 14.4597 14.6684 13.3152M12.9964 6.01645C13.5516 6.11589 14.4428 6.21817 14.6478 7.36595M7.66671 14.6383C7.11151 14.5392 6.2203 14.4374 6.01469 13.2897" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs><clipPath id="dup"><rect width="16" height="16" fill="white"/></clipPath></defs>
  </svg>
);

const IcoRascunho = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M5.33337 4.66675H10.6667" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.33337 7.33325H8.00004" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.66663 14.3333V13.9999C8.66663 12.1143 8.66663 11.1715 9.25243 10.5857C9.83823 9.99992 10.781 9.99992 12.6666 9.99992H13M13.3333 8.89532V6.66658C13.3333 4.15243 13.3333 2.89535 12.5522 2.1143C11.7712 1.33325 10.5141 1.33325 7.99996 1.33325C5.48581 1.33325 4.22873 1.33325 3.44767 2.1143C2.66663 2.89535 2.66663 4.15243 2.66663 6.66658V9.69605C2.66663 11.8594 2.66663 12.9411 3.25734 13.6737C3.37668 13.8217 3.5115 13.9565 3.65951 14.0759C4.39217 14.6666 5.47384 14.6666 7.63716 14.6666C8.10756 14.6666 8.34269 14.6666 8.55809 14.5906C8.60289 14.5748 8.64676 14.5566 8.68963 14.5361C8.89569 14.4375 9.06196 14.2713 9.39456 13.9387L12.5522 10.781C12.9376 10.3956 13.1303 10.2029 13.2318 9.95785C13.3333 9.71285 13.3333 9.44032 13.3333 8.89532Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IcoCancelarAgendamento = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10.6667 1.33325V3.99992M5.33337 1.33325V3.99992" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 9.33341V8.00008C14 5.48592 14 4.22885 13.2189 3.44779C12.4379 2.66675 11.1808 2.66675 8.66667 2.66675H7.33333C4.81917 2.66675 3.5621 2.66675 2.78105 3.44779C2 4.22885 2 5.48592 2 8.00008V9.33341C2 11.8475 2 13.1047 2.78105 13.8857C3.5621 14.6667 4.81917 14.6667 7.33333 14.6667H8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 6.66675H14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.1854 10.8147L10.1616 13.8384M14 12.3333C14 13.622 12.9554 14.6667 11.6667 14.6667C10.378 14.6667 9.33337 13.622 9.33337 12.3333C9.33337 11.0447 10.378 10 11.6667 10C12.9554 10 14 11.0447 14 12.3333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IcoArquivar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2.66663 8.00019V9.69632C2.66663 11.8597 2.66663 12.9413 3.25734 13.674C3.37668 13.822 3.5115 13.9569 3.65951 14.0762C4.39217 14.6669 5.47384 14.6669 7.63716 14.6669C8.10756 14.6669 8.34269 14.6669 8.55809 14.5909C8.60289 14.5751 8.64676 14.5569 8.68963 14.5364C8.89569 14.4379 9.06196 14.2715 9.39456 13.9389L12.5522 10.7813C12.9376 10.3959 13.1303 10.2032 13.2318 9.95819C13.3333 9.71312 13.3333 9.44066 13.3333 8.89566V6.66686C13.3333 4.15271 13.3333 2.89564 12.5522 2.11459C11.8462 1.40848 10.751 1.34074 8.68963 1.33423M8.66663 14.3335V14.0002C8.66663 12.1146 8.66663 11.1718 9.25243 10.586C9.83823 10.0002 10.781 10.0002 12.6666 10.0002H13" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2.66663 5.48685V3.6407C2.66663 2.36619 3.71129 1.33301 4.99996 1.33301C6.28863 1.33301 7.33329 2.36619 7.33329 3.6407V6.17916C7.33329 6.8164 6.81096 7.333 6.16663 7.333C5.52229 7.333 4.99996 6.8164 4.99996 6.17916V3.6407" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IcoDeletar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M13 3.66675L12.5869 10.3501C12.4813 12.0577 12.4285 12.9115 12.0005 13.5253C11.7889 13.8288 11.5165 14.0849 11.2005 14.2774C10.5614 14.6667 9.706 14.6667 7.99513 14.6667C6.28208 14.6667 5.42553 14.6667 4.78603 14.2767C4.46987 14.0839 4.19733 13.8273 3.98579 13.5233C3.55792 12.9085 3.5063 12.0535 3.40307 10.3435L3 3.66675" stroke="currentColor" strokeLinecap="round"/>
    <path d="M2 3.66659H14M10.7038 3.66659L10.2487 2.72774C9.9464 2.10409 9.7952 1.79227 9.53447 1.59779C9.47667 1.55465 9.4154 1.51628 9.35133 1.48305C9.0626 1.33325 8.71607 1.33325 8.023 1.33325C7.31253 1.33325 6.95733 1.33325 6.66379 1.48933C6.59873 1.52393 6.53665 1.56385 6.47819 1.6087C6.21443 1.81105 6.06709 2.13429 5.77241 2.78076L5.36861 3.66659" stroke="currentColor" strokeLinecap="round"/>
    <path d="M6.33337 11V7" stroke="currentColor" strokeLinecap="round"/>
    <path d="M9.66663 11V7" stroke="currentColor" strokeLinecap="round"/>
  </svg>
);

const IcoPublicar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <g clipPath="url(#pub)">
      <path d="M9.98706 4.677C9.98706 4.677 10.3204 5.01034 10.6537 5.677C10.6537 5.677 11.7125 4.01034 12.6537 3.677" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.66327 1.3476C4.99763 1.27708 3.71079 1.46896 3.71079 1.46896C2.89822 1.52706 1.34101 1.98261 1.34103 4.64307C1.34104 7.28091 1.3238 10.5329 1.34103 11.8293C1.34103 12.6214 1.83144 14.4689 3.52888 14.5679C5.59211 14.6883 9.30853 14.7139 11.0137 14.5679C11.4701 14.5422 12.9898 14.1838 13.1821 12.5304C13.3814 10.8176 13.3417 9.62718 13.3417 9.34384" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.6666 4.67708C14.6666 6.51803 13.1728 8.01044 11.3301 8.01044C9.48733 8.01044 7.99353 6.51803 7.99353 4.67708C7.99353 2.83614 9.48733 1.34375 11.3301 1.34375C13.1728 1.34375 14.6666 2.83614 14.6666 4.67708Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.65369 8.677H7.32033" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4.65369 11.3438H9.987" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <defs><clipPath id="pub"><rect width="16" height="16" fill="white"/></clipPath></defs>
  </svg>
);

const IconRascunho = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M4 3.5H8"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 5.5H6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 10.75V10.5C6.5 9.0858 6.5 8.3787 6.93935 7.93935C7.3787 7.5 8.0858 7.5 9.5 7.5H9.75M10 6.67155V5C10 3.11438 10 2.17158 9.4142 1.58579C8.82845 1 7.8856 1 6 1C4.11439 1 3.17157 1 2.58578 1.58579C2 2.17157 2 3.11438 2 5V7.2721C2 8.8946 2 9.70585 2.44303 10.2554C2.53254 10.3664 2.63365 10.4674 2.74466 10.5569C3.29415 11 4.10541 11 5.7279 11C6.0807 11 6.25705 11 6.4186 10.943C6.4522 10.9311 6.4851 10.9175 6.51725 10.9022C6.6718 10.8282 6.7965 10.7035 7.04595 10.4541L9.4142 8.0858C9.70325 7.79675 9.84775 7.65225 9.9239 7.46845C10 7.2847 10 7.0803 10 6.67155Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconAgendado = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M10.5 5.75C10.5 3.51083 10.5 2.39124 9.8044 1.69562C9.10875 1 7.98915 1 5.75 1C3.51083 1 2.39124 1 1.69562 1.69562C1 2.39124 1 3.51083 1 5.75C1 7.98915 1 9.10875 1.69562 9.8044C2.36486 10.4736 3.42651 10.499 5.5 10.5"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path d="M1 3.5H10.5" stroke="currentColor" strokeLinecap="round" />
    <path
      d="M5 8H5.75M3 8H3.5M5 6H8M3 6H3.5"
      stroke="currentColor"
      strokeLinecap="round"
    />
    <path
      d="M10.6317 7.43586C10.1811 6.93256 9.91076 6.96251 9.61041 7.05241C9.40016 7.08236 8.67926 7.92111 8.37891 8.18826C7.88571 8.67391 7.39031 9.17396 7.35766 9.23921C7.26426 9.39051 7.17741 9.65861 7.13536 9.95816C7.05726 10.4075 6.90206 10.8908 7.08731 10.9567C7.17741 11.0765 7.62796 10.9168 8.07851 10.8509C8.37891 10.7969 8.58916 10.737 8.73936 10.6472C8.94961 10.5213 9.34006 10.078 10.0129 9.41896C10.4349 8.97606 10.8419 8.67001 10.9621 8.37046C11.0822 7.92111 10.902 7.68146 10.6317 7.43586Z"
      stroke="currentColor"
      strokeLinecap="round"
    />
  </svg>
);

const IconPublicado = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M7.49023 3.50781C7.49023 3.50781 7.74023 3.75781 7.99023 4.25781C7.99023 4.25781 8.78433 3.00781 9.49023 2.75781"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.99743 1.0107C3.74819 0.957812 2.78306 1.10172 2.78306 1.10172C2.17364 1.1453 1.00573 1.48696 1.00574 3.4823C1.00575 5.46068 0.99282 7.89968 1.00574 8.87198C1.00574 9.46603 1.37355 10.8517 2.64663 10.9259C4.19405 11.0162 6.98137 11.0354 8.26022 10.9259C8.60257 10.9066 9.74232 10.6379 9.88657 9.39783C10.036 8.11318 10.0063 7.22038 10.0063 7.00788"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 3.50781C11 4.88852 9.87963 6.00783 8.49758 6.00783C7.11553 6.00783 5.99518 4.88852 5.99518 3.50781C5.99518 2.1271 7.11553 1.00781 8.49758 1.00781C9.87963 1.00781 11 2.1271 11 3.50781Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.49023 6.50781H5.49022"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.49023 8.50781H7.49022"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconArquivado = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M2 6.0002V7.2723C2 8.8948 2 9.70605 2.44303 10.2556C2.53254 10.3666 2.63365 10.4677 2.74466 10.5572C3.29415 11.0002 4.10541 11.0002 5.7279 11.0002C6.0807 11.0002 6.25705 11.0002 6.4186 10.9432C6.4522 10.9314 6.4851 10.9177 6.51725 10.9024C6.6718 10.8285 6.7965 10.7037 7.04595 10.4543L9.4142 8.086C9.70325 7.79695 9.84775 7.65245 9.9239 7.4687C10 7.2849 10 7.08055 10 6.6718V5.0002C10 3.1146 10 2.17179 9.4142 1.586C8.88465 1.05642 8.06325 1.00561 6.51725 1.00073M6.5 10.7502V10.5002C6.5 9.086 6.5 8.3789 6.93935 7.93955C7.3787 7.5002 8.0858 7.5002 9.5 7.5002H9.75"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 4.11514V2.73053C2 1.77465 2.7835 0.999756 3.75 0.999756C4.7165 0.999756 5.5 1.77465 5.5 2.73053V4.63437C5.5 5.1123 5.10825 5.49975 4.625 5.49975C4.14175 5.49975 3.75 5.1123 3.75 4.63437V2.73053"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const STATUS_CONFIG = {
  publicado: {
    label: "Publicado",
    className: styles.statusPublicado,
    Icon: IconPublicado,
  },
  rascunho: {
    label: "Rascunho",
    className: styles.statusRascunho,
    Icon: IconRascunho,
  },
  agendado: {
    label: "Agendado",
    className: styles.statusAgendado,
    Icon: IconAgendado,
  },
  arquivado: {
    label: "Arquivado",
    className: styles.statusArquivado,
    Icon: IconArquivado,
  },
};

const calcularPrioridade = (noticia) => {
  if (!noticia.status || noticia.status.toLowerCase() === "publicado") return { label: "S/P", nivel: 0 };
  const ref = noticia.dataRascunho || noticia.dataPublicacao;
  if (!ref) return { label: "S/P", nivel: 0 };
  const dias = Math.floor(
    (Date.now() - ref.toDate().getTime()) / (1000 * 60 * 60 * 24),
  );
  if (dias >= 4) return { label: "Alta", nivel: 3 };
  if (dias >= 3) return { label: "Média", nivel: 2 };
  if (dias >= 2) return { label: "Baixa", nivel: 1 };
  return { label: "S/P", nivel: 0 };
};

const tempoRelativo = (timestamp) => {
  if (!timestamp) return "—";
  const dias = Math.floor(
    (Date.now() - timestamp.toDate().getTime()) / (1000 * 60 * 60 * 24),
  );
  if (dias === 0) return "Hoje";
  if (dias === 1) return "1 dia(s)";
  return `${dias} dia(s)`;
};

const PrioridadeBars = ({ nivel }) => (
  <span className={styles.bars} data-nivel={nivel}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <span
        key={i}
        className={`${styles.bar} ${
          nivel === 1 && i <= 2
            ? styles.barAtivo
            : nivel === 2 && i <= 4
              ? styles.barAtivo
              : nivel === 3 && i <= 6
                ? styles.barAtivo
                : ""
        }`}
      />
    ))}
  </span>
);

const SortIcon = ({ active = false, dir = "asc" }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    style={{
      opacity: active ? 1 : 0.4,
      transform: active && dir === "desc" ? "scaleY(-1)" : undefined,
      flexShrink: 0,
    }}
  >
    <path d="M6 2L9 5H3L6 2Z" fill="currentColor" />
    <path d="M6 10L3 7H9L6 10Z" fill="currentColor" />
  </svg>
);

const StatusBadge = ({ status }) => {
  const config =
    STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.publicado;
  const { Icon } = config;
  return (
    <span className={`${styles.statusBadge} ${config.className}`}>
      <span className={styles.badgeIcon}>
        <Icon />
      </span>
      <span className={styles.badgeText}>{config.label}</span>
    </span>
  );
};

const ACOES_POR_STATUS = {
  rascunho:  ["editar", "visualizar", "duplicar", "---", "deletar"],
  agendado:  ["editar", "visualizar", "publicar", "---", "cancelar_agendamento"],
  publicado: ["editar", "visualizar", "---", "arquivar", "despublicar"],
  arquivado: ["visualizar", "---", "reativar"],
};

const ACOES_CONFIG = {
  editar:               { label: "Editar",                  Icon: () => <EditIcon size={16} color="currentColor" /> },
  visualizar:           { label: "Visualizar",               Icon: IcoVisualizar },
  duplicar:             { label: "Duplicar",                 Icon: IcoDuplicar },
  publicar:             { label: "Publicar",                 Icon: IcoPublicar },
  cancelar_agendamento: { label: "Cancelar agendamento",     Icon: IcoCancelarAgendamento },
  arquivar:             { label: "Arquivar",                 Icon: IcoArquivar },
  despublicar:          { label: "Retornar para rascunho",   Icon: IcoRascunho },
  reativar:             { label: "Reativar",                 Icon: IcoRascunho },
  deletar:              { label: "Deletar",                  Icon: IcoDeletar },
};

const POR_PAGINA = 10;

const aplicarSort = (lista, col, dir) =>
  [...lista].sort((a, b) => {
    let va, vb;
    switch (col) {
      case "titulo":
        va = (a.titulo || "").toLowerCase();
        vb = (b.titulo || "").toLowerCase();
        return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      case "status":
        va = a.status?.toLowerCase() || "publicado";
        vb = b.status?.toLowerCase() || "publicado";
        return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      case "autor":
        va = (a.autor?.nome || "").toLowerCase();
        vb = (b.autor?.nome || "").toLowerCase();
        return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      case "criadoEm": {
        const tA = (a.dataRascunho || a.dataPublicacao)?.toMillis() ?? 0;
        const tB = (b.dataRascunho || b.dataPublicacao)?.toMillis() ?? 0;
        return dir === "asc" ? tA - tB : tB - tA;
      }
      case "editadoEm": {
        const tA = (a.dataPublicacao || a.dataRascunho)?.toMillis() ?? 0;
        const tB = (b.dataPublicacao || b.dataRascunho)?.toMillis() ?? 0;
        return dir === "asc" ? tA - tB : tB - tA;
      }
      case "prioridade":
        va = calcularPrioridade(a).nivel;
        vb = calcularPrioridade(b).nivel;
        return dir === "asc" ? va - vb : vb - va;
      default:
        return 0;
    }
  });

export default function AdmNoticias() {
  const router = useRouter();
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
  const [menuAberto, setMenuAberto] = useState(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const [confirmarDeletar, setConfirmarDeletar] = useState(null);

  const [sortCol, setSortCol] = useState("criadoEm");
  const [sortDir, setSortDir] = useState("desc");
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [filtroTitulo, setFiltroTitulo] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState(null);
  const [colDropdown, setColDropdown] = useState(null);
  const [colDropdownPos, setColDropdownPos] = useState({ top: 0, left: 0 });
  const colDropdownRef = useRef(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const snap = await getDocs(collection(db, "noticias"));
        const dados = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        dados.sort((a, b) => {
          const tA = (a.dataPublicacao || a.dataRascunho)?.toMillis() ?? 0;
          const tB = (b.dataPublicacao || b.dataRascunho)?.toMillis() ?? 0;
          return tB - tA;
        });
        setNoticias(dados);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticias();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(null);
      }
      if (colDropdownRef.current && !colDropdownRef.current.contains(e.target)) {
        setColDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const executarDeletar = async () => {
    if (!confirmarDeletar) return;
    await deleteDoc(doc(db, "noticias", confirmarDeletar.id));
    removerLocal(confirmarDeletar.id);
    setConfirmarDeletar(null);
  };

  const abrirMenu = (id, e) => {
    e.stopPropagation();
    if (menuAberto === id) { setMenuAberto(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 6, left: rect.right });
    setMenuAberto(id);
  };

  const atualizarLocal = (id, changes) =>
    setNoticias((prev) => prev.map((n) => n.id === id ? { ...n, ...changes } : n));

  const removerLocal = (id) =>
    setNoticias((prev) => prev.filter((n) => n.id !== id));

  const handleAcao = async (acao, noticia) => {
    setMenuAberto(null);
    const ref = doc(db, "noticias", noticia.id);

    switch (acao) {
      case "editar":
        router.push(`/adm/noticias/editar/${noticia.id}`);
        break;

      case "visualizar": {
        const status = noticia.status?.toLowerCase() || "publicado";
        const url = status === "publicado"
          ? `/noticias/detalhes/${noticia.id}`
          : `/noticias/detalhes/${noticia.id}?preview=true`;
        window.open(url, "_blank");
        break;
      }

      case "duplicar": {
        const novoId = `${noticia.id}-copia-${Date.now()}`;
        const { id: _id, ...resto } = noticia;
        await setDoc(doc(db, "noticias", novoId), {
          ...resto,
          titulo: `${noticia.titulo} (cópia)`,
          status: "rascunho",
          dataRascunho: serverTimestamp(),
          dataPublicacao: null,
        });
        const snap = await getDocs(collection(db, "noticias"));
        const dados = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        dados.sort((a, b) => {
          const tA = (a.dataPublicacao || a.dataRascunho)?.toMillis() ?? 0;
          const tB = (b.dataPublicacao || b.dataRascunho)?.toMillis() ?? 0;
          return tB - tA;
        });
        setNoticias(dados);
        break;
      }

      case "publicar":
        await updateDoc(ref, { status: "publicado", dataPublicacao: serverTimestamp() });
        atualizarLocal(noticia.id, { status: "publicado" });
        break;

      case "cancelar_agendamento":
        await updateDoc(ref, { status: "rascunho" });
        atualizarLocal(noticia.id, { status: "rascunho" });
        break;

      case "despublicar":
        await updateDoc(ref, { status: "rascunho" });
        atualizarLocal(noticia.id, { status: "rascunho" });
        break;

      case "arquivar":
        await updateDoc(ref, { status: "arquivado" });
        atualizarLocal(noticia.id, { status: "arquivado" });
        break;

      case "reativar":
        await updateDoc(ref, { status: "rascunho" });
        atualizarLocal(noticia.id, { status: "rascunho" });
        break;

      case "deletar":
        setConfirmarDeletar(noticia);
        break;
    }
  };

  const abrirColDropdown = (col, e) => {
    e.stopPropagation();
    if (colDropdown === col) { setColDropdown(null); return; }
    const rect = e.currentTarget.getBoundingClientRect();
    setColDropdownPos({ top: rect.bottom + 4, left: rect.left });
    setColDropdown(col);
  };

  const setSort = (col, dir) => { setSortCol(col); setSortDir(dir); };

  const temFiltros = filtroStatus !== null || filtroTitulo !== "" || filtroPrioridade !== null;

  const limparFiltros = () => {
    setFiltroStatus(null);
    setFiltroTitulo("");
    setFiltroPrioridade(null);
    setColDropdown(null);
    setPagina(1);
  };

  const noticiasFiltered = noticias.filter((n) => {
    if (filtroStatus && (n.status?.toLowerCase() || "publicado") !== filtroStatus) return false;
    if (filtroTitulo && !n.titulo?.toLowerCase().includes(filtroTitulo.toLowerCase())) return false;
    if (filtroPrioridade !== null && calcularPrioridade(n).nivel !== filtroPrioridade) return false;
    return true;
  });

  const noticiasOrdenadas = aplicarSort(noticiasFiltered, sortCol, sortDir);

  const totalPaginas = Math.ceil(noticiasOrdenadas.length / POR_PAGINA);
  const noticiasPagina = noticiasOrdenadas.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA,
  );

  const headerActions = (
    <Button
      variant="ghost"
      label="Criar notícia"
      type="button"
      onClick={() => router.push("/adm/noticias/criar")}
      border="var(--stroke-base)"
    />
  );

  return (
    <AdmLayout headerActions={headerActions}>
      <Head>
        <title>Cameo ADM — Notícias</title>
      </Head>

      {confirmarDeletar && createPortal(
        <div
          className={styles.popoverOverlay}
          onClick={() => setConfirmarDeletar(null)}
        >
          <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
            <p className={styles.popoverTexto}>
              Tem certeza que deseja deletar permanentemente <strong>"{confirmarDeletar.titulo}"</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className={styles.popoverAcoes}>
              <button
                type="button"
                className={styles.popoverCancelar}
                onClick={() => setConfirmarDeletar(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={styles.popoverConfirmar}
                onClick={executarDeletar}
              >
                <TrashIcon size={14} color="currentColor" />
                Deletar
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}

      {menuAberto && (() => {
        const noticia = noticias.find((n) => n.id === menuAberto);
        if (!noticia) return null;
        const status = noticia.status?.toLowerCase() || "publicado";
        const acoes = ACOES_POR_STATUS[status] ?? ACOES_POR_STATUS.rascunho;
        return createPortal(
          <div
            ref={menuRef}
            className={styles.menuDropdown}
            style={{ top: menuPos.top, left: menuPos.left }}
          >
            {acoes
              .reduce((grupos, acao) => {
                if (acao === "---") grupos.push([]);
                else grupos[grupos.length - 1].push(acao);
                return grupos;
              }, [[]])
              .filter((g) => g.length > 0)
              .map((grupo, gi) => (
                <div key={gi} className={styles.menuGrupo}>
                  {grupo.map((acao) => {
                    const cfg = ACOES_CONFIG[acao];
                    if (!cfg) return null;
                    return (
                      <button
                        key={acao}
                        type="button"
                        className={`${styles.menuItem} ${acao === "deletar" ? styles.menuItemDanger : ""}`}
                        onClick={() => handleAcao(acao, noticia)}
                      >
                        <span className={styles.menuItemIcon}><cfg.Icon /></span>
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              ))}
          </div>,
          document.body,
        );
      })()}

      {colDropdown && createPortal(
        <div
          ref={colDropdownRef}
          className={styles.colDropdown}
          style={{ top: colDropdownPos.top, left: colDropdownPos.left }}
        >
          {colDropdown === "titulo" && (
            <>
              <div className={styles.colDropdownGrupo}>
                <input
                  autoFocus
                  type="text"
                  className={styles.colDropdownSearch}
                  placeholder="Buscar por título..."
                  value={filtroTitulo}
                  onChange={(e) => { setFiltroTitulo(e.target.value); setPagina(1); }}
                />
              </div>
              <div className={styles.colDropdownGrupo}>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "titulo" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("titulo", "asc")}>
                  <SortIcon active={sortCol === "titulo" && sortDir === "asc"} dir="asc" /> Crescente (A→Z)
                </button>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "titulo" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("titulo", "desc")}>
                  <SortIcon active={sortCol === "titulo" && sortDir === "desc"} dir="desc" /> Decrescente (Z→A)
                </button>
              </div>
            </>
          )}

          {colDropdown === "status" && (
            <>
              <div className={styles.colDropdownGrupo}>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "status" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("status", "asc")}>
                  <SortIcon active={sortCol === "status" && sortDir === "asc"} dir="asc" /> Crescente (A→Z)
                </button>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "status" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("status", "desc")}>
                  <SortIcon active={sortCol === "status" && sortDir === "desc"} dir="desc" /> Decrescente (Z→A)
                </button>
              </div>
              <div className={styles.colDropdownGrupo}>
                <button type="button" className={`${styles.colDropdownItem} ${filtroStatus === null ? styles.colDropdownItemAtivo : ""}`} onClick={() => { setFiltroStatus(null); setPagina(1); }}>
                  Todos
                </button>
                {["publicado", "rascunho", "agendado", "arquivado"].map((s) => (
                  <button key={s} type="button" className={`${styles.colDropdownItem} ${filtroStatus === s ? styles.colDropdownItemAtivo : ""}`} onClick={() => { setFiltroStatus(s); setPagina(1); }}>
                    <StatusBadge status={s} />
                  </button>
                ))}
              </div>
            </>
          )}

          {(colDropdown === "autor" || colDropdown === "criadoEm" || colDropdown === "editadoEm") && (
            <div className={styles.colDropdownGrupo}>
              <button type="button" className={`${styles.colDropdownItem} ${sortCol === colDropdown && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort(colDropdown, "asc")}>
                <SortIcon active={sortCol === colDropdown && sortDir === "asc"} dir="asc" /> Crescente
              </button>
              <button type="button" className={`${styles.colDropdownItem} ${sortCol === colDropdown && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort(colDropdown, "desc")}>
                <SortIcon active={sortCol === colDropdown && sortDir === "desc"} dir="desc" /> Decrescente
              </button>
            </div>
          )}

          {colDropdown === "prioridade" && (
            <>
              <div className={styles.colDropdownGrupo}>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "prioridade" && sortDir === "asc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("prioridade", "asc")}>
                  <SortIcon active={sortCol === "prioridade" && sortDir === "asc"} dir="asc" /> Crescente
                </button>
                <button type="button" className={`${styles.colDropdownItem} ${sortCol === "prioridade" && sortDir === "desc" ? styles.colDropdownItemAtivo : ""}`} onClick={() => setSort("prioridade", "desc")}>
                  <SortIcon active={sortCol === "prioridade" && sortDir === "desc"} dir="desc" /> Decrescente
                </button>
              </div>
              <div className={styles.colDropdownGrupo}>
                <button type="button" className={`${styles.colDropdownItem} ${filtroPrioridade === null ? styles.colDropdownItemAtivo : ""}`} onClick={() => { setFiltroPrioridade(null); setPagina(1); }}>
                  Todos
                </button>
                {[{ label: "S/P", nivel: 0 }, { label: "Baixa", nivel: 1 }, { label: "Média", nivel: 2 }, { label: "Alta", nivel: 3 }].map(({ label, nivel }) => (
                  <button key={nivel} type="button" className={`${styles.colDropdownItem} ${filtroPrioridade === nivel ? styles.colDropdownItemAtivo : ""}`} onClick={() => { setFiltroPrioridade(nivel); setPagina(1); }}>
                    <PrioridadeBars nivel={nivel} />
                    <span className={styles.prioridadeLabel}>{label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>,
        document.body,
      )}

      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitulo}>Todas as notícias</h1>
          {temFiltros && (
            <button type="button" className={styles.btnLimparFiltros} onClick={limparFiltros}>
              Limpar filtros
            </button>
          )}
        </div>

        {loading ? (
          <p className={styles.loading}>Carregando...</p>
        ) : noticias.length === 0 ? (
          <p className={styles.empty}>Nenhuma notícia encontrada.</p>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.colTitulo}>
                      <button type="button" className={`${styles.thBtn} ${colDropdown === "titulo" ? styles.thBtnAtivo : ""}`} onClick={(e) => abrirColDropdown("titulo", e)}>
                        Título <SortIcon active={sortCol === "titulo"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button type="button" className={`${styles.thBtn} ${colDropdown === "status" ? styles.thBtnAtivo : ""}`} onClick={(e) => abrirColDropdown("status", e)}>
                        Status <SortIcon active={sortCol === "status"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button type="button" className={`${styles.thBtn} ${colDropdown === "autor" ? styles.thBtnAtivo : ""}`} onClick={(e) => abrirColDropdown("autor", e)}>
                        Autor <SortIcon active={sortCol === "autor"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button type="button" className={`${styles.thBtn} ${colDropdown === "criadoEm" ? styles.thBtnAtivo : ""}`} onClick={(e) => abrirColDropdown("criadoEm", e)}>
                        Criado à <SortIcon active={sortCol === "criadoEm"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button type="button" className={`${styles.thBtn} ${colDropdown === "editadoEm" ? styles.thBtnAtivo : ""}`} onClick={(e) => abrirColDropdown("editadoEm", e)}>
                        Editado à <SortIcon active={sortCol === "editadoEm"} dir={sortDir} />
                      </button>
                    </th>
                    <th>
                      <button type="button" className={`${styles.thBtn} ${colDropdown === "prioridade" ? styles.thBtnAtivo : ""}`} onClick={(e) => abrirColDropdown("prioridade", e)}>
                        Prioridade <SortIcon active={sortCol === "prioridade"} dir={sortDir} />
                      </button>
                    </th>
                    <th className={styles.colAcoes}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {noticiasPagina.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: "center" }} className={styles.empty}>
                        Nenhuma notícia encontrada com os filtros aplicados.
                      </td>
                    </tr>
                  ) : noticiasPagina.map((noticia) => {
                    const prioridade = calcularPrioridade(noticia);
                    const criadoEm = noticia.dataRascunho || noticia.dataPublicacao;
                    const editadoEm = noticia.dataPublicacao || noticia.dataRascunho;
                    return (
                      <tr
                        key={noticia.id}
                        className={styles.trClicavel}
                        onClick={() => router.push(`/adm/noticias/editar/${noticia.id}`)}
                      >
                        <td className={styles.colTitulo}>
                          <span className={styles.titulo}>
                            {noticia.titulo}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={noticia.status} />
                        </td>
                        <td>
                          {noticia.autor?.avatarUrl ? (
                            <img
                              src={noticia.autor.avatarUrl}
                              alt={noticia.autor.nome}
                              className={styles.avatar}
                              title={noticia.autor.nome}
                            />
                          ) : (
                            <span className={styles.avatarFallback}>
                              {noticia.autor?.nome?.[0] ?? "?"}
                            </span>
                          )}
                        </td>
                        <td className={styles.tempo}>
                          {tempoRelativo(criadoEm)}
                        </td>
                        <td className={styles.tempo}>
                          {tempoRelativo(editadoEm)}
                        </td>
                        <td>
                          <span className={styles.prioridade}>
                            <PrioridadeBars nivel={prioridade.nivel} />
                            <span className={styles.prioridadeLabel}>
                              {prioridade.label}
                            </span>
                          </span>
                        </td>
                        <td className={styles.colAcoes} onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            className={styles.btnAcoes}
                            onClick={(e) => abrirMenu(noticia.id, e)}
                          >
                            •••
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPaginas > 1 && (
              <div className={styles.paginacao}>
                <span className={styles.paginacaoInfo}>
                  {(pagina - 1) * POR_PAGINA + 1}–
                  {Math.min(pagina * POR_PAGINA, noticiasOrdenadas.length)} de{" "}
                  {noticiasOrdenadas.length}
                </span>

                <div className={styles.paginacaoBotoes}>
                  <button
                    type="button"
                    className={styles.btnPagina}
                    onClick={() => setPagina(1)}
                    disabled={pagina === 1}
                  >
                    «
                  </button>
                  <button
                    type="button"
                    className={styles.btnPagina}
                    onClick={() => setPagina((p) => p - 1)}
                    disabled={pagina === 1}
                  >
                    ‹
                  </button>

                  {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === totalPaginas ||
                        Math.abs(p - pagina) <= 1,
                    )
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span
                          key={`dots-${idx}`}
                          className={styles.paginacaoDots}
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          className={`${styles.btnPagina} ${item === pagina ? styles.btnPaginaAtivo : ""}`}
                          onClick={() => setPagina(item)}
                        >
                          {item}
                        </button>
                      ),
                    )}

                  <button
                    type="button"
                    className={styles.btnPagina}
                    onClick={() => setPagina((p) => p + 1)}
                    disabled={pagina === totalPaginas}
                  >
                    ›
                  </button>
                  <button
                    type="button"
                    className={styles.btnPagina}
                    onClick={() => setPagina(totalPaginas)}
                    disabled={pagina === totalPaginas}
                  >
                    »
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdmLayout>
  );
}
