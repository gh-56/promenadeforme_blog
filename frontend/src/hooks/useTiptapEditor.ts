import {
  useEditor,
  Editor,
  type NodeType,
  type TextType,
  type DocumentType,
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import ImageResize from 'tiptap-extension-resize-image';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyleKit } from '@tiptap/extension-text-style';
import CodeBlockShiki from 'tiptap-extension-code-block-shiki';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CodeBlockNodeView } from '../pages/CodeBlock';
import { type RefObject } from 'react';
import { useMantineColorScheme } from '@mantine/core';

interface UseTiptapEditorProps {
  content: string;
  // handleTiptapUpdate?: (newContent: string) => void;
  handleTiptapUpdate?: (
    newContent: DocumentType<
      Record<string, any> | undefined,
      NodeType<
        string,
        undefined | Record<string, any>,
        any,
        (NodeType | TextType)[]
      >[]
    >,
  ) => void;
  isEditable?: boolean;
  titleInputRef?: RefObject<HTMLInputElement | null>;
}

export const useTiptapEditor = ({
  content,
  handleTiptapUpdate,
  isEditable = true,
  titleInputRef,
}: UseTiptapEditorProps): Editor | null => {
  const { colorScheme } = useMantineColorScheme();

  const editor = useEditor(
    {
      editable: isEditable,
      extensions: [
        TextStyleKit,
        StarterKit.configure({ codeBlock: false }),
        TextAlign.configure({
          types: ['heading', 'paragraph'],
          alignments: ['left', 'center', 'right', 'justify'],
          defaultAlignment: 'left',
        }),
        Highlight,
        // Image,
        ImageResize,
        Placeholder.configure({
          placeholder: '내용을 입력하세요.',
        }),
        CodeBlockShiki.extend({
          addNodeView() {
            return ReactNodeViewRenderer(CodeBlockNodeView);
          },
        }).configure({
          defaultTheme: colorScheme === 'dark' ? 'github-dark' : 'github-light',
          enableTabIndentation: true,
        }),
      ],
      content: content,
      onUpdate: isEditable
        ? ({ editor }) => {
            // handleTiptapUpdate?.(JSON.stringify(editor.getJSON()));
            handleTiptapUpdate?.(editor.getJSON());
          }
        : undefined,

      editorProps: isEditable
        ? {
            handleKeyDown: (view, event) => {
              if (event.key === 'Tab' && event.shiftKey) {
                const { from } = view.state.selection;
                if (from === 1) {
                  event.preventDefault();
                  titleInputRef?.current?.focus();
                  return true;
                }
              }
              return false;
            },
          }
        : {},
    },

    [colorScheme],
  );

  // useEffect(() => {
  //   if (!editor || !content) {
  //     return;
  //   }
  //
  //   let isSameContent = false;
  //   try {
  //     isSameContent = JSON.stringify(editor.getJSON()) === content;
  //   } catch (e) {}
  //
  //   if (isSameContent) {
  //     return;
  //   }
  //
  //   try {
  //     const parsedContent = JSON.parse(content);
  //     editor.commands.setContent(parsedContent);
  //   } catch (e) {
  //     editor.commands.setContent(content);
  //   }
  // }, [content, editor]);
  //
  return editor;
};
