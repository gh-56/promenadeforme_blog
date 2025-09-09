import { LoadingOverlay } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchReadPostById, fetchUpdatePost } from '../../../api/posts';
import PostForm from '../../../components/PostForm';
import type { PostResponse, PostRequest } from '../../../types/interface';
import { notifications } from '@mantine/notifications';

const PostEditPage = () => {
  const { id: postId } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [initialPost, setInitialPost] = useState<PostResponse | null>(null);

  useEffect(() => {
    if (postId) {
      const getPost = async () => {
        const data = await fetchReadPostById(postId);
        setInitialPost(data);
      };
      getPost();
    }
  }, [postId]);

  const handleUpdate = async (payload: PostRequest) => {
    if (!postId) return;
    await fetchUpdatePost(postId, payload);

    notifications.show({
      title: '게시글 수정 성공',
      message: '글이 성공적으로 수정되었습니다.',
      color: 'teal',
    });
    nav(`/posts/${postId}`);
  };

  if (!initialPost) {
    return <LoadingOverlay visible />;
  }

  return (
    <PostForm
      pageTitle='글 수정하기'
      initialPost={initialPost}
      onSubmit={handleUpdate}
      submitText={'수정'}
    />
  );
};

export default PostEditPage;
