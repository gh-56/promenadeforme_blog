import { Link } from 'react-router-dom';
import { fetchReadAllPost } from '../../../api/posts';
import type { GetAllPostResponse } from '../../../types/interface';
import { useEffect, useState } from 'react';
import { POST_DETAIL_PATH } from '../../../constant';
import './style.css';

const PostReadPage = () => {
  const [posts, setPosts] = useState<GetAllPostResponse>({
    posts: [],
    totalPosts: 0,
    currentPage: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('1');

  useEffect(() => {
    const getPosts = async () => {
      try {
        const postsData = await fetchReadAllPost(page);
        setPosts(postsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [page]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className='post-container'>
      <h1 className='post-title'>전체 글 보기</h1>
      {posts.posts.length !== 0 ? (
        posts.posts.map((post) => {
          if (post.images) {
            for (const image of post.images) {
              <img key={post._id} src={`http://localhost:4000/${image}`} alt='' />;
            }
          }
          return (
            <Link to={POST_DETAIL_PATH(post._id)} key={post._id} className='post-detail'>
              <div>
                {post.images ? post.images.map((image) => <img src={image.url} alt='' />) : <></>}
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <p>{post.author?.nickname}</p>
                <p>{post.category?.name}</p>
                <p>{post.tags}</p>
                <p>{post.createdAt}</p>
                <p>{post.updatedAt}</p>
                <p></p>
              </div>
            </Link>
          );
        })
      ) : (
        <div>게시글이 없습니다.</div>
      )}
    </div>
  );
};
export default PostReadPage;
