import { fetchReadAllPost } from '../../../api/posts';
import type { GetAllPostResponse } from '../../../types/interface';
import { useEffect, useState } from 'react';

import PostCard from '../../../components/PostCard/index.js';

import {
  LoadingOverlay,
  Container,
  Title,
  SimpleGrid,
  Group,
  Pagination,
  Center,
  Text,
  Stack,
  Box,
} from '@mantine/core';

const PostReadPage = () => {
  const [postsData, setPostsData] = useState<GetAllPostResponse>({
    posts: [],
    totalPosts: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);

    const getPosts = async () => {
      try {
        const responseData = await fetchReadAllPost(String(page));
        setPostsData(responseData);
      } catch (error) {
        console.error('게시글을 불러오는데 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [page]);

  return (
    <Container py='lg'>
      <Stack gap='xl'>
        <Title order={4}>전체 글 보기</Title>

        <Box pos='relative' mih={400}>
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />

          {!loading && postsData.posts.length > 0 && (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              {postsData.posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </SimpleGrid>
          )}

          {!loading && postsData.posts.length === 0 && (
            <Center h={400}>
              <Text>게시글이 없습니다.</Text>
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

export default PostReadPage;
