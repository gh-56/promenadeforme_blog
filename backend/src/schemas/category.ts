import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: {
    type: String,
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

//* name과 author 필드의 조합을 unique로 설정
categorySchema.index({ name: 1, author: 1 }, { unique: true });

const Category = model('Category', categorySchema);

export default Category;
