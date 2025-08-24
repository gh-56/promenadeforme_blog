import api from './axios.js';
import type { GetAllPostResponse, PostRequest, PostResponse } from '../types/interface';

export const fetchCreatePost = async (post: PostRequest) => {
  const response = await api
    .post<PostResponse>('/api/posts', post)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchReadAllPost = async (page: string) => {
  const response = await api
    .get<GetAllPostResponse>(`/api/posts?page=${page}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchReadMyPost = async (page: string) => {
  const response = await api
    .get<GetAllPostResponse>(`/api/posts/me?page=${page}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchReadAllDraftPost = async () => {
  const response = await api
    .get<PostResponse[]>('/api/posts/drafts')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchReadPostById = async (id: string) => {
  const response = await api
    .get<PostResponse>(`/api/posts/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchUpdatePost = async (id: string, postRequest: PostRequest) => {
  const response = await api
    .patch<PostResponse>(`/api/posts/${id}`, postRequest)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchDeletePost = async (id: string) => {
  const response = await api
    .delete(`/api/posts/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};
