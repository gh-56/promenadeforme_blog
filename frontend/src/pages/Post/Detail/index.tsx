import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchReadPostById } from '../../../api/posts';
import type { PostResponse } from '../../../types/interface';
import { formattedDate } from '../../../utils/date-format';
import './style.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { POST_EDIT_PATH } from '../../../constant';
import { Link } from 'react-router-dom';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostResponse | null>();
  const [isLoading, setIsLoading] = useState(true);
  const nav = useNavigate();

  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: '',
  });

  useEffect(() => {
    const getPost = async () => {
      if (id) {
        try {
          const postData: PostResponse = await fetchReadPostById(id);

          if (postData.content && editor) {
            const parsedContent = JSON.parse(postData.content);
            editor.commands.setContent(parsedContent);
          }

          setPost(postData);
        } catch (error) {
          console.error('게시글을 가져오는 데 실패했습니다.', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    getPost();
  }, [id, editor]);

  if (isLoading) {
    return <div>게시글을 불러오는 중...</div>;
  }

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className='postdetail-container'>
      <div className='postdetail-top'>
        <Link to={POST_EDIT_PATH(id as string)}>수정하기</Link>
        <button type='button' onClick={() => nav(POST_EDIT_PATH(id as string))}>
          수정하기
        </button>
        <p className='postcard-category'>{post.category.name}</p>
        <h1 className='postdetail-title'>{post.title}</h1>
        <div className='postcard-profile'>
          <img src={post.author.profileImage} alt='사용자 프로필 이미지' />
          <p className='postcard-profile-nickname'>{post.author.nickname}</p>
          <p className='postcard-profile-createdAt'>{formattedDate(post.createdAt)}</p>
        </div>
      </div>
      <div className='postdetail-bottom'>{editor && <EditorContent editor={editor} />}</div>
    </div>
  );
};

export default PostDetailPage;
