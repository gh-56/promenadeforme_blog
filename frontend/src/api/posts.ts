import axios from 'axios';
import type { PostFormData, Post } from '../types/interface';

export const fetchCreatePost = async (data: PostFormData) => {
  const response = await axios.post<Post>('/api/posts', data);
  return response.data;
};

export const fetchReadPosts = async () => {
  const response = await axios.get<Post[]>('/api/posts');
  return response.data;
};

export const fetchReadPostById = async (id: string) => {
  const response = await axios.get<Post>(`/api/posts/${id}`);
  return response.data;
};
