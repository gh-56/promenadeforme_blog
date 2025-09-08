import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchDeletePost, fetchReadPostById } from '../../../api/posts';
import type { PostResponse } from '../../../types/interface';
import { formattedDate } from '../../../utils/date-format';
import { useUserStore } from '../../../store';

import { EditorContent } from '@tiptap/react';
import { CATEGORY_POSTS_PATH, POST_EDIT_PATH } from '../../../constant';

import {
  Container,
  Title,
  Text,
  Group,
  Avatar,
  Badge,
  Button,
  Stack,
  Center,
  Loader,
  Alert,
  Divider,
  Modal,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAlertCircle } from '@tabler/icons-react';
import { useTiptapEditor } from '../../../hooks/useTiptapEditor';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<PostResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserStore();
  const nav = useNavigate();
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const editor = useTiptapEditor({
    content: post?.content || '',
    isEditable: false,
  });

  useEffect(() => {
    const getPost = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const postData = await fetchReadPostById(id);
          setPost(postData);
        } catch (error) {
          console.error('게시글을 가져오는 데 실패했습니다.', error);
          setPost(null);
        } finally {
          setIsLoading(false);
        }
      }
    };
    getPost();
  }, [id]);

  const handleDeleteConfirm = async () => {
    if (!id) return;
    try {
      await fetchDeletePost(id);
      alert('게시글이 성공적으로 삭제되었습니다.');
      nav('/');
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('게시글 삭제에 실패했습니다.');
    } finally {
      closeDeleteModal();
    }
  };

  if (isLoading) {
    return (
      <Center h={400}>
        <Loader />
      </Center>
    );
  }

  if (!post) {
    return (
      <Container py='lg'>
        <Alert icon={<IconAlertCircle size='1rem' />} title='Error' color='red'>
          게시글을 찾을 수 없거나 불러오는 데 실패했습니다.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container py='xl' size='md'>
        <Stack gap='lg'>
          <Stack gap='xs'>
            <Badge
              color='pink'
              variant='light'
              size='lg'
              mb='sm'
              component={Link}
              to={CATEGORY_POSTS_PATH(post.category.name)}
              style={{ cursor: 'pointer' }}
            >
              {post.category.name}
            </Badge>
            <Title order={1}>{post.title}</Title>
            <Group justify='space-between'>
              <Group>
                <Avatar
                  src={post.author.profileImage?.url}
                  alt="Author's profile image"
                  radius='xl'
                />
                <Text size='sm' fw={500}>
                  {post.author.nickname}
                </Text>
                <Text size='sm' c='dimmed'>
                  ·
                </Text>
                <Text size='sm' c='dimmed'>
                  {formattedDate(post.createdAt)}
                </Text>
              </Group>

              {user && post.author._id === user._id && (
                <Group>
                  <Button
                    component={Link}
                    to={POST_EDIT_PATH(id!)}
                    variant='default'
                    size='xs'
                  >
                    수정
                  </Button>
                  <Button
                    onClick={openDeleteModal}
                    variant='light'
                    color='red'
                    size='xs'
                  >
                    삭제
                  </Button>
                </Group>
              )}
            </Group>
          </Stack>

          <Divider my='md' />

          <div className='prose-styles'>
            {editor && <EditorContent editor={editor} />}
          </div>
        </Stack>
      </Container>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title='게시글 삭제'
        centered
      >
        <Stack>
          <Text size='sm'>
            게시글을 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </Text>
          <Group justify='flex-end' mt='md'>
            <Button variant='default' onClick={closeDeleteModal}>
              취소
            </Button>
            <Button color='red' onClick={handleDeleteConfirm}>
              삭제하기
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default PostDetailPage;
