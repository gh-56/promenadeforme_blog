import api from './axios';

export const fetchUploadImage = async (form: FormData) => {
  const response = await api
    .post('/api/images/upload/posts', form)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchProfileUploadImage = async (form: FormData) => {
  const response = await api
    .post('/api/images/upload/profile', form)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};
