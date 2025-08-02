import axios from 'axios';
import type { PostFormData, PostResponse } from '../types/interface';

export const fetchCreatePost = async (data: PostFormData) => {
  const response = await axios.post<PostResponse>('/api/posts', data);
  return response.data;
};

export const fetchReadPosts = async () => {
  const response = await axios.get<PostResponse[]>('/api/posts');
  return response.data;
};

export const fetchReadPostById = async (id: string) => {
  const response = await axios.get<PostResponse>(`/api/posts/${id}`);
  return response.data;
};
