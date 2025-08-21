// import axios from 'axios';
import api from './axios.js';
import type { CategoryRequest, CategoryResponse } from '../types/interface';

export const fetchCreateCategory = async (categoryRequest: CategoryRequest) => {
  const response = await api
    .post<CategoryResponse>('/api/categories', categoryRequest)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchReadCategories = async () => {
  const response = await api
    .get<CategoryResponse[]>('/api/categories')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchUpdateCategory = async (id: string, categoryRequest: CategoryRequest) => {
  const response = await api
    .patch<CategoryResponse>(`/api/categories/${id}`, categoryRequest)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchDeleteCategory = async (id: string) => {
  const response = await api
    .delete(`/api/categories/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};
