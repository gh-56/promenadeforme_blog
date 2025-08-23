import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';

import './style.css';

const MenuBar = ({ editor }: { editor: Editor }) => {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  return (
    <div>
      <div className='button-group'>
        <div className='button-group-align'>
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
            type='button'
          >
            왼쪽 정렬
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
            type='button'
          >
            가운데 정렬
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
            type='button'
          >
            오른쪽 정렬
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
            type='button'
          >
            양쪽 정렬
          </button>
        </div>
        <div className='button-group-inline'>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editorState.isParagraph ? 'is-active' : ''}
            type='button'
          >
            일반 텍스트
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editorState.canBold}
            className={editorState.isBold ? 'is-active' : ''}
            type='button'
          >
            굵게
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editorState.canItalic}
            className={editorState.isItalic ? 'is-active' : ''}
            type='button'
          >
            기울임꼴
          </button>

          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={editor.isActive('highlight') ? 'is-active' : ''}
            type='button'
          >
            강조
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editorState.canStrike}
            className={editorState.isStrike ? 'is-active' : ''}
            type='button'
          >
            취소선
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editorState.canCode}
            className={editorState.isCode ? 'is-active' : ''}
            type='button'
          >
            인라인 코드
          </button>
          <button onClick={() => editor.chain().focus().unsetAllMarks().run()} type='button'>
            글자 서식 지우기
          </button>
        </div>

        <div className='button-group-block'>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editorState.isHeading1 ? 'is-active' : ''}
            type='button'
          >
            제목1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editorState.isHeading2 ? 'is-active' : ''}
            type='button'
          >
            제목2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editorState.isHeading3 ? 'is-active' : ''}
            type='button'
          >
            제목3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={editorState.isHeading4 ? 'is-active' : ''}
            type='button'
          >
            제목4
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            className={editorState.isHeading5 ? 'is-active' : ''}
            type='button'
          >
            제목5
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            className={editorState.isHeading6 ? 'is-active' : ''}
            type='button'
          >
            제목6
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editorState.isBulletList ? 'is-active' : ''}
            type='button'
          >
            목록
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editorState.isOrderedList ? 'is-active' : ''}
            type='button'
          >
            번호 목록
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editorState.isCodeBlock ? 'is-active' : ''}
            type='button'
          >
            코드 블록
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editorState.isBlockquote ? 'is-active' : ''}
            type='button'
          >
            인용구
          </button>
          <button onClick={() => editor.chain().focus().setHorizontalRule().run()} type='button'>
            구분선
          </button>
          <button onClick={() => editor.chain().focus().setHardBreak().run()} type='button'>
            줄바꿈
          </button>
          <button
            onClick={() =>
              editor.chain().focus().setImage({ src: 'http://localhost:4000/images/default-profile.png' }).run()
            }
            type='button'
          >
            이미지 삽입
          </button>
          <button onClick={() => editor.chain().focus().clearNodes().run()} type='button'>
            블록 서식 지우기
          </button>
        </div>
        <div className='button-group-others'>
          <button onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo} type='button'>
            실행 취소
          </button>
          <button onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo} type='button'>
            다시 실행
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuBar;
