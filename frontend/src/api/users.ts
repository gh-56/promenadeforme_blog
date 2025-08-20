import axios from 'axios';
import type {
  GetProfileResponse,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterResponse,
} from '../types/interface/';

export const fetchCreateUser = async (formData: FormData) => {
  const response = await axios
    .post<RegisterResponse>('/api/users/join', formData)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchLogin = async (loginRequest: LoginRequest) => {
  const response = await axios
    .post<LoginResponse>('/api/users/login', loginRequest)
    .then((response) => response.data)
    .catch((error) => {
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

export const fetchAccessToken = async () => {
  const response = await axios
    .get<RefreshResponse>('/api/users/refresh')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchGetProfile = async () => {
  const response = await axios
    .get<GetProfileResponse>('/api/users/me')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};
