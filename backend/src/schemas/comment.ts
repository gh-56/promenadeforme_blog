import { Schema, model } from 'mongoose';

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = model('Comment', commentSchema);

export default Comment;
