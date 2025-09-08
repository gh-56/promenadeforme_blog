import { useNavigate } from 'react-router-dom';
import { fetchCreatePost } from '../../../api/posts';
import PostForm from '../../../components/PostForm';
import type { PostRequest } from '../../../types/interface';

const PostWritePage = () => {
  const nav = useNavigate();

  const handleCreate = async (payload: PostRequest) => {
    await fetchCreatePost(payload);
    alert(
      payload.status === 'published'
        ? '글이 성공적으로 작성되었습니다.'
        : '임시 저장되었습니다.',
    );
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
