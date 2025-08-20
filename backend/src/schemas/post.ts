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
  tags: [
    {
      type: String,
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = model('Post', postSchema);

export default Post;
