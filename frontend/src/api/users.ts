import axios from 'axios';
import type {
  JoinResponse,
  LoginFormData,
  LoginResponse,
} from '../types/interface/';

export const fetchCreateUser = async (formData: FormData) => {
  const response = await axios
    .post<JoinResponse>('/api/users/join', formData)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
      throw error;
    });
  return response;
};

export const fetchLogin = async (loginFormData: LoginFormData) => {
  const response = await axios
    .post<LoginResponse>('/api/users/login', loginFormData)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
      throw error;
    });
  return response;
};

export const fetchLogout = async () => {
  const response = await axios
    .post('/api/users/logout')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};
