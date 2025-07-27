import axios from 'axios';
import type { PostFormData } from '../types/post';
import type { Post } from '../types/post';

export const fetchCreatePost = async (data: PostFormData) => {
  const response = await axios.post<Post>('/api/posts', data);
  return response.data;
};
