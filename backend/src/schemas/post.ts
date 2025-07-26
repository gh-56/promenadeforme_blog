import { Schema, model } from 'mongoose';

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  images: [
    {
      type: String,
      required: false,
    },
  ],
  thumbnail: {
    type: String,
    required: false,
  },
  tags: [{ type: String, required: false }],
  author: {
    type: String,
    required: true,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = model('Post', postSchema);

export default Post;
