import { fetchReadMyPost } from '../../../api/posts';
import type {
  CategoryResponse,
  GetAllPostResponse,
} from '../../../types/interface';
import { useEffect, useState } from 'react';
import PostCard from '../../../components/PostCard/index.js';
import { fetchReadCategories } from '../../../api/categories.js';

import {
  LoadingOverlay,
  Container,
  Title,
  Grid,
  Stack,
  NavLink,
  SimpleGrid,
  Center,
  Text,
  Pagination,
  Group,
  Box,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

const MyPostReadPage = () => {
  const [postsData, setPostsData] = useState<GetAllPostResponse>({
    posts: [],
    totalPosts: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [categoriesData, setCategoriesData] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const getPostsAndCategories = async () => {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          fetchReadMyPost(String(page)),
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
    getPostsAndCategories();
  }, [page]);

  return (
    <Container py='lg' size='xl'>
      <Grid>
        <Grid.Col span={{ base: 12, md: 2.5 }}>
          <Stack>
            <Title order={3}>카테고리</Title>
            {categoriesData.map((category) => (
              <NavLink
                key={category._id}
                href={`/category/${category.name}`}
                label={category.name}
                rightSection={<IconChevronRight size='0.8rem' stroke={1.5} />}
              />
            ))}
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap='xl'>
            <Title order={2}>내 글 보기</Title>

            <Box pos='relative' mih={500}>
              <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: 'sm', blur: 2 }}
              />

              {!loading && postsData.posts.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                  {postsData.posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </SimpleGrid>
              ) : (
                <Center h={500}>
                  <Text>{loading ? '' : '작성한 글이 없습니다.'}</Text>
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
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2.5 }} />
      </Grid>
    </Container>
  );
};

export default MyPostReadPage;
