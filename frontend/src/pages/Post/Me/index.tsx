import { fetchReadMyPost } from '../../../api/posts';
import type {
  CategoryResponse,
  GetAllPostResponse,
} from '../../../types/interface';
import { useEffect, useState } from 'react';
import './style.css';
import PostCard from '../../../components/PostCard/index.js';
import { LoadingOverlay } from '@mantine/core';
import { fetchReadCategories } from '../../../api/categories.js';

const MyPostReadPage = () => {
  const [postsData, setPostsData] = useState<GetAllPostResponse>({
    posts: [],
    totalPosts: 0,
    currentPage: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  // const [page, setPage] = useState('1');
  const [categoriesData, setCategoriesData] = useState<CategoryResponse[]>([]);
  const page = '1';

  useEffect(() => {
    const getPosts = async () => {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          fetchReadMyPost(page),
          fetchReadCategories(),
        ]);
        setPostsData(postsResponse);
        setCategoriesData(categoriesResponse);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [page]);

  if (loading) {
    return (
      <div>
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'black' }}
        />
      </div>
    );
  }

  return (
    <div className='me-container'>
      {/* <h1 className='me-title'>내 글 보기</h1> */}

      <div className='me-main'>
        <div className='me-category-main'>
          <h1>카테고리</h1>
          {categoriesData.map((category) => (
            <span key={category._id} className='category-main-item'>
              {category.name}
            </span>
          ))}
        </div>
        <div className='me-post-main'>
          <h1>내 글 보기</h1>
          {postsData.posts.length !== 0 ? (
            postsData.posts.map((post) => {
              return <PostCard key={post._id} post={post} />;
            })
          ) : (
            <div>게시글이 없습니다.</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MyPostReadPage;
