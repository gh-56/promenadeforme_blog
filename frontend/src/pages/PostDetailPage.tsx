import { useEffect, useState } from 'react';
import { fetchReadPostById } from '../api/posts';
import type { Post } from '../types/post';
import { useNavigate, useParams } from 'react-router-dom';

const PostDetailPage = () => {
  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    const getPost = async () => {
      if (!id) {
        nav('/');
        return;
      }
      try {
        const post = await fetchReadPostById(id as string);
        setPost(post);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getPost();
  }, [id, nav]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <>
      <div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <p>{post.author}</p>
      </div>
    </>
  );
};

export default PostDetailPage;
