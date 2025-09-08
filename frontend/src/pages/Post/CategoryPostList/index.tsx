import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostsByCategory } from '../../../api/posts';
import type { GetAllPostResponse } from '../../../types/interface';
import PostCard from '../../../components/PostCard';

import {
  Container,
  Title,
  SimpleGrid,
  Group,
  Pagination,
  Center,
  Text,
  Stack,
  Box,
  LoadingOverlay,
} from '@mantine/core';

const CategoryPostListPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [postsData, setPostsData] = useState<GetAllPostResponse>({
    posts: [],
    totalPosts: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!categoryName) return;

    setLoading(true);
    const getPosts = async () => {
      try {
        const responseData = await fetchPostsByCategory(
          categoryName,
          String(page),
        );
        setPostsData(responseData);
      } catch (error) {
        console.error(
          `카테고리 '${categoryName}'의 글을 불러오는 데 실패했습니다:`,
          error,
        );
        setPostsData({
          posts: [],
          totalPosts: 0,
          currentPage: 1,
          totalPages: 1,
        });
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [categoryName, page]);

  return (
    <Container py='lg'>
      <Stack gap='xl'>
        <Title order={2}>
          <Text span c='pink' inherit>
            #{categoryName}
          </Text>
          <Text span inherit>
            {' '}
            글 목록
          </Text>
        </Title>

        <Box pos='relative' mih={400}>
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />

          {!loading && postsData.posts.length > 0 ? (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              {postsData.posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </SimpleGrid>
          ) : (
            <Center h={400}>
              <Text>
                {loading ? '' : '이 카테고리에는 아직 글이 없습니다.'}
              </Text>
            </Center>
          )}
        </Box>

        {postsData.totalPages > 1 && (
          <Group justify='center'>
            <Pagination
              total={postsData.totalPages}
              value={page}
              onChange={setPage}
            />
          </Group>
        )}
      </Stack>
    </Container>
  );
};

export default CategoryPostListPage;
