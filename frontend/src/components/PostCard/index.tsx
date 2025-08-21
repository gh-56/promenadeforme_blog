import { Link } from 'react-router-dom';
import { POST_DETAIL_PATH } from '../../constant';
import type { PostResponse } from '../../types/interface';
import './style.css';

interface PostCardProps {
  post: PostResponse;
}
const PostCard = ({ post }: PostCardProps) => {
  const imageUrl = post.images[0].url;

  const date = new Date(post.createdAt);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const formattedDate = `${year}/${month}/${day}`;

  return (
    <Link to={POST_DETAIL_PATH(post._id)} className='postcard-link'>
      <div className='postcard-container'>
        <div className='postcard-thumbnail'>
          <img src={imageUrl} alt='게시글 이미지가 존재하지 않음' />
        </div>
        <div className='postcard-main'>
          <p className='postcard-category'>{post.category.name}</p>
          <h1>{post.title}</h1>
          <p className='postcard-content'>{post.content}</p>
          <div className='postcard-profile'>
            <img src={post.author.profileImage}></img>
            <p className='postcard-profile-nickname'>{post.author.nickname}</p>
            <p className='postcard-profile-createdAt'>{formattedDate}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
