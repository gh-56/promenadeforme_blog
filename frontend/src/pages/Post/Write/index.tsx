import { useNavigate } from 'react-router-dom';
import { fetchCreatePost } from '../../../api/posts';
import PostForm from '../../../components/PostForm';
import type { PostRequest } from '../../../types/interface';
import { notifications } from '@mantine/notifications';

const PostWritePage = () => {
  const nav = useNavigate();

  const handleCreate = async (payload: PostRequest) => {
    await fetchCreatePost(payload);

    payload.status === 'published'
      ? notifications.show({
          title: '게시글 작성 성공',
          message: '글이 성공적으로 작성되었습니다.',
          color: 'teal',
        })
      : notifications.show({
          title: '임시 저장 성공',
          message: '임시 저장되었습니다.',
          color: 'teal',
        });

    nav(payload.status === 'published' ? '/' : '');
  };

  return (
    <PostForm
      pageTitle='새 글 작성하기'
      onSubmit={handleCreate}
      submitText='게시'
    />
  );
};

export default PostWritePage;
