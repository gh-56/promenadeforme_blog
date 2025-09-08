import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewRendererProps,
} from '@tiptap/react';
import './style.css';
import { useEffect, useState } from 'react';

const LANGUAGES = [
  'language',
  'bash',
  'c',
  'css',
  'java',
  'javascript',
  'jsx',
  'typescript',
  'tsx',
  'python',
];

export function CodeBlockNodeView({ editor, node }: NodeViewRendererProps) {
  const [lines, setLines] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const code = node.textContent;
  const language = node.attrs.language || 'bash'; // 기본 언어 설정

  useEffect(() => {
    const lineCount = code.split('\n').length;
    setLines(lineCount);
  }, [node.textContent]);

  const handleLangChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;

    editor
      .chain()
      .focus()
      .updateAttributes('codeBlock', { language: newLanguage })
      .run();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
    }
  };

  return (
    <NodeViewWrapper className='custom-code-block'>
      <select
        contentEditable={false}
        value={language}
        onChange={handleLangChange}
      >
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      <button
        className={`copy-button ${isCopied ? 'copied' : ''}`}
        onClick={handleCopy}
        aria-label='Copy code to clipboard'
        type='button'
      >
        {isCopied ? 'Copied!' : 'Copy'}
      </button>

      <div className='code-block-content'>
        <div className='line-numbers'>
          {Array.from({ length: lines }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre>
          <NodeViewContent as='code' />
        </pre>
      </div>
    </NodeViewWrapper>
  );
}
