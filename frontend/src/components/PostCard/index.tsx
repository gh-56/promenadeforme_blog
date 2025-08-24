import { Link } from 'react-router-dom';
import { POST_DETAIL_PATH } from '../../constant';
import type { PostResponse } from '../../types/interface';
import { formattedDate } from '../../utils/date-format.js';
import './style.css';

interface PostCardProps {
  post: PostResponse;
}

// 블록 내부의 텍스트 아이템 타입
interface TextItem {
  type: 'text';
  text: string;
}

// 이미지, 구분선 등 텍스트가 아닌 아이템 타입
interface NonTextItem {
  type: string;
  attrs?: Record<string, string>;
}

// 블록 내부의 아이템들을 포함하는 유니온 타입
type ContentItem = TextItem & NonTextItem;

// Tiptap 콘텐츠 블록의 타입
interface ContentBlock {
  type: string;
  attrs?: Record<string, string>;
  content?: ContentItem[];
}

const PostCard = ({ post }: PostCardProps) => {
  let textArray = '';
  let imageUrl = '';

  if (post.content && post.status === 'published') {
    imageUrl = post.images[0].url;
    const parsedContent = JSON.parse(post.content);
    console.log(parsedContent);
    textArray = parsedContent.content.reduce((acc: string[], block: ContentBlock) => {
      if (block.content && block.content.length > 0) {
        block.content.forEach((item: ContentItem) => {
          if (item.type === 'text' && item.text) {
            acc.push(item.text);
          }
        });
      }
      return acc;
    }, []);
    console.log('textArray', textArray);
  }

  return (
    <>
      {post.status === 'published' ? (
        <Link to={POST_DETAIL_PATH(post._id)} className='postcard-link'>
          <div className='postcard-container'>
            <div className='postcard-thumbnail'>
              <img src={imageUrl} alt='게시글 썸네일 이미지' />
            </div>
            <div className='postcard-main'>
              <p className='postcard-category'>{post.category.name}</p>
              <h1 className='postcard-title'>{post.title}</h1>
              <div className='postcard-content'>
                {textArray}
                {/* <EditorContent editor={editor} /> */}
              </div>
              <div className='postcard-profile'>
                <img src={post.author.profileImage} alt='사용자 프로필 이미지'></img>
                <p className='postcard-profile-nickname'>{post.author.nickname}</p>
                <p className='postcard-profile-createdAt'>{formattedDate(post.createdAt)}</p>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <></>
      )}
    </>
  );
};

export default PostCard;
