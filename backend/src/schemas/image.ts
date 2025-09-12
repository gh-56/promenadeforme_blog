import { Schema, model } from 'mongoose';

const imageSchema = new Schema({
  hash: {
    type: String,
    require: true,
    unique: true,
  },
  url: {
    type: String,
    require: true,
    default: `${process.env.GCLOUD_STORAGE_IMAGE_URL}/${process.env.GCLOUD_STORAGE_BUCKET}/default-post-image.webp`,
    // default: 'http://localhost:4000/images/default-post-image.jpg'
  },
  referenceCount: {
    type: Number,
    default: 0,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Image = model('Image', imageSchema);

export default Image;
