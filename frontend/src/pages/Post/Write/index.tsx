import { fetchCreatePost } from '../../../api/posts';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PostFormData } from '../../../types/interface';

const PostWritePage = () => {
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const newPost: PostFormData = {
        title,
        content,
        author,
      };

      fetchCreatePost(newPost);

      alert('글이 성공적으로 작성되었습니다.');
      nav('/');
    } catch (error) {
      console.error(error);
      alert('글 작성에 실패했습니다.');
    }
  };

  return (
    <>
      <h1>글 작성 페이지</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='title'>제목</label>
          <input
            id='title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor='content'>내용</label>
          <input
            id='content'
            type='text'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
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
