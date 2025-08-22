import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor, EditorState, RichUtils, type DraftEditorCommand } from 'draft-js';
import 'draft-js/dist/Draft.css';
import './editorStyle.css';

import InlineStyleControls from '../../../components/WriteStyle/InlineStyleControls';
import BlockStyleControls from '../../../components/WriteStyle/BlockStyleControls';

import { getBlockStyle, handleKeyCommand } from '../../../hooks/useEditorConfig';
import { fetchCreatePost } from '../../../api/posts';
import type { CategoryResponse, PostRequest } from '../../../types/interface';

import { fetchReadCategories } from '../../../api/categories';
import Input from '../../../components/Input';

const PostWritePage2 = () => {
  const nav = useNavigate();
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [formData, setFormData] = useState<PostRequest>({
    title: '',
    content: '',
    category: '',
  });
  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const getCategories = await fetchReadCategories();
        setCategories(getCategories);
      } catch (error) {
        console.error(error);
      }
    };
    getCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const content = editorState.getCurrentContent().getPlainText();
      setFormData({ ...formData, content: content });

      const form = new FormData();

      form.append('title', formData.title);
      form.append('content', formData.content);
      form.append('category', formData.category);

      await fetchCreatePost(form);

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
          <label htmlFor='category'>카테고리 선택</label>
          <select id='category' onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value=''>카테고리를 선택하세요.</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Input
            id='title'
            className='title-input'
            type='text'
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder='제목을 입력하세요.'
          />
        </div>
        <div>
          <div className='RichEditor-root' onClick={focusEditor}>
            <InlineStyleControls editorState={editorState} onToggle={toggleInlineStyle} />
            <BlockStyleControls editorState={editorState} onToggle={toggleBlockType} />
            <Editor
              ref={editorRef}
              editorState={editorState}
              handleKeyCommand={(command: DraftEditorCommand, state) => handleKeyCommand(command, state, setEditorState)}
              onChange={setEditorState}
              blockStyleFn={getBlockStyle}
              placeholder='내용을 입력하세요.'
            />
          </div>
        </div>
        <button type='submit'>저장</button>
      </form>
    </>
  );
};

export default PostWritePage2;
