import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchReadPostById } from '../../../api/posts';
import type { PostResponse } from '../../../types/interface';
import { formattedDate } from '../../../utils/date-format';
import './style.css';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostResponse | null>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPost = async () => {
      if (id) {
        try {
          const postData = await fetchReadPostById(id);
          setPost(postData);
        } catch (error) {
          console.error('게시글을 가져오는 데 실패했습니다.', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    getPost();
  }, [id]);

  if (isLoading) {
    return <div>게시글을 불러오는 중...</div>;
  }

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className='postdetail-container'>
      <div className='postdetail-top'>
        <p className='postcard-category'>{post.category.name}</p>
        <h1 className='postdetail-title'>{post.title}</h1>
        <div className='postcard-profile'>
          <img src={post.author.profileImage} alt='사용자 프로필 이미지' />
          <p className='postcard-profile-nickname'>{post.author.nickname}</p>
          <p className='postcard-profile-createdAt'>{formattedDate(post.createdAt)}</p>
        </div>
      </div>
      <div className='postdetail-bottom'>
        <img className='postdetail-img' src={post.images[0].url} alt='게시글 이미지' />
        <p className='postdetail-content'>{post.content}</p>
      </div>
    </div>
  );
};

export default PostDetailPage;
