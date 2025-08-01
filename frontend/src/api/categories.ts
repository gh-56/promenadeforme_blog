import axios from 'axios';
import type { Category } from '../types/interface';

export const fetchCreateCategory = async (name: string) => {
  const response = await axios.post<Category>('/api/categories', { name });
  return response.data;
};

export const fetchCategories = async () => {
  const response = await axios.get<Category[]>('/api/categories');
  return response.data;
};

export const fetchUpdateCategory = async (id: string, name: string) => {
  const response = await axios.patch<Category>('/api/categories/' + id, {
    name,
  });
  return response.data;
};

export const fetchDeleteCategory = async (id: string) => {
  await axios.delete<Category>('/api/categories/' + id);
};
