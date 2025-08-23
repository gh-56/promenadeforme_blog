import api from './axios';

export const fetchUploadImage = async (form: FormData) => {
  const response = await api
    .post('/api/images/upload', form)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};
