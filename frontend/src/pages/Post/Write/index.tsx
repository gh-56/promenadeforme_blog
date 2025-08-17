import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Editor,
  EditorState,
  RichUtils,
  type DraftEditorCommand,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import './editorStyle.css';

import InlineStyleControls from '../../../components/WriteStyle/InlineStyleControls';
import BlockStyleControls from '../../../components/WriteStyle/BlockStyleControls';

import {
  getBlockStyle,
  handleKeyCommand,
} from '../../../hooks/useEditorConfig';
import { fetchCreatePost } from '../../../api/posts';
import type { PostFormData } from '../../../types/interface';

import { fetchGetCategories } from '../../../api/categories';
import type { Category } from '../../../types/interface';
import Input from '../../../components/Input';

const PostWritePage = () => {
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [categories, setCategories] = useState<Category[]>([]);

  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchGetCategories();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    getCategories();
  }, []);

  // const handleAddCategory = async () => {
  //   if (!categoryName) return alert('카테고리 이름을 입력하세요.');

  //   try {
  //     const newCategory = await fetchCreateCategory(categoryName);
  //     setCategories([...categories, newCategory]);
  //     setCategoryName('');
  //     alert('새로운 카테고리가 생성되었습니다.');
  //   } catch (error) {
  //     console.error(error);
  //     alert('카테고리 생성에 실패했습니다.');
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const content = editorState.getCurrentContent().getPlainText();

      const newPost: PostFormData = {
        title,
        content,
        author,
        category: '',
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
          <label htmlFor='category'>카테고리 선택</label>
          <select id='category'>
            <option value=''>카테고리를 선택하세요.</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {/* <div>
          <label htmlFor='add-category'>새 카테고리 추가</label>
          <input
            id='add-category'
            type='text'
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <button type='button' onClick={handleAddCategory}>
            추가
          </button>
        </div> */}
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
