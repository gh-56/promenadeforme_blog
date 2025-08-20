import axios from 'axios';
import type { GetAllPostResponse, PostRequest, PostResponse } from '../types/interface';

export const fetchCreatePost = async (formData: FormData) => {
  const response = await axios
    .post<PostResponse>('/api/posts', formData)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchReadAllPost = async (page: string) => {
  const response = await axios
    .get<GetAllPostResponse>(`/api/posts?page=${page}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchReadPostById = async (id: string) => {
  const response = await axios
    .get<PostResponse>(`/api/posts/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchUpdatePost = async (id: string, postRequest: PostRequest) => {
  const response = await axios
    .patch<PostResponse>(`/api/posts/${id}`, postRequest)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchDeletePost = async (id: string) => {
  const response = await axios
    .delete(`/api/posts/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};
