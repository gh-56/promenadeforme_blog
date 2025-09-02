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
import type {
  CategoryResponse,
  PostRequest,
  PostResponse,
} from '../../../types/interface';
import { fetchReadCategories } from '../../../api/categories';
import {
  fetchCreatePost,
  fetchDeletePost,
  fetchReadAllDraftPost,
} from '../../../api/posts';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUploadImage } from '../../../api/images';
import type { UploadImageResponse } from '../../../types/interface/image.interface';
import Button from '../../../components/Button';
import { CATEGORY_PATH } from '../../../constant';

const PostWritePage = () => {
  const [post, setPost] = useState<PostRequest>({
    title: '',
    content: '',
    category: '',
    images: [],
    status: '',
  });
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isCategory, setIstCategory] = useState<boolean>(false);
  const [uploadedImageIds, setUploadedImageIds] = useState<string[]>([]);
  const [temporaryPosts, setTemporaryPosts] = useState<PostResponse[]>([]);
  const [isTemporary, setIsTemporary] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const focusEditorRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const categoryData: CategoryResponse[] = await fetchReadCategories();
        setCategories(categoryData);
        if (categoryData.length === 0) {
          setIstCategory(true);
        }
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
      const uploadedIds: string[] = [];
      const form = new FormData();

      for (const image of images) {
        form.append('images', image);
      }

      try {
        const response: UploadImageResponse[] = await fetchUploadImage(form);

        for (const image of response) {
          editor?.commands.enter();
          editor?.chain().focus('end').setImage({ src: image.url }).run();
          uploadedIds.push(image._id);
        }

        setUploadedImageIds((prevIds) => [...prevIds, ...uploadedIds]);
      } catch (error) {
        console.error('이미지 업로드 실패: ', error);
      }
    }
  };

  //* 게시글 상태를 저장한다. (임시저장 | 발행)
  const handleSaveTemporary = (status: 'draft' | 'published') => {
    setPost({ ...post, status });
  };

  //* 임시 저장 게시글을 모두 불러오는 함수
  const handleReadTemporary = async () => {
    //* 1. 임시 저장된 글을 불러온다. (draft 상태인 글만 불러오기)
    const getTemporaryPosts: PostResponse[] = await fetchReadAllDraftPost();

    //* 2. 임시 저장된 글 목록을 제목만 전부 보여준다.
    if (temporaryPosts && getTemporaryPosts.length > 0) {
      setIsTemporary(!isTemporary);
      setTemporaryPosts(getTemporaryPosts);
    }
  };

  //* 선택된 임시 저장 글을 불러오는 함수
  const handleSelectTemporary = (id: string) => {
    //* 1. 선택한 게시글을 찾는다.
    const selectedPost = temporaryPosts.find((post) => post._id === id);

    if (selectedPost) {
      //* 2. 작성 중인 글이 지워진다는 안내를 한다.
      if (
        confirm(
          '임시 저장 글을 불러오시겠습니까? 작성 중인 내용이 모두 지워집니다.',
        )
      ) {
        //* 3. 찾은 게시글의 불러온 내용으로 교체한다.
        setPost({
          ...post,
          title: selectedPost.title,
          category: selectedPost.category._id,
        });
        editor.commands.setContent(JSON.parse(selectedPost.content));
      }
    }
  };

  const handleDeleteTemporary = async (id: string) => {
    if (confirm('임시 저장 글을 삭제하시겠습니까?')) {
      try {
        await fetchDeletePost(id);
        nav('');
        alert('임시 저장 글을 성공적으로 삭제하였습니다.');
      } catch (error) {
        console.error(error);
        alert('임시 저장 글 삭제에 실패하였습니다.');
      }
    }
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

      alert(
        post.status === 'published'
          ? '글이 성공적으로 작성되었습니다.'
          : '임시 저장되었습니다.',
      );
      nav(post.status === 'published' ? '/' : '');
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
    <div className='postwrite-container'>
      <form onSubmit={handleSubmit}>
        <div className='editor-container'>
          <div>
            <select
              id='category'
              onChange={(e) => setPost({ ...post, category: e.target.value })}
              value={post.category}
            >
              <option value=''>카테고리를 선택해주세요.</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {isCategory ? (
            <div className='postwrite-iscategory'>
              <p>카테고리가 없습니다.</p>
              <Link to={CATEGORY_PATH()}>추가</Link>
            </div>
          ) : (
            <></>
          )}

          <input
            placeholder='제목을 입력하세요.'
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            ref={focusEditorRef}
            value={post.title}
          />
          <MenuBar editor={editor} />
          <input
            type='file'
            name='images'
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
          />
          <Button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='button-add-image'
          >
            이미지 업로드
          </Button>
          <EditorContent className='editor-content' editor={editor} />
        </div>
        <div className='postwrite-submit-buttons'>
          <Button
            type='submit'
            className='button-submit'
            onClick={() => handleSaveTemporary('published')}
          >
            게시
          </Button>
          <Button
            type='submit'
            className='button-submit'
            onClick={() => handleSaveTemporary('draft')}
          >
            임시저장
          </Button>

          <Button
            type='button'
            className='button-list open-modal-button'
            onClick={handleReadTemporary}
          >
            임시저장 목록
          </Button>
        </div>
      </form>

      <div className='temporary-container'>
        {isTemporary ? (
          <div>
            {temporaryPosts.map((post) => {
              return (
                <div key={post._id} className='temporary-post'>
                  <h3>{post.title}</h3>
                  <div>{new Date(post.createdAt).toLocaleDateString()}</div>
                  <div>{new Date(post.updatedAt).toLocaleDateString()}</div>
                  <Button
                    type='button'
                    onClick={() => handleSelectTemporary(post._id)}
                    className='temporary-button'
                  >
                    불러오기
                  </Button>
                  <Button
                    type='button'
                    onClick={() => handleDeleteTemporary(post._id)}
                    className='temporary-button delete'
                  >
                    삭제하기
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default PostWritePage;
