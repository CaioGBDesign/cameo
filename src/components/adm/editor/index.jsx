import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  NodeViewContent,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Paragraph } from "@tiptap/extension-paragraph";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import BoldIcon from "@/components/icons/BoldIcon";
import ItalicIcon from "@/components/icons/ItalicIcon";
import UnderlineIcon from "@/components/icons/UnderlineIcon";
import BulletListIcon from "@/components/icons/BulletListIcon";
import OrderedListIcon from "@/components/icons/OrderedListIcon";
import LinkIcon from "@/components/icons/LinkIcon";
import BlockquoteIcon from "@/components/icons/BlockquoteIcon";
import DragHandleIcon from "@/components/icons/DragHandleIcon";
import styles from "./index.module.scss";

const ToolbarButton = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`${styles.toolbarBtn} ${active ? styles.active : ""}`}
    title={title}
  >
    {children}
  </button>
);

const Divider = () => <div className={styles.divider} />;

const ParagraphView = () => (
  <NodeViewWrapper className={styles.blockWrapper} suppressContentEditableWarning>
    <div
      data-drag-handle
      contentEditable={false}
      suppressContentEditableWarning
      className={styles.dragHandle}
    >
      <DragHandleIcon />
    </div>
    <NodeViewContent as="p" />
  </NodeViewWrapper>
);

const CustomParagraph = Paragraph.extend({
  draggable: true,
  addNodeView() {
    return ReactNodeViewRenderer(ParagraphView);
  },
});

export default function AdmEditor({ value, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ paragraph: false }),
      CustomParagraph,
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: styles.editorContent,
      },
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
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.botoesTopo}>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Negrito"
          >
            <BoldIcon size="20px" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Itálico"
          >
            <ItalicIcon size="20px" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Sublinhado"
          >
            <UnderlineIcon size="20px" />
          </ToolbarButton>
        </div>

        <Divider />

        <div className={styles.botoesTopo}>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Lista com marcadores"
          >
            <BulletListIcon size="20px" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Lista numerada"
          >
            <OrderedListIcon size="20px" />
          </ToolbarButton>
        </div>

        <Divider />

        <div className={styles.botoesTopo}>
          <ToolbarButton
            onClick={setLink}
            active={editor.isActive("link")}
            title="Link"
          >
            <LinkIcon size="20px" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Citação"
          >
            <BlockquoteIcon size="20px" />
          </ToolbarButton>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
