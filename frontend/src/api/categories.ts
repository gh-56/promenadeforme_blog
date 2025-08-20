import axios from 'axios';
import type { CategoryRequest, CategoryResponse } from '../types/interface';

export const fetchCreateCategory = async (categoryRequest: CategoryRequest) => {
  const response = await axios
    .post<CategoryResponse>('/api/categories', categoryRequest)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchReadCategories = async () => {
  const response = await axios
    .get<CategoryResponse[]>('/api/categories')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchUpdateCategory = async (id: string, categoryRequest: CategoryRequest) => {
  const response = await axios
    .patch<CategoryResponse>(`/api/categories/${id}`, categoryRequest)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchDeleteCategory = async (id: string) => {
  const response = await axios
    .delete(`/api/categories/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};
