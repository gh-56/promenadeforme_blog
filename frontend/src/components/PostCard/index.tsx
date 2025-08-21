import { Link } from 'react-router-dom';
import { POST_DETAIL_PATH } from '../../constant';
import type { PostResponse } from '../../types/interface';

interface PostCardProps {
  post: PostResponse;
}
const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link to={POST_DETAIL_PATH(post._id)}>
      <div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <p>{post.author.nickname}</p>
        <p>{post.category.name}</p>
      </div>
    </Link>
  );
};

export default PostCard;
