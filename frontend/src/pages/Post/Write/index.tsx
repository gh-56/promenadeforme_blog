import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { TextStyleKit } from '@tiptap/extension-text-style';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar';
import './style.css';
import { useEffect, useRef, useState } from 'react';
import type { CategoryResponse, PostRequest } from '../../../types/interface';
import { fetchReadCategories } from '../../../api/categories';
import { fetchCreatePost } from '../../../api/posts';
import { useNavigate } from 'react-router-dom';
import { fetchUploadImage } from '../../../api/images';
import type { UploadImageResponse } from '../../../types/interface/image.interface';

const PostWritePage = () => {
  const [post, setPost] = useState<PostRequest>({
    title: '',
    content: '',
    category: '',
    images: [],
    status: '',
  });
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [uploadedImageIds, setUploadedImageIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const focusEditorRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoryData = await fetchReadCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error(error);
      }
    };
    getCategories();
    focusEditorRef.current?.focus();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const images = e.target.files;
      const form = new FormData();

      for (const image of images) {
        form.append('images', image);

        try {
          const response: UploadImageResponse = await fetchUploadImage(form);

          editor?.chain().focus().setImage({ src: response.url }).run();

          setUploadedImageIds([...uploadedImageIds, response._id]);
        } catch (error) {
          console.error('이미지 업로드 실패: ', error);
        }
      }
    }
  };

  const handleTemporarySave = (status: 'draft' | 'published') => {
    setPost({ ...post, status });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const rawContent = editor.getJSON();

      const payload = {
        ...post,
        content: JSON.stringify(rawContent),
        images: uploadedImageIds,
      };

      await fetchCreatePost(payload);

      alert(post.status === 'published' ? '글이 성공적으로 작성되었습니다.' : '임시 저장되었습니다.');
      nav('/');
    } catch (error) {
      console.error(error);
      alert('글 작성에 실패했습니다.');
    }
  };

  const editor = useEditor({
    extensions: [
      TextStyleKit,
      StarterKit,
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
    ],
    content: '',
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className='editor-container'>
          <div>
            <select id='category' onChange={(e) => setPost({ ...post, category: e.target.value })}>
              <option value=''>카테고리를 선택해주세요.</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <input
            placeholder='제목을 입력하세요.'
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            ref={focusEditorRef}
          />
          <MenuBar editor={editor} />
          <input type='file' name='images' hidden ref={fileInputRef} onChange={handleFileChange} multiple />
          <button type='button' onClick={() => fileInputRef.current?.click()}>
            이미지 업로드
          </button>
          <EditorContent className='editor-content' editor={editor} />
        </div>
        <button type='submit' onClick={() => handleTemporarySave('published')}>
          제출하기
        </button>
        <button type='submit' onClick={() => handleTemporarySave('draft')}>
          임시저장
        </button>
      </form>
    </>
  );
};

export default PostWritePage;
