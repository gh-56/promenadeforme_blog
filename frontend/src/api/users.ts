import api from './axios.js';
import axios from 'axios';
import type {
  LoginRequest,
  UserResponse,
  RefreshResponse,
  RegisterResponse,
  RegisterRequest,
} from '../types/interface/';

export const fetchCreateUser = async (registerRequest: RegisterRequest) => {
  const response = await api
    .post<RegisterResponse>('/api/users/join', registerRequest)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchLogin = async (loginRequest: LoginRequest) => {
  const response = await api
    .post<UserResponse>('/api/users/login', loginRequest)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchLogout = async () => {
  const response = await api
    .post('/api/users/logout')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchAccessToken = async () => {
  const response = await api
    .get<RefreshResponse>('/api/users/refresh')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchGetProfile = async () => {
  const response = await api
    .get<UserResponse>('/api/users/me')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};

export const fetchUpdateUser = async (
  request: RegisterRequest & { newPassword: string },
) => {
  const response = await api
    .patch<RegisterResponse>('/api/users/me', request)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
  return response;
};
