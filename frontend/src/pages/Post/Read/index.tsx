import { Link } from 'react-router-dom';
import { fetchReadPosts } from '../../../api/posts';
import type { Post } from '../../../types/interface';
import { useEffect, useState } from 'react';
import { POST_DETAIL_PATH } from '../../../constant';

const PostReadPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchReadPosts();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <div>
        <h1>전체 게시글 목록</h1>
        {posts.length !== 0 ? (
          posts.map((post) => {
            return (
              <Link to={POST_DETAIL_PATH(post._id)} key={post._id}>
                <div>
                  <h2>{post.title}</h2>
                  <p>{post.content}</p>
                  <p>{post.author}</p>
                </div>
              </Link>
            );
          })
        ) : (
          <div>게시글이 없습니다.</div>
        )}
      </div>
    </>
  );
};
export default PostReadPage;
