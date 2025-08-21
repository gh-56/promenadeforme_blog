import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchReadPostById } from '../../../api/posts';
import type { PostResponse } from '../../../types/interface';

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
    <>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </>
  );
};

export default PostDetailPage;
