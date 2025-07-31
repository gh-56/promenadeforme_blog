import type { ContentBlock, DraftEditorCommand, EditorState } from 'draft-js';
import { RichUtils } from 'draft-js';

export const getBlockStyle = (block: ContentBlock): string => {
  switch (block.getType()) {
    case 'blockquote':
      return 'RichEditor-blockquote';
    case 'code-block':
      return 'RichEditor-codeBlock';
    case 'header-one':
      return 'RichEditor-h1';
    case 'header-two':
      return 'RichEditor-h2';
    case 'header-three':
      return 'RichEditor-h3';
    case 'unordered-list-item':
      return 'RichEditor-ul';
    case 'ordered-list-item':
      return 'RichEditor-ol';
    default:
      return '';
  }
};

export const handleKeyCommand = (
  command: DraftEditorCommand,
  editorState: EditorState,
  setEditorState: React.Dispatch<React.SetStateAction<EditorState>>
): 'handled' | 'not-handled' => {
  const newState = RichUtils.handleKeyCommand(editorState, command);
  if (newState) {
    setEditorState(newState);
    return 'handled';
  }
  return 'not-handled';
};
