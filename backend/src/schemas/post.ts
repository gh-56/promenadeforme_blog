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

const Post = model('Post', postSchema);

export default Post;
