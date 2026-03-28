import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  useEditor,
  useEditorState,
  EditorContent,
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Paragraph } from "@tiptap/extension-paragraph";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import BoldIcon from "@/components/icons/BoldIcon";
import ItalicIcon from "@/components/icons/ItalicIcon";
import UnderlineIcon from "@/components/icons/UnderlineIcon";
import BulletListIcon from "@/components/icons/BulletListIcon";
import OrderedListIcon from "@/components/icons/OrderedListIcon";
import LinkIcon from "@/components/icons/LinkIcon";
import BlockquoteIcon from "@/components/icons/BlockquoteIcon";
import DragHandleIcon from "@/components/icons/DragHandleIcon";
import styles from "./index.module.scss";

// ─── Ícones inline do slash menu ──────────────────────────────────────────────

const IcoParagraph = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 5h10M3 8h10M3 11h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IcoHeading = ({ n }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 4v8M2 8h5M7 4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <text x="9.5" y="12.5" fontSize="6.5" fontWeight="800" fill="currentColor" fontFamily="sans-serif">{n}</text>
  </svg>
);

const IcoFraseDestaque = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="1.5" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M4.5 6.5h7M4.5 9.5h4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IcoTabela = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="1.5" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M1.5 6.5h13M6.5 6.5v8" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const IcoImagem = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="5.5" cy="6" r="1" fill="currentColor" />
    <path d="M1.5 11l3.5-3.5 2.5 2.5 2-2 4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const IcoAudio = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 6v4h3l4 3V3L5 6H2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M11.5 5.5a3 3 0 0 1 0 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IcoArquivo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M9 2H5a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 5 14h6a1.5 1.5 0 0 0 1.5-1.5V5L9 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9 2v3h3M5.5 8.5h5M5.5 11h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IcoHighlight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10.5 2.5L13.5 5.5L7 12H4v-3l6.5-6.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M2 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ─── Bubble Button ────────────────────────────────────────────────────────────

const BubbleBtn = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`${styles.toolbarBtn} ${active ? styles.active : ""}`}
    title={title}
  >
    {children}
  </button>
);

// ─── Paragraph com drag handle ────────────────────────────────────────────────

const ParagraphView = ({ node, getPos, editor }) => {
  const isEmpty = node.textContent === "";
  let dentroDeBloco = false;
  try {
    const $pos = editor.state.doc.resolve(getPos());
    const parentName = $pos.parent.type.name;
    dentroDeBloco = parentName === "blockquote" || parentName === "callout";
  } catch {}

  if (dentroDeBloco) {
    return (
      <NodeViewWrapper suppressContentEditableWarning>
        <NodeViewContent as="p" className={isEmpty ? styles.paragraphVazio : ""} />
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className={styles.blockWrapper} suppressContentEditableWarning>
      <div
        data-drag-handle
        contentEditable={false}
        suppressContentEditableWarning
        className={styles.dragHandle}
      >
        <DragHandleIcon />
      </div>
      <NodeViewContent as="p" className={isEmpty ? styles.paragraphVazio : ""} />
    </NodeViewWrapper>
  );
};

// ─── NodeViews com drag handle ────────────────────────────────────────────────

const HeadingView = ({ node }) => {
  const tag = `h${node.attrs.level}`;
  return (
    <NodeViewWrapper className={styles.blockWrapper} suppressContentEditableWarning>
      <div data-drag-handle contentEditable={false} suppressContentEditableWarning className={styles.dragHandle}>
        <DragHandleIcon />
      </div>
      <NodeViewContent as={tag} />
    </NodeViewWrapper>
  );
};

const BlockquoteView = () => (
  <NodeViewWrapper className={styles.blockWrapper} suppressContentEditableWarning>
    <div data-drag-handle contentEditable={false} suppressContentEditableWarning className={styles.dragHandle}>
      <DragHandleIcon />
    </div>
    <NodeViewContent as="blockquote" />
  </NodeViewWrapper>
);

const CalloutView = ({ node }) => {
  const isEmpty = node.textContent === "";
  return (
    <NodeViewWrapper className={`${styles.blockWrapper} ${styles.calloutWrapper}`} suppressContentEditableWarning>
      <div data-drag-handle contentEditable={false} suppressContentEditableWarning className={styles.dragHandle}>
        <DragHandleIcon />
      </div>
      <NodeViewContent as="p" className={isEmpty ? styles.paragraphVazio : undefined} />
    </NodeViewWrapper>
  );
};

const ImageView = ({ node }) => (
  <NodeViewWrapper className={styles.blockWrapper} suppressContentEditableWarning>
    <div data-drag-handle contentEditable={false} suppressContentEditableWarning className={styles.dragHandle}>
      <DragHandleIcon />
    </div>
    <img
      src={node.attrs.src}
      alt={node.attrs.alt || ""}
      contentEditable={false}
      className={styles.editorImage}
    />
  </NodeViewWrapper>
);

// ─── Extensões customizadas ───────────────────────────────────────────────────

const CustomParagraph = Paragraph.extend({
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(ParagraphView);
  },
});

const CustomHeading = Heading.extend({
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(HeadingView);
  },
});

const CustomBlockquote = Blockquote.extend({
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(BlockquoteView);
  },
});

const Callout = Paragraph.extend({
  name: "callout",
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }];
  },

  renderHTML() {
    return ["div", { "data-type": "callout" }, 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutView);
  },
});

const Highlight = Underline.extend({
  name: "highlight",
  parseHTML() {
    return [{ tag: "mark" }];
  },
  renderHTML() {
    return ["mark", 0];
  },
});

const CustomImage = Image.extend({
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(ImageView);
  },
});

// ─── Bubble Menu customizado ──────────────────────────────────────────────────

function BubbleMenuCustom({ editor, children }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);

  useEffect(() => {
    if (!editor) return;

    const atualizar = () => {
      const { from, to } = editor.state.selection;
      if (from === to) { setVisible(false); return; }
      const start = editor.view.coordsAtPos(from);
      const end = editor.view.coordsAtPos(to);
      setCoords({ top: start.top, left: (start.left + end.left) / 2 });
      setVisible(true);
    };

    editor.on("selectionUpdate", atualizar);
    editor.on("blur", () => setVisible(false));
    return () => {
      editor.off("selectionUpdate", atualizar);
      editor.off("blur", () => setVisible(false));
    };
  }, [editor]);

  if (!visible || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={menuRef}
      className={styles.bubbleMenu}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        transform: "translate(-50%, calc(-100% - 8px))",
        zIndex: 1000,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </div>,
    document.body,
  );
}

// ─── Slash Command Menu ───────────────────────────────────────────────────────

const SLASH_GROUPS = [
  {
    categoria: "Texto",
    items: [
      {
        label: "Parágrafo",
        icone: <IcoParagraph />,
        comando: (e) => e.chain().focus().setParagraph().run(),
      },
      {
        label: "Título 1",
        icone: <IcoHeading n={1} />,
        comando: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
      },
      {
        label: "Título 2",
        icone: <IcoHeading n={2} />,
        comando: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
      },
      {
        label: "Título 3",
        icone: <IcoHeading n={3} />,
        comando: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
      },
      {
        label: "Título 4",
        icone: <IcoHeading n={4} />,
        comando: (e) => e.chain().focus().toggleHeading({ level: 4 }).run(),
      },
      {
        label: "Lista",
        icone: <BulletListIcon size="16px" />,
        comando: (e) => e.chain().focus().toggleBulletList().run(),
      },
      {
        label: "Lista numerada",
        icone: <OrderedListIcon size="16px" />,
        comando: (e) => e.chain().focus().toggleOrderedList().run(),
      },
      {
        label: "Frase de destaque",
        icone: <IcoFraseDestaque />,
        comando: (e) => e.isActive("callout")
          ? e.chain().focus().setNode("paragraph").run()
          : e.chain().focus().setNode("callout").run(),
      },
      {
        label: "Citação",
        icone: <BlockquoteIcon size="16px" />,
        comando: (e) => e.chain().focus().toggleBlockquote().run(),
      },
      {
        label: "Tabela",
        icone: <IcoTabela />,
        disabled: true,
      },
      {
        label: "Link",
        icone: <LinkIcon size="16px" />,
        tipo: "link",
      },
    ],
  },
  {
    categoria: "Mídia",
    items: [
      {
        label: "Imagem",
        icone: <IcoImagem />,
        tipo: "imagem",
      },
      {
        label: "Áudio",
        icone: <IcoAudio />,
        disabled: true,
      },
      {
        label: "Arquivo",
        icone: <IcoArquivo />,
        disabled: true,
      },
      {
        label: "Marcador de texto",
        icone: <IcoHighlight />,
        comando: (e) => e.chain().focus().toggleMark("highlight").run(),
      },
    ],
  },
];

const SLASH_MENU_HEIGHT = 400;

function SlashMenu({ editor, onTriggerImageUpload }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [abrirParaCima, setAbrirParaCima] = useState(false);
  const [query, setQuery] = useState("");
  const [selecionado, setSelecionado] = useState(0);
  const [range, setRange] = useState(null);
  const menuRef = useRef(null);

  const fechar = useCallback(() => {
    setVisible(false);
    setQuery("");
    setSelecionado(0);
    setRange(null);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (!editor) return;

    const onUpdate = () => {
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;

      const textoLinha = $from.parent.textContent;
      const posNaLinha = $from.parentOffset;
      const antes = textoLinha.slice(0, posNaLinha);

      const match = antes.match(/\/(\w*)$/);
      if (!match) { fechar(); return; }

      const q = match[1].toLowerCase();
      const posSlash = $from.pos - match[0].length;

      const cursorCoords = editor.view.coordsAtPos($from.pos);
      const sobrarEspaco = window.innerHeight - cursorCoords.bottom;
      const paraCima = sobrarEspaco < SLASH_MENU_HEIGHT;

      setCoords({ top: paraCima ? cursorCoords.top : cursorCoords.bottom, left: cursorCoords.left });
      setAbrirParaCima(paraCima);
      setQuery(q);
      setRange({ from: posSlash, to: $from.pos });
      setSelecionado(0);
      setVisible(true);
      document.body.style.overflow = "hidden";
    };

    editor.on("transaction", onUpdate);
    return () => editor.off("transaction", onUpdate);
  }, [editor, fechar]);

  useEffect(() => {
    if (!visible) return;
    const onMouseDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        fechar();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [visible, fechar]);

  const gruposFiltrados = SLASH_GROUPS.map((grupo) => ({
    ...grupo,
    items: grupo.items.filter((item) =>
      item.label.toLowerCase().includes(query),
    ),
  })).filter((grupo) => grupo.items.length > 0);

  const itensSelecionaveis = gruposFiltrados
    .flatMap((g) => g.items)
    .filter((i) => !i.disabled);

  useEffect(() => {
    if (!editor || !visible) return;

    const onKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelecionado((s) => (s + 1) % itensSelecionaveis.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelecionado((s) => (s - 1 + itensSelecionaveis.length) % itensSelecionaveis.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        executar(itensSelecionaveis[selecionado]);
      } else if (e.key === "Escape") {
        fechar();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  });

  const executar = (item) => {
    if (!item || item.disabled || !range) return;
    editor.chain().focus().deleteRange(range).run();

    if (item.tipo === "imagem") {
      fechar();
      onTriggerImageUpload?.();
    } else if (item.tipo === "link") {
      fechar();
      const url = window.prompt("URL do link:");
      if (url) {
        editor.chain().focus().insertContent(`<a href="${url}">${url}</a>`).run();
      }
    } else {
      item.comando(editor);
      fechar();
    }
  };

  if (!visible || gruposFiltrados.length === 0 || typeof document === "undefined") return null;

  let kbIdx = -1;

  return createPortal(
    <div
      ref={menuRef}
      className={styles.slashMenu}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        transform: abrirParaCima ? "translateY(calc(-100% - 4px))" : "translateY(4px)",
        zIndex: 1000,
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {gruposFiltrados.map((grupo) => (
        <div key={grupo.categoria} className={styles.slashGrupo}>
          <span className={styles.slashCategoria}>{grupo.categoria}</span>
          {grupo.items.map((item) => {
            if (!item.disabled) kbIdx++;
            const isAtivo = !item.disabled && kbIdx === selecionado;
            return (
              <button
                key={item.label}
                type="button"
                className={`${styles.slashItem} ${isAtivo ? styles.slashItemAtivo : ""} ${item.disabled ? styles.slashItemDisabled : ""}`}
                onMouseDown={() => executar(item)}
              >
                <span className={styles.slashItemIcone}>{item.icone}</span>
                <span className={styles.slashItemLabel}>{item.label}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>,
    document.body,
  );
}

// ─── Contagem de palavras ─────────────────────────────────────────────────────

function WordCount({ editor }) {
  const { palavras } = useEditorState({
    editor,
    selector: (ctx) => {
      const texto = ctx.editor.getText();
      const count = texto.trim() ? texto.trim().split(/\s+/).filter(Boolean).length : 0;
      return { palavras: count };
    },
  });

  return (
    <div className={styles.wordCount}>
      {palavras} {palavras === 1 ? "palavra" : "palavras"}
    </div>
  );
}

// ─── Editor ───────────────────────────────────────────────────────────────────

export default function AdmEditor({ value, onChange }) {
  const imageInputRef = useRef(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ paragraph: false, heading: false, blockquote: false }),
      CustomParagraph,
      CustomHeading,
      CustomBlockquote,
      Callout,
      Underline,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Digite '/' para comandos…",
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
      CustomImage,
      Highlight,
    ],
    content: value || "",
    editorProps: {
      attributes: { class: styles.editorContent },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL do link:", prev);
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  };

  const handleImageFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      editor.chain().focus().setImage({ src: ev.target.result }).run();
      onChange?.(editor.getHTML());
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const triggerImageUpload = () => {
    imageInputRef.current?.click();
  };

  return (
    <div className={styles.wrapper}>
      <BubbleMenuCustom editor={editor}>
        <BubbleBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Título 1">
          <span className={styles.headingLabel}>H1</span>
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Título 2">
          <span className={styles.headingLabel}>H2</span>
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Título 3">
          <span className={styles.headingLabel}>H3</span>
        </BubbleBtn>

        <div className={styles.bubbleDivider} />

        <BubbleBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Negrito">
          <BoldIcon size="16px" />
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Itálico">
          <ItalicIcon size="16px" />
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Sublinhado">
          <UnderlineIcon size="16px" />
        </BubbleBtn>

        <div className={styles.bubbleDivider} />

        <BubbleBtn onClick={setLink} active={editor.isActive("link")} title="Link">
          <LinkIcon size="16px" />
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Citação">
          <BlockquoteIcon size="16px" />
        </BubbleBtn>

        <div className={styles.bubbleDivider} />

        <BubbleBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista">
          <BulletListIcon size="16px" />
        </BubbleBtn>
        <BubbleBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista numerada">
          <OrderedListIcon size="16px" />
        </BubbleBtn>

        <div className={styles.bubbleDivider} />

        <BubbleBtn onClick={() => editor.chain().focus().toggleMark("highlight").run()} active={editor.isActive("highlight")} title="Marcador de texto">
          <IcoHighlight />
        </BubbleBtn>
      </BubbleMenuCustom>

      <SlashMenu editor={editor} onTriggerImageUpload={triggerImageUpload} />

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleImageFile}
      />

      <EditorContent editor={editor} />

      <WordCount editor={editor} />
    </div>
  );
}
