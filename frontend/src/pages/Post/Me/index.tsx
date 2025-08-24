import { fetchReadMyPost } from '../../../api/posts';
import type { GetAllPostResponse } from '../../../types/interface';
import { useEffect, useState } from 'react';
// import './style.css';
import PostCard from '../../../components/PostCard/index.js';

const MyPostReadPage = () => {
  const [postsData, setPostsData] = useState<GetAllPostResponse>({
    posts: [],
    totalPosts: 0,
    currentPage: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  // const [page, setPage] = useState('1');
  const page = '1';

  useEffect(() => {
    const getPosts = async () => {
      try {
        const postsData = await fetchReadMyPost(page);
        setPostsData(postsData);
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
      <h1 className='post-title'>내 글 보기</h1>
      <div className='post-main'>
        {postsData.posts.length !== 0 ? (
          postsData.posts.map((post) => {
            return <PostCard key={post._id} post={post} />;
          })
        ) : (
          <div>게시글이 없습니다.</div>
        )}
      </div>
    </div>
  );
};
export default MyPostReadPage;
