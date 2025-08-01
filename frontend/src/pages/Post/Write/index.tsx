import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PostFormData } from '../../../types/interface';
import {
  Editor,
  EditorState,
  RichUtils, // RichUtils는 toggleInlineStyle, toggleBlockType에서 직접 사용되므로 유지합니다.
  type DraftEditorCommand,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './editorStyle.css';

// 분리된 컴포넌트들을 불러옵니다.
import InlineStyleControls from '../../../components/WriteStyle/InlineStyleControls';
import BlockStyleControls from '../../../components/WriteStyle/BlockStyleControls';
// 분리된 함수들을 불러옵니다.
import {
  getBlockStyle,
  handleKeyCommand,
} from '../../../hooks/useEditorConfig';
import { fetchCreatePost } from '../../../api/posts'; // API 함수 경로 확인
import Input from '../../../components/Input';

const PostWritePage = () => {
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const editorRef = useRef<Editor>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const content = editorState.getCurrentContent().getPlainText();

      const newPost: PostFormData = {
        title,
        content,
        author,
      };

      await fetchCreatePost(newPost);

      alert('글이 성공적으로 작성되었습니다.');
      nav('/');
    } catch (error) {
      console.error(error);
      alert('글 작성에 실패했습니다.');
    }
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    focusEditor();
  };

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    focusEditor();
  };

  return (
    <>
      <h1>글 쓰기</h1>
      <form onSubmit={handleSubmit}>
        <div>
          {/* <label htmlFor='category'>카테고리</label> */}
          <select
            name='category'
            id='category'
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value=''>카테고리를 선택하세요.</option>
            <option value='category1'>카테고리 1</option>
          </select>
        </div>
        <div>
          {/* <label htmlFor='title'>제목</label> */}
          <Input
            id='title'
            className='title-input'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='제목을 입력하세요.'
          />
        </div>
        <div>
          {/* <label htmlFor='content'>내용</label> */}
          <div className='RichEditor-root' onClick={focusEditor}>
            <InlineStyleControls
              editorState={editorState}
              onToggle={toggleInlineStyle}
            />
            <BlockStyleControls
              editorState={editorState}
              onToggle={toggleBlockType}
            />
            <Editor
              ref={editorRef}
              editorState={editorState}
              handleKeyCommand={(command: DraftEditorCommand, state) =>
                handleKeyCommand(command, state, setEditorState)
              }
              onChange={setEditorState}
              blockStyleFn={getBlockStyle}
              placeholder='내용을 입력하세요.'
            />
          </div>
        </div>
        <div>
          <label htmlFor='author'>작성자</label>
          <input
            id='author'
            type='text'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <button type='submit'>저장</button>
      </form>
    </>
  );
};

export default PostWritePage;
