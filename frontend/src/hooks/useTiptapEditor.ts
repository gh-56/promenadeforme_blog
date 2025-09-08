import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyleKit } from '@tiptap/extension-text-style';
import CodeBlockShiki from 'tiptap-extension-code-block-shiki';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CodeBlockNodeView } from '../pages/CodeBlock';
import { useEffect } from 'react';

interface UseTiptapEditorProps {
  content: string;
}

export const useTiptapEditor = ({
  content,
}: UseTiptapEditorProps): Editor | null => {
  const editor = useEditor({
    extensions: [
      TextStyleKit,
      StarterKit.configure({ codeBlock: false }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
        defaultAlignment: 'left',
      }),
      Highlight,
      Image,
      Placeholder.configure({
        placeholder: '내용을 입력하세요.',
      }),
      CodeBlockShiki.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockNodeView);
        },
      }).configure({
        defaultTheme: 'github-dark',
      }),
    ],
    content: content,
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      if (editor.isEmpty) {
        editor.commands.setContent(content);
      }
    }
  }, [content, editor]);

  return editor;
};
