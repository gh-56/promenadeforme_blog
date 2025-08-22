import { Link } from 'react-router-dom';
import { POST_DETAIL_PATH } from '../../constant';
import type { PostResponse } from '../../types/interface';
import { formattedDate } from '../../utils/date-format.js';
import './style.css';

interface PostCardProps {
  post: PostResponse;
}
const PostCard = ({ post }: PostCardProps) => {
  const imageUrl = post.images[0].url;

  return (
    <Link to={POST_DETAIL_PATH(post._id)} className='postcard-link'>
      <div className='postcard-container'>
        <div className='postcard-thumbnail'>
          <img src={imageUrl} alt='게시글 썸네일 이미지' />
        </div>
        <div className='postcard-main'>
          <p className='postcard-category'>{post.category.name}</p>
          <h1 className='postcard-title'>{post.title}</h1>
          <p className='postcard-content'>{post.content}</p>
          <div className='postcard-profile'>
            <img src={post.author.profileImage} alt='사용자 프로필 이미지'></img>
            <p className='postcard-profile-nickname'>{post.author.nickname}</p>
            <p className='postcard-profile-createdAt'>{formattedDate(post.createdAt)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
