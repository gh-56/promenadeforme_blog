import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewRendererProps,
} from '@tiptap/react';
import { useEffect, useState } from 'react';

import { Select, ActionIcon, Tooltip, Box, Flex } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';

import classes from './CodeBlockNodeView.module.css';

const LANGUAGES = [
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
  const language = node.attrs.language || 'bash';

  useEffect(() => {
    const lineCount = code.split('\n').length;
    setLines(lineCount);
  }, [code]);

  const handleLangChange = (value: string | null) => {
    editor
      .chain()
      .focus()
      .updateAttributes('codeBlock', { language: value })
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
    <NodeViewWrapper as={Box} className={classes.wrapper}>
      <div className={classes.header}>
        <Select
          data={LANGUAGES}
          value={language}
          onChange={handleLangChange}
          size='xs'
          contentEditable={false}
          allowDeselect={false}
        />
        <Tooltip
          label={isCopied ? '복사됨!' : '코드 복사'}
          withArrow
          position='left'
        >
          <ActionIcon
            variant='light'
            color={isCopied ? 'teal' : 'gray'}
            onClick={handleCopy}
            aria-label='코드 복사'
          >
            {isCopied ? <IconCheck size={16} /> : <IconCopy size={16} />}
          </ActionIcon>
        </Tooltip>
      </div>

      <div className={classes.contentWrapper}>
        <pre className={classes.pre}>
          <Flex>
            <div className={classes.lineNumbers}>
              {Array.from({ length: lines }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            <div className={classes.code}>
              <NodeViewContent as='div' />
            </div>
          </Flex>
        </pre>
      </div>
    </NodeViewWrapper>
  );
}
