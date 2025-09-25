import { Schema, model } from 'mongoose';
import Image from './image.js';

const generateSummary = (contentJson: string) => {
  if (!contentJson) return '';

  let textContent = '';
  try {
    const parsedContent = JSON.parse(contentJson);

    if (parsedContent.content) {
      for (const block of parsedContent.content) {
        if (block.content) {
          for (const item of block.content) {
            if (item.type === 'text' && item.text) {
              textContent += item.text + ' ';
            }
          }
        }
        if (textContent.length > 150) break;
      }
    }
  } catch (error) {
    console.error('콘텐츠 파싱 실패 (요약 생성):', error);
    return '내용을 불러올 수 없습니다.';
  }

  // 150자 이내로 자르고, 끝에 ...을 붙입니다.
  return (
    textContent.trim().slice(0, 150) + (textContent.length > 150 ? '...' : '')
  );
};

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  images: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Image',
      required: false,
    },
  ],
  thumbnail: {
    type: String,
  },
  tags: [
    {
      type: String,
      required: false,
    },
  ],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  expireAt: {
    type: Date,
  },
});

postSchema.index(
  { expireAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { status: 'draft', expireAt: { $type: 'date' } },
  },
);

postSchema.pre('save', async function (next) {
  // 게시글 미리보기 텍스트
  if (this.isModified('content')) {
    this.summary = generateSummary(this.content);
  }

  // 썸네일
  if (this.isModified('images')) {
    if (this.images && this.images.length > 0) {
      const firstImageId = this.images[0];

      const imageDoc = await Image.findById(firstImageId);

      if (imageDoc) {
        this.thumbnail = imageDoc.url;
      } else {
        this.thumbnail = `${process.env.GCLOUD_STORAGE_IMAGE_URL}/${process.env.GCLOUD_STORAGE_BUCKET}/default-post-image.webp`;
      }
    } else {
      this.thumbnail = `${process.env.GCLOUD_STORAGE_IMAGE_URL}/${process.env.GCLOUD_STORAGE_BUCKET}/default-post-image.webp`;
    }
  }

  next();
});

const Post = model('Post', postSchema);

export default Post;
